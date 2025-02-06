import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  type: 'savings' | 'warning';
  icon: LucideIcon;
}

export function RecommendationCard({ title, description, type, icon: Icon }: RecommendationCardProps) {
  return (
    <Card
      className={`transition-all hover:scale-[1.02] ${
        type === 'savings' 
          ? 'bg-blue-500/5 hover:bg-blue-500/10' 
          : 'bg-yellow-500/5 hover:bg-yellow-500/10'
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-2 ${
            type === 'savings' 
              ? 'bg-blue-500/10 text-blue-500' 
              : 'bg-yellow-500/10 text-yellow-500'
          }`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}