import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CategorySummary } from "@/types/category";

export function useCategories() {
  return useQuery({
    queryKey: ['categoryDistribution'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('category, amount, billing_cycle');
      
      if (error) throw error;

      if (!subscriptions || subscriptions.length === 0) {
        return [];
      }

      // Calculate category totals and percentages with billing cycle adjustments
      const categoryTotals: Record<string, number> = {};
      let totalMonthlyAmount = 0;

      subscriptions.forEach((sub) => {
        // Convert amount to monthly based on billing cycle
        let monthlyAmount = sub.amount;
        if (sub.billing_cycle === 'quarterly') monthlyAmount = sub.amount / 3;
        if (sub.billing_cycle === 'annual') monthlyAmount = sub.amount / 12;

        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyAmount;
        totalMonthlyAmount += monthlyAmount;
      });

      // Convert to required format
      const categoryData: CategorySummary[] = Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category,
        amount: amount,
        percentage: Math.round((amount / totalMonthlyAmount) * 100),
        trend: "stable", // You could implement trend calculation based on historical data
        description: `${category} subscriptions and services`
      }));

      return categoryData.sort((a, b) => b.percentage - a.percentage);
    }
  });
}