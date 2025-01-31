import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Recommendations() {
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['subscriptionRecommendations'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('name, amount, billing_cycle, category');
      
      if (error) throw error;

      const recommendations = [];
      
      // Check for potential annual savings
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
            type: 'savings'
          });
        }
      }

      // Check for duplicate service categories
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
          type: 'warning'
        });
      }

      return recommendations;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recommendations</h2>
      {recommendations.map((recommendation, index) => (
        <Card
          key={index}
          className={`${
            recommendation.type === 'savings' ? 'bg-blue-50' : 'bg-yellow-50'
          }`}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">{recommendation.title}</h3>
            <p className="text-muted-foreground">{recommendation.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}