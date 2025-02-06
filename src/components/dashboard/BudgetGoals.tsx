import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Award, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BudgetProgress } from "./budget/BudgetProgress";
import { AchievementCard } from "./budget/AchievementCard";
import { LevelProgress } from "./budget/LevelProgress";
import { useBudgetSpend } from "./budget/useBudgetSpend";

export function BudgetGoals() {
  const { toast } = useToast();
  const [monthlyGoal, setMonthlyGoal] = useState(200);
  const [userLevel, setUserLevel] = useState(3);
  const [userPoints, setUserPoints] = useState(2750);
  const { data: currentSpend = 0 } = useBudgetSpend();

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Budget Master",
      description: "Stay under budget for 3 consecutive months",
      progress: 66,
      points: 1000,
      joined: true,
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      id: 2,
      title: "Cost Cutter",
      description: "Reduce monthly spending by 20%",
      progress: 80,
      points: 750,
      joined: true,
      icon: <Target className="h-4 w-4" />,
    },
    {
      id: 3,
      title: "Savings Champion",
      description: "Save $100 through subscription optimization",
      progress: 45,
      points: 500,
      joined: false,
      icon: <Award className="h-4 w-4" />,
    },
  ]);

  const handleJoinChallenge = (id: number) => {
    setAchievements(achievements.map(achievement => 
      achievement.id === id 
        ? { ...achievement, joined: true }
        : achievement
    ));
    toast({
      title: "Challenge Joined!",
      description: "Good luck on your new challenge!",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold">Budget Goals & Challenges</h3>
            <p className="text-sm text-muted-foreground">
              Track your progress and earn achievements
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{userPoints} points</span>
            </div>
            <Badge variant="secondary">Level {userLevel}</Badge>
          </div>
        </div>

        <div className="space-y-6">
          <BudgetProgress
            currentSpend={currentSpend}
            monthlyGoal={monthlyGoal}
            onUpdateGoal={setMonthlyGoal}
          />

          <div>
            <h4 className="text-sm font-semibold mb-4">Active Challenges</h4>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onJoin={handleJoinChallenge}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <LevelProgress userLevel={userLevel} userPoints={userPoints} />
    </div>
  );
}