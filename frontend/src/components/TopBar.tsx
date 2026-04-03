import { useState, useEffect } from 'react';
import { Bell, Clock, Cpu, Server, Play, Loader2 } from 'lucide-react';

export function TopBar({ demoStatus, onStartDemo }: { 
  demoStatus?: { isRunning: boolean, currentPhase: string },
  onStartDemo: () => void 
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 w-full flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-300">
          <Server className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">Bridge API: Connected</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Nodes: 2 Active</span>
        </div>
        
        {demoStatus?.isRunning && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-campusYellow/20 border border-campusYellow/30 animate-pulse">
            <Loader2 className="w-3 h-3 text-campusYellow animate-spin" />
            <span className="text-[10px] font-bold text-campusYellow uppercase tracking-tighter">
              Demo: {demoStatus.currentPhase}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {!demoStatus?.isRunning && (
          <button 
            onClick={onStartDemo}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-campusYellow text-black text-xs font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
          >
            <Play className="w-3 h-3 fill-current" />
            PLAY DEMO
          </button>
        )}

        <div className="flex items-center gap-2 text-slate-300 ml-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono tracking-wider">{time}</span>
        </div>
        
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-alert"></span>
        </button>
      </div>
    </div>
  );
}
