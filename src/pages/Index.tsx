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

export default function Index() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('User Accounts')
        .select('created_at')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error checking first time user:', error);
        return;
      }

      // If the user was created in the last minute, show the welcome screen
      if (data) {
        const createdAt = new Date(data.created_at);
        const now = new Date();
        const diffInSeconds = (now.getTime() - createdAt.getTime()) / 1000;
        if (diffInSeconds < 60) {
          setShowWelcome(true);
        }
      }
    };

    checkFirstTimeUser();
  }, [session?.user?.id]);

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
            value={249.99}
            subtitle="+$49.99 from last month"
            icon={<DollarSign className="h-6 w-6" />}
            isCurrency={true}
          />
          <StatsCard
            title="Active Alerts"
            value="3"
            subtitle="2 renewals, 1 price change"
            icon={<Bell className="h-6 w-6" />}
          />
          <StatsCard
            title="Potential Savings"
            value={75.00}
            subtitle="From 3 unused subscriptions"
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
          onClose={() => setShowWelcome(false)} 
        />
      </div>
    </div>
  );
}