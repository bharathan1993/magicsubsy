import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from "lucide-react";
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
      
      // Default values for empty data
      if (amounts.length === 0) {
        return {
          highest: { name: 'No subscriptions', amount: 0 },
          lowest: { name: 'No subscriptions', amount: 0 },
          average: 0
        };
      }

      // Calculate highest and lowest expenses
      const highest = amounts.reduce((max, curr) => 
        curr.amount > max.amount ? curr : max
      , amounts[0]);

      const lowest = amounts.reduce((min, curr) => 
        curr.amount < min.amount ? curr : min
      , amounts[0]);

      const average = amounts.reduce((sum, curr) => sum + curr.amount, 0) / amounts.length;

      return {
        highest,
        lowest,
        average
      };
    }
  });

  if (isLoading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse">Loading analysis...</div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Spending Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stats Section */}
          <div className="grid gap-4">
            {/* Highest Expense */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Highest Expense</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {formatAmount(analysis?.highest.amount || 0)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {analysis?.highest.name}
                  </p>
                </div>
                <ArrowUpCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>

            {/* Lowest Expense */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lowest Expense</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {formatAmount(analysis?.lowest.amount || 0)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {analysis?.lowest.name}
                  </p>
                </div>
                <ArrowDownCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>

            {/* Average Cost */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Cost</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {formatAmount(analysis?.average || 0)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Per Subscription
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}