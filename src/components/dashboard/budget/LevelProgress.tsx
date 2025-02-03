import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface LevelProgressProps {
  userLevel: number;
  userPoints: number;
}

export function LevelProgress({ userLevel, userPoints }: LevelProgressProps) {
  const nextLevelPoints = 5000;
  const progress = (userPoints / nextLevelPoints) * 100;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-semibold">Level {userLevel}</h4>
          <p className="text-sm text-muted-foreground">
            {nextLevelPoints - userPoints} points until next level
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{userPoints} / {nextLevelPoints}</span>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </Card>
  );
}