import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react";

const monthlyData = [
  { month: 'Jan', amount: 120 },
  { month: 'Feb', amount: 145 },
  { month: 'Mar', amount: 132 },
  { month: 'Apr', amount: 168 },
  { month: 'May', amount: 170 },
  { month: 'Jun', amount: 165 },
];

const categoryData = [
  { name: 'Entertainment', value: 40, color: '#4f46e5' },
  { name: 'Software', value: 25, color: '#06b6d4' },
  { name: 'Fitness', value: 20, color: '#10b981' },
  { name: 'Others', value: 15, color: '#6b7280' },
];

export default function Insights() {
  const highestCategory = categoryData.reduce((prev, current) => 
    (prev.value > current.value) ? prev : current
  );

  const lowestCategory = categoryData.reduce((prev, current) => 
    (prev.value < current.value) ? prev : current
  );

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Subscription Insights</h1>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <StatsCard
            title="Highest Spending Category"
            value={highestCategory.name}
            subtitle={`${highestCategory.value}% of total spend`}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <StatsCard
            title="Lowest Spending Category"
            value={lowestCategory.name}
            subtitle={`${lowestCategory.value}% of total spend`}
            icon={<TrendingDown className="w-6 h-6" />}
          />
          <StatsCard
            title="Total Categories"
            value={categoryData.length}
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
                    <YAxis />
                    <Tooltip />
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