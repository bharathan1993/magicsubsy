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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId?: string; // Optional to maintain backwards compatibility
}

export function CancelSubscriptionDialog({ 
  open, 
  onOpenChange,
  subscriptionId 
}: CancelSubscriptionDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const handleCancel = async () => {
    if (!subscriptionId || !session?.user?.id) {
      toast({
        title: "Error",
        description: "Unable to cancel subscription. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription has been cancelled successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      onOpenChange(false);
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
            Are you sure you want to cancel this subscription? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Subscription
          </Button>
          <Button 
            onClick={handleCancel}
            variant="destructive"
          >
            Yes, Cancel Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}