import { CreditCard } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface SubscriptionStatsProps {
  totalMonthly: number;
}

export function SubscriptionStats({ totalMonthly }: SubscriptionStatsProps) {
  const { formatAmount } = useCurrency();
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-muted-foreground" />
        <span className="text-lg">Total Monthly: {formatAmount(totalMonthly)}</span>
      </div>
    </div>
  );
}