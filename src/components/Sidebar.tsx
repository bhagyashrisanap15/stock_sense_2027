import React from 'react';
import {
  BrainCircuit,
  LayoutDashboard,
  TrendingUp,
  ShieldAlert,
  Bookmark,
  Wallet,
  CandlestickChart,
  Cpu,
  Grid3X3,
  SlidersHorizontal,
  Newspaper,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { ScreenTab } from '../types';

interface SidebarProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: ScreenTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isPrimary?: boolean;
  group?: 'core' | 'portfolio' | 'analytics';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navItems: NavItem[] = [
    // Core Navigation
    { id: 'ai-predict', label: 'AI Predictions', icon: BrainCircuit, badge: 'AI GUIDE', isPrimary: true, group: 'core' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'core' },
    { id: 'markets', label: 'Live Markets', icon: TrendingUp, group: 'core' },

    // Portfolio & Analytics
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, group: 'portfolio' },
    { id: 'portfolio', label: 'My Portfolio', icon: Wallet, group: 'portfolio' },
    { id: 'paper-trading', label: 'Practice Trading', icon: CandlestickChart, badge: 'FREE CASH', group: 'portfolio' },

    // Analytics & Research
    { id: 'risk-radar', label: 'Risk & Safety Meter', icon: ShieldAlert, group: 'analytics' },
    { id: 'screener', label: 'Stock Finder', icon: SlidersHorizontal, group: 'analytics' },
    { id: 'technical-analysis', label: 'Price Trends & Charts', icon: Activity, group: 'analytics' },
    { id: 'heatmap', label: 'Sector Heatmap', icon: Grid3X3, group: 'analytics' },
    { id: 'news-sentiment', label: 'News & Sentiment', icon: Newspaper, group: 'analytics' },
    { id: 'backtesting', label: 'Strategy Tester', icon: Cpu, badge: 'TEST', group: 'analytics' }
  ];

  const handleSelectTab = (tab: ScreenTab) => {
    onTabChange(tab);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const renderNavList = () => (
    <div className="flex flex-col gap-1 px-2.5 py-2">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        const prevGroup = index > 0 ? navItems[index - 1].group : null;
        const isNewGroup = prevGroup && prevGroup !== item.group;

        return (
          <React.Fragment key={item.id}>
            {isNewGroup && (
              <div className="my-1.5 mx-2 border-t border-[#14233c]/80" />
            )}
            <div className="relative group/navitem">
              <button
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-lg text-left text-[13px] font-medium transition-all duration-150 relative ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 font-semibold shadow-[inset_0_1px_0_0_rgba(56,189,248,0.15)]'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#111e33]/80'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                {/* Thin cyan active indicator on the left */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-cyan-400 rounded-r shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                )}

                <div className="shrink-0 flex items-center justify-center">
                  <Icon
                    className={`w-[18px] h-[18px] transition-transform duration-150 ${
                      isActive
                        ? 'text-cyan-400 scale-105'
                        : 'text-[#64748b] group-hover/navitem:text-[#38bdf8]'
                    }`}
                  />
                </div>

                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate tracking-wide">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9.5px] font-mono uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0 ${
                          item.isPrimary
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                            : 'bg-[#1c2e4a] text-[#7dd3fc] border border-[#273d61]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Floating Tooltip in Collapsed Mode */}
              {isCollapsed && (
                <div className="hidden md:group-hover/navitem:flex absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0a1424] text-white text-[12px] font-medium shadow-xl border border-[#1e3453] pointer-events-none whitespace-nowrap">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0a1424] border-l border-b border-[#1e3453] rotate-45" />
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#08101e] border-r border-[#14233c] select-none text-[#e2e8f0]">
      {/* Top Header Section */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#14233c] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          {/* Logo Mark */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/30 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[16px] tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  StockSense
                </span>
                {/* LIVE Market Status Chip */}
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold font-mono tracking-wider text-emerald-400">
                    LIVE
                  </span>
                </div>
              </div>
              <span className="text-[10.5px] text-[#64748b] tracking-wider font-mono">
                Simple Stock Market Guide
              </span>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#132238] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden md:flex w-7 h-7 rounded-lg text-[#64748b] hover:text-cyan-300 hover:bg-[#111e33] items-center justify-center transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-transparent">
        {renderNavList()}
      </div>

      {/* Bottom Sidebar Alpha Card & Kernel Status */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-[#14233c] shrink-0 bg-[#060c17]/60">
          <div className="alpha-intelligence-card rounded-xl p-3 bg-gradient-to-b from-[#0f1d33] to-[#0a1424] border border-[#1b2f4f] shadow-lg relative overflow-hidden group">
            {/* Ambient background glow */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
                  Beginner Guide
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <p className="text-[12px] font-semibold text-[#e2e8f0] leading-snug">
              Learn as you trade.
              <span className="block text-cyan-300 font-normal">Zero financial jargon.</span>
            </p>

            {/* Decorative Mini Sparkline Chart */}
            <div className="mt-2 pt-1 border-t border-[#192b45] flex items-end justify-between gap-1">
              <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 32" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="miniChartGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M 0 28 Q 15 24 28 20 T 55 12 T 80 16 T 100 4 L 100 32 L 0 32 Z"
                  fill="url(#miniChartGlow)"
                />
                {/* Stroke curve */}
                <path
                  d="M 0 28 Q 15 24 28 20 T 55 12 T 80 16 T 100 4"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Accent point at the end */}
                <circle cx="100" cy="4" r="2.5" fill="#22d3ee" className="animate-pulse" />
              </svg>
            </div>

            <div className="mt-1 flex items-center justify-between text-[10px] text-[#64748b] font-mono">
              <span>AI Predictions Ready</span>
              <span className="text-cyan-400 font-medium">NSE & BSE</span>
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed mode bottom controls */
        <div className="p-2 border-t border-[#14233c] flex flex-col items-center gap-1.5 shrink-0 bg-[#060c17]/60">
          {/* Collapsed Live Kernel Status */}
          <div
            className="w-10 h-10 rounded-xl bg-[#0f1d33] border border-[#1e3453] flex items-center justify-center text-cyan-400 group/pulse relative cursor-pointer"
            title="Smarter insights. Better decisions. (FastAPI ML Live)"
          >
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside
        className={`hidden md:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer & Backdrop Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
