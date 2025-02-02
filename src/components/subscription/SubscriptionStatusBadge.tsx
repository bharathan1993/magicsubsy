import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface SubscriptionStatusBadgeProps {
  status: string;
}

export function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'Active' ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <Badge 
        variant={status === 'Active' ? "secondary" : "destructive"}
        className={status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
      >
        {status}
      </Badge>
    </div>
  );
}