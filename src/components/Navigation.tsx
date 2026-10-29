import React from 'react';
import {
  Home,
  TrendingUp,
  Bookmark,
  Sparkles,
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
  onTabChange,
  onOpenProfile
}) => {
  const tabs = [
    { id: 'dashboard' as ScreenTab, label: 'Home', icon: Home },
    { id: 'markets' as ScreenTab, label: 'Markets', icon: TrendingUp },
    { id: 'watchlist' as ScreenTab, label: 'Watchlist', icon: Bookmark },
    { id: 'ai-predict' as ScreenTab, label: 'AI Insights', icon: Sparkles },
    { id: 'learn' as ScreenTab, label: 'Learn', icon: Layers }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0c1524]/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 shadow-lg pb-safe">
      <div className="flex justify-around items-center h-14 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all select-none ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 text-teal-600 dark:text-teal-400' : 'text-slate-400'
                }`}
              />
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
