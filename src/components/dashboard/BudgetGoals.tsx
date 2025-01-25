import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Award } from "lucide-react";

export function BudgetGoals() {
  // Mock data - in a real app, this would come from your backend
  const monthlyGoal = 200;
  const currentSpend = 175;
  const progress = (currentSpend / monthlyGoal) * 100;
  
  const achievements = [
    {
      id: 1,
      title: "Budget Master",
      description: "Stay under budget for 3 consecutive months",
      progress: 66, // 2/3 months
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      id: 2,
      title: "Cost Cutter",
      description: "Reduce monthly spending by 20%",
      progress: 80,
      icon: <Target className="h-4 w-4" />,
    },
    {
      id: 3,
      title: "Savings Champion",
      description: "Save $100 through subscription optimization",
      progress: 45,
      icon: <Award className="h-4 w-4" />,
    },
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Budget Goals & Challenges</h3>
        <p className="text-sm text-muted-foreground">
          Track your progress and earn achievements
        </p>
      </div>

      <div className="space-y-6">
        {/* Monthly Budget Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Monthly Budget</span>
            <span className="text-sm font-medium">${currentSpend} / ${monthlyGoal}</span>
          </div>
          <Progress value={progress} className="h-2" />
          {progress <= 100 && (
            <p className="text-xs text-green-600 mt-1">
              You're on track! ${monthlyGoal - currentSpend} remaining this month
            </p>
          )}
        </div>

        {/* Active Challenges */}
        <div>
          <h4 className="text-sm font-semibold mb-4">Active Challenges</h4>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-start gap-4">
                <div className="mt-1">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{achievement.title}</span>
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {achievement.progress}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <Progress value={achievement.progress} className="h-1 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}