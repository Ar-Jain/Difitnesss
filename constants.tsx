
export const COLORS = {
  PRIMARY_RED: '#E10600',
  BLACK: '#0B0B0D',
  WHITE: '#FFFFFF',
  DARK_GRAY: '#1A1A1D',
};

export const MOCK_USER = {
  id: 'u1',
  name: 'Rohan Sharma',
  membershipId: 'DF-8829-X',
  joinDate: '15 Jan 2024',
  goal: 'Muscle Hypertrophy',
  weight: 82.5,
  height: 180,
  photo: 'https://picsum.photos/seed/rohan/200/200',
  isAdmin: false,
  points: 450,
  isApproved: true,
  isCheckedIn: false,
  dietTargets: {
    calories: 2500,
    protein: 180,
    carbs: 220,
    fat: 70,
    water: 12
  },
  workoutHistory: [],
  plannedSessions: [],
  attendanceHistory: [],
  bmiHistory: [],
  dietHistory: []
};

export const INDIAN_FOOD_DATABASE = [
  { name: 'Paneer Tikka (100g)', calories: 250, protein: 18, carbs: 6, fat: 17 },
  { name: 'Roti (1 piece)', calories: 75, protein: 3, carbs: 15, fat: 1 },
  { name: 'Dal Tadka (1 bowl)', calories: 150, protein: 8, carbs: 20, fat: 5 },
  { name: 'Chicken Curry (1 bowl)', calories: 300, protein: 25, carbs: 10, fat: 18 },
  { name: 'Brown Rice (1 bowl)', calories: 215, protein: 5, carbs: 45, fat: 2 },
  { name: 'Greek Yogurt (100g)', calories: 60, protein: 10, carbs: 4, fat: 0 },
];
