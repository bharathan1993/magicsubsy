import { MonthlyTrend } from "@/components/insights/MonthlyTrend";
import { SpendingAnalysis } from "@/components/insights/SpendingAnalysis";
import { CategoryDistribution } from "@/components/insights/CategoryDistribution";
import { MonthlyChanges } from "@/components/insights/MonthlyChanges";
import { Recommendations } from "@/components/insights/Recommendations";

export default function Insights() {
  return (
    <div className="flex-1 p-8 space-y-8">
      <h1 className="text-3xl font-bold">Subscription Insights</h1>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <SpendingAnalysis />
        <CategoryDistribution />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <MonthlyTrend />
        <MonthlyChanges />
      </div>

      <Recommendations />
    </div>
  );
}