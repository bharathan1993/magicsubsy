import { Card } from "@/components/ui/card";
import { RecommendationCard } from "./recommendations/RecommendationCard";
import { useRecommendations } from "./recommendations/useRecommendations";

export function Recommendations() {
  const { data: recommendations = [], isLoading } = useRecommendations();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recommendations</h2>
        <Card className="min-h-[80px] flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
          <div className="animate-pulse text-muted-foreground">Loading recommendations...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Recommendations</h2>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard key={index} {...recommendation} />
        ))}
      </div>
    </div>
  );
}