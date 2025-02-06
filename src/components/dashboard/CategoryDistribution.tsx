import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCategories } from "@/hooks/useCategories";
import { CategoryItem } from "./CategoryItem";

export function CategoryDistribution() {
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();
  const { data: categories = [], isLoading, error } = useCategories();

  // Calculate total amount
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
          <CategoryItem key={category.name} category={category} />
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