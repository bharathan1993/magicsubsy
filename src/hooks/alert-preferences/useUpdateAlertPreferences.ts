import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { defaultPreferences } from "./useFetchAlertPreferences";

export const useUpdateAlertPreferences = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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
};