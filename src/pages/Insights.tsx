import { MonthlyTrend } from "@/components/insights/MonthlyTrend";
import { SpendingAnalysis } from "@/components/insights/SpendingAnalysis";
import { CategoryDistribution } from "@/components/insights/CategoryDistribution";
import { MonthlyChanges } from "@/components/insights/MonthlyChanges";
import { Recommendations } from "@/components/insights/Recommendations";

export default function Insights() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 bg-background/50">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Analyze your subscription spending patterns and get personalized recommendations
        </p>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* First row */}
        <div className="h-[250px]">
          <MonthlyTrend />
        </div>
        <SpendingAnalysis />

        {/* Second row */}
        <CategoryDistribution />
        <MonthlyChanges />
      </div>

      {/* Recommendations at the bottom */}
      <div className="mt-4">
        <Recommendations />
      </div>
    </div>
  );
}