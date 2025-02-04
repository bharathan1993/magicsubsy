import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionTableHeader } from "./SubscriptionTableHeader";
import { SubscriptionTableRow } from "./SubscriptionTableRow";
import { DeleteSubscriptionDialog } from "./DeleteSubscriptionDialog";
import { Subscription } from "@/types/subscription";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  selectedType: string;
}

export function SubscriptionTable({ 
  subscriptions, 
  onEdit,
  searchQuery,
  selectedCategory,
  selectedStatus,
  selectedType
}: SubscriptionTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);
  const { session } = useAuth();

  // Function to check if a subscription is expired
  const isSubscriptionExpired = (nextBillingDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const billingDate = new Date(nextBillingDate);
    return billingDate < today;
  };

  // Update subscription statuses based on next billing date
  useEffect(() => {
    const updateExpiredSubscriptions = async () => {
      for (const subscription of subscriptions) {
        const isExpired = isSubscriptionExpired(subscription.next_billing_date);
        const newStatus = isExpired ? 'expired' : 'active';
        
        if (subscription.status !== newStatus) {
          try {
            const { error } = await supabase
              .from('subscriptions')
              .update({ status: newStatus })
              .eq('id', subscription.id)
              .eq('user_id', session?.user?.id);

            if (error) throw error;
          } catch (error) {
            console.error('Error updating subscription status:', error);
          }
        }
      }
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    };

    updateExpiredSubscriptions();
  }, [subscriptions, session?.user?.id, queryClient]);

  const handleDeleteClick = async () => {
    if (!subscriptionToDelete || !session?.user?.id) {
      toast({
        title: "Error",
        description: "Unable to delete subscription. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscriptionToDelete)
        .eq('user_id', session.user.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
      
      setSubscriptionToDelete(null);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || subscription.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || subscription.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesType = selectedType === "all" || subscription.subscription_type === selectedType;
    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  return (
    <>
      <Table>
        <SubscriptionTableHeader />
        <TableBody>
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionTableRow
              key={subscription.id}
              subscription={subscription}
              onEdit={onEdit}
              onDelete={setSubscriptionToDelete}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteSubscriptionDialog
        open={!!subscriptionToDelete}
        onOpenChange={(open) => !open && setSubscriptionToDelete(null)}
        onConfirm={handleDeleteClick}
      />
    </>
  );
}