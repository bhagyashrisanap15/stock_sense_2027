import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Download,
  User,
  ChevronDown,
  Wallet,
  BookOpen,
  Keyboard,
  CandlestickChart
} from 'lucide-react';
import { ScreenTab, UserProfile } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onNotificationClick: () => void;
  onExportCSV?: () => void;
  onOpenShortcuts?: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onToggleMobileMenu?: () => void;
  currentTab: ScreenTab;
  currentStockTicker?: string;
  onSelectTab?: (tab: ScreenTab) => void;
  currentUser?: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  onNotificationClick,
  onExportCSV,
  onOpenShortcuts,
  theme,
  toggleTheme,
  onToggleMobileMenu,
  currentTab,
  currentStockTicker = 'RELIANCE',
  onSelectTab,
  currentUser
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map tab IDs to clean, human-readable breadcrumb titles
  const tabTitles: Record<ScreenTab, string> = {
    'dashboard': 'Home Dashboard',
    'markets': 'Markets Today',
    'watchlist': 'My Watchlist',
    'ai-predict': 'AI Stock Insights',
    'portfolio': 'Portfolio & Investments',
    'learn': 'Learning Academy',
    'paper-trading': 'Practice Trading',
    'risk-radar': 'Risk & Safety Meter',
    'screener': 'Stock Finder',
    'technical-analysis': 'Technical Charts',
    'heatmap': 'Sector Heatmap',
    'news-sentiment': 'Market News',
    'backtesting': 'Strategy Tester',
    'overview': 'Market Summary',
    'profile': 'Investor Profile & Settings'
  };

  const activePageTitle = tabTitles[currentTab] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/95 dark:bg-[#0c1524]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Drawer Trigger + Breadcrumb trail (NO horizontal navigation links, NO duplicate logo) */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title="Open navigation menu"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0 select-none">
            <span className="hidden sm:inline font-medium text-slate-500 dark:text-slate-400">
              StockSense
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>
            <span className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-xs">
              {activePageTitle}
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[11px] font-mono font-semibold text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
              Active: <strong>{currentStockTicker}</strong>
            </span>
          </div>
        </div>

        {/* Right: Global Search, Export, Notifications, Theme Toggle, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium transition-all group cursor-pointer"
            title="Search stocks (⌘K)"
            aria-label="Search stocks"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
            <span className="hidden md:inline">Search stocks...</span>
            <span className="md:hidden">Search</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 text-slate-500 rounded border border-slate-200 dark:border-slate-800">
              ⌘K
            </kbd>
          </button>

          {/* Export CSV Button */}
          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all group cursor-pointer"
              title="Download financial spreadsheet (CSV)"
              aria-label="Export data to CSV"
            >
              <Download className="w-3.5 h-3.5 text-teal-600 group-hover:scale-105 transition-transform" />
              <span>Export</span>
            </button>
          )}

          {/* Notifications Bell (Price Alerts) */}
          <button
            type="button"
            onClick={onNotificationClick}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors relative cursor-pointer"
            title="Price Alerts & Signals"
            aria-label="Price Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-2 right-2 ring-2 ring-white dark:ring-[#0c1524]" />
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-teal-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* User Profile Dropdown Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
              aria-label="Account menu"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs border border-teal-200 dark:border-teal-800">
                {currentUser?.avatarInitials || 'P'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    {currentUser?.avatarInitials || 'P'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {currentUser?.name || 'Pooja Bhagwat'}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {currentUser?.email || 'poojabhagwat2525@gmail.com'}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                      {currentUser?.accountType || 'Investor (Pro Member)'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs text-slate-700 dark:text-slate-300">
                  {onSelectTab && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('profile');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-teal-600" />
                        <span>My Investor Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('portfolio');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Wallet className="w-3.5 h-3.5 text-teal-600" />
                        <span>My Portfolio Holdings</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('paper-trading');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <CandlestickChart className="w-3.5 h-3.5 text-teal-600" />
                        <span>Practice Trading Simulator</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('learn');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                        <span>Beginner's Academy</span>
                      </button>
                    </>
                  )}

                  {onOpenShortcuts && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenShortcuts();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Keyboard Shortcuts (?)</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAuth();
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    Account Settings / Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
