import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, TrendingDown, LucideIcon } from "lucide-react";

export interface Recommendation {
  title: string;
  description: string;
  type: 'savings' | 'warning';
  icon: LucideIcon;
}

export function useRecommendations() {
  return useQuery({
    queryKey: ['subscriptionRecommendations'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('name, amount, billing_cycle, category');
      
      if (error) throw error;

      const recommendations: Recommendation[] = [];
      
      const monthlySubscriptions = subscriptions.filter(sub => 
        sub.billing_cycle === 'monthly' && sub.amount > 0
      );
      
      if (monthlySubscriptions.length > 0) {
        const potentialSavings = monthlySubscriptions.reduce(
          (sum, sub) => sum + (Number(sub.amount) * 2), 
          0
        );
        
        if (potentialSavings > 0) {
          recommendations.push({
            title: 'Switch to Annual Plans',
            description: `Save up to ${potentialSavings} annually by switching ${
              monthlySubscriptions.map(s => s.name).join(' and ')
            } to yearly subscriptions.`,
            type: 'savings',
            icon: TrendingDown
          });
        }
      }

      const categoryCount = subscriptions.reduce((acc, sub) => {
        acc[sub.category] = (acc[sub.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const duplicateCategories = Object.entries(categoryCount)
        .filter(([_, count]) => count > 1)
        .map(([category]) => category);

      if (duplicateCategories.length > 0) {
        recommendations.push({
          title: 'Duplicate Services',
          description: 'You have multiple streaming services. Consider consolidating to save money.',
          type: 'warning',
          icon: AlertCircle
        });
      }

      return recommendations;
    }
  });
}