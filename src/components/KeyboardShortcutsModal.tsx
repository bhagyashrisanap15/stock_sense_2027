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
  ArrowRight
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
        title: 'AI Insights & Explainability',
        description: 'Target stock SHAP feature attribution and direction forecast',
        keys: ['1'],
        action: () => {
          onClose();
          onNavigate('ai-predict');
        },
        actionLabel: 'Go to AI Insights',
        icon: Zap
      },
      {
        id: 'nav-dashboard',
        category: 'navigation',
        title: 'Institutional Dashboard',
        description: 'Benchmark indices, top gainers, active movers, and macro telemetry',
        keys: ['2'],
        action: () => {
          onClose();
          onNavigate('dashboard');
        },
        actionLabel: 'Go to Dashboard',
        icon: Compass
      },
      {
        id: 'nav-markets',
        category: 'navigation',
        title: 'Real-Time Market Monitor',
        description: 'NSE 500 sectoral heatmaps, advance/decline breadth, and quotes',
        keys: ['3'],
        action: () => {
          onClose();
          onNavigate('markets');
        },
        actionLabel: 'Go to Markets',
        icon: Compass
      },
      {
        id: 'nav-watchlist',
        category: 'navigation',
        title: 'Priority Watchlist',
        description: 'Curated high-priority institutional monitoring basket',
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
        title: 'Position & Portfolio Allocation',
        description: 'Live holdings, unrealized P&L, and sector weightings',
        keys: ['5'],
        action: () => {
          onClose();
          onNavigate('portfolio');
        },
        actionLabel: 'Go to Portfolio',
        icon: Compass
      },
      {
        id: 'nav-risk-radar',
        category: 'navigation',
        title: 'Portfolio Risk Radar',
        description: 'Value-at-Risk (VaR 95%), Sharpe, Sortino, and stress simulations',
        keys: ['6'],
        action: () => {
          onClose();
          onNavigate('risk-radar');
        },
        actionLabel: 'Go to Risk Radar',
        icon: Compass
      },
      {
        id: 'nav-screener',
        category: 'navigation',
        title: 'Quantitative Stock Screener',
        description: 'Multi-variable fundamental & technical filter engine',
        keys: ['7'],
        action: () => {
          onClose();
          onNavigate('screener');
        },
        actionLabel: 'Go to Screener',
        icon: Compass
      },
      {
        id: 'nav-technical',
        category: 'navigation',
        title: 'Technical Multi-Indicator Analysis',
        description: 'RSI, MACD, Bollinger Bands, and moving average regimes',
        keys: ['8'],
        action: () => {
          onClose();
          onNavigate('technical-analysis');
        },
        actionLabel: 'Go to Technical',
        icon: Compass
      },
      {
        id: 'nav-backtest',
        category: 'navigation',
        title: 'Quantitative Strategy Backtest',
        description: 'Historical performance simulation, alpha, and max drawdowns',
        keys: ['9'],
        action: () => {
          onClose();
          onNavigate('backtesting');
        },
        actionLabel: 'Go to Backtest',
        icon: Compass
      },
      {
        id: 'nav-heatmap',
        category: 'navigation',
        title: 'Sectoral Market Heatmap',
        description: 'Relative capital distribution across Indian industry sectors',
        keys: ['0'],
        action: () => {
          onClose();
          onNavigate('heatmap');
        },
        actionLabel: 'Go to Heatmap',
        icon: Compass
      },
      {
        id: 'nav-news',
        category: 'navigation',
        title: 'News & Institutional Sentiment',
        description: 'Real-time NLP sentiment scoring on market financial wires',
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
        title: 'Executive Market Overview',
        description: 'Macro perspectives and cross-asset correlations',
        keys: ['O'],
        action: () => {
          onClose();
          onNavigate('overview');
        },
        actionLabel: 'Go to Overview',
        icon: Compass
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#0a1424] border border-[#1c304d] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-[#e2e8f0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#14233c] bg-[#08101e]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="shortcuts-modal-title" className="text-[16px] font-bold text-white tracking-tight">
                  Keyboard Shortcuts
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Global Helper
                </span>
              </div>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">
                Press <kbd className="px-1.5 py-0.2 rounded bg-[#132238] border border-[#1f3554] text-cyan-300 font-mono text-[11px] font-semibold">?</kbd> anywhere to toggle this helper
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#0e1a2d] hover:bg-[#14233c] border border-[#1a2e4c] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-[#14233c] bg-[#060e1a]/40 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search command, shortcut, or key (e.g. export, dark, 1, K)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e1a2d] border border-[#1a2e4c] focus:border-cyan-400 text-[13px] text-white placeholder-[#64748b] outline-none transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#94a3b8] hover:text-white"
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
                className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition-all shrink-0 cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-[#0e1a2d] text-[#94a3b8] hover:text-white border border-[#1a2e4c]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-[#14233c]/60">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center text-[#94a3b8] text-[13px]">
              No keyboard shortcuts match &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredShortcuts.map((item) => {
              const Icon = item.icon || Zap;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  className="pt-2 first:pt-0 group flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#111e33] transition-colors cursor-pointer"
                  title={item.actionLabel ? `Click to run: ${item.actionLabel}` : item.title}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#0e1a2d] border border-[#1a2e4c] flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {item.title}
                        </span>
                        {item.actionLabel && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-cyan-400/80 font-mono">
                            <ArrowRight className="w-2.5 h-2.5" /> {item.actionLabel}
                          </span>
                        )}
                      </div>
                      <span className="text-[11.5px] text-[#94a3b8] truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {/* Key Combo Badges */}
                  <div className="flex items-center gap-1 shrink-0">
                    {item.keys.map((k, idx) => (
                      <kbd
                        key={idx}
                        className="min-w-[24px] h-6 px-1.5 flex items-center justify-center rounded-md bg-[#132238] border border-[#233b5c] text-[#7dd3fc] font-mono text-[11px] font-bold shadow-sm"
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
        <div className="px-5 py-3 border-t border-[#14233c] bg-[#08101e]/90 flex items-center justify-between text-[11.5px] text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <span>Tip: Click any row to run the action directly</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#132238] border border-[#233857] text-[#7dd3fc] font-mono text-[10px]">
              Esc
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
