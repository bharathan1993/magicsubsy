import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, RefreshCw, Trash2, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "@/types/subscription";

interface SubscriptionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
}

export function SubscriptionDetailsDialog({
  open,
  onOpenChange,
  subscription,
}: SubscriptionDetailsDialogProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { formatAmount } = useCurrency();
  const { toast } = useToast();

  if (!subscription) return null;

  const handleRenew = () => {
    toast({
      title: "Renewal initiated",
      description: "Your subscription renewal process has started.",
    });
    onOpenChange(false);
  };

  const handleVisitWebsite = () => {
    if (subscription.website_url) {
      window.open(subscription.website_url, '_blank');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{subscription.name}</DialogTitle>
            <DialogDescription>
              View and manage your subscription details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Amount</span>
              <span className="text-lg font-semibold">
                {formatAmount(subscription.amount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Billing Cycle</span>
              <Badge variant="secondary" className="capitalize">
                {subscription.billing_cycle}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Next Billing Date</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(subscription.next_billing_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Category</span>
              <Badge variant="outline" className="capitalize">
                {subscription.category}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Type</span>
              <Badge variant="outline" className="capitalize">
                {subscription.subscription_type}
              </Badge>
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              {subscription.website_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVisitWebsite}
                  className="flex items-center gap-2"
                >
                  Visit Website
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRenew}
                className="flex items-center gap-2"
              >
                Renew
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
                className="flex items-center gap-2"
              >
                Cancel
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
      />
    </>
  );
}