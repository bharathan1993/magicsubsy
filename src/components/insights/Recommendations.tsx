import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, TrendingDown, LucideIcon } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  type: 'savings' | 'warning';
  icon: LucideIcon;
}

export function Recommendations() {
  const { data: recommendations = [], isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recommendations</h2>
        <Card className="min-h-[100px] flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
          <div className="animate-pulse text-muted-foreground">Loading recommendations...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recommendations</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {recommendations.map((recommendation, index) => {
          const Icon = recommendation.icon;
          return (
            <Card
              key={index}
              className={`transition-all hover:scale-[1.02] ${
                recommendation.type === 'savings' 
                  ? 'bg-blue-500/5 hover:bg-blue-500/10' 
                  : 'bg-yellow-500/5 hover:bg-yellow-500/10'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    recommendation.type === 'savings' 
                      ? 'bg-blue-500/10 text-blue-500' 
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{recommendation.title}</h3>
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}