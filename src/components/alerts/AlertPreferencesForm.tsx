import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentRemindersSection } from "./PaymentRemindersSection";
import { SubscriptionStatusSection } from "./SubscriptionStatusSection";

export const AlertPreferencesForm = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [localPreferences, setLocalPreferences] = useState({
    payment_reminder: true,
    payment_reminder_days: 3,
    trial_ending: true,
    auto_renewal: true,
    subscription_expiry: true,
  });

  const { data: preferences, refetch } = useQuery({
    queryKey: ['alert-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_preferences')
        .select('*')
        .eq('user_id', session?.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: any) => {
      const { error } = await supabase
        .from('alert_preferences')
        .upsert({
          user_id: session?.user.id,
          ...newPreferences,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alert settings saved",
        description: "Your notification preferences have been updated.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initialize default preferences silently without showing toast
  useEffect(() => {
    const initializeDefaultPreferences = async () => {
      if (!preferences && session?.user.id) {
        const defaultPreferences = {
          payment_reminder: true,
          payment_reminder_days: 3,
          trial_ending: true,
          auto_renewal: true,
          subscription_expiry: true,
          user_id: session.user.id
        };
        
        // Silent upsert without triggering toast
        await supabase
          .from('alert_preferences')
          .upsert(defaultPreferences);
          
        refetch();
      }
    };

    initializeDefaultPreferences();
  }, [preferences, session?.user.id]);

  const handleSaveSettings = () => {
    if (!localPreferences) return;
    updatePreferences.mutate(localPreferences);
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setLocalPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleDaysChange = (days: number) => {
    setLocalPreferences(prev => ({ ...prev, payment_reminder_days: days }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Alert Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentRemindersSection
          paymentReminder={localPreferences.payment_reminder}
          paymentReminderDays={localPreferences.payment_reminder_days}
          onToggleChange={handleToggleChange}
          onDaysChange={handleDaysChange}
        />
        <SubscriptionStatusSection
          trialEnding={localPreferences.trial_ending}
          autoRenewal={localPreferences.auto_renewal}
          subscriptionExpiry={localPreferences.subscription_expiry}
          onToggleChange={handleToggleChange}
        />
        <Button onClick={handleSaveSettings} className="w-full">
          Save Alert Preferences
        </Button>
      </CardContent>
    </Card>
  );
};