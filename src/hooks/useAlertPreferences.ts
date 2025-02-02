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
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in garbage collection for 10 minutes
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
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
    onMutate: async (newPreferences) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['alert-preferences', session?.user.id] });

      // Snapshot the previous value
      const previousPreferences = queryClient.getQueryData(['alert-preferences', session?.user.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['alert-preferences', session?.user.id], {
        ...newPreferences,
        user_id: session?.user.id,
      });

      return { previousPreferences };
    },
    onError: (error: Error, _, context) => {
      // Rollback to the previous value on error
      if (context?.previousPreferences) {
        queryClient.setQueryData(['alert-preferences', session?.user.id], context.previousPreferences);
      }
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['alert-preferences', session?.user.id], data);
      toast({
        title: "Alert settings saved",
        description: "Your notification preferences have been updated.",
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

  // Initialize preferences only if they don't exist
  useEffect(() => {
    const initializeDefaultPreferences = async () => {
      if (!preferences && session?.user.id && !isLoading) {
        try {
          await updatePreferences.mutateAsync(defaultPreferences);
        } catch (err) {
          console.error('Error in initialization:', err);
        }
      }
    };

    initializeDefaultPreferences();
  }, [preferences, session?.user.id, isLoading]);

  return {
    preferences: localPreferences,
    setPreferences: setLocalPreferences,
    isLoading,
    savePreferences: (prefs: AlertPreferences) => updatePreferences.mutate(prefs),
    isSaving: updatePreferences.isPending
  };
};