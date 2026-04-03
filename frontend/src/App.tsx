import { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { ShieldAlert, Activity, WifiOff, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

interface DeviceData {
  id: string;
  name: string;
  type: string;
  protocol: string;
  status: string;
  data: any;
}

interface DemoStatus {
  isRunning: boolean;
  currentPhase: string;
}

const Overview = ({ devices }: { devices: DeviceData[] }) => (
  <div className="flex flex-col gap-6 h-full animate-in fade-in duration-500">
    <div className="glass-panel p-6">
      <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Industrial Environment Topography</h2>
      <p className="text-slate-400 text-sm">Real-time telemetry from Level 0/1 assets.</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
      {devices.map(device => (
        <div key={device.id} className="glass-panel p-6 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className={`absolute top-0 left-0 w-1 h-full ${device.status === 'Attacked' ? 'bg-alert animate-pulse' : 'bg-primary'}`}></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{device.name}</h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                <span className="uppercase tracking-[0.2em] font-bold">{device.protocol}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="font-medium">{device.type} Asset</span>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 ${
              device.status === 'Attacked' 
                ? 'bg-alert/20 text-alert border border-alert/30' 
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}>
              {device.status === 'Attacked' ? <ShieldAlert className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
              {device.status}
            </div>
          </div>
          
          <div className="bg-black/40 rounded-xl border border-white/5 p-5 grid grid-cols-2 gap-4">
            {device.protocol === 'Modbus' && device.data.registers && (
               <>
                 <div>
                   <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">MW 40001</div>
                   <div className="text-2xl font-mono font-bold text-white tabular-nums">{device.data.registers[0]}</div>
                 </div>
                 <div>
                   <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">I/O Coils</div>
                   <div className="text-2xl font-mono font-bold text-white">
                     {device.data.coils.filter((c: boolean) => c).length}<span className="text-slate-600 text-sm ml-1">/ {device.data.coils.length}</span>
                   </div>
                 </div>
               </>
            )}
            
            {device.protocol === 'S7Comm' && device.data && (
               <>
                 <div>
                   <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Rotational Speed</div>
                   <div className={`text-2xl font-mono font-bold tabular-nums transition-colors ${device.data.speed > 100 ? 'text-campusYellow' : 'text-white'}`}>
                     {device.data.speed.toFixed(1)} <span className="text-xs font-sans text-slate-500 ml-1">km/h</span>
                   </div>
                 </div>
                 <div>
                   <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Thermal Load</div>
                   <div className={`text-2xl font-mono font-bold tabular-nums transition-colors ${device.data.temp > 40 ? 'text-alert' : 'text-white'}`}>
                     {device.data.temp.toFixed(1)} <span className="text-xs font-sans text-slate-500 ml-1">°C</span>
                   </div>
                 </div>
               </>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ModbusMonitor = ({ device }: { device?: DeviceData }) => {
  if (!device) return <div className="text-slate-500 p-8">Initializing sequence...</div>;
  
  return (
    <div className="glass-panel p-8 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
          Modbus <span className="text-primary not-italic tracking-normal font-light ml-2">TCP Controller</span>
        </h2>
        <div className="h-0.5 w-12 bg-primary"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 shadow-inner">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Output Coils (0x)</h3>
            <span className="text-[10px] text-primary/60 font-mono italic">RW Access Established</span>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {device.data.coils.map((state: boolean, i: number) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                  state 
                    ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                    : 'border-slate-800 bg-slate-900/50'
                }`}>
                  <span className={`text-sm font-mono font-black ${state ? 'text-white' : 'text-slate-700'}`}>{i}</span>
                </div>
                <div className={`h-1.5 w-8 rounded-full ${state ? 'bg-primary animate-pulse' : 'bg-slate-800'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 shadow-inner">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Registers (4x)</h3>
            <span className="text-[10px] text-slate-600 font-mono">16-bit Unsigned Integer</span>
          </div>
          <div className="space-y-4">
            {device.data.registers.map((val: number, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors">
                <div className="flex flex-col gap-0.5">
                   <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Add: 4000{i + 1}</span>
                </div>
                <span className={`font-mono text-2xl font-bold tabular-nums transition-colors ${val > 500 ? 'text-alert' : 'text-white'}`}>
                  {val.toString().padStart(4, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const S7CommMonitor = ({ device }: { device?: DeviceData }) => {
  if (!device) return <div className="text-slate-500 p-8">Synchronizing S7 Protocol...</div>;

  return (
    <div className="glass-panel p-8 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
          S7Comm <span className="text-secondary not-italic tracking-normal font-light ml-2">RTU Diagnostics</span>
        </h2>
        <div className="h-0.5 w-12 bg-secondary"></div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(device.data).map(([key, val]) => (
          <div key={key} className="bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-secondary/30 transition-all shadow-inner">
            <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-4">{key}</div>
            <div className="text-4xl font-mono font-bold tracking-tight mb-2">
              {typeof val === 'number' ? val.toFixed(key === 'vibration' ? 3 : 1) : String(val)}
            </div>
            <div className="flex gap-1">
               <div className="w-1 h-1 rounded-full bg-secondary"></div>
               <div className="w-1 h-1 rounded-full bg-secondary animate-pulse delay-75"></div>
               <div className="w-1 h-1 rounded-full bg-secondary delay-150"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SecurityLab = ({ triggerAttack, resetSystem, isAttacked }: { triggerAttack: () => void, resetSystem: () => void, isAttacked: boolean }) => (
  <div className={`glass-panel p-8 h-full flex flex-col transition-all duration-700 ${isAttacked ? 'border-alert shadow-[inset_0_0_100px_rgba(239,68,68,0.15)] bg-alert/[0.02]' : 'border-white/10'}`}>
    <div className="mb-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${isAttacked ? 'bg-alert text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
          <ShieldAlert className={isAttacked ? 'animate-shake' : ''} />
        </div>
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Security Lab</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Attack Simulation Environment</p>
        </div>
      </div>
      {isAttacked && (
        <div className="flex items-center gap-2 px-4 py-2 bg-alert text-white font-black text-[10px] italic skew-x-[-12deg] animate-pulse">
           THREAT DETECTED: FDI ATTACK ACTIVE
        </div>
      )}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
      <div className="bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col shadow-2xl">
         <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-[0.3em]">Attack Configuration</h3>
         <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">
           Injecting malicious Modbus ADUs to manipulate process variables. This demonstration overwrites Level-1 setpoints to induce physical instability in the control loop.
         </p>
         
         <div className="space-y-4 mt-auto">
           <button 
             onClick={triggerAttack}
             disabled={isAttacked}
             className="w-full py-5 rounded-2xl bg-alert hover:bg-red-500 text-white font-black tracking-[0.2em] uppercase transition-all disabled:opacity-30 disabled:grayscale shadow-xl shadow-alert/20 active:scale-95 italic"
           >
             Inject False Data
           </button>
           <button 
             onClick={resetSystem}
             disabled={!isAttacked}
             className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold tracking-widest uppercase transition-all border border-white/5 disabled:opacity-0"
           >
             Countermeasure: Reset
           </button>
         </div>
      </div>
      
      <div className="bg-black border border-white/10 rounded-3xl p-8 font-mono text-sm overflow-hidden flex flex-col relative shadow-2xl">
         <div className="flex items-center gap-2 text-slate-600 mb-6 text-[10px] font-bold uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            Real-time SIEM Log
         </div>
         
         <div className="flex-1 overflow-auto text-[11px] space-y-3 pb-8 custom-scrollbar">
            <div className="text-slate-600">[{new Date().toLocaleTimeString()}] MONITOR: S7 Station ID: 0x01 reports normal cycle timing.</div>
            {isAttacked && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-alert mt-4 bg-alert/10 p-2 border-l-2 border-alert">
                   [{new Date().toLocaleTimeString()}] ALERT: TCP Handshake anomaly on port 502
                </div>
                <div className="text-alert font-bold pl-3 italic">
                   [{new Date().toLocaleTimeString()}] CRITICAL: CVE-2021-34563 - PLC Register Overflow
                </div>
                <div className="text-white/60 pl-3">
                   &gt; source: 192.168.1.104
                   <br/>
                   &gt; target: PLC_01 (192.168.1.50)
                   <br/>
                   &gt; payload: reg(40001).val(999)
                </div>
                <div className="text-alert bg-alert/20 p-4 rounded-xl mt-4 border border-alert/30 font-bold leading-relaxed shadow-lg">
                  SCADA HMI DISCONNECTED. PROCESS VARIABLES EXCEEDING TOLERANCE.
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  </div>
);

function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [demoStatus, setDemoStatus] = useState<DemoStatus>({ isRunning: false, currentPhase: 'IDLE' });

  const fetchData = useCallback(async () => {
    try {
      const deviceRes = await fetch('http://localhost:8000/api/devices');
      if (deviceRes.ok) {
        setDevices(await deviceRes.json());
        setIsConnected(true);
      }
      
      const statsRes = await fetch('http://localhost:8000/api/stats');
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setDemoStatus(stats.demo || { isRunning: false, currentPhase: 'IDLE' });
      }
    } catch (e) {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const triggerAttack = async () => {
    await fetch('http://localhost:8000/api/attack/simulate', { method: 'POST' });
    fetchData();
  };

  const resetSystem = async () => {
    await fetch('http://localhost:8000/api/attack/reset', { method: 'POST' });
    fetchData();
  };

  const startDemo = async () => {
    await fetch('http://localhost:8000/api/demo/start', { method: 'POST' });
    fetchData();
  };

  const modbusDevice = devices.find(d => d.protocol === 'Modbus');
  const s7commDevice = devices.find(d => d.protocol === 'S7Comm');
  const isAttacked = modbusDevice?.status === 'Attacked';

  const renderContent = () => {
    if (!isConnected && devices.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
          <WifiOff className="w-12 h-12 text-slate-600 animate-pulse" />
          <p className="font-mono text-sm tracking-widest uppercase">BRIDGE API OFFLINE</p>
          <code className="text-[10px] bg-white/5 px-2 py-1 rounded">awaiting handshake...</code>
        </div>
      );
    }

    switch (currentTab) {
      case 'overview': return <Overview devices={devices} />;
      case 'modbus': return <ModbusMonitor device={modbusDevice} />;
      case 's7comm': return <S7CommMonitor device={s7commDevice} />;
      case 'security': return <SecurityLab triggerAttack={triggerAttack} resetSystem={resetSystem} isAttacked={isAttacked} />;
      default: return <Overview devices={devices} />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-white selection:bg-campusYellow selection:text-black">
      <Layout 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        demoStatus={demoStatus}
        onStartDemo={startDemo}
      >
        {renderContent()}
      </Layout>

      {/* Demo Overlay */}
      {demoStatus.isRunning && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 px-10 py-5 bg-black/95 border-2 border-campusYellow rounded-[2rem] shadow-[0_0_100px_rgba(250,204,21,0.2)] animate-in slide-in-from-bottom-20 zoom-in-95 duration-500">
          <div className="flex flex-col">
            <span className="text-[10px] text-campusYellow font-black uppercase tracking-[0.4em] mb-1">Live Demo Environment</span>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-white/5">
                {demoStatus.currentPhase.includes('ATTACK') ? (
                  <ShieldAlert className="w-8 h-8 text-alert animate-shake" />
                ) : demoStatus.currentPhase.includes('ANOMALY') ? (
                  <AlertTriangle className="w-8 h-8 text-campusYellow animate-pulse" />
                ) : demoStatus.currentPhase.includes('RECOVERY') ? (
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                ) : (
                  <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
                )}
              </div>
              <div>
                <h4 className="text-2xl font-black text-white italic tracking-tight">{demoStatus.currentPhase}</h4>
              </div>
            </div>
          </div>
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-campusYellow to-transparent w-2/3 animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
