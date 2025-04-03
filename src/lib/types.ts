
// Data type definitions

export type HabitCategory =
  | 'health'
  | 'fitness'
  | 'learning'
  | 'productivity'
  | 'mindfulness'
  | 'social'
  | 'other';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  streak: number;
  totalCompletions: number;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
  createdAt: string; // ISO date string
  targetDays?: number[]; // 0-6 where 0 is Sunday
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedOn?: string; // ISO date string
  category?: HabitCategory;
}
