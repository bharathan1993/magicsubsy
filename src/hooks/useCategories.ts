import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CategorySummary } from "@/types/category";

export function useCategories() {
  return useQuery({
    queryKey: ['categoryDistribution'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('category, amount');
      
      if (error) throw error;

      if (!subscriptions || subscriptions.length === 0) {
        return [];
      }

      // Calculate category totals and percentages
      const categoryTotals: Record<string, number> = {};
      let totalAmount = 0;

      subscriptions.forEach((sub) => {
        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + Number(sub.amount);
        totalAmount += Number(sub.amount);
      });

      // Convert to required format
      const categoryData: CategorySummary[] = Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category,
        amount: amount,
        percentage: Math.round((amount / totalAmount) * 100),
        trend: "stable", // You could implement trend calculation based on historical data
        description: `${category} subscriptions and services`
      }));

      return categoryData.sort((a, b) => b.percentage - a.percentage);
    }
  });
}