import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { EditSubscriptionDialog } from "@/components/dashboard/EditSubscriptionDialog";
import { SubscriptionStats } from "@/components/subscription/SubscriptionStats";
import { SubscriptionTable } from "@/components/subscription/SubscriptionTable";
import { SubscriptionFilters } from "@/components/subscription/SubscriptionFilters";
import { Subscription } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { NewSubscriptionDialog } from "@/components/dashboard/NewSubscriptionDialog";

export default function Subscriptions() {
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data: subscriptions = [], refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      console.log('Fetching subscriptions...');
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order('next_billing_date', { ascending: true });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      }
      
<<<<<<< HEAD
      console.log('Fetched subscriptions:', data);
=======
      console.log('Raw subscriptions data:', data?.map(sub => ({
        name: sub.name,
        status: sub.status,
        next_billing_date: sub.next_billing_date,
        billing_cycle: sub.billing_cycle
      })));
      
>>>>>>> master
      return data as Subscription[];
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

  const handleNewDialogClose = (open: boolean) => {
    setIsNewDialogOpen(open);
    if (!open) {
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
          <div className="flex items-center gap-4">
            <SubscriptionStats totalMonthly={totalMonthly} />
            <Button onClick={() => setIsNewDialogOpen(true)} className="bg-green-500 hover:bg-green-600">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Subscription
            </Button>
          </div>
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
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
            <SubscriptionTable
              subscriptions={subscriptions}
              onEdit={handleEditClick}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              selectedType={selectedType}
            />
          </CardContent>
        </Card>
      </div>
      
      <EditSubscriptionDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        subscription={editingSubscription}
      />

      <NewSubscriptionDialog
        open={isNewDialogOpen}
        onOpenChange={handleNewDialogClose}
      />
    </div>
  );
}
