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

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Trend</CardTitle>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatAmount(value)} />
              <Tooltip 
                formatter={(value: number) => [formatAmount(value), "Amount"]}
              />
              <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}