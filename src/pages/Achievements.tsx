
import React from "react";
import { cn } from "@/lib/utils";
import { useHabits } from "@/context/HabitContext";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

const Achievements = () => {
  const { achievements } = useHabits();
  
  const earnedAchievements = achievements.filter(a => a.earnedOn);
  const pendingAchievements = achievements.filter(a => !a.earnedOn);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Achievements</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3">Your Badges</h2>
          {earnedAchievements.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border">
              <p className="text-muted-foreground">
                No badges earned yet
              </p>
              <p className="text-sm text-muted-foreground">
                Keep building your streaks to earn badges!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {earnedAchievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={cn(
                    "bg-white border rounded-xl p-4 flex items-center gap-3",
                    achievement.category && `border-l-4 border-l-habit-${achievement.category}`
                  )}
                >
                  <div className="achievement-badge flex items-center justify-center text-2xl w-12 h-12 rounded-full">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{achievement.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.earnedOn && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          Earned {formatDistanceToNow(
                            new Date(achievement.earnedOn),
                            { addSuffix: true }
                          )}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">Badges to Earn</h2>
          <div className="grid grid-cols-2 gap-3">
            {pendingAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="bg-muted/50 border rounded-xl p-4 flex items-center gap-3 opacity-70"
              >
                <div className="flex items-center justify-center text-2xl w-12 h-12 rounded-full bg-muted">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs bg-muted/50">
                      Locked
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
