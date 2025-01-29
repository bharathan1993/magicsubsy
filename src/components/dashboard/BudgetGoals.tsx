import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Award, Edit2, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";

export function BudgetGoals() {
  const { toast } = useToast();
  const { formatAmount } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(200);
  const [currentSpend, setCurrentSpend] = useState(175);
  const [userLevel, setUserLevel] = useState(3);
  const [userPoints, setUserPoints] = useState(2750);
  const progress = (currentSpend / monthlyGoal) * 100;
  
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

  const handleSaveBudget = () => {
    setIsEditing(false);
    toast({
      title: "Budget Updated",
      description: `Your monthly budget has been set to ${formatAmount(monthlyGoal)}`,
    });
  };

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
          {/* Monthly Budget Progress */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Monthly Budget</span>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                    className="w-24 h-8"
                  />
                  <Button size="sm" onClick={handleSaveBudget}>Save</Button>
                </div>
              ) : (
                <span className="text-sm font-medium">{formatAmount(currentSpend)} / {formatAmount(monthlyGoal)}</span>
              )}
            </div>
            <Progress value={progress} className="h-2" />
            {progress <= 100 ? (
              <p className="text-xs text-green-600 mt-1">
                You're on track! {formatAmount(monthlyGoal - currentSpend)} remaining this month
              </p>
            ) : (
              <p className="text-xs text-red-600 mt-1">
                You're over budget by {formatAmount(currentSpend - monthlyGoal)} this month
              </p>
            )}
          </div>

          {/* Active Challenges */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Active Challenges</h4>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
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
                        onClick={() => handleJoinChallenge(achievement.id)}
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" /> Join Challenge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-semibold">Level {userLevel}</h4>
            <p className="text-sm text-muted-foreground">
              {5000 - userPoints} points until next level
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{userPoints} / 5000</span>
          </div>
        </div>
        <Progress value={(userPoints / 5000) * 100} className="h-2" />
      </Card>
    </div>
  );
}
