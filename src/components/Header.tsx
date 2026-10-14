import React, { useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  User,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { ScreenTab } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onNotificationClick: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onToggleMobileMenu?: () => void;
  currentTab?: ScreenTab;
  currentStockTicker?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  onNotificationClick,
  theme,
  toggleTheme,
  onToggleMobileMenu,
  currentTab = 'ai-predict',
  currentStockTicker = 'RELIANCE'
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Tab display name mapping
  const tabTitles: Record<ScreenTab, string> = {
    'ai-predict': 'AI Insights & Explainability',
    'dashboard': 'Institutional Dashboard',
    'markets': 'Real-Time Market Monitor',
    'risk-radar': 'Portfolio Risk Radar',
    'watchlist': 'Priority Watchlist',
    'portfolio': 'Position & Portfolio Allocation',
    'paper-trading': 'Virtual Execution Simulator',
    'backtesting': 'Quantitative Strategy Backtest',
    'heatmap': 'Sectoral Market Heatmap',
    'screener': 'Quantitative Stock Screener',
    'news-sentiment': 'News & Institutional Sentiment',
    'technical-analysis': 'Technical Multi-Indicator Analysis',
    'overview': 'Executive Market Overview'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#08101e]/95 backdrop-blur-md border-b border-[#14233c] px-4 lg:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile hamburger menu & active context breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden w-9 h-9 rounded-lg bg-[#111e33] border border-[#1b2f4f] text-[#94a3b8] hover:text-white flex items-center justify-center shrink-0 transition-colors"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Breadcrumb & Section Name */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-[#64748b] font-mono tracking-wide">
            <span className="hidden sm:inline">StockSense</span>
            <span className="hidden sm:inline text-[#334155]">/</span>
            <span className="text-cyan-400 font-semibold truncate">
              {tabTitles[currentTab] || 'Platform'}
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 ml-2 px-1.5 py-0.2 rounded bg-[#111e33] text-[10px] text-[#94a3b8] border border-[#1b2f4f]">
              Target: <strong className="text-white">{currentStockTicker}</strong>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              NIFTY 50 22,485.40 (+0.42%)
            </span>
            <span className="text-[#334155] text-[10px]">·</span>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              India VIX 12.80 (-1.8%)
            </span>
          </div>
        </div>
      </div>

      {/* Center / Right: Global Search, Notifications, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Global Stock / Company Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1a2d] hover:bg-[#14233c] border border-[#1a2e4c] hover:border-cyan-500/40 text-[#94a3b8] hover:text-[#f8fafc] text-[13px] transition-all shadow-sm group"
        >
          <Search className="w-4 h-4 text-[#64748b] group-hover:text-cyan-400 transition-colors" />
          <span className="hidden md:inline font-normal">Search symbols or companies...</span>
          <span className="md:hidden">Search</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#1a2a42] text-[#7dd3fc] rounded border border-[#233857]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Button */}
        <button
          type="button"
          onClick={onNotificationClick}
          className="relative w-9 h-9 rounded-lg bg-[#0e1a2d] hover:bg-[#14233c] border border-[#1a2e4c] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors shadow-sm"
          title="Price alerts & market signals"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg bg-[#0e1a2d] hover:bg-[#14233c] border border-[#1a2e4c] text-[#94a3b8] hover:text-amber-400 flex items-center justify-center transition-colors shadow-sm"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Separator */}
        <div className="h-6 w-[1px] bg-[#14233c] mx-0.5" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg bg-[#0e1a2d] hover:bg-[#14233c] border border-[#1a2e4c] hover:border-[#273d61] transition-all"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
              QP
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[12px] font-semibold text-white tracking-tight">
                Quant Desk
              </span>
              <span className="text-[9.5px] font-mono text-cyan-400 font-medium">
                Institutional
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#0a1424] border border-[#1c304d] shadow-2xl p-3 z-50 text-[#e2e8f0] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-[#14233c]">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-[14px]">
                    QP
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[13px] text-white truncate">
                        Quant Desk Alpha
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    </div>
                    <span className="text-[11px] text-[#64748b] truncate">
                      institutional@stocksense.ai
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold mt-0.5">
                      Tier: Multi-Factor Pro
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-[12px]">
                  <div className="px-2 py-1.5 text-[#94a3b8] flex items-center justify-between">
                    <span>ML Pipeline Status</span>
                    <span className="font-mono text-emerald-400 font-semibold">Ready (18ms)</span>
                  </div>
                  <div className="px-2 py-1.5 text-[#94a3b8] flex items-center justify-between">
                    <span>SHAP Kernel</span>
                    <span className="font-mono text-cyan-300">FastTreeSHAP</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#14233c] space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-cyan-300 hover:bg-[#132238] transition-colors"
                  >
                    <span>Manage Account Credentials</span>
                    <User className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
