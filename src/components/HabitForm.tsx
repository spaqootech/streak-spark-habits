
import React, { useState } from "react";
import { useHabits } from "@/context/HabitContext";
import { Habit, HabitCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface HabitFormProps {
  habit?: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  habit,
  open,
  onOpenChange,
}) => {
  const { addHabit, editHabit } = useHabits();
  const [name, setName] = useState(habit?.name || "");
  const [category, setCategory] = useState<HabitCategory>(
    habit?.category || "other"
  );

  const isEditing = !!habit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      if (isEditing && habit) {
        editHabit({
          ...habit,
          name,
          category,
        });
      } else {
        addHabit({
          name,
          category,
        });
      }
      
      onOpenChange(false);
    }
  };

  const categories: HabitCategory[] = [
    "health",
    "fitness",
    "learning",
    "productivity",
    "mindfulness",
    "social",
    "other",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Habit" : "Create New Habit"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit name"
              autoFocus
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as HabitCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center">
                      <div 
                        className={`w-3 h-3 rounded-full bg-habit-${cat} mr-2`} 
                      />
                      <span className="capitalize">{cat}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
