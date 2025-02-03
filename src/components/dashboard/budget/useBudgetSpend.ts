import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBudgetSpend() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['monthlySpend', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('amount, billing_cycle')
        .eq('user_id', session.user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      }

      return subscriptions.reduce((total, sub) => {
        let monthlyAmount = sub.amount;
        if (sub.billing_cycle === 'quarterly') monthlyAmount = sub.amount / 3;
        if (sub.billing_cycle === 'annual') monthlyAmount = sub.amount / 12;
        return total + monthlyAmount;
      }, 0);
    },
    enabled: !!session?.user?.id
  });
}