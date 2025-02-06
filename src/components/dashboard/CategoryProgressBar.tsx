import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { CategorySummary } from "@/types/category";

interface CategoryProgressBarProps {
  category: CategorySummary;
}

export function CategoryProgressBar({ category }: CategoryProgressBarProps) {
  return (
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
  );
}