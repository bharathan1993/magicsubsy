import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { UpcomingCharges } from "@/components/dashboard/UpcomingCharges";
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WelcomeHandler } from "@/components/dashboard/WelcomeHandler";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions', userId],
    queryFn: async () => {
      console.log('Fetching subscriptions...');
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
      
      console.log('Fetched subscriptions:', data);
      return data || [];
    },
    enabled: !!userId // Only run query when userId is available
  });

  const totalMonthly = subscriptions.reduce((acc, sub) => {
    let monthlyAmount = sub.amount;
    if (sub.billing_cycle === "quarterly") monthlyAmount = sub.amount / 3;
    if (sub.billing_cycle === "annual") monthlyAmount = sub.amount / 12;
    return acc + monthlyAmount;
  }, 0);

  return (
    <div className="flex-1 p-8 bg-gray-50">
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
      </div>
    </div>
  );
}