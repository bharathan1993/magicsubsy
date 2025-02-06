<<<<<<< HEAD

import { CreditCard, DollarSign, CheckCircle, CalendarX } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import type { Subscription } from "@/types/subscription";
=======
import { CreditCard, DollarSign, CheckCircle, CalendarX } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import type { Subscription } from "@/types/subscription";
import { useEffect, useMemo } from "react";
>>>>>>> master

interface StatsOverviewProps {
  subscriptions: Subscription[];
  totalMonthly: number;
}

export function StatsOverview({ subscriptions, totalMonthly }: StatsOverviewProps) {
<<<<<<< HEAD
  // Function to check if a subscription is expired
  const isSubscriptionExpired = (subscription: Subscription): boolean => {
    // Convert next_billing_date to Date object and set time to end of day
    const billingDate = new Date(subscription.next_billing_date);
    billingDate.setHours(23, 59, 59, 999);
    
    // Get today's date and set time to beginning of day for fair comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // A subscription is expired if:
    // 1. Its status is explicitly 'expired' OR
    // 2. Its next billing date is in the past
    const isExpired = subscription.status === 'expired' || billingDate < today;
    
    console.log(`Checking subscription ${subscription.name}:`, {
      billingDate: billingDate.toISOString(),
      today: today.toISOString(),
=======
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
>>>>>>> master
      status: subscription.status,
      isExpired
    });
    
    return isExpired;
  };

<<<<<<< HEAD
  // Filter subscriptions based on their expiration status
  const expiredSubscriptions = subscriptions.filter(isSubscriptionExpired);
  const expiredCount = expiredSubscriptions.length;
  
  const activeSubscriptions = subscriptions.filter(sub => !isSubscriptionExpired(sub));
  const activeCount = activeSubscriptions.length;

  console.log('Checking expired subscriptions...');
  console.log('All subscriptions:', subscriptions);
  console.log('Expired subscriptions:', expiredSubscriptions);
  console.log('Active subscriptions:', activeSubscriptions);
=======
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
>>>>>>> master

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
