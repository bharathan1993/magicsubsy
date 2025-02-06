import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))
const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check if this is a test request
    const { test, email } = await req.json().catch(() => ({ test: false, email: null }));
    
    if (test && email) {
      console.log(`Starting test email process for ${email}`);
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('email', email)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      const userName = profile ? 
        `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Valued Customer' 
        : 'Valued Customer';

      try {
        const emailResponse = await resend.emails.send({
          from: "Subsy <onboarding@resend.dev>",
          to: email,
          subject: `Test - Upcoming Payment Reminder for Your Netflix Subscription`,
          html: `
            <h1>Dear ${userName},</h1>
            <p>This is a test email to confirm your alert settings are working.</p>
            <p>You will receive actual payment reminders based on your configured preferences.</p>
            <p>Best regards,<br>The Subsy Team</p>
          `,
        });

        console.log(`Test email sent successfully:`, emailResponse);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Test email sent successfully',
          emailResponse
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        throw emailError;
      }
    }

    // Get all users with their alert preferences and active subscriptions
    const { data: usersWithPreferences, error: preferencesError } = await supabase
      .from('alert_preferences')
      .select(`
        user_id,
        payment_reminder,
        payment_reminder_days,
        trial_ending,
        auto_renewal,
        subscription_expiry,
        profiles!inner (
          email,
          first_name,
          last_name
        ),
        subscriptions!inner (
          name,
          amount,
          next_billing_date,
          status
        )
      `)
      .eq('subscriptions.status', 'active');

    if (preferencesError) {
      console.error('Error fetching preferences:', preferencesError);
      throw preferencesError;
    }

    console.log('Found users with preferences:', usersWithPreferences?.length);

    const emailsSent = [];

    for (const userPrefs of usersWithPreferences || []) {
      const userName = `${userPrefs.profiles.first_name || ''} ${userPrefs.profiles.last_name || ''}`.trim() || 'Valued Customer';
      
      // Process each subscription for the user
      for (const subscription of userPrefs.subscriptions) {
        const daysUntilBilling = Math.ceil(
          (new Date(subscription.next_billing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        console.log(`Processing subscription ${subscription.name} for ${userName}, days until billing: ${daysUntilBilling}`);

        // Check if we should send a payment reminder based on user preferences
        if (
          userPrefs.payment_reminder &&
          daysUntilBilling <= userPrefs.payment_reminder_days &&
          daysUntilBilling >= 0
        ) {
          try {
            const emailResponse = await resend.emails.send({
              from: "Subsy <onboarding@resend.dev>",
              to: userPrefs.profiles.email,
              subject: `Payment Reminder: ${subscription.name} Subscription`,
              html: `
                <h1>Dear ${userName},</h1>
                
                <p>This is a friendly reminder that your subscription to ${subscription.name} is due for payment in ${daysUntilBilling} day${daysUntilBilling === 1 ? '' : 's'}.</p>
                
                <p>Payment Details:</p>
                <ul>
                  <li>Service: ${subscription.name}</li>
                  <li>Amount: $${subscription.amount}</li>
                  <li>Due Date: ${new Date(subscription.next_billing_date).toLocaleDateString()}</li>
                </ul>
                
                <p>To ensure uninterrupted service, please ensure your payment method is up to date.</p>
                
                <p>Best regards,<br>
                The Subsy Team</p>
                
                <p style="color: #666; font-size: 12px;">
                  You received this email because you enabled payment reminders in your Subsy account.
                  You can modify these settings in your alert preferences.
                </p>
              `,
            });

            console.log(`Payment reminder sent for ${subscription.name} to ${userPrefs.profiles.email}`);
            emailsSent.push({
              subscription: subscription.name,
              email: userPrefs.profiles.email,
              type: 'payment_reminder',
              status: 'sent'
            });
          } catch (emailError) {
            console.error(`Error sending payment reminder for ${subscription.name}:`, emailError);
            emailsSent.push({
              subscription: subscription.name,
              email: userPrefs.profiles.email,
              type: 'payment_reminder',
              status: 'failed',
              error: emailError.message
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      emailsSent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in send-subscription-alerts:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});