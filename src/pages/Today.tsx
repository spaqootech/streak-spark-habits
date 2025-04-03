
import React, { useState } from "react";
import { format } from "date-fns";
import { PlusCircle, Filter } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import HabitCard from "@/components/HabitCard";
import HabitForm from "@/components/HabitForm";
import { Button } from "@/components/ui/button";
import { Habit, HabitCategory } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const Today = () => {
  const { habits } = useHabits();
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [filter, setFilter] = useState<HabitCategory | "all">("all");
  
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d");

  const filteredHabits = habits.filter(
    habit => filter === "all" || habit.category === filter
  );

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormOpen(true);
  };

  const categories: Array<HabitCategory | "all"> = [
    "all",
    "health",
    "fitness",
    "learning",
    "productivity",
    "mindfulness",
    "social",
    "other",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Today</h1>
        <Button onClick={() => setFormOpen(true)} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      <p className="text-lg text-muted-foreground">{formattedDate}</p>

      <div className="flex justify-between items-center">
        <h2 className="font-medium">
          {filteredHabits.length} habit{filteredHabits.length !== 1 ? "s" : ""}
        </h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={filter} onValueChange={setFilter as any}>
              {categories.map((category) => (
                <DropdownMenuRadioItem key={category} value={category}>
                  {category === "all" ? (
                    "All Categories"
                  ) : (
                    <div className="flex items-center">
                      <div 
                        className={`w-3 h-3 rounded-full bg-habit-${category} mr-2`} 
                      />
                      <span className="capitalize">{category}</span>
                    </div>
                  )}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">No habits yet</p>
            <p className="text-muted-foreground">Create your first habit to get started</p>
            <Button 
              onClick={() => setFormOpen(true)} 
              variant="outline" 
              className="mt-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Habit
            </Button>
          </div>
        ) : (
          filteredHabits.map(habit => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onEdit={() => handleEdit(habit)} 
            />
          ))
        )}
      </div>

      <HabitForm
        open={formOpen}
        onOpenChange={setFormOpen}
        habit={editingHabit}
      />
    </div>
  );
};

export default Today;
