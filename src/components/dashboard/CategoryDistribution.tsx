import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Category {
  name: string;
  percentage: number;
}

const categories: Category[] = [
  { name: "Entertainment", percentage: 40 },
  { name: "Software", percentage: 25 },
  { name: "Fitness", percentage: 20 },
  { name: "Others", percentage: 15 },
];

export function CategoryDistribution() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Subscription Categories</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of your subscriptions
        </p>
      </div>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-sm text-muted-foreground">
                {category.percentage}%
              </span>
            </div>
            <Progress value={category.percentage} className="h-2" />
          </div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full mt-6">
        View Detailed Insights
      </Button>
    </Card>
  );
}