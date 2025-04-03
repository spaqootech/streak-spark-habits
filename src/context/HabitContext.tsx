
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, Achievement, HabitCategory } from '@/lib/types';
import { format, isSameDay, parseISO, startOfToday } from 'date-fns';
import { toast } from "sonner";

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Streak',
    description: 'Complete a habit for 3 days in a row',
    icon: '🔥'
  },
  {
    id: '2',
    name: 'Consistency Master',
    description: 'Complete a habit for 7 days in a row',
    icon: '⚡'
  },
  {
    id: '3', 
    name: 'Habit Champion',
    description: 'Complete a habit for 30 days in a row',
    icon: '🏆'
  },
  {
    id: '4',
    name: 'Diverse Achiever',
    description: 'Have active habits in 3 different categories',
    icon: '🌈'
  },
  {
    id: '5',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 days in a row',
    icon: '🌟'
  }
];

// Define the context type
interface HabitContextType {
  habits: Habit[];
  achievements: Achievement[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'totalCompletions' | 'completedDates' | 'createdAt'>) => void;
  editHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date?: Date) => void;
  isHabitCompletedOn: (habit: Habit, date: Date) => boolean;
  getHabitsByCategory: (category?: HabitCategory) => Habit[];
  getStreakPercentage: (habit: Habit) => number;
  getRecentAchievements: (count?: number) => Achievement[];
}

// Create the context
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Provider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const savedAchievements = localStorage.getItem('achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : defaultAchievements;
  });

  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Check for achievements
  useEffect(() => {
    checkAchievements();
  }, [habits]);

  // Add a new habit
  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'totalCompletions' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      streak: 0,
      totalCompletions: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    setHabits(prev => [...prev, newHabit]);
    toast.success("New habit created!");
  };

  // Edit an existing habit
  const editHabit = (updatedHabit: Habit) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
    toast.success("Habit updated!");
  };

  // Delete a habit
  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    toast.success("Habit deleted!");
  };

  // Toggle habit completion for a specific date
  const toggleHabitCompletion = (id: string, date: Date = new Date()) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    setHabits(prev => {
      return prev.map(habit => {
        if (habit.id === id) {
          const isAlreadyCompleted = habit.completedDates.includes(formattedDate);
          
          if (isAlreadyCompleted) {
            // Remove completion
            return {
              ...habit,
              completedDates: habit.completedDates.filter(d => d !== formattedDate),
              totalCompletions: habit.totalCompletions - 1,
              streak: calculateStreak(
                habit.completedDates.filter(d => d !== formattedDate)
              )
            };
          } else {
            // Add completion
            const updatedCompletions = [...habit.completedDates, formattedDate];
            return {
              ...habit,
              completedDates: updatedCompletions,
              totalCompletions: habit.totalCompletions + 1,
              streak: calculateStreak(updatedCompletions)
            };
          }
        }
        return habit;
      });
    });
  };

  // Calculate streak
  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;
    
    // Sort dates from newest to oldest
    const sortedDates = [...completedDates].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    // Check if there's a completion for today
    const today = startOfToday();
    const hasCompletedToday = sortedDates.some(date => 
      isSameDay(parseISO(date), today)
    );

    if (!hasCompletedToday) return 0;

    let streak = 1;
    let currentDate = today;

    for (let i = 1; i < 1000; i++) {
      // Move to previous day
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      // Check if previous day is in completions
      const completed = sortedDates.some(date => 
        isSameDay(parseISO(date), prevDate)
      );
      
      if (completed) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }

    return streak;
  };

  // Check if habit was completed on a specific date
  const isHabitCompletedOn = (habit: Habit, date: Date): boolean => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return habit.completedDates.includes(formattedDate);
  };

  // Get habits by category
  const getHabitsByCategory = (category?: HabitCategory): Habit[] => {
    if (!category) return habits;
    return habits.filter(habit => habit.category === category);
  };

  // Calculate habit streak percentage (current streak / days since creation)
  const getStreakPercentage = (habit: Habit): number => {
    const createdAt = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 3600 * 24)) + 1;
    
    return Math.min(100, Math.round((habit.streak / daysSinceCreation) * 100)) || 0;
  };

  // Check and award achievements
  const checkAchievements = () => {
    const updatedAchievements = [...achievements];
    let newAchievements = false;

    // First Streak (3 days)
    habits.forEach(habit => {
      if (habit.streak >= 3) {
        const achievement = updatedAchievements.find(a => a.id === '1' && !a.earnedOn);
        if (achievement) {
          achievement.earnedOn = new Date().toISOString();
          achievement.category = habit.category;
          newAchievements = true;
        }
      }
    });

    // Consistency Master (7 days)
    habits.forEach(habit => {
      if (habit.streak >= 7) {
        const achievement = updatedAchievements.find(a => a.id === '2' && !a.earnedOn);
        if (achievement) {
          achievement.earnedOn = new Date().toISOString();
          achievement.category = habit.category;
          newAchievements = true;
        }
      }
    });

    // Habit Champion (30 days)
    habits.forEach(habit => {
      if (habit.streak >= 30) {
        const achievement = updatedAchievements.find(a => a.id === '3' && !a.earnedOn);
        if (achievement) {
          achievement.earnedOn = new Date().toISOString();
          achievement.category = habit.category;
          newAchievements = true;
        }
      }
    });

    // Diverse Achiever (3 categories)
    const categories = new Set(habits.map(h => h.category));
    if (categories.size >= 3) {
      const achievement = updatedAchievements.find(a => a.id === '4' && !a.earnedOn);
      if (achievement) {
        achievement.earnedOn = new Date().toISOString();
        newAchievements = true;
      }
    }

    if (newAchievements) {
      setAchievements(updatedAchievements);
      toast.success("You've unlocked a new achievement!");
    }
  };

  // Get recent achievements
  const getRecentAchievements = (count: number = 3): Achievement[] => {
    return achievements
      .filter(a => a.earnedOn)
      .sort((a, b) => 
        new Date(b.earnedOn!).getTime() - new Date(a.earnedOn!).getTime()
      )
      .slice(0, count);
  };

  const value = {
    habits,
    achievements,
    addHabit,
    editHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedOn,
    getHabitsByCategory,
    getStreakPercentage,
    getRecentAchievements
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to use the habit context
export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
