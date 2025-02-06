import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const defaultPreferences = {
  payment_reminder: true,
  payment_reminder_days: 3,
  trial_ending: true,
  auto_renewal: true,
  subscription_expiry: true,
};

export const useFetchAlertPreferences = () => {
  const { session } = useAuth();

  return useQuery({
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
};