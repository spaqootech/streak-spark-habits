
import React from "react";
import { Check, Calendar, PencilLine, Trash2 } from "lucide-react";
import { Habit } from "@/lib/types";
import { useHabits } from "@/context/HabitContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HabitCardProps {
  habit: Habit;
  onEdit?: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit }) => {
  const { toggleHabitCompletion, deleteHabit, isHabitCompletedOn } = useHabits();
  const today = new Date();
  const isCompleted = isHabitCompletedOn(habit, today);

  const categoryColors: Record<string, string> = {
    health: "bg-habit-health",
    fitness: "bg-habit-fitness",
    learning: "bg-habit-learning",
    productivity: "bg-habit-productivity",
    mindfulness: "bg-habit-mindfulness",
    social: "bg-habit-social",
    other: "bg-habit-other",
  };

  return (
    <div className="habit-card bg-white rounded-xl border overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Button
          onClick={() => toggleHabitCompletion(habit.id)}
          variant={isCompleted ? "default" : "outline"}
          size="icon"
          className={cn(
            "rounded-full w-10 h-10 transition-all",
            isCompleted ? "bg-primary hover:bg-primary/90" : "hover:border-primary"
          )}
        >
          <Check
            className={cn(
              "h-5 w-5",
              isCompleted ? "text-white animate-checkmark" : "text-muted-foreground"
            )}
          />
        </Button>

        <div className="flex-1">
          <h3 className="font-medium">{habit.name}</h3>
          <div className="flex items-center mt-1">
            <div 
              className={cn(
                "w-2 h-2 rounded-full mr-2",
                categoryColors[habit.category] || "bg-gray-300"
              )}
            />
            <p className="text-xs text-muted-foreground capitalize">{habit.category}</p>
          </div>
        </div>

        <div className="flex items-center">
          {habit.streak > 0 && (
            <div className="streak-badge px-2 py-1 rounded-full text-white text-xs flex items-center mr-3">
              <span className="mr-1">🔥</span>
              {habit.streak}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Calendar className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <PencilLine className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => deleteHabit(habit.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {habit.streak > 0 && (
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${Math.min(habit.streak * 10, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
