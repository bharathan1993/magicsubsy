import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface CategorySummary {
  name: string;
  percentage: number;
  amount: number;
  trend: "up" | "down" | "stable";
  description: string;
}

export function CategoryDistribution() {
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categoryDistribution'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('category, amount');
      
      if (error) throw error;

      if (!subscriptions || subscriptions.length === 0) {
        return [];
      }

      // Calculate category totals and percentages
      const categoryTotals: Record<string, number> = {};
      let totalAmount = 0;

      subscriptions.forEach((sub) => {
        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + Number(sub.amount);
        totalAmount += Number(sub.amount);
      });

      // Convert to required format
      const categoryData: CategorySummary[] = Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category,
        amount: amount,
        percentage: Math.round((amount / totalAmount) * 100),
        trend: "stable", // You could implement trend calculation based on historical data
        description: `${category} subscriptions and services`
      }));

      return categoryData.sort((a, b) => b.percentage - a.percentage);
    }
  });

  const getTrendIcon = (trend: CategorySummary["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Initialize totalAmount with proper error handling
  const totalAmount = Array.isArray(categories) 
    ? categories.reduce((sum, category) => sum + category.amount, 0)
    : 0;

  if (isLoading) {
    return <Card className="p-6"><div>Loading...</div></Card>;
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Error loading category distribution</div>
      </Card>
    );
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No subscription data available
        </div>
      </Card>
    );
  }

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
          Total Monthly Spend: {formatAmount(totalAmount)}
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
                  {formatAmount(category.amount)}
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
        <Button 
          variant="outline" 
          className="w-full bg-white dark:bg-gray-800"
          onClick={() => navigate('/app/insights')}
        >
          View Detailed Analysis
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
}