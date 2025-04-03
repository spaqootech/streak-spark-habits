
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useHabits } from "@/context/HabitContext";
import { Button } from "@/components/ui/button";
import { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Calendar = () => {
  const { habits, getHabitsByCategory, toggleHabitCompletion, isHabitCompletedOn } = useHabits();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<string | null>(
    habits.length > 0 ? habits[0].id : null
  );

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const prevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleHabitSelect = (habitId: string) => {
    setSelectedHabit(habitId);
  };

  const selectedHabitObj = habits.find(h => h.id === selectedHabit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>

      <div className="flex justify-between items-center">
        <Button size="icon" variant="outline" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button size="icon" variant="outline" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5">
        <Select 
          value={selectedHabit || ''} 
          onValueChange={handleHabitSelect}
          disabled={habits.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a habit to view" />
          </SelectTrigger>
          <SelectContent>
            {habits.map(habit => (
              <SelectItem key={habit.id} value={habit.id}>
                <div className="flex items-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full mr-2",
                    `bg-habit-${habit.category}`
                  )} />
                  <span>{habit.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No habits yet</p>
            <p className="text-sm text-muted-foreground">
              Create habits on the Today tab to see them in the calendar
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-sm font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-12" />
              ))}
              
              {daysInMonth.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                
                const isCompleted = selectedHabitObj 
                  ? isHabitCompletedOn(selectedHabitObj, day)
                  : false;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    disabled={!isCurrentMonth}
                    className={cn(
                      "calendar-day h-12 flex items-center justify-center rounded-md relative",
                      isSelected && "ring-2 ring-primary",
                      isCurrentDay && "font-bold",
                      !isCurrentMonth && "opacity-30"
                    )}
                  >
                    <span>{format(day, "d")}</span>
                    {isCompleted && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">
                {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              
              {selectedHabitObj && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full mr-2",
                      `bg-habit-${selectedHabitObj.category}`
                    )} />
                    <span>{selectedHabitObj.name}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={isHabitCompletedOn(selectedHabitObj, selectedDate) ? "default" : "outline"}
                    onClick={() => toggleHabitCompletion(selectedHabitObj.id, selectedDate)}
                    className="gap-1"
                  >
                    <Check className="h-4 w-4" />
                    {isHabitCompletedOn(selectedHabitObj, selectedDate) ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
