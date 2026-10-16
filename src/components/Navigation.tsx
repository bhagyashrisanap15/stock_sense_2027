import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  BrainCircuit,
  ShieldAlert,
  Bookmark,
  Wallet,
  CandlestickChart
} from 'lucide-react';
import { ScreenTab } from '../types';

interface NavigationProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as ScreenTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'markets' as ScreenTab, label: 'Markets', icon: TrendingUp },
    { id: 'ai-predict' as ScreenTab, label: 'AI Insights', icon: BrainCircuit },
    { id: 'risk-radar' as ScreenTab, label: 'Risk Radar', icon: ShieldAlert },
    { id: 'watchlist' as ScreenTab, label: 'Watchlist', icon: Bookmark },
    { id: 'portfolio' as ScreenTab, label: 'Portfolio', icon: Wallet },
    { id: 'paper-trading' as ScreenTab, label: 'Simulator', icon: CandlestickChart }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-[#051424]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.35)] border-t border-[#1c2b3c]">
      <div className="flex justify-around items-center h-16 px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-12 transition-all relative select-none ${
                isActive ? 'text-[#38bdf8] font-semibold' : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-7 h-0.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 text-[#38bdf8]' : 'text-[#8c909f]'
                }`}
              />
              <span className="text-[10px] leading-none tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
