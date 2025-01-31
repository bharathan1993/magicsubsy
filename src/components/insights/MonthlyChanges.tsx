import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MonthlyChanges() {
  const { data: changes = [], isLoading } = useQuery({
    queryKey: ['monthlyChanges'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('name, amount, billing_cycle')
        .order('updated_at', { ascending: false })
        .limit(2);
      
      if (error) throw error;

      // For this example, we'll show billing cycle changes as "discounts"
      return subscriptions.map(sub => ({
        name: sub.name,
        change: sub.billing_cycle === 'annual' ? 
          { type: 'discount', value: -16.7 } : 
          { type: 'increase', value: 13.4 }
      }));
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Changes</CardTitle>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {changes.map((change, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className={`${
                change.change.type === 'increase' ? 'text-red-500' : 'text-green-500'
              }`}>
                {change.change.type === 'increase' ? '↗' : '↘'}
              </span>
              <span>{change.name} {change.change.type === 'increase' ? 'increased' : 'annual discount'}</span>
            </div>
            <span
              className={`${
                change.change.type === 'increase' ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {change.change.type === 'increase' ? '+' : ''}{change.change.value}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}