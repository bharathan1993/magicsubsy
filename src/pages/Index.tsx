import { useState, useEffect } from "react";
import { CreditCard, DollarSign, Bell, TrendingDown, CalendarX, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingCharges } from "@/components/dashboard/UpcomingCharges";
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Welcome } from "@/components/onboarding/Welcome";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useQuery } from "@tanstack/react-query";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  category: string;
  status: string;
}

export default function Index() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { session } = useAuth();
  const { formatAmount } = useCurrency();

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_status")
        .select("*");
      
      if (error) throw error;
      return data || [];
    }
  });

  const totalMonthly = subscriptions.reduce((acc, sub) => {
    let monthlyAmount = sub.amount;
    if (sub.billing_cycle === "quarterly") monthlyAmount = sub.amount / 3;
    if (sub.billing_cycle === "annual") monthlyAmount = sub.amount / 12;
    return acc + monthlyAmount;
  }, 0);

  const expiredCount = subscriptions.filter(sub => sub.status === 'Expired').length;
  const activeCount = subscriptions.filter(sub => sub.status === 'Active').length;

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
            subtitle={`${subscriptions.length} total subscriptions`}
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
            title="Active Subscriptions"
            value={activeCount.toString()}
            subtitle={activeCount === 1 ? "subscription active" : "subscriptions active"}
            icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          />
          <StatsCard
            title="Expired Subscriptions"
            value={expiredCount.toString()}
            subtitle={expiredCount === 1 ? "subscription expired" : "subscriptions expired"}
            icon={<CalendarX className="h-6 w-6 text-red-500" />}
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