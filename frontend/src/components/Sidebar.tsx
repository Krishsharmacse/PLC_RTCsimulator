import { Activity, ShieldAlert, Cpu, Network, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for formatting classes
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar({ currentTab, setCurrentTab }: { currentTab: string, setCurrentTab: (tab: string) => void }) {
  const navItems = [
    { id: 'overview', label: 'System Overview', icon: Activity },
    { id: 'modbus', label: 'Modbus Monitor', icon: Network },
    { id: 's7comm', label: 'S7Comm Monitor', icon: Cpu },
    { id: 'security', label: 'Security Lab', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-full flex flex-col bg-surface border-r border-white/10">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight">Digital Twin</h1>
          <p className="text-xs text-slate-400">OT Pipeline Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-500")} />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      {/* OT Connection Status */}
      <div className="p-4 m-4 rounded-lg bg-black/20 border border-white/5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Connection</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Modbus</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs text-slate-400">Online</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">S7Comm</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs text-slate-400">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
