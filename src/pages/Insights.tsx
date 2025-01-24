import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', amount: 120 },
  { month: 'Feb', amount: 145 },
  { month: 'Mar', amount: 132 },
  { month: 'Apr', amount: 168 },
  { month: 'May', amount: 170 },
  { month: 'Jun', amount: 165 },
];

export default function Insights() {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Subscription Insights</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}