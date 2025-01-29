import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface SharingOpportunity {
  service: string;
  plan: string;
  maxUsers: number;
  individualCost: number;
  sharedCost: number;
  potentialSavings: number;
  availableSlots: number;
}

interface SharingOpportunityCardProps {
  opportunity: SharingOpportunity;
  onJoin: (service: string) => void;
}

export const SharingOpportunityCard = ({ opportunity, onJoin }: SharingOpportunityCardProps) => {
  const { formatAmount } = useCurrency();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
      <div className="space-y-2 mb-4 md:mb-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{opportunity.service}</h3>
          <Badge>{opportunity.plan}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Max users: {opportunity.maxUsers} | Available slots: {opportunity.availableSlots}
        </p>
      </div>
      <div className="space-y-2 md:text-right">
        <div>
          <p className="text-sm text-muted-foreground">
            Individual cost: {formatAmount(opportunity.individualCost)}/mo
          </p>
          <p className="text-sm text-muted-foreground">
            Shared cost: {formatAmount(opportunity.sharedCost)}/mo
          </p>
          <p className="font-semibold text-green-600">
            Save {formatAmount(opportunity.potentialSavings)}/mo
          </p>
        </div>
        <Button 
          className="w-full md:w-auto"
          onClick={() => onJoin(opportunity.service)}
        >
          Join Plan <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};