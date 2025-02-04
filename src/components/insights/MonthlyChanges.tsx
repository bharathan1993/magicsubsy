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

      return subscriptions.map(sub => ({
        name: sub.name,
        change: sub.billing_cycle === 'annual' ? 
          { type: 'discount', value: -16.7 } : 
          { type: 'increase', value: 13.4 }
      }));
    }
  });

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="animate-pulse text-muted-foreground">Loading changes...</div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-background to-muted/50">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-semibold">Monthly Changes</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {changes.map((change, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border bg-card transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <span className={`${
                change.change.type === 'increase' ? 'text-destructive' : 'text-green-500'
              }`}>
                {change.change.type === 'increase' ? '↗' : '↘'}
              </span>
              <span className="text-sm">
                {change.name} {change.change.type === 'increase' ? 'increased' : 'annual discount'}
              </span>
            </div>
            <span
              className={`text-sm font-medium ${
                change.change.type === 'increase' ? 'text-destructive' : 'text-green-500'
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