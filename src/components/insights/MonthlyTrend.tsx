import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";

export function MonthlyTrend() {
  const { formatAmount } = useCurrency();

  const { data: monthlyData = [], isLoading } = useQuery({
    queryKey: ['monthlySpending'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('amount, billing_cycle, activation_date');
      
      if (error) throw error;

      const monthlyAmounts: Record<string, number> = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      subscriptions.forEach((sub) => {
        const activationDate = new Date(sub.activation_date);
        const month = months[activationDate.getMonth()];
        let monthlyAmount = Number(sub.amount);
        
        if (sub.billing_cycle === 'quarterly') monthlyAmount /= 3;
        if (sub.billing_cycle === 'annual') monthlyAmount /= 12;
        
        monthlyAmounts[month] = (monthlyAmounts[month] || 0) + monthlyAmount;
      });

      return months.slice(0, 5).map(month => ({
        month,
        amount: monthlyAmounts[month] || 0
      }));
    }
  });

  if (isLoading) {
    return (
      <Card className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="animate-pulse text-muted-foreground">Loading analysis...</div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-gradient-to-br from-background to-muted/50">
      <CardHeader className="flex flex-row items-center justify-between p-2">
        <CardTitle className="text-sm font-semibold">Monthly Trend</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground/50" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
              <XAxis 
                dataKey="month" 
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                tickFormatter={(value) => formatAmount(value)}
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatAmount(value), "Amount"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "12px"
                }}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}