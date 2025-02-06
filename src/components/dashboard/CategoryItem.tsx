import { TrendingUp, TrendingDown } from "lucide-react";
import { CategoryProgressBar } from "./CategoryProgressBar";
import type { CategorySummary } from "@/types/category";
import { useCurrency } from "@/contexts/CurrencyContext";

interface CategoryItemProps {
  category: CategorySummary;
}

export function CategoryItem({ category }: CategoryItemProps) {
  const { formatAmount } = useCurrency();

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

  return (
    <div className="space-y-2">
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
      <CategoryProgressBar category={category} />
    </div>
  );
}