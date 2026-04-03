import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout({ children, currentTab, setCurrentTab, demoStatus, onStartDemo }: { 
  children: React.ReactNode, 
  currentTab: string, 
  setCurrentTab: (tab: string) => void,
  demoStatus?: { isRunning: boolean, currentPhase: string },
  onStartDemo?: () => void
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <TopBar demoStatus={demoStatus} onStartDemo={onStartDemo || (() => {})} />
        <main className="flex-1 overflow-auto p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
