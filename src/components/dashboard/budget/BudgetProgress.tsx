import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";

interface BudgetProgressProps {
  currentSpend: number;
  monthlyGoal: number;
  onUpdateGoal: (newGoal: number) => void;
}

export function BudgetProgress({ currentSpend, monthlyGoal, onUpdateGoal }: BudgetProgressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(monthlyGoal);
  const { toast } = useToast();
  const { formatAmount } = useCurrency();

  const progress = (currentSpend / monthlyGoal) * 100;

  const handleSaveBudget = () => {
    setIsEditing(false);
    onUpdateGoal(tempGoal);
    toast({
      title: "Budget Updated",
      description: `Your monthly budget has been set to ${formatAmount(tempGoal)}`,
    });
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Monthly Budget</span>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(Number(e.target.value))}
              className="w-24 h-8"
            />
            <Button size="sm" onClick={handleSaveBudget}>Save</Button>
          </div>
        ) : (
          <span className="text-sm font-medium">
            {formatAmount(currentSpend)} / {formatAmount(monthlyGoal)}
          </span>
        )}
      </div>
      <Progress value={progress} className="h-2" />
      {progress <= 100 ? (
        <p className="text-xs text-green-600 mt-1">
          You're on track! {formatAmount(monthlyGoal - currentSpend)} remaining this month
        </p>
      ) : (
        <p className="text-xs text-red-600 mt-1">
          You're over budget by {formatAmount(currentSpend - monthlyGoal)} this month
        </p>
      )}
    </div>
  );
}