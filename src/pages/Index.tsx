
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { UpcomingCharges } from "@/components/dashboard/UpcomingCharges";
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WelcomeHandler } from "@/components/dashboard/WelcomeHandler";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { NewSubscriptionDialog } from "@/components/dashboard/NewSubscriptionDialog";

export default function Index() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      console.log('Fetching subscriptions for dashboard...');
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq('user_id', userId)
        .order('next_billing_date', { ascending: true });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      }
      
      console.log('Raw dashboard data:', data);
      return data || [];
    },
    enabled: !!userId,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
  }, [queryClient]);

  const totalMonthly = subscriptions.reduce((acc, sub) => {
    let monthlyAmount = sub.amount;
    if (sub.billing_cycle === "quarterly") monthlyAmount = sub.amount / 3;
    if (sub.billing_cycle === "annual") monthlyAmount = sub.amount / 12;
    return acc + monthlyAmount;
  }, 0);

  const handleNewDialogClose = (open: boolean) => {
    setIsNewDialogOpen(open);
    if (!open) {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    }
  };

  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Your Subscriptions Overview</h1>
        </div>

        <StatsOverview 
          subscriptions={subscriptions} 
          totalMonthly={totalMonthly} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Charges</h2>
              <Button 
                onClick={() => setIsNewDialogOpen(true)} 
                className="bg-green-500 hover:bg-green-600"
                size="sm"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Subscription
              </Button>
            </div>
            <UpcomingCharges />
          </div>
          <div>
            <CategoryDistribution />
          </div>
        </div>

        <div className="mb-8">
          <QuickActions />
        </div>

        <WelcomeHandler />
        
        <NewSubscriptionDialog
          open={isNewDialogOpen}
          onOpenChange={handleNewDialogClose}
        />
      </div>
    </div>
  );
}
