import React, { useState } from 'react';
import { 
  Terminal, 
  LayoutDashboard, 
  BookOpen, 
  PlayCircle, 
  Code2, 
  Award, 
  Flame, 
  Zap, 
  Menu, 
  X,
  Database
} from 'lucide-react';
import { UserProgress } from '../types/dsa';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  progress: UserProgress;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, progress }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Terminal },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'topics', label: 'DSA Topics', icon: BookOpen },
    { id: 'visualizer', label: 'Visualizer', icon: PlayCircle },
    { id: 'practice', label: 'Practice Arena', icon: Code2 },
    { id: 'progress', label: 'My Progress', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <button 
            onClick={() => setActiveTab('landing')} 
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-white font-mono">CODE LEAGUE</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                  DSA Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Learn Algorithms. Visualize Logic. Master Code.
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats Badges */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak */}
            <div 
              title="Daily Learning Streak"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{progress.streakDays}d Streak</span>
            </div>

            {/* Total XP */}
            <div 
              title="Total Earned XP"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold"
            >
              <Zap className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
              <span>{progress.totalXP} XP</span>
            </div>

            {/* Storage Mode indicator */}
            <div 
              title="Data is saved locally in browser storage (persistent offline)"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-400 text-[11px]"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>Local Storage</span>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-violet-500/10 text-violet-300 text-xs font-bold sm:hidden">
              <Zap className="w-3 h-3 text-violet-400" />
              <span>{progress.totalXP}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F172A] border-b border-slate-800 px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-semibold">{progress.streakDays} Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-violet-300 font-semibold">{progress.totalXP} XP</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
