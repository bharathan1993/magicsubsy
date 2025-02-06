import { CreditCard, DollarSign, CheckCircle, CalendarX } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import type { Subscription } from "@/types/subscription";
import { useEffect, useMemo } from "react";

interface StatsOverviewProps {
  subscriptions: Subscription[];
  totalMonthly: number;
}

export function StatsOverview({ subscriptions, totalMonthly }: StatsOverviewProps) {
  // Add useEffect to log when component receives new data
  useEffect(() => {
    console.log('StatsOverview received new data:', {
      total: subscriptions.length,
      subscriptions: subscriptions.map(sub => ({
        name: sub.name,
        status: sub.status
      }))
    });
  }, [subscriptions]);

  // Function to check if a subscription is expired
  const isSubscriptionExpired = (subscription: Subscription): boolean => {
    const isExpired = subscription.status === 'expired';
    
    console.log(`Checking subscription ${subscription.name}:`, {
      name: subscription.name,
      status: subscription.status,
      isExpired
    });
    
    return isExpired;
  };

  // Memoize the filtered subscriptions to prevent unnecessary recalculations
  const { expiredSubscriptions, activeSubscriptions } = useMemo(() => {
    const expired = subscriptions.filter(isSubscriptionExpired);
    const active = subscriptions.filter(sub => !isSubscriptionExpired(sub));
    
    console.log('Calculated subscription counts:', {
      total: subscriptions.length,
      expired: expired.length,
      active: active.length,
      expiredList: expired.map(sub => sub.name),
      activeList: active.map(sub => sub.name)
    });

    return { expiredSubscriptions: expired, activeSubscriptions: active };
  }, [subscriptions]);

  const expiredCount = expiredSubscriptions.length;
  const activeCount = activeSubscriptions.length;

  return (
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
  );
}
