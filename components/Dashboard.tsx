
import React, { useState } from 'react';
import { User, FoodEntry, WorkoutSession, NavTab, WorkoutExercise } from '../types';
import { 
  CheckCircle2, 
  Flame, 
  Calendar, 
  Clock, 
  ChevronRight,
  Zap,
  History,
  TrendingUp,
  MapPin,
  Trophy,
  X,
  Plus,
  Dumbbell,
  Target,
  ArrowRight,
  UserCheck,
  Search,
  PlusCircle,
  Save,
  Check
} from 'lucide-react';

interface DashboardProps {
  user: User;
  setUser: (user: User) => void;
  dietEntries: FoodEntry[];
  onStartWorkout: (plannedSession?: WorkoutSession) => void;
  onNavigateToTab: (tab: NavTab) => void;
}

const TRAINERS = [
  { id: 't1', name: 'Coach Vikram', role: 'Strength Specialist', photo: 'https://picsum.photos/seed/vikram/200/200' },
  { id: 't2', name: 'Coach Sarah', role: 'Calisthenics Expert', photo: 'https://picsum.photos/seed/sarah/200/200' },
  { id: 't3', name: 'Coach Rahul', role: 'Transformation Pro', photo: 'https://picsum.photos/seed/rahul/200/200' },
];

const COMMON_EXERCISES = [
  "Bench Press", "Squats", "Deadlifts", "Overhead Press", "Barbell Rows", "Pull Ups", "Lat Pulldowns", "Leg Press", "Leg Curls", "Bicep Curls"
];

