import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId?: string; // If provided, shows direct confirmation. If not, shows dropdown.
}

export function CancelSubscriptionDialog({ 
  open, 
  onOpenChange,
  subscriptionId 
}: CancelSubscriptionDialogProps) {
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  // Only fetch subscriptions if we need to show the dropdown (no subscriptionId provided)
  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq('user_id', session.user.id)
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !subscriptionId // Only fetch if no subscriptionId provided
  });

  const handleCancel = async () => {
    const idToCancel = subscriptionId || selectedSubscription;
    
    if (!idToCancel || !session?.user?.id) {
      toast({
        title: "Error",
        description: subscriptionId 
          ? "Unable to cancel subscription. Please try again."
          : "Please select a subscription to cancel.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', idToCancel)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription has been cancelled successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      onOpenChange(false);
      if (!subscriptionId) {
        setSelectedSubscription(""); // Reset selection only for dropdown flow
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            {subscriptionId 
              ? "Are you sure you want to cancel this subscription? This action cannot be undone."
              : "Select the subscription you want to cancel."}
          </DialogDescription>
        </DialogHeader>

        {!subscriptionId && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subscription" className="text-right">
                Subscription
              </Label>
              <Select
                value={selectedSubscription}
                onValueChange={setSelectedSubscription}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subscription" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name} - {sub.amount}/month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {subscriptionId ? "Keep Subscription" : "Cancel"}
          </Button>
          <Button 
            onClick={handleCancel}
            variant="destructive"
          >
            {subscriptionId ? "Yes, Cancel Subscription" : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}