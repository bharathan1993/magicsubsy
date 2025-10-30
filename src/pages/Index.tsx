
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { UpcomingCharges } from "@/components/dashboard/UpcomingCharges";
import { CategoryDistribution } from "@/components/dashboard/CategoryDistribution";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WelcomeHandler } from "@/components/dashboard/WelcomeHandler";
import { DashboardSearchFilter } from "@/components/dashboard/DashboardSearchFilter";
import { SubscriptionDetailsDialog } from "@/components/dashboard/SubscriptionDetailsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { Subscription } from "@/types/subscription";

export default function Index() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  
  // Search and filter state
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Subscription details dialog state
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Handle subscription selection from autocomplete
  const handleSubscriptionSelect = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsOpen(true);
  };

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      console.log('Fetching subscriptions for dashboard...');
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
      
      console.log('Raw dashboard data:', data);
      return data || [];
    },
    enabled: !!userId,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
  }, [queryClient]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(subscriptions.map(sub => sub.category).filter(Boolean)));
    return uniqueCategories.sort();
  }, [subscriptions]);

  // Filter subscriptions based on search and filters
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      // Search filter
      const matchesSearch = searchValue === "" ||
        sub.name.toLowerCase().includes(searchValue.toLowerCase());
      
      // Status filter
      const matchesStatus = !statusFilter || sub.status === statusFilter;
      
      // Category filter
      const matchesCategory = !categoryFilter || sub.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [subscriptions, searchValue, statusFilter, categoryFilter]);

  const totalMonthly = filteredSubscriptions.reduce((acc, sub) => {
    let monthlyAmount = sub.amount;
    if (sub.billing_cycle === "quarterly") monthlyAmount = sub.amount / 3;
    if (sub.billing_cycle === "annual") monthlyAmount = sub.amount / 12;
    return acc + monthlyAmount;
  }, 0);

  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Your Subscriptions Overview</h1>
        </div>

        <DashboardSearchFilter
          onSearchChange={setSearchValue}
          onStatusFilterChange={setStatusFilter}
          onCategoryFilterChange={setCategoryFilter}
          selectedStatus={statusFilter}
          selectedCategory={categoryFilter}
          categories={categories}
          searchValue={searchValue}
          allSubscriptions={subscriptions}
          onSubscriptionSelect={handleSubscriptionSelect}
        />

        <StatsOverview
          subscriptions={filteredSubscriptions}
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

        <SubscriptionDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          subscription={selectedSubscription}
        />
      </div>
    </div>
  );
}
