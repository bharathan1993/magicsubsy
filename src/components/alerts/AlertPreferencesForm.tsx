import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentRemindersSection } from "./PaymentRemindersSection";
import { SubscriptionStatusSection } from "./SubscriptionStatusSection";
import { AlertPreferencesLoading } from "./AlertPreferencesLoading";
import { useAlertPreferences } from "@/hooks/useAlertPreferences";
import { supabase } from "@/integrations/supabase/client";

export const AlertPreferencesForm = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const { 
    preferences, 
    setPreferences, 
    isLoading, 
    savePreferences,
    isSaving 
  } = useAlertPreferences();

  const handleSaveSettings = () => {
    if (!session?.user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save preferences",
        variant: "destructive",
      });
      return;
    }
    
    savePreferences(preferences);
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleDaysChange = (days: number) => {
    setPreferences(prev => ({ ...prev, payment_reminder_days: days }));
  };

  const handleTestEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-subscription-alerts', {
        body: { test: true, email: session?.user.email }
      });

      if (error) throw error;

      toast({
        title: "Test Email Sent",
        description: "Please check your inbox for the test email",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <AlertPreferencesLoading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Alert Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentRemindersSection
          paymentReminder={preferences.payment_reminder}
          paymentReminderDays={preferences.payment_reminder_days}
          onToggleChange={handleToggleChange}
          onDaysChange={handleDaysChange}
        />
        <SubscriptionStatusSection
          trialEnding={preferences.trial_ending}
          autoRenewal={preferences.auto_renewal}
          subscriptionExpiry={preferences.subscription_expiry}
          onToggleChange={handleToggleChange}
        />
        <div className="flex gap-4">
          <Button 
            onClick={handleSaveSettings} 
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Alert Preferences'}
          </Button>
          <Button
            onClick={handleTestEmail}
            variant="outline"
          >
            Send Test Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};