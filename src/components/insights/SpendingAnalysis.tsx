import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";

export function SpendingAnalysis() {
  const { formatAmount } = useCurrency();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['spendingAnalysis'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('name, amount');
      
      if (error) throw error;

      const subs = subscriptions || [];
      const amounts = subs.map(sub => ({ name: sub.name, amount: Number(sub.amount) }));
      
      const highest = amounts.reduce((max, curr) => 
        curr.amount > max.amount ? curr : max
      , { name: '', amount: 0 });

      const lowest = amounts.reduce((min, curr) => 
        curr.amount < min.amount ? curr : min
      , { name: amounts[0]?.name || '', amount: amounts[0]?.amount || 0 });

      const average = amounts.reduce((sum, curr) => sum + curr.amount, 0) / (amounts.length || 1);

      return {
        highest,
        lowest,
        average
      };
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Spending Analysis</CardTitle>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Highest Expense</span>
            <span className="font-medium">
              {analysis?.highest.name} ({formatAmount(analysis?.highest.amount || 0)})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lowest Expense</span>
            <span className="font-medium">
              {analysis?.lowest.name} ({formatAmount(analysis?.lowest.amount || 0)})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Average Cost</span>
            <span className="font-medium">{formatAmount(analysis?.average || 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}