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
    // Get all subscriptions that need alerts
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        profiles!inner(email),
        alert_preferences!inner(*)
      `)
      .gte('next_billing_date', new Date().toISOString())
      .lte('next_billing_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())

    if (subError) {
      console.error('Error fetching subscriptions:', subError)
      throw subError
    }

    console.log(`Found ${subscriptions?.length || 0} subscriptions to process`)

    const emailsSent = []

    for (const sub of subscriptions) {
      const daysUntilBilling = Math.ceil(
        (new Date(sub.next_billing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )

      console.log(`Processing subscription ${sub.name}, days until billing: ${daysUntilBilling}`)

      // Check if we should send an alert based on user preferences
      if (
        sub.alert_preferences.payment_reminder &&
        daysUntilBilling <= sub.alert_preferences.payment_reminder_days
      ) {
        try {
          const emailResponse = await resend.emails.send({
            from: "Subscription Manager <onboarding@resend.dev>",
            to: sub.profiles.email,
            subject: `Payment Reminder: ${sub.name} subscription due in ${daysUntilBilling} days`,
            html: `
              <h1>Upcoming Subscription Payment Reminder</h1>
              <p>Your subscription to ${sub.name} will be renewed in ${daysUntilBilling} days.</p>
              <p>Amount: $${sub.amount}</p>
              <p>Billing Date: ${new Date(sub.next_billing_date).toLocaleDateString()}</p>
              <p>This is an automated reminder based on your alert preferences.</p>
            `,
          })

          console.log(`Sent payment reminder for ${sub.name} to ${sub.profiles.email}`, emailResponse)
          emailsSent.push({
            subscription: sub.name,
            email: sub.profiles.email,
            status: 'sent'
          })
        } catch (emailError) {
          console.error(`Error sending email for ${sub.name}:`, emailError)
          emailsSent.push({
            subscription: sub.name,
            email: sub.profiles.email,
            status: 'failed',
            error: emailError.message
          })
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      emailsSent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-subscription-alerts:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})