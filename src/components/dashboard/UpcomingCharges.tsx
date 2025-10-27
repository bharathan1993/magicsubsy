
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Calendar, Plus } from "lucide-react";
import { SubscriptionDetailsDialog } from "./SubscriptionDetailsDialog";
import { Subscription } from "@/types/subscription";
import { NewSubscriptionDialog } from "./NewSubscriptionDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export function UpcomingCharges() {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
  const { formatAmount } = useCurrency();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const { data: upcomingCharges = [], isLoading, refetch } = useQuery({
    queryKey: ['upcomingCharges', userId],
    queryFn: async (): Promise<Subscription[]> => {
      if (!userId) return [];
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .lte("next_billing_date", thirtyDaysFromNow.toISOString().split('T')[0])
        .gte("next_billing_date", new Date().toISOString().split('T')[0])
        .order("next_billing_date", { ascending: true });

      if (error) {
        console.error("Error fetching upcoming charges:", error);
        throw error;
      }

      return data ?? [];
    },
    enabled: !!userId,
  });

  const handleSubscriptionAdded = () => {
    void refetch();
  };

  const handleSubscriptionClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Upcoming Charges</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsAddSubscriptionOpen(true)}
                  className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Subscription</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && (
              <p className="text-center text-muted-foreground">Loading upcoming charges...</p>
            )}
            {!isLoading && upcomingCharges.map((charge) => (
              <div
                key={charge.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => handleSubscriptionClick(charge)}
              >
                <div className="flex items-center gap-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{charge.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(charge.next_billing_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="font-medium">{formatAmount(charge.amount)}</p>
              </div>
            ))}
            {!isLoading && upcomingCharges.length === 0 && (
              <p className="text-center text-muted-foreground">
                No upcoming charges in the next 30 days
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <SubscriptionDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        subscription={selectedSubscription}
      />

      <NewSubscriptionDialog
        open={isAddSubscriptionOpen}
        onOpenChange={setIsAddSubscriptionOpen}
        onSubscriptionAdded={handleSubscriptionAdded}
      />
    </>
  );
}
