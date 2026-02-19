
import React, { useState, useEffect, useMemo } from 'react';
import { WorkoutExercise, WorkoutSession, User } from '../types';
import { 
  Plus, 
  Check,
  Timer,
  X,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Zap,
  Dumbbell,
  Save,
  ArrowRight,
  ClipboardCheck,
  Award,
  History as HistoryIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Lock,
  Unlock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WorkoutProps {
  user: User;
  plannedSession?: WorkoutSession;
  onFinish: (session: WorkoutSession) => void;
  onBack: () => void;
}

const COMMON_EXERCISES = [
  "Bench Press", "Incline DB Press", "Cable Flyes", "Squats", "Leg Press", "Deadlifts", "Lat Pulldowns", "Bent Over Rows", "Shoulder Press", "Lateral Raises", "Bicep Curls", "Tricep Pushdowns"
];

const INITIAL_EXERCISES: WorkoutExercise[] = [
  {
    id: 'e1',
    name: 'Bench Press (Standard)',
    sets: [
      { weight: 80, reps: 10, completed: false },
      { weight: 85, reps: 8, completed: false },
    ]
  }
];

const MIN_SETS_TO_FINISH = 2;

const Workout: React.FC<WorkoutProps> = ({ user, plannedSession, onFinish, onBack }) => {
  const [view, setView] = useState<'active' | 'history'>('active');
  const [exercises, setExercises] = useState<WorkoutExercise[]>(() => {
    if (plannedSession && plannedSession.exercises.length > 0) return plannedSession.exercises;
    const saved = localStorage.getItem('df_current_workout');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });
  
  const [sessionName, setSessionName] = useState(plannedSession?.name || "Protocol Session");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [historyFilter, setHistoryFilter] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!plannedSession && view === 'active') {
      localStorage.setItem('df_current_workout', JSON.stringify(exercises));
    }
  }, [exercises, plannedSession, view]);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(p => p - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
      setTimerSeconds(60);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const toggleSet = (exerciseId: string, setIndex: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const newSets = [...ex.sets];
        const prevCompleted = newSets[setIndex].completed;
        newSets[setIndex].completed = !newSets[setIndex].completed;
        
        // Automated rest timer only when marking as completed
        if (!prevCompleted && newSets[setIndex].completed) { 
          setIsTimerActive(true); 
          setTimerSeconds(60); 
        }
        return { ...ex, sets: newSets };
      }
      return ex;
    }));
  };

  const updateSetValues = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const numValue = parseInt(value) || 0;
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const newSets = [...ex.sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: numValue };
        return { ...ex, sets: newSets };
      }
      return ex;
    }));
  };

  const completedSetsCount = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
  const totalSetsCount = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const isFinishable = completedSetsCount >= MIN_SETS_TO_FINISH;
  const progressPercentage = (completedSetsCount / Math.max(1, totalSetsCount)) * 100;

  const handleComplete = () => {
    setIsSaving(true);
    setTimeout(() => {
      const session: WorkoutSession = {
        id: plannedSession?.id || Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        name: sessionName,
        durationMinutes: plannedSession?.durationMinutes || 75,
        caloriesBurned: plannedSession?.caloriesBurned || 480,
        exercises: exercises
      };
      localStorage.removeItem('df_current_workout');
      onFinish(session);
    }, 1200);
  };

  const filteredHistory = useMemo(() => {
    if (!historyFilter) return user.workoutHistory;
    return user.workoutHistory.filter(s => s.date.toLowerCase().includes(historyFilter.toLowerCase()));
  }, [user.workoutHistory, historyFilter]);

  const frequencyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(day => ({ name: day, count: 0 }));
    
    user.workoutHistory.slice(0, 30).forEach(session => {
        const date = new Date(session.date);
        if (!isNaN(date.getTime())) {
            const dayIdx = date.getDay();
            data[dayIdx].count++;
        }
    });
    return data;
  }, [user.workoutHistory]);

  if (view === 'history') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
        <div className="flex justify-between items-center bg-[#0B0B0D]/80 backdrop-blur-xl p-4 -mx-6 mb-2 border-b border-gray-900 sticky top-0 z-[100]">
          <button onClick={() => setView('active')} className="text-gray-500 text-[10px] font-black tracking-widest uppercase hover:text-white transition-all transform active:scale-90 px-4 flex items-center gap-2">
            <ChevronLeft size={14} /> Back to Session
          </button>
          <h2 className="text-xs font-black tracking-tight uppercase text-white italic">Workout Vault</h2>
          <div className="w-16"></div>
        </div>

        <div className="bg-dark-gray p-6 rounded-[24px] border border-gray-800 space-y-4">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <BarChart2 size={14} className="text-[#E10600]" /> Frequency Analysis
           </div>
           <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={frequencyData}>
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke="#555" />
                    <Tooltip contentStyle={{backgroundColor:'#1A1A1D', border:'none', borderRadius:'12px', fontSize:'10px'}} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {frequencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#E10600' : '#222'} />
                      ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input 
            type="text" 
            placeholder="Search by date (e.g. Mar 12)..." 
            className="w-full h-14 bg-dark-gray border border-gray-800 rounded-2xl pl-12 pr-6 outline-none focus:border-[#E10600] text-sm text-white transition-all"
            value={historyFilter}
            onChange={(e) => setHistoryFilter(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-[32px] text-gray-600">
               <HistoryIcon size={32} className="mx-auto mb-4 opacity-20" />
               <p className="text-[10px] font-black uppercase tracking-widest">No previous protocols found</p>
            </div>
          ) : (
            filteredHistory.map(session => (
              <div key={session.id} className="bg-dark-gray p-5 rounded-[24px] border border-gray-800 flex items-center justify-between group hover:border-[#E10600]/40 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#E10600]">
                       <ClipboardCheck size={22} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white italic uppercase tracking-tight">{session.name}</h4>
                       <div className="flex items-center gap-3 mt-1 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {session.date}</span>
                          <span className="flex items-center gap-1"><Zap size={10} /> {session.caloriesBurned} KCAL</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-black text-white">{session.durationMinutes}m</p>
                    <p className="text-[8px] font-bold text-gray-600 uppercase">Duration</p>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-[#0B0B0D]/80 backdrop-blur-xl p-4 -mx-6 mb-2 border-b border-gray-900 sticky top-0 z-[100] transition-all">
        <button onClick={onBack} className="text-gray-500 text-[10px] font-black tracking-widest uppercase hover:text-white transition-all transform active:scale-90 px-4">Abort</button>
        <div className="text-center flex-1 mx-4">
          {isEditingName ? (
            <input 
              autoFocus
              className="bg-black/40 border border-[#E10600] text-sm font-black tracking-tight uppercase text-white rounded-lg px-3 py-1 w-full text-center outline-none animate-in zoom-in-95" 
              value={sessionName}
              onBlur={() => setIsEditingName(false)}
              onChange={(e) => setSessionName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                <h2 className="text-sm font-black tracking-tight uppercase text-white italic group-hover:text-[#E10600] transition-colors">{sessionName}</h2>
                <Edit2 size={12} className="text-[#E10600] opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-24 h-1 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                 <div className="h-full bg-[#E10600] transition-all duration-700" style={{width: `${progressPercentage}%`}}></div>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => setView('history')} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all transform active:scale-90">
           <HistoryIcon size={20} />
        </button>
      </div>

      {/* Exercises List */}
      <div className="space-y-5">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-dark-gray rounded-3xl border border-gray-800 overflow-hidden shadow-2xl transition-all group hover:border-gray-700">
            <div className="p-5 bg-white/5 flex justify-between items-center border-b border-gray-800">
              <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${exercise.sets.every(s => s.completed) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-[#E10600] animate-pulse'}`}></div>
                 <h3 className="font-black text-xs text-white uppercase italic tracking-tighter">{exercise.name}</h3>
              </div>
              <button onClick={() => setExercises(p => p.filter(e => e.id !== exercise.id))} className="text-gray-700 hover:text-red-500 transition-all transform hover:rotate-90"><Trash2 size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-4 gap-3 text-[9px] font-black text-gray-600 uppercase text-center tracking-widest">
                  <span>Set</span><span>Weight</span><span>Reps</span><span>Status</span>
              </div>
              {exercise.sets.map((set, idx) => (
                <div key={idx} className={`grid grid-cols-4 gap-3 items-center text-center transition-all ${set.completed ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                  <span className="text-gray-500 font-black text-xs">{idx + 1}</span>
                  <input type="number" value={set.weight || ''} placeholder="0" onChange={(e) => updateSetValues(exercise.id, idx, 'weight', e.target.value)} className="bg-black border border-gray-800 h-12 rounded-xl text-sm font-black text-center text-white outline-none focus:border-[#E10600] transition-all hover:bg-white/5" />
                  <input type="number" value={set.reps || ''} placeholder="0" onChange={(e) => updateSetValues(exercise.id, idx, 'reps', e.target.value)} className="bg-black border border-gray-800 h-12 rounded-xl text-sm font-black text-center text-white outline-none focus:border-[#E10600] transition-all hover:bg-white/5" />
                  <button 
                    onClick={() => toggleSet(exercise.id, idx)} 
                    className={`h-12 rounded-xl flex items-center justify-center transition-all border transform ${set.completed ? 'bg-green-600 border-green-500 scale-95 shadow-[0_0_15px_rgba(22,163,74,0.3)] set-complete-pop' : 'bg-gray-800/40 border-gray-800 hover:border-gray-600 active:scale-90'}`}
                  >
                    <Check size={20} className={set.completed ? 'text-white' : 'text-gray-700'} />
                  </button>
                </div>
              ))}
              <button onClick={() => setExercises(prev => prev.map(ex => ex.id === exercise.id ? {...ex, sets: [...ex.sets, {weight:0, reps:0, completed:false}]} : ex))} className="w-full h-12 border border-dashed border-gray-800 rounded-xl text-gray-600 text-[10px] font-black uppercase mt-2 active:bg-white/5 transition-all hover:border-gray-600 hover:text-gray-400">Add New Set</button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 pt-4">
        <button onClick={() => setIsAddModalOpen(true)} className="w-full h-16 bg-dark-gray border border-gray-800 text-gray-500 font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-gray-800 hover:text-white uppercase tracking-widest text-[11px] shadow-lg">
            <PlusCircle size={22} /> Add Exercise to Protocol
        </button>
        
        {/* Progress active check - at least MIN_SETS_TO_FINISH sets done to enable finish */}
        <div className="space-y-3">
          <button 
            onClick={() => isFinishable && setShowConfirmModal(true)} 
            disabled={!isFinishable}
            className={`w-full h-18 font-black rounded-3xl shadow-[0_20px_40px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3 transition-all uppercase tracking-widest ${isFinishable ? 'bg-white text-black active:scale-[0.97] opacity-100' : 'bg-dark-gray text-gray-700 border border-gray-800 opacity-60 cursor-not-allowed'}`}
          >
              {isFinishable ? <Unlock size={24} className="text-[#E10600]" /> : <Lock size={20} className="text-gray-700" />}
              FINISH TRAINING
          </button>
          
          <div className="flex flex-col items-center gap-1.5 animate-in fade-in duration-500">
            {!isFinishable ? (
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] italic">
                COMPLETE {MIN_SETS_TO_FINISH - completedSetsCount} MORE SETS TO ARCHIVE
              </p>
            ) : (
              <p className="text-[9px] font-black text-[#E10600] uppercase tracking-[0.2em] italic animate-pulse">
                MINIMUM PROTOCOL MET • SESSION READY
              </p>
            )}
            <div className="w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-700 ${isFinishable ? 'bg-green-500' : 'bg-gray-700'}`} 
                 style={{width: `${Math.min((completedSetsCount / MIN_SETS_TO_FINISH) * 100, 100)}%`}}
               ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-[320px] bg-dark-gray border border-gray-800 p-8 rounded-[40px] text-center shadow-2xl space-y-6">
              <div className="w-20 h-20 bg-[#E10600]/10 rounded-full flex items-center justify-center mx-auto border border-[#E10600]/20">
                <ClipboardCheck className="text-[#E10600]" size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">ARCHIVE PROTOCOL?</h3>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-relaxed">
                  Excellent work, elite. Committing {completedSetsCount} sets to your permanent performance history.
                </p>
              </div>
              
              <div className="bg-black/40 rounded-3xl p-6 border border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>Summary</span>
                    <span className="text-white">{new Date().toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
                 </div>
                 <div className="h-[1px] bg-white/5"></div>
                 <div className="flex items-center gap-4">
                    <div className="flex-1 text-left">
                       <p className="text-[9px] font-black text-[#E10600] uppercase mb-1">Total Effort</p>
                       <p className="text-xl font-black text-white italic">{completedSetsCount} <span className="text-[10px] font-normal not-italic opacity-40">SETS</span></p>
                    </div>
                    <div className="w-[1px] h-8 bg-white/5"></div>
                    <div className="flex-1 text-right">
                       <p className="text-[9px] font-black text-[#E10600] uppercase mb-1">Rewards</p>
                       <p className="text-xl font-black text-white italic">+15 <span className="text-[10px] font-normal not-italic opacity-40">PTS</span></p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleComplete} 
                  disabled={isSaving}
                  className="w-full h-16 bg-white text-black font-black uppercase rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  {isSaving ? (
                     <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        SYNCING
                     </div>
                  ) : (
                    <>CONFIRM ARCHIVE <Award size={20} /></>
                  )}
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)} 
                  className="w-full h-14 rounded-2xl text-[10px] font-black text-gray-600 border border-gray-800 uppercase active:bg-white/5 transition-all"
                >
                  KEEP GRINDING
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Exercise Library Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/98 backdrop-blur-3xl p-6 flex flex-col animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">PROTOCOL VAULT</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Select from standard library</p>
            </div>
            <button onClick={() => setIsAddModalOpen(false)} className="bg-white/5 p-3 rounded-full text-white border border-white/5 hover:bg-white/10 transition-all transform active:scale-90"><X size={28} /></button>
          </div>
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={22} />
            <input 
              type="text" 
              placeholder="Filter Protocols..." 
              className="w-full h-18 bg-dark-gray border border-gray-800 rounded-3xl pl-16 pr-8 outline-none focus:border-[#E10600] text-white font-black tracking-tight transition-all shadow-inner" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              autoFocus 
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scroll">
            {COMMON_EXERCISES.filter(e => e.toLowerCase().includes(searchQuery.toLowerCase())).map((name, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setExercises([...exercises, {id: Math.random().toString(), name, sets: [{weight:0, reps:0, completed:false}]}]); 
                  setIsAddModalOpen(false);
                }} 
                className="w-full bg-dark-gray p-6 rounded-2xl border border-gray-800 text-left font-black text-white active:bg-[#E10600] transition-all uppercase tracking-widest text-[11px] flex items-center justify-between group hover:border-[#E10600]/30"
              >
                {name}
                <ArrowRight size={18} className="text-gray-700 group-active:text-white transform group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rest Timer */}
      {isTimerActive && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#E10600] px-8 py-5 rounded-[24px] shadow-[0_20px_50px_rgba(225,6,0,0.4)] flex items-center gap-8 animate-in slide-in-from-bottom-12 z-[110] border border-white/10 transform transition-all hover:scale-105">
          <div className="flex items-center gap-4 text-white">
            <div className="p-2 bg-black/20 rounded-xl"><Timer className="animate-pulse" size={28} /></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">RECOVERY PROTOCOL</span>
              <span className="text-3xl font-black tabular-nums tracking-tighter">{Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}</span>
            </div>
          </div>
          <button onClick={() => setIsTimerActive(false)} className="bg-black/20 p-2.5 rounded-full hover:bg-black/40 transition-all transform active:scale-90"><X size={20} className="text-white" /></button>
        </div>
      )}
    </div>
  );
};

export default Workout;
