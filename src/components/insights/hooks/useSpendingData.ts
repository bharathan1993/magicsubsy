import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SpendingData } from "../types/spendingTypes";

export const useSpendingData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['spendingPattern', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Calculate date 90 days ago
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('amount, activation_date')
        .eq('user_id', userId)
        .gte('activation_date', ninetyDaysAgo.toISOString().split('T')[0])
        .order('activation_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscription data:', error);
        throw error;
      }

      console.log('Fetched subscription data:', subscriptions);
      
      // Convert to SpendingData format and filter for 15-day intervals
      const allData = subscriptions.map(sub => ({
        date: new Date(sub.activation_date),
        amount: Number(sub.amount)
      }));

      // Group data by date to combine amounts for same day
      const groupedData = new Map<string, number>();
      allData.forEach(item => {
        const dateKey = item.date.toISOString().split('T')[0];
        groupedData.set(dateKey, (groupedData.get(dateKey) || 0) + item.amount);
      });

      // Convert grouped data back to array and filter for 15-day intervals
      const processedData: SpendingData[] = [];
      let lastAddedDate: Date | null = null;

      Array.from(groupedData.entries())
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .forEach(([dateStr, amount]) => {
          const currentDate = new Date(dateStr);
          
          if (!lastAddedDate || daysBetween(lastAddedDate, currentDate) >= 15) {
            processedData.push({
              date: currentDate,
              amount: amount
            });
            lastAddedDate = currentDate;
          }
        });

      return processedData;
    },
    enabled: !!userId
  });
};

// Helper function to calculate days between two dates
const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};