
import React from 'react';
import { 
  Users, 
  IndianRupee, 
  CalendarCheck, 
  Megaphone,
  ArrowUpRight,
  Clock,
  ChevronLeft,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 bg-dark-gray border border-gray-800 rounded-xl text-gray-400 active:scale-90">
            <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-black tracking-tighter">ADMIN PANEL</h2>
      </div>

      <div className="bg-[#E10600] p-6 rounded-[24px] shadow-[0_20px_50px_rgba(225,6,0,0.3)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <span className="text-[10px] font-black uppercase text-white/60 tracking-[0.2em] relative z-10">Total Revenue (Monthly)</span>
        <h2 className="text-4xl font-black text-white mt-2 relative z-10 tracking-tighter">₹ 2,42,800</h2>
        <div className="flex items-center gap-2 mt-5 bg-black/20 w-fit px-3 py-1.5 rounded-full text-[10px] font-black relative z-10 border border-white/10">
            <ArrowUpRight size={12} className="text-green-400" />
            <span className="text-white">14.2% GROWTH</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AdminStatCard icon={<Users size={20} />} label="Members" value="482" />
        <AdminStatCard icon={<CalendarCheck size={20} />} label="Active PT" value="38" />
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] px-1">Management Actions</h3>
        <div className="grid grid-cols-2 gap-3">
            <button onClick={() => alert("All members currently approved.")} className="bg-dark-gray border border-gray-800 p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all hover:bg-gray-800">
                <div className="p-3 bg-green-500/10 rounded-xl">
                    <CheckCircle2 className="text-green-500" size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Approval Queue</span>
            </button>
            <button onClick={() => alert("Broadcasting to all members...")} className="bg-dark-gray border border-gray-800 p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all hover:bg-gray-800">
                <div className="p-3 bg-[#E10600]/10 rounded-xl">
                    <Megaphone className="text-[#E10600]" size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Gym Broadcast</span>
            </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Real-time Feed</h3>
            <button className="text-[10px] font-black text-[#E10600] tracking-widest">LIVE</button>
        </div>
        <div className="space-y-2">
            <ActivityItem user="Sameer K." action="Checked In" time="2m ago" />
            <ActivityItem user="Priya M." action="Membership Renewal" time="15m ago" amount="₹4,500" />
            <ActivityItem user="Arun S." action="Logged Max Deadlift" time="1h ago" />
        </div>
      </div>
      
      <button className="w-full py-4 rounded-xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors">
        <Trash2 size={16} /> RESET GYM DATA (ADMIN ONLY)
      </button>
    </div>
  );
};

const AdminStatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="bg-dark-gray border border-gray-800 p-5 rounded-2xl group transition-all hover:border-[#E10600]/30">
        <div className="text-[#E10600] mb-4 bg-black/30 w-10 h-10 flex items-center justify-center rounded-xl">{icon}</div>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black tracking-tight text-white">{value}</p>
    </div>
);

const ActivityItem: React.FC<{ user: string; action: string; time: string; amount?: string }> = ({ user, action, time, amount }) => (
    <div className="bg-dark-gray/30 p-4 rounded-xl border border-gray-900 flex justify-between items-center transition-all hover:bg-dark-gray/50">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xs font-black border border-gray-700">
                {user.charAt(0)}
            </div>
            <div>
                <p className="text-xs font-black text-white">{user} <span className="text-gray-500 font-bold">{action}</span></p>
                <div className="flex items-center gap-1.5 text-[9px] text-gray-600 font-bold uppercase mt-0.5">
                    <Clock size={10} /> {time}
                </div>
            </div>
        </div>
        {amount && <span className="text-sm font-black text-green-500">{amount}</span>}
    </div>
);

export default AdminPanel;
