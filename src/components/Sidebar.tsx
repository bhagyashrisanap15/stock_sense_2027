import React, { useState } from 'react';
import {
  Home,
  TrendingUp,
  Bookmark,
  Sparkles,
  Wallet,
  BookOpen,
  Layers,
  CandlestickChart,
  ShieldAlert,
  SlidersHorizontal,
  Activity,
  Grid3X3,
  Newspaper,
  Cpu,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  LogOut,
  User
} from 'lucide-react';
import { ScreenTab } from '../types';

interface SidebarProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
}

interface NavItem {
  id: ScreenTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onOpenSettings,
  onOpenHelp
}) => {
  // Primary navigation items requested
  const primaryNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
    { id: 'ai-predict', label: 'AI Insights', icon: Sparkles, badge: 'AI' },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'learn', label: 'Learn', icon: BookOpen }
  ];

  // Secondary tools in expandable dropdown
  const secondaryNavItems: NavItem[] = [
    { id: 'paper-trading', label: 'Practice Trading', icon: CandlestickChart, badge: 'VIRTUAL' },
    { id: 'risk-radar', label: 'Risk & Safety Meter', icon: ShieldAlert },
    { id: 'screener', label: 'Stock Finder', icon: SlidersHorizontal },
    { id: 'technical-analysis', label: 'Technical Charts', icon: Activity },
    { id: 'heatmap', label: 'Sector Heatmap', icon: Grid3X3 },
    { id: 'news-sentiment', label: 'Market News', icon: Newspaper },
    { id: 'backtesting', label: 'Strategy Tester', icon: Cpu }
  ];

  // Check if current tab is in secondary tools
  const isSecondaryActive = secondaryNavItems.some((item) => item.id === currentTab);
  const [isMoreToolsExpanded, setIsMoreToolsExpanded] = useState<boolean>(isSecondaryActive);

  const handleSelectTab = (tab: ScreenTab) => {
    onTabChange(tab);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const renderNavButton = (item: NavItem, isSubItem = false) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;

    return (
      <div key={item.id} className="relative group/navitem">
        <button
          type="button"
          onClick={() => handleSelectTab(item.id)}
          className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-150 relative ${
            isSubItem ? 'pl-8 pr-3' : 'px-3'
          } ${
            isActive
              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
          } ${isCollapsed ? 'justify-center px-2' : ''}`}
        >
          {/* Active left indicator line */}
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-600 dark:bg-teal-400 rounded-r-full" />
          )}

          <div className="shrink-0 flex items-center justify-center">
            <Icon
              className={`w-4 h-4 transition-transform duration-150 ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 scale-105'
                  : 'text-slate-400 group-hover/navitem:text-slate-700 dark:group-hover/navitem:text-slate-200'
              }`}
            />
          </div>

          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="truncate tracking-tight">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9.5px] font-mono uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0 ${
                    isActive
                      ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
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
          <div className="hidden md:group-hover/navitem:flex absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl border border-slate-800 pointer-events-none whitespace-nowrap">
            <span>{item.label}</span>
            {item.badge && (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-teal-500/20 text-teal-300">
                {item.badge}
              </span>
            )}
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-b border-slate-800 rotate-45" />
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c1524] border-r border-slate-200/90 dark:border-slate-800 select-none text-slate-800 dark:text-slate-200 transition-colors">
      {/* Brand & Collapse Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          {/* Logo Mark */}
          <button
            type="button"
            onClick={() => handleSelectTab('dashboard')}
            className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 focus:outline-none"
            title="StockSense Home"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                StockSense
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold tracking-wide mt-0.5">
                AI Market Guide
              </span>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Desktop Collapse / Expand Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden md:flex w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 items-center justify-center transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {/* Primary Items */}
        {primaryNavItems.map((item) => renderNavButton(item))}

        {/* Expandable "More Tools" Section */}
        <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800/80">
          {!isCollapsed ? (
            <div>
              <button
                type="button"
                onClick={() => setIsMoreToolsExpanded(!isMoreToolsExpanded)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isSecondaryActive
                    ? 'text-teal-700 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>More Tools</span>
                </div>
                {isMoreToolsExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isMoreToolsExpanded && (
                <div className="flex flex-col gap-0.5 mt-1 animate-in fade-in duration-150">
                  {secondaryNavItems.map((item) => renderNavButton(item, true))}
                </div>
              )}
            </div>
          ) : (
            // In Collapsed Mode: show secondary items directly as icons
            <div className="flex flex-col gap-1">
              {secondaryNavItems.map((item) => renderNavButton(item))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Settings, Help & User Profile */}
      <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800 shrink-0 flex flex-col gap-1 bg-slate-50/50 dark:bg-[#09101c]/50">
        {/* Settings button */}
        <div className="relative group/navitem">
          <button
            type="button"
            onClick={onOpenSettings}
            className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </button>
          {isCollapsed && (
            <div className="hidden md:group-hover/navitem:flex absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 items-center px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl pointer-events-none whitespace-nowrap">
              <span>Settings</span>
            </div>
          )}
        </div>

        {/* Help button */}
        <div className="relative group/navitem">
          <button
            type="button"
            onClick={onOpenHelp}
            className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            {!isCollapsed && <span>Help & Shortcuts</span>}
          </button>
          {isCollapsed && (
            <div className="hidden md:group-hover/navitem:flex absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 items-center px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl pointer-events-none whitespace-nowrap">
              <span>Help & Shortcuts (?)</span>
            </div>
          )}
        </div>

        {/* User Profile Card at Bottom */}
        <div className="pt-1.5 mt-1 border-t border-slate-200/60 dark:border-slate-800/80">
          {!isCollapsed ? (
            <div
              onClick={onOpenSettings}
              className="p-2 rounded-xl flex items-center justify-between gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs border border-teal-200 dark:border-teal-800 shrink-0">
                  P
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    Pooja Bhagwat
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    Investor · Pro Member
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSettings) onOpenSettings();
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Account Settings"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="relative group/profile flex justify-center py-1">
              <button
                type="button"
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs border border-teal-200 dark:border-teal-800 shadow-xs"
                title="Pooja Bhagwat (Investor Account)"
              >
                P
              </button>
              <div className="hidden md:group-hover/profile:flex absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 flex-col px-3 py-2 rounded-xl bg-slate-900 text-white text-xs shadow-xl pointer-events-none whitespace-nowrap">
                <span className="font-bold">Pooja Bhagwat</span>
                <span className="text-[10px] text-slate-400">Investor Account</span>
              </div>
            </div>
          )}
        </div>
      </div>
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
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
