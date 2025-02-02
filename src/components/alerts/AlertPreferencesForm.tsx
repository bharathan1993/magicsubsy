import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentRemindersSection } from "./PaymentRemindersSection";
import { SubscriptionStatusSection } from "./SubscriptionStatusSection";
import { AlertPreferencesLoading } from "./AlertPreferencesLoading";
import { useAlertPreferences } from "@/hooks/useAlertPreferences";

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
        <Button 
          onClick={handleSaveSettings} 
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Alert Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};