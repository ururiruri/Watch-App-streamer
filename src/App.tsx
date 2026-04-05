/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Mic, 
  MicOff, 
  Music, 
  Gamepad2, 
  LayoutGrid, 
  ShieldAlert, 
  Zap, 
  Moon, 
  MessageSquare, 
  Play, 
  Pause, 
  Wifi, 
  Battery,
  Bell,
  X,
  AlertTriangle,
  Users,
  Cpu,
  HardDrive,
  Volume2,
  Tv,
  Monitor,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Screen = 'dashboard' | 'mixer' | 'scenes' | 'notifications' | 'panic';

interface StreamStats {
  fps: number;
  cpu: number;
  uptime: number;
  isLive: boolean;
  bitrate: string;
  droppedFrames: number;
  viewers: number;
}

interface NotificationItem {
  id: string;
  category: 'technical' | 'social' | 'system';
  title: string;
  message: string;
  time: string;
  urgent?: boolean;
}

// --- Constants ---
const COLORS = {
  bg: '#09090b',
  primary: '#a855f7', // Purple
  secondary: '#22d3ee', // Cyan
  danger: '#ef4444', // Red
  warning: '#f59e0b', // Amber
  zinc: {
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  }
};

// --- Helper Components ---

const WatchFrame = ({ children, activeScreen, setActiveScreen }: { 
  children: React.ReactNode, 
  activeScreen: Screen, 
  setActiveScreen: (s: Screen) => void 
}) => (
  <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-4">
    <div className="relative w-[320px] h-[380px] bg-black rounded-[50px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-zinc-700/50">
      {/* Status Bar - Fixed at top of watch face */}
      <div className="absolute top-0 left-0 right-0 h-8 px-8 flex justify-between items-center z-50 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <Wifi size={10} className="text-zinc-500" />
          <span className="text-[10px] font-medium text-zinc-500">LTE</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-medium text-zinc-500">10:42</span>
          <Battery size={10} className="text-zinc-500 rotate-90" />
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="absolute inset-0 pt-8 pb-12 overflow-y-auto scrollbar-hide">
        {children}
      </div>

      {/* Bottom Navigation - Fixed at bottom of watch face */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/90 backdrop-blur-xl flex items-center border-t border-zinc-800/50 z-50">
        <NavButton 
          active={activeScreen === 'dashboard'} 
          onClick={() => setActiveScreen('dashboard')} 
          icon={Activity} 
          color={COLORS.primary} 
        />
        <NavButton 
          active={activeScreen === 'mixer'} 
          onClick={() => setActiveScreen('mixer')} 
          icon={Mic} 
          color={COLORS.secondary} 
        />
        <NavButton 
          active={activeScreen === 'scenes'} 
          onClick={() => setActiveScreen('scenes')} 
          icon={LayoutGrid} 
          color="#fbbf24" 
        />
        <NavButton 
          active={activeScreen === 'notifications'} 
          onClick={() => setActiveScreen('notifications')} 
          icon={Bell} 
          color="#10b981" 
        />
        <NavButton 
          active={activeScreen === 'panic'} 
          onClick={() => setActiveScreen('panic')} 
          icon={ShieldAlert} 
          color={COLORS.danger} 
        />
      </div>
    </div>
  </div>
);

const NavButton = ({ active, onClick, icon: Icon, color }: { active: boolean, onClick: () => void, icon: any, color: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center h-full transition-all duration-300 ${active ? 'scale-110' : 'opacity-40 grayscale'}`}
    style={{ color: active ? color : '#71717a' }}
  >
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
  </button>
);

// --- Main Screens ---

const Dashboard = ({ stats }: { stats: StreamStats }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col p-4 gap-3 min-h-[450px]">
      {/* Live Status */}
      <div className="bg-zinc-900/50 rounded-2xl p-3 border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${stats.isLive ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-zinc-600'}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {stats.isLive ? 'Live' : 'Offline'}
          </span>
        </div>
        <span className="text-sm font-mono font-bold text-white tracking-tight">
          {formatTime(stats.uptime)}
        </span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`bg-zinc-900/50 rounded-2xl p-3 border ${stats.fps < 50 ? 'border-red-500 animate-pulse' : 'border-zinc-800'}`}>
          <div className="text-[8px] font-bold text-zinc-500 uppercase mb-1">FPS</div>
          <div className={`text-xl font-bold ${stats.fps < 50 ? 'text-red-500' : 'text-cyan-400'}`}>{stats.fps}</div>
        </div>
        <div className="bg-zinc-900/50 rounded-2xl p-3 border border-zinc-800">
          <div className="text-[8px] font-bold text-zinc-500 uppercase mb-1">CPU</div>
          <div className="text-xl font-bold text-purple-400">{stats.cpu}%</div>
        </div>
      </div>

      {/* Secondary Stats (Scroll to see) */}
      <div className="space-y-2">
        <div className="bg-zinc-900/30 rounded-2xl p-3 border border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={12} className="text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Viewers</span>
          </div>
          <span className="text-xs font-bold text-white">{stats.viewers}</span>
        </div>
        <div className="bg-zinc-900/30 rounded-2xl p-3 border border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Bitrate</span>
          </div>
          <span className="text-xs font-bold text-cyan-400">{stats.bitrate}</span>
        </div>
        <div className="bg-zinc-900/30 rounded-2xl p-3 border border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={12} className="text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Dropped</span>
          </div>
          <span className="text-xs font-bold text-red-400">{stats.droppedFrames}</span>
        </div>
      </div>

      {/* Swipe Indicator */}
      <div className="mt-4 flex flex-col items-center gap-1 opacity-20">
        <span className="text-[8px] font-bold uppercase tracking-widest">Scroll for more</span>
        <div className="w-1 h-4 bg-zinc-500 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

const Mixer = () => {
  const [sources, setSources] = useState([
    { id: 'game', label: 'Game', vol: 75, icon: Gamepad2, color: '#22d3ee' },
    { id: 'music', label: 'Music', vol: 40, icon: Music, color: '#a855f7' },
    { id: 'discord', label: 'Discord', vol: 60, icon: MessageSquare, color: '#6366f1' },
    { id: 'alerts', label: 'Alerts', vol: 90, icon: Bell, color: '#fbbf24' },
    { id: 'browser', label: 'Browser', vol: 30, icon: Monitor, color: '#f472b6' },
  ]);
  const [isMuted, setIsMuted] = useState(false);

  const updateVol = (id: string, val: number) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, vol: val } : s));
  };

  return (
    <div className="flex flex-col p-4 gap-4 min-h-[600px]">
      <div className="space-y-3">
        {sources.map(source => (
          <div key={source.id} className="bg-zinc-900/50 rounded-2xl p-3 border border-zinc-800 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <source.icon size={12} style={{ color: source.color }} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{source.label}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-white">{source.vol}%</span>
            </div>
            <div className="h-6 bg-zinc-950 rounded-full relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 transition-all duration-300"
                style={{ width: `${source.vol}%`, backgroundColor: source.color, opacity: 0.3 }}
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={source.vol} 
                onChange={(e) => updateVol(source.id, parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Master Mute (Sticky-like at bottom of scroll) */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border-2 mt-4 ${
          isMuted 
            ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
        }`}
      >
        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        <span className="text-xs font-bold uppercase tracking-widest">
          {isMuted ? 'Muted' : 'Active'}
        </span>
      </button>
    </div>
  );
};

