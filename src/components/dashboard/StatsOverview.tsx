
import { CreditCard, DollarSign, CheckCircle, CalendarX } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import type { Subscription } from "@/types/subscription";

interface StatsOverviewProps {
  subscriptions: Subscription[];
  totalMonthly: number;
}

export function StatsOverview({ subscriptions, totalMonthly }: StatsOverviewProps) {
  // Function to check if a subscription is expired
  const isSubscriptionExpired = (nextBillingDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const billingDate = new Date(nextBillingDate);
    return billingDate < today;
  };

  // Filter subscriptions based on their expiration status
  const expiredCount = subscriptions.filter(sub => 
    sub.status === 'expired' || isSubscriptionExpired(sub.next_billing_date)
  ).length;
  
  const activeCount = subscriptions.filter(sub => 
    sub.status === 'active' && !isSubscriptionExpired(sub.next_billing_date)
  ).length;

  console.log('Active subscriptions:', activeCount);
  console.log('Expired subscriptions:', expiredCount);

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
