
import React from "react";
import { useHabits } from "@/context/HabitContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { HabitCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const Insights = () => {
  const { habits, getHabitsByCategory } = useHabits();

  const categories: HabitCategory[] = [
    "health",
    "fitness",
    "learning",
    "productivity",
    "mindfulness",
    "social",
    "other",
  ];

  // Get completion data by category
  const completionByCategory = categories.map(category => {
    const categoryHabits = getHabitsByCategory(category);
    const totalCompletions = categoryHabits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
    
    return {
      name: category,
      completions: totalCompletions,
    };
  }).filter(cat => cat.completions > 0);

  // Get streak data
  const streakData = habits
    .filter(habit => habit.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5)
    .map(habit => ({
      name: habit.name,
      streak: habit.streak,
      category: habit.category,
    }));

  // Get total stats
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
  const averageStreak = habits.length > 0
    ? Math.round(habits.reduce((sum, habit) => sum + habit.streak, 0) / habits.length)
    : 0;
  const longestStreak = habits.length > 0
    ? Math.max(...habits.map(habit => habit.streak))
    : 0;

  // Color map for categories
  const categoryColors: Record<string, string> = {
    health: "#ef4444",
    fitness: "#22c55e",
    learning: "#3b82f6",
    productivity: "#f59e0b",
    mindfulness: "#8b5cf6",
    social: "#ec4899",
    other: "#64748b",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Insights</h1>

      {habits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-lg">No data yet</p>
          <p className="text-muted-foreground">
            Create and complete habits to see insights
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-muted-foreground">Total Habits</p>
              <p className="text-2xl font-bold">{totalHabits}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-muted-foreground">Total Completions</p>
              <p className="text-2xl font-bold">{totalCompletions}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-muted-foreground">Average Streak</p>
              <p className="text-2xl font-bold">{averageStreak} days</p>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="text-2xl font-bold">{longestStreak} days</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h2 className="text-lg font-medium mb-4">Top Streaks</h2>
            {streakData.length > 0 ? (
              <div className="space-y-3">
                {streakData.map((data, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 text-sm text-muted-foreground">{i+1}.</div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div 
                          className={cn(
                            "w-3 h-3 rounded-full mr-2",
                          )}
                          style={{ backgroundColor: categoryColors[data.category] }}
                        />
                        <span className="font-medium">{data.name}</span>
                      </div>
                    </div>
                    <div className="streak-badge px-2 py-1 rounded-full text-white text-xs flex items-center">
                      <span className="mr-1">🔥</span>
                      {data.streak}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">
                No active streaks yet
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h2 className="text-lg font-medium mb-4">Completions by Category</h2>
            {completionByCategory.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name"
                      tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, "Completions"]}
                      labelFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
                    />
                    <Bar 
                      dataKey="completions"
                      name="Completions"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-center">
                Complete habits to see this chart
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;
