import { MonthlyTrend } from "@/components/insights/MonthlyTrend";
import { SpendingAnalysis } from "@/components/insights/SpendingAnalysis";
import { CategoryDistribution } from "@/components/insights/CategoryDistribution";
import { MonthlyChanges } from "@/components/insights/MonthlyChanges";
import { Recommendations } from "@/components/insights/Recommendations";

export default function Insights() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-background/50">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Analyze your subscription spending patterns and get personalized recommendations
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 transition-all">
        <div className="col-span-1 md:col-span-2">
          <MonthlyTrend />
        </div>
        <SpendingAnalysis />
        <CategoryDistribution />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <MonthlyChanges />
        <div className="col-span-1 md:col-span-2">
          <Recommendations />
        </div>
      </div>
    </div>
  );
}