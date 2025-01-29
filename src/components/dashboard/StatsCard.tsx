import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  isCurrency?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  className,
  isCurrency = false 
}: StatsCardProps) {
  const { formatAmount } = useCurrency();

  const displayValue = isCurrency && typeof value === 'number' 
    ? formatAmount(value)
    : value;

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{displayValue}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </Card>
  );
}