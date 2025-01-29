import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

export function CategoryDistribution() {
  const getTrendIcon = (trend: Category["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0);

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Subscription Categories</h3>
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
        <p className="text-sm text-muted-foreground mt-1">
          Total Monthly Spend: ${totalAmount.toFixed(2)}
        </p>
      </div>
      
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{category.name}</span>
                {getTrendIcon(category.trend)}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-muted-foreground">
                  ${category.amount.toFixed(2)}
                </span>
                <span className="text-sm font-medium w-12 text-right">
                  {category.percentage}%
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Progress 
                value={category.percentage} 
                className={cn(
                  "h-2",
                  category.percentage > 30 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500" 
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                )}
              />
              <p className="text-xs text-muted-foreground">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 space-y-2">
        <Button variant="outline" className="w-full bg-white dark:bg-gray-800">
          View Detailed Analysis
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
}