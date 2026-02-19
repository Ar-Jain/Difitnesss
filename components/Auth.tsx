
import React, { useState } from 'react';
import { User, Key, ArrowRight, ShieldCheck } from 'lucide-react';

const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScB8qLvd_uBBwo1jdA3gmwtXTq2-7zSqEJzA&s";

const Auth: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [memberId, setMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center p-8 max-w-md mx-auto relative overflow-hidden font-inter text-white">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#E10600]/15 to-transparent blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#E10600]/5 blur-[100px] pointer-events-none"></div>
      
      <div className="w-full flex flex-col items-center relative z-10 mb-16 animate-in fade-in zoom-in duration-1000">
        {/* Branding Container */}
        <div className="w-48 h-48 mb-8 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-[#E10600]/20 blur-[60px] rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000"></div>
            <img 
              src={LOGO_URL} 
              className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(225,6,0,0.5)] transform transition-transform group-hover:scale-110 duration-700" 
              alt="D-Fitness Muscular Branding" 
            />
        </div>
        
        <div className="text-center space-y-1">
          <h1 className="text-[40px] font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-2xl">D-FITNESS</h1>
          <div className="flex items-center gap-5 w-full justify-center mt-3">
              <div className="h-[1px] w-10 bg-white/10"></div>
              <p className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-black">MEMBERS PORTAL</p>
              <div className="h-[1px] w-10 bg-white/10"></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleLogin} className="w-full space-y-6 relative z-10 animate-in slide-in-from-bottom-8 duration-700 delay-200">
        <div className="relative group">
          <div className="absolute left-7 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#E10600] transition-colors duration-500">
            <User size={24} strokeWidth={2.5} />
          </div>
          <input 
            type="text" 
            placeholder="MEMBERSHIP ID"
            className="w-full h-[80px] bg-[#1A1A1D] border border-white/5 rounded-[26px] pl-16 pr-8 text-white font-black tracking-[0.2em] focus:border-[#E10600] focus:bg-[#1A1A1D]/80 outline-none transition-all placeholder:text-white/10 text-lg uppercase shadow-inner"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value.toUpperCase())}
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading || !memberId}
          className="w-full h-[80px] bg-white text-black font-black text-xl uppercase rounded-[26px] flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_20px_50px_rgba(255,255,255,0.08)] hover:bg-gray-100 group/btn overflow-hidden relative"
        >
          {isLoading ? (
             <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="tracking-tighter italic">AUTHENTICATING</span>
             </div>
          ) : (
            <>
              <span className="tracking-tighter italic">LOG IN NOW</span>
              <ArrowRight size={24} strokeWidth={3} className="transform transition-transform group-hover/btn:translate-x-1.5 duration-300" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 text-center relative z-10 space-y-10 animate-in fade-in duration-1000 delay-500">
        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">
            Access Restricted. <span className="text-[#E10600] cursor-pointer hover:underline underline-offset-4 transition-all">Support Desk</span>
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5 text-white/20">
              <ShieldCheck size={18} className="opacity-60" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-80">END-TO-END ENCRYPTED SESSION</span>
          </div>
          <div className="w-12 h-[2px] bg-white/5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
