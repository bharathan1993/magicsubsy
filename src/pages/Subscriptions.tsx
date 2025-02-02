import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { EditSubscriptionDialog } from "@/components/dashboard/EditSubscriptionDialog";
import { SubscriptionStats } from "@/components/subscription/SubscriptionStats";
import { SubscriptionTable } from "@/components/subscription/SubscriptionTable";
import { SubscriptionFilters } from "@/components/subscription/SubscriptionFilters";

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

export default function Subscriptions() {
  const { toast } = useToast();
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: subscriptions = [], refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_status")
        .select("*")
        .order('next_billing_date', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const handleEditClick = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingSubscription(null);
      refetch();
    }
  };

  const totalMonthly = subscriptions.reduce((acc, sub) => {
    let monthlyAmount = sub.amount;
    if (sub.billing_cycle === "quarterly") monthlyAmount = sub.amount / 3;
    if (sub.billing_cycle === "annual") monthlyAmount = sub.amount / 12;
    return acc + monthlyAmount;
  }, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Subscriptions</h1>
          <SubscriptionStats totalMonthly={totalMonthly} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
            <SubscriptionTable
              subscriptions={subscriptions}
              onEdit={handleEditClick}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
            />
          </CardContent>
        </Card>
      </div>
      
      <EditSubscriptionDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        subscription={editingSubscription}
      />
    </div>
  );
}