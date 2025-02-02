import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";
import { SubscriptionActions } from "./SubscriptionActions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  next_billing_date: string;
  category: string;
  website_url: string | null;
  activation_date: string;
  subscription_type: string;
  status: string;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
}

export function SubscriptionTable({ 
  subscriptions, 
  onEdit, 
  onDelete,
  searchQuery,
  selectedCategory,
  selectedStatus
}: SubscriptionTableProps) {
  const { formatAmount } = useCurrency();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate and refetch subscriptions query
      await queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });

      // Call the parent's onDelete callback
      onDelete(id);
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
    const matchesStatus = selectedStatus === "all" || subscription.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Billing Cycle</TableHead>
          <TableHead>Next Billing</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSubscriptions.map((subscription) => (
          <TableRow key={subscription.id}>
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
                onDelete={handleDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}