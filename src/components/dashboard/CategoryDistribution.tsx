import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  percentage: number;
  amount: number;
  trend: "up" | "down" | "stable";
  description: string;
}

const categories: Category[] = [
  {
    name: "Entertainment",
    percentage: 40,
    amount: 120.50,
    trend: "up",
    description: "Streaming services, gaming subscriptions, and media content"
  },
  {
    name: "Software",
    percentage: 25,
    amount: 75.25,
    trend: "stable",
    description: "Productivity tools, cloud storage, and development platforms"
  },
  {
    name: "Fitness",
    percentage: 20,
    amount: 60.00,
    trend: "up",
    description: "Gym memberships, fitness apps, and wellness programs"
  },
  {
    name: "Others",
    percentage: 15,
    amount: 45.25,
    trend: "down",
    description: "Miscellaneous subscriptions and services"
  },
];

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#6b7280'];

export function CategoryDistribution() {
  const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0);

  const data = categories.map(category => ({
    name: category.name,
    value: category.percentage,
    amount: category.amount,
    description: category.description
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.description}</p>
          <div className="mt-2 font-mono">
            <p>${data.amount.toFixed(2)}</p>
            <p>{data.value}% of total</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Category Distribution</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Breakdown of your monthly subscription spending by category</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm">
                  {value} ({entry.payload.value}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-center text-muted-foreground mt-4">
        Total Monthly Spend: ${totalAmount.toFixed(2)}
      </p>
    </Card>
  );
}