const Dashboard: React.FC<DashboardProps> = ({ user, setUser, dietEntries, onStartWorkout, onNavigateToTab }) => {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPTModal, setShowPTModal] = useState(false);

  // Advanced Planning state
  const [planName, setPlanName] = useState('');
  const [planExercises, setPlanExercises] = useState<string[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState('');

  // Booking state
  const [selectedTrainer, setSelectedTrainer] = useState(TRAINERS[0]);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('18:30');

  const totalCalories = dietEntries.reduce((acc, curr) => acc + curr.calories, 0);
  const calorieTarget = user.dietTargets.calories;
  
  const handleCheckIn = () => {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (user.attendanceHistory.includes(today)) {
      alert("Already checked in today!");
      return;
    }
    setUser({ 
      ...user, 
      isCheckedIn: true, 
      points: user.points + 1,
      attendanceHistory: [today, ...user.attendanceHistory] 
    });
  };

  const handleCreatePlan = () => {
    if (!planName) return alert("Please name your protocol");
    
    const newSession: WorkoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      date: 'Personal Plan',
      name: planName,
      durationMinutes: 60,
      caloriesBurned: 400,
      exercises: planExercises.map(name => ({
        id: Math.random().toString(),
        name,
        sets: [{ weight: 0, reps: 0, completed: false }]
      })),
      isPlanned: true
    };
    
    setUser({ ...user, plannedSessions: [newSession, ...user.plannedSessions] });
    setShowPlanModal(false);
    resetBuilder();
  };

  const resetBuilder = () => {
    setPlanName('');
    setPlanExercises([]);
  };

  const handleBookSession = () => {
    if (!bookingDate) return alert("Please select a date for your session");
    
    const newSession: WorkoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      date: `${bookingDate} @ ${bookingTime}`,
      name: `PT Session with ${selectedTrainer.name.split(' ')[1]}`,
      durationMinutes: 60,
      caloriesBurned: 500,
      exercises: [],
      isPlanned: true
    };
    
    setUser({ ...user, plannedSessions: [newSession, ...user.plannedSessions] });
    setShowPTModal(false);
    alert("Premium PT Session Booked Successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 overflow-x-hidden">
      {/* Attendance Bar */}
      <div className={`p-4 rounded-[28px] bg-[#1A1A1D]/80 backdrop-blur-md border ${user.isCheckedIn ? 'border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-gray-800'} relative overflow-hidden transition-all duration-500 hover:bg-[#1A1A1D]`}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${user.isCheckedIn ? 'bg-green-500/20 text-green-500 border border-green-500/20 animate-pulse' : 'bg-white/5 text-gray-500 border border-white/5'}`}>
               <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">ELITE STATUS</p>
              <h3 className={`text-sm font-black tracking-tighter leading-none uppercase italic transition-all ${user.isCheckedIn ? 'text-green-500' : 'text-white'}`}>
                {user.isCheckedIn ? 'STATION ACTIVE' : 'OUTSIDE PERIMETER'}
              </h3>
            </div>
          </div>
          <div className="flex gap-2">
            {!user.isCheckedIn ? (
              <button onClick={handleCheckIn} className="bg-white text-black h-10 px-5 rounded-xl text-[10px] font-black active:scale-95 transition-all shadow-xl uppercase tracking-tighter hover:bg-gray-100">CHECK IN</button>
            ) : (
              <button onClick={() => setShowAttendanceModal(true)} className="p-2.5 text-gray-500 bg-white/5 rounded-xl border border-white/5 hover:text-white transition-all transform active:scale-90">
                <History size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* High-Fidelity Hero Card */}
      <div className="bg-[#1A1A1D] rounded-[40px] p-8 border border-white/5 relative overflow-hidden group shadow-[0_25px_60px_rgba(0,0,0,0.6)] transform transition-all duration-700 hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(225,6,0,0.15)]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-red-600/10 to-transparent transition-opacity group-hover:opacity-60"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/30 blur-[70px] -mr-12 -mt-12 group-hover:scale-150 transition-all duration-1000"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 blur-[80px] rounded-full group-hover:scale-110 transition-all"></div>
        
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-[#0B0B0D] p-3.5 rounded-2xl border border-white/5 shadow-inner transform transition-transform group-hover:rotate-12">
               <Zap size={22} className="text-[#E10600] fill-[#E10600]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/90 uppercase tracking-tight italic leading-none mb-0.5">RECOMMENDED</span>
              <span className="text-[10px] font-black text-white/90 uppercase tracking-tight italic leading-none">PROTOCOL</span>
            </div>
          </div>
          <div className="bg-[#0B0B0D]/80 border border-white/10 px-5 py-2.5 rounded-full text-white/40 font-black uppercase tracking-widest text-[9px] shadow-sm transform transition-all hover:text-white hover:border-white/20">
             PHASE 2 / DAY 14
          </div>
        </div>

        <div className="space-y-1 mb-12 relative z-10 transform transition-transform group-hover:translate-x-1 duration-500">
          <h2 className="text-[40px] font-black text-white leading-[0.85] tracking-tighter italic uppercase drop-shadow-lg">PUSH PROTOCOL</h2>
          <h2 className="text-[40px] font-black text-[#E10600] leading-[0.85] tracking-tighter italic uppercase">V3 POWER</h2>
        </div>

        <div className="flex items-center gap-8 mb-10 relative z-10">
          <div className="flex items-center gap-2.5 text-gray-300">
             <Clock size={18} className="text-[#E10600]" />
             <span className="text-sm font-black uppercase tracking-tight italic">75 MINS</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-300">
             <Flame size={18} className="text-[#E10600]" />
             <span className="text-sm font-black uppercase tracking-tight italic">480 KCAL</span>
          </div>
        </div>

        <button 
          onClick={() => onStartWorkout()}
          className="w-full h-[76px] bg-white text-black font-black text-[17px] rounded-[24px] shadow-[0_15px_40px_rgba(255,255,255,0.1)] active:scale-[0.97] hover:scale-[1.01] transition-all flex items-center justify-center gap-4 uppercase tracking-tighter group/btn"
        >
          START TRAINING <ArrowRight size={22} strokeWidth={3} className="transform transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>

      {/* Split Row Widgets */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calorie Widget with Navigation and Transition */}
        <button 
          onClick={() => onNavigateToTab(NavTab.Diet)}
          className="bg-[#1A1A1D] rounded-[32px] p-6 border border-white/5 flex flex-col items-center shadow-lg active:scale-95 transition-all group relative overflow-hidden hover:border-[#E10600]/30"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-[#E10600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-5 text-center group-hover:text-[#E10600] transition-colors relative z-10">DAILY INTAKE</p>
            <div className="w-full aspect-square relative flex items-center justify-center relative z-10 transform transition-transform group-hover:scale-105 duration-500">
                <div className="absolute inset-0 rounded-full border-[7px] border-[#2a2a2d]"></div>
                <div 
                  className="absolute inset-0 rounded-full border-[7px] border-t-[#E10600] border-l-[#E10600] border-r-transparent border-b-transparent transition-all duration-1000"
                  style={{ transform: `rotate(${Math.min((totalCalories / calorieTarget) * 270 - 45, 225)}deg)` }}
                ></div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-white">{totalCalories}</span>
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">KCAL</span>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[8px] text-[#E10600] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
               VIEW DIET <ChevronRight size={10} />
            </div>
        </button>

        {/* PT Booking Entry */}
        <div className="bg-[#1A1A1D] rounded-[32px] p-6 border border-white/5 shadow-lg flex flex-col justify-between group hover:border-[#E10600]/30 transition-all">
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 group-hover:text-[#E10600] transition-colors">NEXT PT SESSION</p>
              <h4 className="font-black text-white text-sm leading-tight mb-4 uppercase italic">ELITE SESSIONS <br/><span className="text-[#E10600] opacity-80">PHASE 1</span></h4>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                    <Clock size={12} className="text-[#E10600]" /> 06:30 PM
                </div>
                <button onClick={() => setShowPTModal(true)} className="flex items-center justify-between w-full text-[9px] font-black text-white mt-4 uppercase tracking-[0.15em] group/book bg-[#E10600] py-3 px-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/10 active:scale-95">
                    BOOK NOW <ChevronRight size={14} className="transform transition-transform group-hover/book:translate-x-1" />
                </button>
            </div>
        </div>
      </div>
      
      {/* Footer Branding Info */}
      <div className="bg-gradient-to-br from-[#E10600] to-[#800] p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
         <div className="flex items-center justify-between mb-8 relative z-10">
            <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] italic">PLATINUM MEMBER PORTAL</span>
            <div className="flex items-center gap-1.5 text-white/50"><Trophy size={20} /></div>
         </div>
         <div className="flex items-end justify-between relative z-10">
            <div>
               <h2 className="text-5xl font-black text-white italic tracking-tighter drop-shadow-lg">{user.points}</h2>
               <p className="text-[10px] font-black text-white/50 uppercase mt-1 tracking-widest">ELITE PERFORMANCE SCORE</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-white bg-black/40 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg transform transition-transform group-hover:scale-105">
              <TrendingUp size={14} className="text-green-400" /> GLOBAL #12
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
