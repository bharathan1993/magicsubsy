import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function CategoryDistribution() {
  const { formatAmount } = useCurrency();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['categoryDistribution'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('category, amount');
      
      if (error) throw error;

      const subs = subscriptions || [];
      
      if (subs.length === 0) {
        return {
          categoryDistribution: []
        };
      }

      // Calculate category distribution
      const categoryData = subs.reduce((acc: Record<string, number>, curr) => {
        const category = curr.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + Number(curr.amount);
        return acc;
      }, {});

      const pieData = Object.entries(categoryData).map(([name, value]) => ({
        name,
        value
      }));

      return {
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

  const chartData = analysis?.categoryDistribution || [];

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-primary" />
          Category Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatAmount(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}