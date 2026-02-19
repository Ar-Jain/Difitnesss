
import React, { useState, useEffect, useRef } from 'react';
import { NavTab, User, FoodEntry, WorkoutSession } from './types';
import { MOCK_USER } from './constants';
import Dashboard from './components/Dashboard';
import Workout from './components/Workout';
import Diet from './components/Diet';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  Trophy, 
  User as UserIcon, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScB8qLvd_uBBwo1jdA3gmwtXTq2-7zSqEJzA&sg";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.Dashboard);
  const [prevTab, setPrevTab] = useState<NavTab | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('df_isLoggedIn') === 'true');
  const [activePlannedSession, setActivePlannedSession] = useState<WorkoutSession | undefined>(undefined);
  
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('df_user');
    const parsed = saved ? JSON.parse(saved) : MOCK_USER;
    if (!parsed.workoutHistory) parsed.workoutHistory = [];
    if (!parsed.dietHistory) parsed.dietHistory = [];
    if (!parsed.plannedSessions) parsed.plannedSessions = [];
    if (!parsed.attendanceHistory) parsed.attendanceHistory = [];
    if (!parsed.bmiHistory) parsed.bmiHistory = [];
    return parsed;
  });
  
  const [dietEntries, setDietEntries] = useState<FoodEntry[]>(() => {
    const saved = localStorage.getItem('df_diet');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', name: 'Oats with Milk', calories: 350, protein: 15, carbs: 55, fat: 8, type: 'Breakfast' },
    ];
  });

  const [waterCups, setWaterCups] = useState<number>(() => {
    const saved = localStorage.getItem('df_water');
    return saved ? parseInt(saved) : 4;
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    localStorage.setItem('df_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('df_diet', JSON.stringify(dietEntries));
  }, [dietEntries]);

  useEffect(() => {
    localStorage.setItem('df_water', waterCups.toString());
  }, [waterCups]);

  useEffect(() => {
    localStorage.setItem('df_isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAuthenticating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAdminAccess = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setActiveTab(NavTab.Dashboard);
    } else {
      setShowAdminPinModal(true);
    }
  };

  const verifyPin = () => {
    if (pinInput === '1234') {
      setIsAdminMode(true);
      setShowAdminPinModal(false);
      setPinInput('');
      setActiveTab(NavTab.Admin);
    } else {
      alert("Invalid Security PIN");
      setPinInput('');
    }
  };

  const handleFinishWorkout = (session: WorkoutSession) => {
    const newHistory = [session, ...user.workoutHistory];
    const newPlanned = user.plannedSessions.filter(ps => ps.id !== session.id);
    
    setUser(prev => ({ 
      ...prev, 
      points: prev.points + 15, 
      workoutHistory: newHistory,
      plannedSessions: newPlanned
    }));
    setActivePlannedSession(undefined);
    setActiveTab(NavTab.Dashboard);
  };

  const startWorkoutFlow = (planned?: WorkoutSession) => {
    setActivePlannedSession(planned);
    setActiveTab(NavTab.Workout);
  };

  const navigateToTab = (tab: NavTab) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAuthenticating) {
    return (
      <div className="fixed inset-0 bg-[#0B0B0D] flex flex-col items-center justify-center p-6 text-center z-[200]">
        <div className="mb-8 relative flex flex-col items-center animate-pulse">
            <div className="w-48 h-48 mb-4 relative z-10 animate-in fade-in zoom-in duration-1000">
                <img 
                  src={LOGO_URL} 
                  className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(225,6,0,0.6)]" 
                  alt="D-Fitness Logo" 
                />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#E10600]/20 blur-[100px] rounded-full"></div>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic animate-in slide-in-from-bottom-4 duration-700">D-FITNESS</h1>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Auth onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case NavTab.Dashboard: 
          return <Dashboard 
            user={user} 
            setUser={setUser} 
            dietEntries={dietEntries} 
            onStartWorkout={startWorkoutFlow} 
            onNavigateToTab={navigateToTab}
          />;
        case NavTab.Workout: 
          return <Workout user={user} plannedSession={activePlannedSession} onFinish={handleFinishWorkout} onBack={() => navigateToTab(NavTab.Dashboard)} />;
        case NavTab.Diet: 
          return <Diet 
            entries={dietEntries} 
            setEntries={setDietEntries} 
            waterCups={waterCups} 
            setWaterCups={setWaterCups} 
            user={user}
            setUser={setUser}
          />;
        case NavTab.Leaderboard: 
          return <Leaderboard user={user} />;
        case NavTab.Profile: 
          return <Profile user={user} setUser={setUser} onSignOut={() => setIsLoggedIn(false)} />;
        case NavTab.Admin: 
          return <AdminPanel onBack={() => { setIsAdminMode(false); navigateToTab(NavTab.Dashboard); }} />;
        default: 
          return <Dashboard user={user} setUser={setUser} dietEntries={dietEntries} onStartWorkout={startWorkoutFlow} onNavigateToTab={navigateToTab} />;
      }
    })();

    return (
      <div key={activeTab} className="page-transition-enter page-transition-enter-active">
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[#0B0B0D] relative flex flex-col shadow-2xl border-x border-gray-900 transition-colors duration-500">
      <header className="pt-8 pb-4 px-6 sticky top-0 bg-[#0B0B0D]/95 backdrop-blur-md z-40 flex justify-between items-center border-b border-gray-900 shadow-sm">
        <div className="flex items-center gap-3 group">
          {activeTab !== NavTab.Dashboard && activeTab !== NavTab.Admin && (
             <button onClick={() => navigateToTab(NavTab.Dashboard)} className="p-2 -ml-2 text-gray-500 hover:text-white transition-all transform hover:-translate-x-1">
               <ChevronLeft size={20} />
             </button>
          )}
          <div className="w-10 h-10 flex items-center justify-center p-0.5 transform transition-transform group-hover:scale-110">
             <img src={LOGO_URL} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-tighter text-white leading-tight uppercase italic">D-FITNESS</h1>
            <p className="text-[#E10600] text-[7px] font-black uppercase tracking-[0.2em] leading-none">ELITE ACCESS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={handleAdminAccess} className={`p-2.5 rounded-xl border transition-all transform active:scale-95 hover:shadow-[0_0_15px_rgba(225,6,0,0.2)] ${isAdminMode ? 'bg-[#E10600] border-[#E10600] text-white' : 'bg-dark-gray border-gray-800 text-gray-400'}`}>
                <ShieldCheck size={20} />
            </button>
            <button onClick={() => navigateToTab(NavTab.Profile)} className="w-10 h-10 rounded-full border-2 border-gray-800 p-0.5 overflow-hidden transition-all transform active:scale-90 hover:border-[#E10600]">
                <img src={user.photo} className="w-full h-full rounded-full object-cover" alt="Profile" />
            </button>
        </div>
      </header>

      <main className="px-6 py-4 flex-1">{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0B0B0D]/98 backdrop-blur-xl border-t border-gray-900 px-6 py-4 z-50 flex justify-between items-center shadow-2xl">
          <NavItem icon={<LayoutDashboard size={22} />} label="HOME" isActive={activeTab === NavTab.Dashboard} onClick={() => { setIsAdminMode(false); navigateToTab(NavTab.Dashboard); }} />
          <NavItem icon={<Dumbbell size={22} />} label="GYM" isActive={activeTab === NavTab.Workout} onClick={() => { setIsAdminMode(false); navigateToTab(NavTab.Workout); }} />
          <NavItem icon={<Utensils size={22} />} label="DIET" isActive={activeTab === NavTab.Diet} onClick={() => { setIsAdminMode(false); navigateToTab(NavTab.Diet); }} />
          <NavItem icon={<Trophy size={22} />} label="RANK" isActive={activeTab === NavTab.Leaderboard} onClick={() => { setIsAdminMode(false); navigateToTab(NavTab.Leaderboard); }} />
          <NavItem icon={<UserIcon size={22} />} label="ME" isActive={activeTab === NavTab.Profile} onClick={() => { setIsAdminMode(false); navigateToTab(NavTab.Profile); }} />
      </nav>

      {showAdminPinModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-full max-w-[300px] bg-dark-gray border border-gray-800 p-8 rounded-[32px] text-center shadow-2xl">
            <div className="w-16 h-16 bg-[#E10600]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#E10600]/20"><ShieldCheck className="text-[#E10600]" size={32} /></div>
            <h3 className="text-xl font-black mb-2 text-white italic tracking-tighter">ADMIN SECURITY</h3>
            <p className="text-[10px] text-gray-500 mb-8 uppercase tracking-widest font-bold">ENTER TRAINER PORTAL PIN</p>
            <input type="password" maxLength={4} placeholder="••••" value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))} className="w-full h-16 bg-black border border-gray-800 rounded-2xl text-center text-4xl font-black tracking-[0.5em] focus:border-[#E10600] outline-none mb-8 text-white transition-all shadow-inner" autoFocus />
            <div className="flex gap-4">
              <button onClick={() => { setShowAdminPinModal(false); setPinInput(''); }} className="flex-1 h-14 rounded-2xl text-[10px] font-black text-gray-500 border border-gray-800 uppercase hover:bg-white/5 transition-all">CANCEL</button>
              <button onClick={verifyPin} className="flex-1 h-14 bg-[#E10600] rounded-2xl text-[10px] font-black text-white uppercase hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">ENTER</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 transform active:scale-90 ${isActive ? 'text-[#E10600]' : 'text-gray-600 hover:text-gray-400'}`}>
    <div className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(225,6,0,0.5)]' : ''}`}>{icon}</div>
    <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-0.5'}`}>{label}</span>
  </button>
);

export default App;
