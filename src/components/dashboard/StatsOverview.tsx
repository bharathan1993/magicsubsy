import { CreditCard, DollarSign, CheckCircle, CalendarX } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import type { Subscription } from "@/types/subscription";

interface StatsOverviewProps {
  subscriptions: Subscription[];
  totalMonthly: number;
}

export function StatsOverview({ subscriptions, totalMonthly }: StatsOverviewProps) {
  const expiredCount = subscriptions.filter(sub => sub.status === 'Expired').length;
  const activeCount = subscriptions.filter(sub => sub.status === 'Active').length;

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