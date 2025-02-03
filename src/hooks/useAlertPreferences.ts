import { useEffect, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const defaultPreferences = {
  payment_reminder: true,
  payment_reminder_days: 3,
  trial_ending: true,
  auto_renewal: true,
  subscription_expiry: true,
};

export const useAlertPreferences = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [localPreferences, setLocalPreferences] = useState(defaultPreferences);

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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: typeof defaultPreferences) => {
      if (!session?.user.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('alert_preferences')
        .upsert({
          user_id: session.user.id,
          ...newPreferences,
        }, {
          onConflict: 'user_id'
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onMutate: async (newPreferences) => {
      await queryClient.cancelQueries({ queryKey: ['alert-preferences', session?.user.id] });
      const previousPreferences = queryClient.getQueryData(['alert-preferences', session?.user.id]);
      queryClient.setQueryData(['alert-preferences', session?.user.id], {
        ...newPreferences,
        user_id: session?.user.id,
      });
      return { previousPreferences };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousPreferences) {
        queryClient.setQueryData(['alert-preferences', session?.user.id], context.previousPreferences);
      }
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['alert-preferences', session?.user.id], data);
      toast({
        title: "Alert settings saved",
        description: "Your notification preferences have been updated.",
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    } else if (!isLoading) {
      // Only set default preferences if we're not loading and no preferences exist
      setLocalPreferences(defaultPreferences);
    }
  }, [preferences, isLoading]);

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
    savePreferences: updatePreferences.mutate,
    isSaving: updatePreferences.isPending
  };
};