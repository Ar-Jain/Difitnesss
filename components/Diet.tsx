
import React, { useState } from 'react';
import { FoodEntry, User } from '../types';
import { INDIAN_FOOD_DATABASE } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { 
  Plus, Search, Droplets, Trash2, UtensilsCrossed, X, Sparkles, Loader2, Edit2, Check, Settings, Target, Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DietProps {
  entries: FoodEntry[];
  setEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
  waterCups: number;
  setWaterCups: React.Dispatch<React.SetStateAction<number>>;
  user: User;
  setUser: (user: User) => void;
}

const Diet: React.FC<DietProps> = ({ entries, setEntries, waterCups, setWaterCups, user, setUser }) => {
  const [view, setView] = useState<'today' | 'history'>('today');
  const [isAdding, setIsAdding] = useState(false);
  const [isAISearching, setIsAISearching] = useState(false);
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<FoodEntry['type']>('Lunch');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<{ text: string, suggestedMacros?: any } | null>(null);
  const [tempTargets, setTempTargets] = useState(user.dietTargets);

  const totalCalories = entries.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = entries.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbs = entries.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFat = entries.reduce((acc, curr) => acc + curr.fat, 0);

  const chartData = [
    { name: 'Mon', cal: 2100 }, { name: 'Tue', cal: 2400 }, { name: 'Wed', cal: 1800 },
    { name: 'Thu', cal: 2200 }, { name: 'Fri', cal: 2600 }, { name: 'Sat', cal: totalCalories },
  ];

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAISearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze food: "${searchQuery}". Return Cal, Pro, Carb, Fat for 1 serving. Be brief.`,
        config: { tools: [{ googleSearch: {} }] },
      });
      const text = response.text || "";
      const calMatch = text.match(/(\d+)\s*kcal/i);
      const protMatch = text.match(/(\d+)\s*g\s*pro/i);
      setAiResponse({ text, suggestedMacros: { calories: calMatch ? parseInt(calMatch[1]) : 200, protein: protMatch ? parseInt(protMatch[1]) : 15, carbs: 20, fat: 5 } });
    } catch (err) { alert("AI Search Failed"); }
    finally { setIsAISearching(false); }
  };

  const addFood = (food: Partial<FoodEntry>) => {
    const newEntry: FoodEntry = {
      id: Math.random().toString(),
      name: food.name || searchQuery,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      type: selectedMealType
    };
    setEntries([newEntry, ...entries]);
    setIsAdding(false);
    setSearchQuery('');
    setAiResponse(null);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex bg-dark-gray p-1 rounded-xl border border-gray-800 mb-2">
        <button onClick={() => setView('today')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'today' ? 'bg-[#E10600] text-white' : 'text-gray-500'}`}>Today</button>
        <button onClick={() => setView('history')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'history' ? 'bg-[#E10600] text-white' : 'text-gray-500'}`}>History</button>
      </div>

      {view === 'today' ? (
        <>
          <div className="bg-dark-gray p-6 rounded-[24px] border border-gray-800 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-[9px] font-black uppercase mb-1">Total Calorie Budget</p>
                <h3 className="text-3xl font-black text-white">{totalCalories} <span className="text-xs text-gray-500">/ {user.dietTargets.calories} kcal</span></h3>
              </div>
              <button onClick={() => {setTempTargets(user.dietTargets); setIsEditingTargets(true);}} className="p-2 bg-gray-800 rounded-lg text-gray-500"><Settings size={18} /></button>
            </div>
            <div className="h-3 bg-black rounded-full overflow-hidden border border-gray-900">
               <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${Math.min((totalCalories / user.dietTargets.calories) * 100, 100)}%` }}></div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <MacroRow label="Carbs" current={totalCarbs} target={user.dietTargets.carbs} color="bg-blue-500" />
              <MacroRow label="Protein" current={totalProtein} target={user.dietTargets.protein} color="bg-red-600" />
              <MacroRow label="Fat" current={totalFat} target={user.dietTargets.fat} color="bg-yellow-500" />
            </div>
          </div>

          <div className="bg-dark-gray p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Droplets size={20} /></div>
              <div>
                <h4 className="font-black text-xs uppercase text-white">Hydration</h4>
                <p className="text-[10px] font-bold text-gray-500">{waterCups} / {user.dietTargets.water} Cups</p>
              </div>
            </div>
            <button onClick={() => setWaterCups(prev => Math.min(prev + 1, 24))} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"><Plus size={20} /></button>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center px-1"><h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logged Meals</h4><button onClick={() => setIsAdding(true)} className="text-[10px] font-black text-[#E10600] uppercase underline">+ Add Meal</button></div>
             {entries.map(e => (
               <div key={e.id} className="bg-dark-gray p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                 <div><p className="text-xs font-black text-white">{e.name}</p><p className="text-[8px] text-gray-500 uppercase font-black">{e.calories} KCAL • {e.protein}G PRO</p></div>
                 <button onClick={() => setEntries(p => p.filter(f => f.id !== e.id))} className="text-gray-700"><Trash2 size={14} /></button>
               </div>
             ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
           <div className="bg-dark-gray p-6 rounded-[24px] border border-gray-800">
             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Calorie Trends</h4>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs><linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E10600" stopOpacity={0.3}/><stop offset="95%" stopColor="#E10600" stopOpacity={0}/></linearGradient></defs>
                      <XAxis dataKey="name" fontSize={10} stroke="#333" axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{backgroundColor:'#1A1A1D', border:'none', borderRadius:'12px', fontSize:'10px'}} />
                      <Area type="monotone" dataKey="cal" stroke="#E10600" fillOpacity={1} fill="url(#colorCal)" strokeWidth={3} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>
           <div className="space-y-3">
             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Daily Logs</h4>
             <HistoryItem date="12 Mar" cal={2240} pro={165} />
             <HistoryItem date="11 Mar" cal={2510} pro={182} />
             <HistoryItem date="10 Mar" cal={2100} pro={150} />
           </div>
        </div>
      )}

      {/* Edit Targets Modal */}
      {isEditingTargets && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl p-6 flex items-center justify-center animate-in zoom-in-95">
          <div className="w-full max-w-sm bg-dark-gray border border-gray-800 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3"><Target className="text-[#E10600]" size={24} /><h3 className="text-xl font-black text-white">Diet Protocol</h3></div>
            <div className="grid grid-cols-2 gap-4">
              <TargetInput label="Calories" unit="kcal" value={tempTargets.calories} onChange={v => setTempTargets({...tempTargets, calories:v})} />
              <TargetInput label="Protein" unit="g" value={tempTargets.protein} onChange={v => setTempTargets({...tempTargets, protein:v})} />
              <TargetInput label="Carbs" unit="g" value={tempTargets.carbs} onChange={v => setTempTargets({...tempTargets, carbs:v})} />
              <TargetInput label="Fat" unit="g" value={tempTargets.fat} onChange={v => setTempTargets({...tempTargets, fat:v})} />
              <TargetInput label="Water" unit="Cups" value={tempTargets.water} onChange={v => setTempTargets({...tempTargets, water:v})} />
            </div>
            <button onClick={() => {setUser({...user, dietTargets:tempTargets}); setIsEditingTargets(false);}} className="w-full h-14 bg-white text-black font-black uppercase rounded-2xl">Save Protocol</button>
            <button onClick={() => setIsEditingTargets(false)} className="w-full text-xs font-bold text-gray-500 uppercase">Cancel</button>
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl p-6 flex flex-col animate-in fade-in overflow-y-auto">
          <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black text-white">Log Fuel</h2><button onClick={() => setIsAdding(false)} className="text-white"><X size={28} /></button></div>
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input type="text" placeholder="Describe or search..." className="w-full h-16 bg-dark-gray border border-gray-800 rounded-2xl pl-14 pr-16 text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAISearch()} autoFocus />
            <button onClick={handleAISearch} disabled={isAISearching} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#E10600] text-white flex items-center justify-center">{isAISearching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}</button>
          </div>
          {aiResponse && (
            <div className="bg-[#E10600]/10 border border-[#E10600]/20 rounded-2xl p-5 mb-6"><p className="text-sm italic text-gray-300 mb-4">{aiResponse.text}</p><button onClick={() => addFood(aiResponse.suggestedMacros)} className="w-full h-12 bg-white text-black font-black uppercase rounded-xl">Add Estimate</button></div>
          )}
          <div className="space-y-3">
             {INDIAN_FOOD_DATABASE.map((f, i) => (
               <button key={i} onClick={() => addFood(f)} className="w-full bg-dark-gray p-4 rounded-xl border border-gray-800 flex justify-between items-center text-left">
                 <div><p className="font-black text-white text-xs">{f.name}</p><p className="text-[9px] text-gray-500 font-bold uppercase">{f.protein}P • {f.carbs}C • {f.fat}F</p></div>
                 <div className="font-black text-[#E10600] text-sm">{f.calories} KCAL</div>
               </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MacroRow: React.FC<{ label: string; current: number; target: number; color: string }> = ({ label, current, target, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[8px] font-black uppercase text-gray-500"><span>{label}</span><span>{current}g</span></div>
    <div className="h-1 bg-black rounded-full overflow-hidden"><div className={`h-full ${color} transition-all duration-700`} style={{ width: `${Math.min((current / Math.max(1, target)) * 100, 100)}%` }}></div></div>
  </div>
);

const TargetInput: React.FC<{ label: string; unit: string; value: number; onChange: (v: number) => void }> = ({ label, unit, value, onChange }) => (
  <div className="space-y-1"><label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{label} ({unit})</label><input type="number" className="w-full h-12 bg-black border border-gray-800 rounded-xl px-4 text-sm font-black text-white outline-none" value={value} onChange={e => onChange(parseInt(e.target.value) || 0)} /></div>
);

const HistoryItem: React.FC<{ date: string; cal: number; pro: number }> = ({ date, cal, pro }) => (
  <div className="bg-dark-gray/30 p-4 rounded-xl border border-gray-900 flex justify-between items-center"><div className="flex items-center gap-4"><Calendar size={16} className="text-gray-700" /><p className="text-xs font-black text-white">{date}</p></div><div className="text-right"><p className="text-xs font-black text-[#E10600]">{cal} KCAL</p><p className="text-[9px] text-gray-500 font-black uppercase">{pro}G PRO</p></div></div>
);

export default Diet;
