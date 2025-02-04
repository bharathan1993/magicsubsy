import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SpendingData } from "../types/spendingTypes";

export const useSpendingData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['spendingPattern', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('amount, activation_date')
        .eq('user_id', userId)
        .order('activation_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscription data:', error);
        throw error;
      }

      console.log('Fetched subscription data:', subscriptions);
      
      return subscriptions.map(sub => ({
        date: new Date(sub.activation_date),
        amount: Number(sub.amount)
      }));
    },
    enabled: !!userId
  });
};