import { CreditCard, DollarSign, Bell, TrendingDown } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingCharges } from "@/components/dashboard/UpcomingCharges";
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { BudgetGoals } from "@/components/dashboard/BudgetGoals";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Index() {
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
            value="15"
            subtitle="+2 from last month"
            icon={<CreditCard className="h-6 w-6" />}
          />
          <StatsCard
            title="Monthly Spend"
            value="$249.99"
            subtitle="+$49.99 from last month"
            icon={<DollarSign className="h-6 w-6" />}
          />
          <StatsCard
            title="Active Alerts"
            value="3"
            subtitle="2 renewals, 1 price change"
            icon={<Bell className="h-6 w-6" />}
          />
          <StatsCard
            title="Potential Savings"
            value="$75.00"
            subtitle="From 3 unused subscriptions"
            icon={<TrendingDown className="h-6 w-6" />}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BudgetGoals />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}