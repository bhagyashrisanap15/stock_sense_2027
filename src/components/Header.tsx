import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  User,
  ChevronDown,
  Download,
  Keyboard,
  Menu,
  Wallet,
  CandlestickChart,
  BookOpen
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
  onSelectTab: (tab: ScreenTab) => void;
  userProfile?: UserProfile;
}

const TAB_TITLES: Record<ScreenTab, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Home', subtitle: 'Market Overview' },
  markets: { title: 'Markets', subtitle: 'NSE & BSE Live Tracking' },
  watchlist: { title: 'My Watchlist', subtitle: 'Saved Stocks' },
  'ai-predict': { title: 'AI Insights', subtitle: 'Explainable Price Predictions' },
  portfolio: { title: 'Portfolio', subtitle: 'Holdings & Asset Allocation' },
  learn: { title: 'Learn', subtitle: "Beginner's Academy" },
  'paper-trading': { title: 'Practice Trading', subtitle: '₹10L Virtual Sandbox' },
  'risk-radar': { title: 'Risk Radar', subtitle: 'Volatility & Safety Metrics' },
  screener: { title: 'Stock Finder', subtitle: 'Filter Indian Equities' },
  'technical-analysis': { title: 'Technical Charts', subtitle: 'Indicators & Oscillators' },
  heatmap: { title: 'Sector Heatmap', subtitle: 'Performance by Industry' },
  'news-sentiment': { title: 'Market News', subtitle: 'Live Sentiment Analysis' },
  backtesting: { title: 'Strategy Tester', subtitle: 'Historical Backtesting' },
  overview: { title: 'Market Summary', subtitle: 'Broad Market Trends' },
  profile: { title: 'My Profile', subtitle: 'Account & Trading Settings' }
};

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
  userProfile
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabInfo = TAB_TITLES[currentTab] || { title: 'Dashboard', subtitle: 'StockSense' };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#0c1524]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="w-full px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile Drawer Hamburger & Page Breadcrumb / Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger for mobile slide-out drawer */}
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Open sidebar drawer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-sm min-w-0">
            <span className="font-bold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white tracking-tight truncate">
              {tabInfo.title}
            </span>

            {/* Optional breadcrumb ticker badge */}
            {(currentTab === 'dashboard' || currentTab === 'ai-predict' || currentTab === 'markets' || currentTab === 'technical-analysis') && currentStockTicker && (
              <div className="hidden sm:flex items-center gap-1.5 min-w-0 shrink-0">
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 truncate">
                  NSE: {currentStockTicker}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Search, Export, Bell, Theme, Profile Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            title="Search stocks (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search (⌘K)</span>
          </button>

          {/* Export CSV Button */}
          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              title="Download financial spreadsheet (CSV)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Export</span>
            </button>
          )}

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onNotificationClick}
            title="Price Alerts"
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-2 right-2 ring-2 ring-white dark:ring-[#0c1524]" />
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-teal-600" />
            )}
          </button>

          {/* Profile / Account Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
              title="My Account & Profile"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs border border-teal-200 dark:border-teal-800">
                {userProfile ? userProfile.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-100">
                <div
                  onClick={() => {
                    onSelectTab('profile');
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {userProfile ? userProfile.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {userProfile ? userProfile.name : 'Pooja Bhagwat'}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {userProfile?.accountType || (userProfile?.isGuest ? 'Guest Explorer' : 'Investor (Pro)')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs text-slate-700 dark:text-slate-300">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-semibold text-teal-700 dark:text-teal-300"
                  >
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>My Profile & Demat</span>
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
                    <span>Practice Trading (₹10L)</span>
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
                    {userProfile?.isGuest ? 'Log In / Create Account' : 'Switch Account / Sign In'}
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
