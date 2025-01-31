import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateTotalMonthlySpend } from "@/utils/subscriptionCalculations";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import UpcomingCharges from "@/components/dashboard/UpcomingCharges";
import CategoryDistribution from "@/components/dashboard/CategoryDistribution";
import BudgetGoals from "@/components/dashboard/BudgetGoals";

export default function Index() {
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", session?.user?.id);

        if (error) throw error;

        if (data) {
          setSubscriptionCount(data.length);
          const monthly = calculateTotalMonthlySpend(data);
          setTotalMonthly(monthly);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session?.user?.id, toast]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Monthly Spend"
            value={totalMonthly}
            type="currency"
          />
          <StatsCard
            title="Active Subscriptions"
            value={subscriptionCount}
            type="number"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <QuickActions />
          <UpcomingCharges />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <CategoryDistribution />
          </Card>
          <Card className="p-6">
            <BudgetGoals />
          </Card>
        </div>
      </div>
    </div>
  );
}