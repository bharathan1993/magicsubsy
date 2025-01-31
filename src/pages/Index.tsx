import { useState, useEffect } from "react";
import { CreditCard, DollarSign, Bell, TrendingDown } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingCharges } from "@/components/dashboard/UpcomingCharges";
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Welcome } from "@/components/onboarding/Welcome";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  category: string;
}

export default function Index() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const { session } = useAuth();
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const checkWelcomeStatus = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('User Accounts')
        .select('has_seen_welcome')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error checking welcome status:', error);
        return;
      }

      if (data && !data.has_seen_welcome) {
        setShowWelcome(true);
      }
    };

    checkWelcomeStatus();
  }, [session?.user?.id]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setSubscriptions(data || []);

        // Calculate total monthly spending
        const monthly = data?.reduce((acc, sub) => {
          let monthlyAmount = sub.amount;
          // Convert amounts to monthly basis
          if (sub.billing_cycle === "quarterly") monthlyAmount = sub.amount / 3;
          if (sub.billing_cycle === "annual") monthlyAmount = sub.amount / 12;
          return acc + monthlyAmount;
        }, 0) || 0;

        setTotalMonthly(monthly);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleCloseWelcome = async () => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from('User Accounts')
      .update({ has_seen_welcome: true })
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating welcome status:', error);
    }

    setShowWelcome(false);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Your Subscriptions Overview</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Subscriptions"
            value={subscriptions.length.toString()}
            subtitle={`${subscriptions.length} active subscriptions`}
            icon={<CreditCard className="h-6 w-6" />}
          />
          <StatsCard
            title="Monthly Spend"
            value={totalMonthly}
            subtitle="Total monthly cost"
            icon={<DollarSign className="h-6 w-6" />}
            isCurrency={true}
          />
          <StatsCard
            title="Active Alerts"
            value="0"
            subtitle="No active alerts"
            icon={<Bell className="h-6 w-6" />}
          />
          <StatsCard
            title="Potential Savings"
            value={0}
            subtitle="No savings identified yet"
            icon={<TrendingDown className="h-6 w-6" />}
            isCurrency={true}
          />
        </div>

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

        <Welcome 
          open={showWelcome} 
          onClose={handleCloseWelcome} 
        />
      </div>
    </div>
  );
}