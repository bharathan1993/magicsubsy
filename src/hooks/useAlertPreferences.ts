import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type AlertPreferences = {
  payment_reminder: boolean;
  payment_reminder_days: number;
  trial_ending: boolean;
  auto_renewal: boolean;
  subscription_expiry: boolean;
};

const defaultPreferences: AlertPreferences = {
  payment_reminder: true,
  payment_reminder_days: 3,
  trial_ending: true,
  auto_renewal: true,
  subscription_expiry: true,
};

export const useAlertPreferences = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [localPreferences, setLocalPreferences] = useState<AlertPreferences>(defaultPreferences);

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['alert-preferences', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const { data, error } = await supabase
        .from('alert_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching preferences:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!session?.user.id,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
  });

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: AlertPreferences) => {
      if (!session?.user.id) throw new Error("No user session");
      
      const { data, error } = await supabase
        .from('alert_preferences')
        .upsert({
          user_id: session.user.id,
          ...newPreferences,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['alert-preferences', session?.user.id], data);
      queryClient.invalidateQueries({ queryKey: ['alert-preferences', session?.user.id] });
      toast({
        title: "Alert settings saved",
        description: "Your notification preferences have been updated.",
      });
    },
    onError: (error: Error) => {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  useEffect(() => {
    const initializeDefaultPreferences = async () => {
      if (!preferences && session?.user.id) {
        try {
          const { error } = await supabase
            .from('alert_preferences')
            .upsert({
              ...defaultPreferences,
              user_id: session.user.id
            });
            
          if (!error) {
            queryClient.invalidateQueries({ queryKey: ['alert-preferences', session.user.id] });
          } else {
            console.error('Error initializing preferences:', error);
          }
        } catch (err) {
          console.error('Error in initialization:', err);
        }
      }
    };

    initializeDefaultPreferences();
  }, [preferences, session?.user.id, queryClient]);

  return {
    preferences: localPreferences,
    setPreferences: setLocalPreferences,
    isLoading,
    savePreferences: (prefs: AlertPreferences) => updatePreferences.mutate(prefs),
    isSaving: updatePreferences.isPending
  };
};