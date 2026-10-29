import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  User,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Bookmark,
  Wallet,
  BookOpen,
  SlidersHorizontal,
  CandlestickChart,
  ShieldAlert,
  Activity,
  Grid3X3,
  Newspaper,
  Cpu,
  Download,
  LogOut,
  ExternalLink,
  Keyboard,
  Layers,
  Home
} from 'lucide-react';
import { ScreenTab } from '../types';

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
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  onNotificationClick,
  onExportCSV,
  onOpenShortcuts,
  theme,
  toggleTheme,
  currentTab,
  currentStockTicker = 'RELIANCE',
  onSelectTab
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);

  const moreToolsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreToolsRef.current && !moreToolsRef.current.contains(e.target as Node)) {
        setIsMoreToolsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary desktop navigation tabs
  const primaryTabs: { id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
    { id: 'ai-predict', label: 'AI Insights', icon: Sparkles },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'learn', label: 'Learn', icon: BookOpen }
  ];

  // Secondary tools in "More Tools" dropdown
  const secondaryTools = [
    { id: 'paper-trading' as ScreenTab, label: 'Practice Trading', desc: '₹10L virtual money simulator', icon: CandlestickChart },
    { id: 'risk-radar' as ScreenTab, label: 'Risk & Safety Meter', desc: 'Downside volatility checks', icon: ShieldAlert },
    { id: 'screener' as ScreenTab, label: 'Stock Finder', desc: 'Filter 500+ Indian companies', icon: SlidersHorizontal },
    { id: 'technical-analysis' as ScreenTab, label: 'Technical Charts', desc: 'RSI, MACD & 200 SMA', icon: Activity },
    { id: 'heatmap' as ScreenTab, label: 'Sector Heatmap', desc: 'Visual market performance', icon: Grid3X3 },
    { id: 'news-sentiment' as ScreenTab, label: 'Market News', desc: 'Live headlines & sentiment', icon: Newspaper },
    { id: 'backtesting' as ScreenTab, label: 'Strategy Tester', desc: 'Historical performance simulation', icon: Cpu }
  ];

  const isSecondaryActive = secondaryTools.some((t) => t.id === currentTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0c1524]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          {/* Brand Logo */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                StockSense
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium tracking-wide mt-0.5">
                AI Market Guide
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* More Tools Dropdown */}
            <div className="relative" ref={moreToolsRef}>
              <button
                onClick={() => setIsMoreToolsOpen(!isMoreToolsOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSecondaryActive || isMoreToolsOpen
                    ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>More Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreToolsOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Secondary Tools
                  </div>
                  {secondaryTools.map((tool) => {
                    const ToolIcon = tool.icon;
                    const isActive = currentTab === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onSelectTab(tool.id);
                          setIsMoreToolsOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors ${
                          isActive
                            ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <ToolIcon className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold">{tool.label}</span>
                          <span className="text-[11px] text-slate-400 truncate">{tool.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Search, Export, Bell, Theme, Profile */}
        <div className="flex items-center gap-2">
          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search (⌘K)</span>
          </button>

          {/* Export CSV Button */}
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              title="Download financial spreadsheet (CSV)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Export</span>
            </button>
          )}

          {/* Notifications Bell */}
          <button
            onClick={onNotificationClick}
            title="Price Alerts"
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-2 right-2 ring-2 ring-white dark:ring-[#0c1524]" />
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
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
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs border border-teal-200 dark:border-teal-800">
                P
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 flex flex-col gap-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    P
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      Pooja Bhagwat
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      poojabhagwat2525@gmail.com
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs text-slate-700 dark:text-slate-300">
                  <button
                    onClick={() => {
                      onSelectTab('portfolio');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Wallet className="w-3.5 h-3.5 text-teal-600" />
                    <span>My Portfolio Holdings</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('paper-trading');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <CandlestickChart className="w-3.5 h-3.5 text-teal-600" />
                    <span>Practice Trading (₹10L Virtual)</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('learn');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Beginner's Academy</span>
                  </button>

                  {onOpenShortcuts && (
                    <button
                      onClick={() => {
                        onOpenShortcuts();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Keyboard Shortcuts (?)</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-center transition-colors"
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
