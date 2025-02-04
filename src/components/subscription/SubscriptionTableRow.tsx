import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";
import { SubscriptionActions } from "./SubscriptionActions";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Subscription } from "@/types/subscription";

interface SubscriptionTableRowProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionTableRow({ 
  subscription, 
  onEdit, 
  onDelete 
}: SubscriptionTableRowProps) {
  const { formatAmount } = useCurrency();

  return (
    <TableRow>
      <TableCell className="font-medium">{subscription.name}</TableCell>
      <TableCell>{formatAmount(subscription.amount)}</TableCell>
      <TableCell className="capitalize">{subscription.billing_cycle}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          {new Date(subscription.next_billing_date).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          {subscription.category}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {subscription.subscription_type}
        </Badge>
      </TableCell>
      <TableCell>
        <SubscriptionStatusBadge status={subscription.status} />
      </TableCell>
      <TableCell>
        <SubscriptionActions
          subscriptionId={subscription.id}
          websiteUrl={subscription.website_url}
          onEdit={() => onEdit(subscription)}
          onDelete={() => onDelete(subscription.id)}
        />
      </TableCell>
    </TableRow>
  );
}