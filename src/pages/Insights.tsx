import { MonthlyTrend } from "@/components/insights/MonthlyTrend";
import { SpendingAnalysis } from "@/components/insights/SpendingAnalysis";
import { CategoryDistribution } from "@/components/insights/CategoryDistribution";
import { MonthlyChanges } from "@/components/insights/MonthlyChanges";
import { Recommendations } from "@/components/insights/Recommendations";
import { SpendingPatternD3 } from "@/components/insights/SpendingPatternD3";

export default function Insights() {
  return (
    <div className="flex-1 space-y-2 p-4 md:p-6 bg-background/50">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Analyze your subscription spending patterns and get personalized recommendations
        </p>
      </div>
      
      <div className="grid gap-2 grid-cols-1">
        {/* First row - full width for spending pattern */}
        <div className="h-[500px]">
          <SpendingPatternD3 />
        </div>

        {/* Second row */}
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          <div className="h-[400px]">
            <MonthlyTrend />
          </div>
          <div className="h-[400px]">
            <SpendingAnalysis />
          </div>
        </div>

        {/* Third row */}
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          <div className="h-[400px]">
            <CategoryDistribution />
          </div>
          <div className="h-[400px]">
            <MonthlyChanges />
          </div>
        </div>
      </div>

      {/* Recommendations at the bottom */}
      <div className="mt-2">
        <Recommendations />
      </div>
    </div>
  );
}