const Scenes = () => {
  const [currentScene, setScene] = useState('game');
  const scenes = [
    { id: 'start', label: 'Inicio', icon: Play, color: '#22d3ee' },
    { id: 'game', label: 'Juego', icon: Gamepad2, color: '#a855f7' },
    { id: 'chat', label: 'Charla', icon: MessageSquare, color: '#fbbf24' },
    { id: 'pause', label: 'Pausa', icon: Pause, color: '#f472b6' },
    { id: 'brb', label: 'BRB', icon: Activity, color: '#10b981' },
    { id: 'end', label: 'Final', icon: X, color: '#ef4444' },
  ];

  return (
    <div className="flex flex-col p-4 gap-4 min-h-[500px]">
      <div className="grid grid-cols-2 gap-2">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setScene(scene.id)}
            className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border ${
              currentScene === scene.id 
                ? 'bg-zinc-800 border-white/20 shadow-lg' 
                : 'bg-zinc-900/50 border-zinc-800 opacity-60'
            }`}
          >
            <scene.icon size={20} style={{ color: currentScene === scene.id ? scene.color : '#71717a' }} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentScene === scene.id ? 'text-white' : 'text-zinc-600'}`}>
              {scene.label}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2 mt-2">
        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest px-1">Ambiente</span>
        <div className="flex gap-2">
          <button className="flex-1 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center gap-2 active:scale-95 text-purple-400">
            <Zap size={14} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Stream</span>
          </button>
          <button className="flex-1 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center gap-2 active:scale-95 text-cyan-400">
            <Moon size={14} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Rest</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const notifications: NotificationItem[] = [
    { id: '1', category: 'social', title: 'New Sub', message: 'CyberPunk_77 subscribed for 6 months!', time: '2m' },
    { id: '2', category: 'technical', title: 'Bitrate Drop', message: 'Bitrate dropped below 4500kbps', time: '5m', urgent: true },
    { id: '3', category: 'system', title: 'OBS Status', message: 'Encoder overload detected', time: '12m', urgent: true },
    { id: '4', category: 'social', title: 'Donation', message: 'NeonVibes donated $50.00', time: '15m' },
    { id: '5', category: 'technical', title: 'Dropped Frames', message: '0.5% frames dropped in last 5min', time: '20m' },
    { id: '6', category: 'system', title: 'Update', message: 'OBS 30.1.0 available for download', time: '1h' },
  ];

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'technical': return <Activity size={14} className="text-cyan-400" />;
      case 'social': return <Users size={14} className="text-purple-400" />;
      case 'system': return <Settings size={14} className="text-zinc-400" />;
      default: return <Bell size={14} />;
    }
  };

  return (
    <div className="flex flex-col p-4 gap-3 min-h-[600px]">
      <div className="flex justify-between items-end mb-1 px-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Alert Center</h2>
        <button className="text-[8px] font-bold text-purple-400 uppercase">Clear All</button>
      </div>
      
      <div className="space-y-2">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`bg-zinc-900/50 rounded-2xl p-3 border transition-all active:scale-95 ${
              notif.urgent ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-800'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                {getIcon(notif.category)}
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">{notif.title}</span>
              </div>
              <span className="text-[8px] font-bold text-zinc-600">{notif.time}</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PanicMode = ({ onPanic, isPanic }: { onPanic: () => void, isPanic: boolean }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-red-950/20">
      <motion.button
        animate={isPanic ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        onClick={onPanic}
        className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 transition-all active:scale-90 border-4 shadow-2xl ${
          isPanic 
            ? 'bg-red-600 border-white text-white shadow-red-500/50' 
            : 'bg-zinc-900 border-red-500 text-red-500 shadow-red-500/20'
        }`}
      >
        <ShieldAlert size={48} />
        <span className="text-[10px] font-black uppercase tracking-tighter">Panic Mode</span>
      </motion.button>
      
      <div className="mt-6 text-center">
        <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] animate-pulse">
          {isPanic ? 'System Locked' : 'Ready to Kill'}
        </p>
        <p className="text-[8px] text-zinc-500 mt-1 uppercase tracking-widest">
          Cuts Cam & Mic Instantly
        </p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [stats, setStats] = useState<StreamStats>({
    fps: 60,
    cpu: 12,
    uptime: 0,
    isLive: true,
    bitrate: '6000 kbps',
    droppedFrames: 0,
    viewers: 1242
  });
  const [isPanic, setIsPanic] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        uptime: prev.isLive ? prev.uptime + 1 : prev.uptime,
        fps: Math.floor(Math.random() * (62 - 58) + 58),
        cpu: Math.floor(Math.random() * (18 - 10) + 10),
        viewers: prev.viewers + (Math.random() > 0.5 ? 1 : -1)
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <Dashboard stats={stats} />;
      case 'mixer': return <Mixer />;
      case 'scenes': return <Scenes />;
      case 'notifications': return <Notifications />;
      case 'panic': return <PanicMode onPanic={() => setIsPanic(!isPanic)} isPanic={isPanic} />;
    }
  };

  return (
    <WatchFrame activeScreen={activeScreen} setActiveScreen={setActiveScreen}>
      <div className="h-full relative font-sans text-white select-none">
        {/* Screen Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {/* Global Panic Overlay */}
        {isPanic && activeScreen !== 'panic' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-red-600/20 pointer-events-none border-4 border-red-600 animate-pulse z-[100]"
          />
        )}
      </div>
    </WatchFrame>
  );
}
