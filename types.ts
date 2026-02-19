
export enum NavTab {
  Dashboard = 'Dashboard',
  Workout = 'Workout',
  Diet = 'Diet',
  Leaderboard = 'Leaderboard',
  Profile = 'Profile',
  Admin = 'Admin'
}

export interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercises: WorkoutExercise[];
  isPlanned?: boolean;
}

export interface BMIReport {
  id: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  category: string;
}

export interface User {
  id: string;
  name: string;
  membershipId: string;
  joinDate: string;
  goal: string;
  weight: number;
  height: number;
  photo: string;
  isAdmin: boolean;
  points: number;
  isApproved: boolean;
  isCheckedIn: boolean;
  dietTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  workoutHistory: WorkoutSession[];
  plannedSessions: WorkoutSession[];
  attendanceHistory: string[];
  bmiHistory: BMIReport[];
  dietHistory: { date: string; entries: FoodEntry[]; water: number }[];
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  photo: string;
  points: number;
  rank: number;
  type: 'attendance' | 'strength' | 'transformation';
}
