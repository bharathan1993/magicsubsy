import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentRemindersSection } from "./PaymentRemindersSection";
import { SubscriptionStatusSection } from "./SubscriptionStatusSection";

export const AlertPreferencesForm = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  
  const [localPreferences, setLocalPreferences] = useState({
    payment_reminder: true,
    payment_reminder_days: 3,
    trial_ending: true,
    auto_renewal: true,
    subscription_expiry: true,
  });

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['alert-preferences', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const { data, error } = await supabase
        .from('alert_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes (formerly cacheTime)
  });

  // Update local state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        payment_reminder: preferences.payment_reminder ?? true,
        payment_reminder_days: preferences.payment_reminder_days ?? 3,
        trial_ending: preferences.trial_ending ?? true,
        auto_renewal: preferences.auto_renewal ?? true,
        subscription_expiry: preferences.subscription_expiry ?? true,
      });
    }
  }, [preferences]);

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: any) => {
      if (!session?.user.id) throw new Error("No user session");
      
      const { error } = await supabase
        .from('alert_preferences')
        .upsert({
          user_id: session.user.id,
          ...newPreferences,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alert settings saved",
        description: "Your notification preferences have been updated.",
      });
    },
    onError: (error) => {
      console.error('Error saving preferences:', error);
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
        
        const { error } = await supabase
          .from('alert_preferences')
          .upsert(defaultPreferences);
          
        if (!error) {
          // Refresh the query to get the latest data
          queryClient.invalidateQueries({ queryKey: ['alert-preferences', session.user.id] });
        }
      }
    };

    initializeDefaultPreferences();
  }, [preferences, session?.user.id, queryClient]);

  const handleSaveSettings = () => {
    if (!session?.user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save preferences",
        variant: "destructive",
      });
      return;
    }
    
    updatePreferences.mutate({
      ...localPreferences,
      user_id: session.user.id
    });
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setLocalPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleDaysChange = (days: number) => {
    setLocalPreferences(prev => ({ ...prev, payment_reminder_days: days }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Alert Settings</CardTitle>
        </CardHeader>
        <CardContent>
          Loading preferences...
        </CardContent>
      </Card>
    );
  }

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
        <Button 
          onClick={handleSaveSettings} 
          className="w-full"
          disabled={updatePreferences.isPending}
        >
          {updatePreferences.isPending ? 'Saving...' : 'Save Alert Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};