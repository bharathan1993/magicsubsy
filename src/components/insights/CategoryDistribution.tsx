import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

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
      <Card className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="animate-pulse text-muted-foreground">Loading analysis...</div>
      </Card>
    );
  }

  const chartData = analysis?.categoryDistribution || [];

  return (
    <Card className="bg-gradient-to-br from-background to-muted/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-primary/50" />
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
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="transition-opacity hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatAmount(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}