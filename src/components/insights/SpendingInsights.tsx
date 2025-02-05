import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";

export function SpendingInsights() {
  const { formatAmount } = useCurrency();
  const { session } = useAuth();

  const { data: insights, isLoading } = useQuery({
    queryKey: ['spendingInsights'],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('amount, activation_date')
        .eq('user_id', session.user.id)
        .gte('activation_date', ninetyDaysAgo.toISOString().split('T')[0])
        .order('activation_date', { ascending: true });

      if (error) throw error;

      if (!subscriptions?.length) return null;

      const amounts = subscriptions.map(sub => Number(sub.amount));
      const totalSpent = amounts.reduce((sum, amount) => sum + amount, 0);
      const avgSpending = totalSpent / amounts.length;
      
      // Calculate trend (comparing first and last month)
      const firstMonth = amounts.slice(0, 30);
      const lastMonth = amounts.slice(-30);
      const firstMonthAvg = firstMonth.reduce((sum, amount) => sum + amount, 0) / firstMonth.length;
      const lastMonthAvg = lastMonth.reduce((sum, amount) => sum + amount, 0) / lastMonth.length;
      const trend = ((lastMonthAvg - firstMonthAvg) / firstMonthAvg) * 100;

      return {
        totalSpent,
        avgSpending,
        trend,
        numberOfSubscriptions: subscriptions.length
      };
    }
  });

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="animate-pulse text-muted-foreground">Loading insights...</div>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="text-muted-foreground">No data available</div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-background to-muted/50">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Info className="h-4 w-4 text-primary/50" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent (90 days)</p>
                <h3 className="text-xl font-semibold mt-0.5">
                  {formatAmount(insights.totalSpent)}
                </h3>
              </div>
              <DollarSign className="h-6 w-6 text-primary/50" />
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Monthly</p>
                <h3 className="text-xl font-semibold mt-0.5">
                  {formatAmount(insights.avgSpending)}
                </h3>
              </div>
              <DollarSign className="h-6 w-6 text-blue-500/50" />
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Spending Trend</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold mt-0.5">
                    {Math.abs(insights.trend).toFixed(1)}%
                  </h3>
                  <span className={insights.trend > 0 ? "text-destructive" : "text-green-500"}>
                    {insights.trend > 0 ? "increase" : "decrease"}
                  </span>
                </div>
              </div>
              {insights.trend > 0 ? (
                <TrendingUp className="h-6 w-6 text-destructive/50" />
              ) : (
                <TrendingDown className="h-6 w-6 text-green-500/50" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}