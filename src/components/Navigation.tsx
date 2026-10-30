import React from 'react';
import {
  Home,
  TrendingUp,
  Bookmark,
  Sparkles,
  Wallet,
  Layers,
  User
} from 'lucide-react';
import { ScreenTab } from '../types';

interface NavigationProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  onOpenProfile?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'dashboard' as ScreenTab, label: 'Home', icon: Home },
    { id: 'markets' as ScreenTab, label: 'Markets', icon: TrendingUp },
    { id: 'watchlist' as ScreenTab, label: 'Watchlist', icon: Bookmark },
    { id: 'portfolio' as ScreenTab, label: 'Portfolio', icon: Wallet },
    { id: 'profile' as ScreenTab, label: 'Profile', icon: User }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c1524]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe transition-colors"
    >
      <div className="flex justify-around items-center h-16 px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[48px] py-1 transition-all select-none active:scale-95 touch-manipulation ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                    : 'text-slate-400'
                }`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
              </div>
              <span className="text-[10px] leading-none tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
