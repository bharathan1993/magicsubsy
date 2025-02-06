import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
  points: number;
  joined: boolean;
  icon: React.ReactNode;
}

interface AchievementCardProps {
  achievement: Achievement;
  onJoin: (id: number) => void;
}

export function AchievementCard({ achievement, onJoin }: AchievementCardProps) {
  return (
    <div 
      className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
        achievement.joined ? 'bg-muted/50' : 'bg-background border border-dashed border-muted-foreground/25'
      }`}
    >
      <div className="mt-1">{achievement.icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{achievement.title}</span>
          <Badge 
            variant={achievement.joined ? "secondary" : "outline"}
            className="text-xs"
          >
            {achievement.progress}%
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {achievement.points} pts
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {achievement.description}
        </p>
        {achievement.joined ? (
          <Progress value={achievement.progress} className="h-1" />
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onJoin(achievement.id)}
            className="gap-1"
          >
            <Plus className="h-3 w-3" /> Join Challenge
          </Button>
        )}
      </div>
    </div>
  );
}