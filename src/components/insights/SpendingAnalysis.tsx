import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, DollarSign, PieChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function SpendingAnalysis() {
  const { formatAmount } = useCurrency();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['spendingAnalysis'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('name, amount, category');
      
      if (error) throw error;

      const subs = subscriptions || [];
      const amounts = subs.map(sub => ({ name: sub.name, amount: Number(sub.amount) }));
      
      // Calculate highest and lowest expenses
      const highest = amounts.reduce((max, curr) => 
        curr.amount > max.amount ? curr : max
      , { name: '', amount: 0 });

      const lowest = amounts.reduce((min, curr) => 
        curr.amount < min.amount ? curr : min
      , { name: amounts[0]?.name || '', amount: amounts[0]?.amount || 0 });

      const average = amounts.reduce((sum, curr) => sum + curr.amount, 0) / (amounts.length || 1);

      // Calculate category distribution
      const categoryData = subs.reduce((acc: Record<string, number>, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
        return acc;
      }, {});

      const pieData = Object.entries(categoryData).map(([name, value]) => ({
        name,
        value
      }));

      return {
        highest,
        lowest,
        average,
        categoryDistribution: pieData
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stats Section */}
          <div className="space-y-6">
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

          {/* Category Distribution Pie Chart */}
          <div className="h-[300px] relative">
            <div className="absolute top-0 left-0 flex items-center justify-center w-full">
              <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Category Distribution
              </p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsChart>
                <Pie
                  data={analysis?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analysis?.categoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatAmount(value)}
                />
                <Legend />
              </RechartsChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}