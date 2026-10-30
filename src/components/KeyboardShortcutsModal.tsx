import React, { useState, useMemo } from 'react';
import {
  Keyboard,
  X,
  Search,
  Download,
  Sun,
  Moon,
  Sidebar as SidebarIcon,
  Bell,
  FileCode,
  Compass,
  Zap,
  ArrowRight,
  User
} from 'lucide-react';
import { ScreenTab } from '../types';

export interface ShortcutItem {
  id: string;
  category: 'global' | 'navigation' | 'tools';
  title: string;
  description: string;
  keys: string[];
  actionLabel?: string;
  action?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ScreenTab) => void;
  onOpenSearch: () => void;
  onExportCSV: () => void;
  toggleTheme: () => void;
  theme: 'dark' | 'light';
  toggleSidebar: () => void;
  onOpenPriceAlert: () => void;
  onOpenJsonDossier: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSearch,
  onExportCSV,
  toggleTheme,
  theme,
  toggleSidebar,
  onOpenPriceAlert,
  onOpenJsonDossier
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'global' | 'navigation' | 'tools'>('all');

  const isMac = useMemo(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    }
    return false;
  }, []);

  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts: ShortcutItem[] = useMemo(
    () => [
      // Global Commands & Toggles
      {
        id: 'help',
        category: 'global',
        title: 'Open Keyboard Shortcuts',
        description: 'Display this command cheat sheet from anywhere',
        keys: ['?'],
        action: () => {},
        icon: Keyboard
      },
      {
        id: 'search',
        category: 'global',
        title: 'Global Symbol & Company Search',
        description: 'Instant autocomplete search across NSE 500 securities',
        keys: [modKey, 'K'],
        action: () => {
          onClose();
          onOpenSearch();
        },
        actionLabel: 'Open Search',
        icon: Search
      },
      {
        id: 'export-csv',
        category: 'global',
        title: 'Export View to CSV',
        description: 'Download the current screen financial data for offline modeling',
        keys: [modKey, 'E'],
        action: () => {
          onClose();
          onExportCSV();
        },
        actionLabel: 'Export CSV',
        icon: Download
      },
      {
        id: 'toggle-theme',
        category: 'global',
        title: 'Toggle Dark / Light Theme',
        description: `Switch entire application appearance (currently in ${theme === 'dark' ? 'Dark' : 'Light'} Mode)`,
        keys: [modKey, 'D'],
        action: () => {
          toggleTheme();
        },
        actionLabel: theme === 'dark' ? 'Switch to Light' : 'Switch to Dark',
        icon: theme === 'dark' ? Sun : Moon
      },
      {
        id: 'toggle-sidebar',
        category: 'global',
        title: 'Toggle Sidebar Collapse',
        description: 'Expand or minimize the left navigation drawer',
        keys: [modKey, 'B'],
        action: () => {
          toggleSidebar();
        },
        actionLabel: 'Toggle Sidebar',
        icon: SidebarIcon
      },
      {
        id: 'price-alert',
        category: 'tools',
        title: 'Set Price Alert',
        description: 'Configure breakout and support threshold notifications',
        keys: [modKey, 'P'],
        action: () => {
          onClose();
          onOpenPriceAlert();
        },
        actionLabel: 'New Alert',
        icon: Bell
      },
      {
        id: 'json-dossier',
        category: 'tools',
        title: 'Inspect JSON Quantitative Dossier',
        description: 'View full machine-readable SHAP factor and probability payload',
        keys: [modKey, 'J'],
        action: () => {
          onClose();
          onOpenJsonDossier();
        },
        actionLabel: 'View JSON',
        icon: FileCode
      },
      {
        id: 'close-modal',
        category: 'global',
        title: 'Close Active Modal / Overlay',
        description: 'Dismiss any open dialog, modal, or drawer immediately',
        keys: ['Esc'],
        action: onClose,
        actionLabel: 'Dismiss',
        icon: X
      },

      // Screen Navigation
      {
        id: 'nav-ai-predict',
        category: 'navigation',
        title: 'Stock Insights',
        description: 'AI trend outlook, plain-English reasons, and 5-day price ranges',
        keys: ['1'],
        action: () => {
          onClose();
          onNavigate('ai-predict');
        },
        actionLabel: 'Go to Stock Insights',
        icon: Zap
      },
      {
        id: 'nav-dashboard',
        category: 'navigation',
        title: 'Overview',
        description: 'Benchmark indices, top gainers, active movers, and market highlights',
        keys: ['2'],
        action: () => {
          onClose();
          onNavigate('dashboard');
        },
        actionLabel: 'Go to Overview',
        icon: Compass
      },
      {
        id: 'nav-markets',
        category: 'navigation',
        title: 'Market Today',
        description: 'NSE indices, live stock prices, news, and sector movements',
        keys: ['3'],
        action: () => {
          onClose();
          onNavigate('markets');
        },
        actionLabel: 'Go to Market Today',
        icon: Compass
      },
      {
        id: 'nav-watchlist',
        category: 'navigation',
        title: 'My Watchlist',
        description: 'Personal stock list to keep an eye on your favorite companies',
        keys: ['4'],
        action: () => {
          onClose();
          onNavigate('watchlist');
        },
        actionLabel: 'Go to Watchlist',
        icon: Compass
      },
      {
        id: 'nav-portfolio',
        category: 'navigation',
        title: 'My Investments',
        description: 'Your investments, profits/losses, and company distribution',
        keys: ['5'],
        action: () => {
          onClose();
          onNavigate('portfolio');
        },
        actionLabel: 'Go to Investments',
        icon: Compass
      },
      {
        id: 'nav-risk-radar',
        category: 'navigation',
        title: 'Risk Checker',
        description: 'Easy safety meter (0-100), price swing history, and drop tests',
        keys: ['6'],
        action: () => {
          onClose();
          onNavigate('risk-radar');
        },
        actionLabel: 'Go to Risk Checker',
        icon: Compass
      },
      {
        id: 'nav-screener',
        category: 'navigation',
        title: 'Find a Stock',
        description: 'Simple filters to discover stocks by price, trend, or safety',
        keys: ['7'],
        action: () => {
          onClose();
          onNavigate('screener');
        },
        actionLabel: 'Go to Find a Stock',
        icon: Compass
      },
      {
        id: 'nav-technical',
        category: 'navigation',
        title: 'Price History',
        description: 'Simple charts, momentum trends, and average price levels',
        keys: ['8'],
        action: () => {
          onClose();
          onNavigate('technical-analysis');
        },
        actionLabel: 'Go to Price History',
        icon: Compass
      },
      {
        id: 'nav-backtest',
        category: 'navigation',
        title: 'Strategy Tester',
        description: 'See how investment strategies performed in past market years',
        keys: ['9'],
        action: () => {
          onClose();
          onNavigate('backtesting');
        },
        actionLabel: 'Go to Strategy Tester',
        icon: Compass
      },
      {
        id: 'nav-heatmap',
        category: 'navigation',
        title: 'Market Sectors',
        description: 'Visual map showing which industries are gaining or dropping today',
        keys: ['0'],
        action: () => {
          onClose();
          onNavigate('heatmap');
        },
        actionLabel: 'Go to Market Sectors',
        icon: Compass
      },
      {
        id: 'nav-news',
        category: 'navigation',
        title: 'News & Sentiment',
        description: 'Latest market headlines and whether news is positive or negative',
        keys: ['N'],
        action: () => {
          onClose();
          onNavigate('news-sentiment');
        },
        actionLabel: 'Go to News',
        icon: Compass
      },
      {
        id: 'nav-overview',
        category: 'navigation',
        title: 'Market Summary',
        description: 'Easy summary of today’s market moves and broad trends',
        keys: ['O'],
        action: () => {
          onClose();
          onNavigate('overview');
        },
        actionLabel: 'Go to Summary',
        icon: Compass
      },
      {
        id: 'nav-profile',
        category: 'navigation',
        title: 'User Profile & Settings',
        description: 'View your Demat info, practice funds, KYC status, and risk profile',
        keys: ['U'],
        action: () => {
          onClose();
          onNavigate('profile');
        },
        actionLabel: 'Go to Profile',
        icon: User
      }
    ],
    [modKey, onClose, onOpenSearch, onExportCSV, toggleTheme, theme, toggleSidebar, onOpenPriceAlert, onOpenJsonDossier, onNavigate]
  );

  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keys.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [shortcuts, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0c1524] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121c2d]/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/60 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="shortcuts-modal-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Keyboard Shortcuts
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800 font-semibold">
                  Quick Access
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-300 font-mono text-[11px] font-semibold">?</kbd> anywhere to toggle this guide
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcut, key, or command (e.g. export, dark, 1, K)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-teal-500 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `All Commands (${shortcuts.length})` },
              { id: 'global', label: 'Actions & Toggles' },
              { id: 'navigation', label: 'Screen Switching' },
              { id: 'tools', label: 'Tools & Modals' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No keyboard shortcuts match &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredShortcuts.map((item) => {
              const Icon = item.icon || Zap;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  className="pt-2 first:pt-0 group flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  title={item.actionLabel ? `Click to run: ${item.actionLabel}` : item.title}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors truncate">
                          {item.title}
                        </span>
                        {item.actionLabel && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                            <ArrowRight className="w-2.5 h-2.5" /> {item.actionLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {/* Key Combo Badges */}
                  <div className="flex items-center gap-1 shrink-0">
                    {item.keys.map((k, idx) => (
                      <kbd
                        key={idx}
                        className="min-w-[24px] h-6 px-1.5 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-teal-300 font-mono text-[11px] font-bold shadow-2xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121c2d]/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Tip: Click any row to run the action directly</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-teal-300 font-mono text-[10px]">
              Esc
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
