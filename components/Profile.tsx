
import React, { useState, useRef } from 'react';
import { User, BMIReport } from '../types';
import { 
  Settings, CreditCard, History, Download, Camera, ChevronRight, LogOut, Save, ShieldCheck, CheckCircle2, ChevronLeft,
  Activity, ArrowUpRight, Scale, Calculator, X, Plus, TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileProps {
  user: User;
  setUser: (user: User) => void;
  onSignOut: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, onSignOut }) => {
  const [subView, setSubView] = useState<'main' | 'membership' | 'billing' | 'bmi'>('main');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ weight: user.weight, height: user.height, goal: user.goal });
  const [isAddingBMI, setIsAddingBMI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setUser({ ...user, weight: formData.weight, height: formData.height, goal: formData.goal });
    setIsEditing(false);
  };

  const calculateBMI = (w: number, h: number) => {
    const hMeter = h / 100;
    const bmi = parseFloat((w / (hMeter * hMeter)).toFixed(1));
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";
    return { bmi, category };
  };

  const handleAddBMI = () => {
    const { bmi, category } = calculateBMI(formData.weight, formData.height);
    const newReport: BMIReport = {
      id: Math.random().toString(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      weight: formData.weight,
      height: formData.height,
      bmi,
      category
    };
    setUser({ ...user, bmiHistory: [newReport, ...user.bmiHistory], weight: formData.weight, height: formData.height });
    setIsAddingBMI(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setUser({ ...user, photo: reader.result as string });
        reader.readAsDataURL(file);
    }
  };

  // --- Subviews ---

  if (subView === 'membership') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSubView('main')} className="flex items-center gap-2 text-gray-500 text-xs font-black uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
        <div className="bg-gradient-to-br from-[#E10600] to-red-900 p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
          <ShieldCheck size={120} className="absolute -bottom-10 -right-10 text-white opacity-10" />
          <h2 className="text-xs font-black text-white/60 uppercase tracking-widest mb-1">Membership Tier</h2>
          <h1 className="text-3xl font-black text-white italic tracking-tighter mb-4">ELITE ACCESS</h1>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12} /> Unlimited Personal Training</p>
            <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12} /> 24/7 Premium Gym Access</p>
            <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12} /> AI Nutrition Coaching</p>
          </div>
        </div>
        <div className="bg-dark-gray p-6 rounded-2xl border border-gray-800">
           <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Status</p>
           <div className="flex items-center justify-between">
              <p className="text-white font-black text-xl">Active & Paid</p>
              <CheckCircle2 className="text-green-500" />
           </div>
           <p className="text-gray-600 text-[10px] font-bold mt-4 uppercase">Next Billing Cycle: 15 Apr 2024</p>
        </div>
      </div>
    );
  }

  if (subView === 'bmi') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-12">
        <button onClick={() => setSubView('main')} className="flex items-center gap-2 text-gray-500 text-xs font-black uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
        
        <div className="bg-dark-gray p-6 rounded-[24px] border border-gray-800 space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Body Metrics History</h3>
             <button onClick={() => setIsAddingBMI(true)} className="p-2 bg-[#E10600] text-white rounded-xl active:scale-90 transition-all shadow-lg shadow-red-500/20"><Plus size={20} /></button>
          </div>

          {user.bmiHistory.length > 0 ? (
            <div className="space-y-6">
              <div className="h-40 w-full mt-4 bg-black/20 rounded-xl p-2 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...user.bmiHistory].reverse()}>
                    <XAxis dataKey="date" fontSize={8} stroke="#444" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor:'#1A1A1D', border:'none', borderRadius:'12px', fontSize:'10px', color: '#fff'}} />
                    <Line type="monotone" dataKey="bmi" stroke="#E10600" strokeWidth={3} dot={{fill:'#E10600', strokeWidth: 2}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {user.bmiHistory.map(report => (
                  <div key={report.id} className="bg-black/30 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-white">{report.bmi} <span className="text-[10px] text-gray-600 font-normal">BMI</span></p>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{report.date} • {report.weight}kg / {report.height}cm</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${report.category === 'Normal' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{report.category}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
               <Scale className="mx-auto text-gray-800 mb-4" size={32} />
               <p className="text-xs font-black text-gray-600 uppercase">No data logs found</p>
            </div>
          )}
        </div>

        {isAddingBMI && (
          <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl p-6 flex items-center justify-center animate-in zoom-in-95">
             <div className="w-full max-w-sm bg-dark-gray border border-gray-800 rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-3"><Calculator className="text-[#E10600]" size={24} /><h3 className="text-xl font-black text-white uppercase tracking-widest">New Report</h3></div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Current Weight (kg)</label>
                    <input type="number" className="w-full h-12 bg-black border border-gray-800 rounded-xl px-4 text-white font-black" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Height (cm)</label>
                    <input type="number" className="w-full h-12 bg-black border border-gray-800 rounded-xl px-4 text-white font-black" value={formData.height} onChange={e => setFormData({...formData, height: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
                <button onClick={handleAddBMI} className="w-full h-14 bg-white text-black font-black uppercase rounded-2xl shadow-xl shadow-white/5 active:scale-95 transition-all">LOG & GENERATE</button>
                <button onClick={() => setIsAddingBMI(false)} className="w-full text-xs font-bold text-gray-500 uppercase">Dismiss</button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-[#E10600] p-1 ring-8 ring-[#E10600]/10 overflow-hidden shadow-[0_0_30px_rgba(225,6,0,0.3)]">
                <img src={user.photo} className="w-full h-full rounded-full object-cover" alt="Profile" />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#E10600] p-2.5 rounded-full border-4 border-[#0B0B0D] shadow-lg active:scale-90 transition-all text-white"><Camera size={18} /></button>
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-black text-white tracking-tighter">{user.name}</h2>
            <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">{user.membershipId}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-gray p-4 rounded-2xl border border-gray-800">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Weight</span>
            {isEditing ? <input type="number" className="w-full bg-transparent text-xl font-black text-white outline-none border-b border-[#E10600]" value={formData.weight} onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })} /> : <p className="text-xl font-black text-white">{user.weight} <span className="text-xs font-normal text-gray-600 uppercase">kg</span></p>}
        </div>
        <div className="bg-dark-gray p-4 rounded-2xl border border-gray-800 overflow-hidden">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Height</span>
            {isEditing ? <input type="number" className="w-full bg-transparent text-xl font-black text-white outline-none border-b border-[#E10600]" value={formData.height} onChange={e => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })} /> : <p className="text-xl font-black text-white">{user.height} <span className="text-xs font-normal text-gray-600 uppercase">cm</span></p>}
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="w-full h-14 bg-dark-gray border border-gray-800 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest transition-all active:scale-[0.98]">
          {isEditing ? <Save size={18} className="text-[#E10600]" /> : <Settings size={18} className="text-gray-400" />}
          {isEditing ? 'Save Profile Changes' : 'Manage Personal Info'}
        </button>

        <button onClick={() => setSubView('bmi')} className="w-full h-14 bg-[#E10600] rounded-xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest text-white transition-all active:scale-[0.98] shadow-lg shadow-red-500/20">
          <Activity size={18} /> Metrics & BMI History
        </button>
      </div>

      <div className="bg-dark-gray rounded-[24px] border border-gray-800 overflow-hidden shadow-xl">
        <ProfileAction icon={<CreditCard size={18} />} label="Membership & Billing" onClick={() => setSubView('membership')} />
        <ProfileAction icon={<History size={18} />} label="Transaction History" onClick={() => alert("Recent activity: Renewal ₹4,500 (March 15th)")} />
        <ProfileAction icon={<Download size={18} />} label="Download Tax Invoices" border={false} onClick={() => alert("Invoices generated! Checking downloads...")} />
      </div>

      <button onClick={() => { if (confirm("Confirm sign out of Elite Portal?")) onSignOut(); }} className="w-full h-14 bg-dark-gray border border-gray-800 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest text-red-500 hover:bg-red-500/5 transition-all">
          <LogOut size={18} /> SIGN OUT
      </button>
    </div>
  );
};

const ProfileAction: React.FC<{ icon: React.ReactNode; label: string; border?: boolean; onClick?: () => void }> = ({ icon, label, border = true, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-5 hover:bg-gray-800/50 transition-colors ${border ? 'border-b border-gray-800' : ''}`}>
        <div className="flex items-center gap-4"><span className="text-gray-500">{icon}</span><span className="text-sm font-black text-white tracking-tight">{label}</span></div>
        <ChevronRight size={16} className="text-gray-700" />
    </button>
);

export default Profile;
