
import React, { useState } from 'react';
// Import User type from types
import { User } from '../types';
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Medal,
  ChevronUp
} from 'lucide-react';

const MOCK_LEADERBOARD = [
  { id: '1', name: 'Arun Singh', points: 1240, photo: 'https://picsum.photos/seed/arun/100/100', rank: 1, trend: 'up' },
  { id: '2', name: 'Vikram Malhotra', points: 1120, photo: 'https://picsum.photos/seed/vik/100/100', rank: 2, trend: 'down' },
  { id: '3', name: 'Sneha Rao', points: 980, photo: 'https://picsum.photos/seed/sneha/100/100', rank: 3, trend: 'stable' },
  { id: '4', name: 'Kabir Das', points: 850, photo: 'https://picsum.photos/seed/kabir/100/100', rank: 4, trend: 'up' },
  { id: '5', name: 'Rohan Sharma', points: 450, photo: 'https://picsum.photos/seed/rohan/100/100', rank: 12, trend: 'up', isMe: true },
];

// Define props interface for Leaderboard
interface LeaderboardProps {
  user: User;
}

// Update component signature to accept LeaderboardProps to fix prop mismatch in App.tsx
const Leaderboard: React.FC<LeaderboardProps> = ({ user }) => {
  const [activeType, setActiveType] = useState<'attendance' | 'strength' | 'transformation'>('attendance');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-extrabold tracking-tight">RANKINGS</h2>

      <div className="flex bg-dark-gray p-1 rounded-xl border border-gray-800">
        <TabButton active={activeType === 'attendance'} onClick={() => setActiveType('attendance')}>Attendance</TabButton>
        <TabButton active={activeType === 'strength'} onClick={() => setActiveType('strength')}>Strength</TabButton>
        <TabButton active={activeType === 'transformation'} onClick={() => setActiveType('transformation')}>Body</TabButton>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-2 py-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-gray-400 p-1">
                    <img src={MOCK_LEADERBOARD[1].photo} className="w-full h-full rounded-full object-cover grayscale opacity-80" alt="" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-black">2</div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 max-w-[60px] text-center truncate">{MOCK_LEADERBOARD[1].name}</p>
            <div className="w-20 h-24 bg-dark-gray border-x border-t border-gray-800 rounded-t-lg flex flex-col items-center justify-center">
                <Medal size={20} className="text-gray-400 mb-1" />
                <span className="text-xs font-bold text-gray-400">{MOCK_LEADERBOARD[1].points}</span>
            </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center gap-2 -mt-4">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-yellow-500 p-1 red-glow">
                    <img src={MOCK_LEADERBOARD[0].photo} className="w-full h-full rounded-full object-cover" alt="" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-black ring-4 ring-[#0B0B0D]">1</div>
                <Trophy className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 animate-pulse" size={24} />
            </div>
            <p className="text-xs font-extrabold text-white max-w-[80px] text-center truncate">{MOCK_LEADERBOARD[0].name}</p>
            <div className="w-24 h-32 bg-[#E10600] rounded-t-xl flex flex-col items-center justify-center shadow-[0_-10px_30px_rgba(225,6,0,0.3)]">
                <Medal size={24} className="text-white mb-1" />
                <span className="text-sm font-black text-white">{MOCK_LEADERBOARD[0].points}</span>
            </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-orange-700 p-1">
                    <img src={MOCK_LEADERBOARD[2].photo} className="w-full h-full rounded-full object-cover opacity-80" alt="" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white">3</div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 max-w-[60px] text-center truncate">{MOCK_LEADERBOARD[2].name}</p>
            <div className="w-20 h-20 bg-dark-gray border-x border-t border-gray-800 rounded-t-lg flex flex-col items-center justify-center">
                <Medal size={20} className="text-orange-700 mb-1" />
                <span className="text-xs font-bold text-gray-400">{MOCK_LEADERBOARD[2].points}</span>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2 bg-dark-gray rounded-[14px] border border-gray-800 p-2">
        {MOCK_LEADERBOARD.slice(3).map((player) => (
            <div 
              key={player.id} 
              className={`flex items-center gap-4 p-3 rounded-xl ${player.isMe ? 'bg-[#E10600]/10 border border-[#E10600]/30' : ''}`}
            >
                <span className="w-6 text-xs font-bold text-gray-500">#{player.rank}</span>
                <img src={player.photo} className="w-10 h-10 rounded-full object-cover border border-gray-800" alt="" />
                <div className="flex-1">
                    <h4 className={`text-sm font-bold ${player.isMe ? 'text-[#E10600]' : 'text-white'}`}>{player.name} {player.isMe && '(You)'}</h4>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{player.points} pts</span>
                </div>
                {player.trend === 'up' && <ChevronUp className="text-green-500" size={16} />}
            </div>
        ))}
      </div>

      <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800/60">
        <h5 className="text-[10px] font-black uppercase text-[#E10600] mb-2">Scoring System</h5>
        <ul className="text-[10px] text-gray-400 space-y-1">
            <li className="flex justify-between"><span>Daily Attendance</span> <span>+1 pt</span></li>
            <li className="flex justify-between"><span>Personal Best (PB) Log</span> <span>+5 pts</span></li>
            <li className="flex justify-between"><span>PT Session Completed</span> <span>+10 pts</span></li>
        </ul>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${active ? 'bg-[#E10600] text-white' : 'text-gray-500'}`}
    >
        {children}
    </button>
);

export default Leaderboard;
