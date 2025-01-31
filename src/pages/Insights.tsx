import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function Insights() {
  const { formatAmount } = useCurrency();

  const { data: monthlyData = [], isLoading: isMonthlyDataLoading } = useQuery({
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

      return months.map(month => ({
        month,
        amount: monthlyAmounts[month] || 0
      }));
    }
  });

  const { data: categoryData = [], isLoading: isCategoryDataLoading } = useQuery({
    queryKey: ['categoryDistribution'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('category, amount');
      
      if (error) throw error;

      const categoryTotals: Record<string, number> = {};
      let totalAmount = 0;

      subscriptions.forEach((sub) => {
        const amount = Number(sub.amount);
        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + amount;
        totalAmount += amount;
      });

      const colors = ['#4f46e5', '#06b6d4', '#10b981', '#6b7280', '#8b5cf6', '#ec4899'];
      
      return Object.entries(categoryTotals).map(([category, amount], index) => ({
        name: category,
        value: Math.round((amount / totalAmount) * 100),
        color: colors[index % colors.length]
      }));
    }
  });

  const { data: stats = { highest: null, lowest: null, total: 0 }, isLoading: isStatsLoading } = useQuery({
    queryKey: ['subscriptionStats'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('category, amount');
      
      if (error) throw error;

      const categoryTotals: Record<string, number> = {};
      subscriptions.forEach((sub) => {
        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + Number(sub.amount);
      });

      const categories = Object.entries(categoryTotals);
      const highest = categories.reduce((prev, curr) => 
        curr[1] > prev[1] ? curr : prev
      , ['', 0]);
      
      const lowest = categories.reduce((prev, curr) => 
        curr[1] < prev[1] ? curr : prev
      , ['', Infinity]);

      return {
        highest: highest[0],
        lowest: lowest[0],
        total: categories.length
      };
    }
  });

  if (isMonthlyDataLoading || isCategoryDataLoading || isStatsLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Subscription Insights</h1>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <StatsCard
            title="Highest Spending Category"
            value={stats.highest || 'N/A'}
            subtitle="of total spend"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <StatsCard
            title="Lowest Spending Category"
            value={stats.lowest || 'N/A'}
            subtitle="of total spend"
            icon={<TrendingDown className="w-6 h-6" />}
          />
          <StatsCard
            title="Total Categories"
            value={stats.total}
            subtitle="Active subscription categories"
            icon={<PieChartIcon className="w-6 h-6" />}
          />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name} (${value}%)`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <CategoryDistribution />
      </div>
    </div>
  );
}