import React, { useState, useMemo } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Clock,
  Activity,
  Layers,
  ArrowRight,
  Eye,
  Plus
} from 'lucide-react';
import { StockData, ScreenTab, IndexData } from '../types';
import { INDICES_DATA, STOCKS_DATA, getAllIndianStocks, getStockData } from '../data/stocks';
import { MarketNews } from '../components/MarketNews';

interface DashboardScreenProps {
  currentStock: StockData;
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
  onOpenSearch: () => void;
  onOpenBacktest?: () => void;
  watchlist?: string[];
  onToggleWatchlist?: (ticker: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentStock,
  onSelectStock,
  onNavigate,
  onOpenSearch,
  watchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'TATAMOTORS'],
  onToggleWatchlist
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMoverTab, setActiveMoverTab] = useState<'gainers' | 'losers'>('gainers');
  const [searchCategory, setSearchCategory] = useState<'All' | 'Nifty 50' | 'Banking' | 'Tech' | 'Auto'>('All');

  const allStocks = useMemo(() => getAllIndianStocks(), []);

  // Compute Indian Market Status (IST: UTC + 5:30)
  const marketStatus = useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 3600000 * 5.5);
    const day = ist.getDay(); // 0 is Sunday, 6 is Saturday
    const hours = ist.getHours();
    const minutes = ist.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // NSE trading session: Mon-Fri 09:15 to 15:30 IST
    const isWeekday = day >= 1 && day <= 5;
    const isOpenHours = totalMinutes >= 9 * 60 + 15 && totalMinutes <= 15 * 60 + 30;
    const isOpen = isWeekday && isOpenHours;

    const timeStr = ist.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      isOpen,
      timeStr,
      label: isOpen ? 'Market is Open' : 'Market is Closed',
      sublabel: isOpen ? 'Closes at 3:30 PM IST' : 'Opens Mon-Fri at 9:15 AM IST'
    };
  }, []);

  // Benchmark indices
  const nifty50 = useMemo(() => INDICES_DATA.find((i) => i.name === 'NIFTY 50') || INDICES_DATA[0], []);
  const sensex = useMemo(() => INDICES_DATA.find((i) => i.name === 'SENSEX') || INDICES_DATA[1], []);

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allStocks
      .filter((s) => {
        const matchesQuery = s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
        if (!matchesQuery) return false;
        if (searchCategory === 'Banking') return s.sector.toLowerCase().includes('bank');
        if (searchCategory === 'Tech') return s.sector.toLowerCase().includes('it') || s.sector.toLowerCase().includes('tech');
        if (searchCategory === 'Auto') return s.sector.toLowerCase().includes('auto');
        return true;
      })
      .slice(0, 6);
  }, [allStocks, searchQuery, searchCategory]);

  // Watchlist stock objects
  const watchlistStocks = useMemo(() => {
    return watchlist.map((ticker) => getStockData(ticker)).filter(Boolean) as StockData[];
  }, [watchlist]);

  // Top Movers: sorted by daily percentage change
  const { topGainers, topLosers } = useMemo(() => {
    const sorted = [...allStocks].sort((a, b) => b.changePercent - a.changePercent);
    const gainers = sorted.filter((s) => s.changePercent > 0).slice(0, 5);
    const losers = [...sorted].reverse().filter((s) => s.changePercent < 0).slice(0, 5);
    return { topGainers: gainers, topLosers: losers };
  }, [allStocks]);

  // 3 plain-English AI explanations for selected stock
  const aiPlainReasons = useMemo(() => {
    const reasons: string[] = [];
    const isUp = currentStock.direction === 'UP';
    const isDown = currentStock.direction === 'DOWN';

    if (isUp) {
      if (currentStock.price >= currentStock.sma20) {
        reasons.push(`Price is trading above its recent 20-day average (₹${currentStock.sma20.toFixed(0)}), showing strong buyer support.`);
      } else {
        reasons.push(`Price has rebounded off recent support levels with steady upward momentum.`);
      }
      if (currentStock.rsi >= 50 && currentStock.rsi <= 68) {
        reasons.push(`Momentum (RSI ${currentStock.rsi.toFixed(1)}) is in a healthy growth zone without being overheated.`);
      } else {
        reasons.push(`Buyers are steadily stepping in, outpacing selling pressure over the last session.`);
      }
      reasons.push(`Trading activity indicates positive participation from institutional and retail investors.`);
    } else if (isDown) {
      if (currentStock.price <= currentStock.sma20) {
        reasons.push(`Price is trading below its 20-day average (₹${currentStock.sma20.toFixed(0)}), reflecting short-term selling pressure.`);
      } else {
        reasons.push(`Price faced resistance near its recent peak and is taking a breather.`);
      }
      reasons.push(`Momentum indicators suggest caution as sellers currently outnumber buyers.`);
      reasons.push(`Higher recent price swings (${currentStock.annVolatility}% volatility) mean wider daily fluctuations.`);
    } else {
      reasons.push(`Price is holding steady near its recent average levels with no strong directional bias.`);
      reasons.push(`Buying and selling activity are currently well-balanced.`);
      reasons.push(`Waiting for fresh market catalysts or quarterly earnings before a decisive breakout.`);
    }

    return reasons.slice(0, 3);
  }, [currentStock]);

  const handleStockClick = (stock: StockData) => {
    onSelectStock(stock);
  };

  const handleOpenStockDetails = (stock: StockData) => {
    onSelectStock(stock);
    onNavigate('ai-predict');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-8 text-slate-800 dark:text-slate-100">
      
      {/* ========================================================
          SECTION A: MARKET OVERVIEW
          ======================================================== */}
      <section className="flex flex-col gap-3">
        {/* Market Status Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                marketStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {marketStatus.label}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              {marketStatus.sublabel} ({marketStatus.timeStr} IST)
            </span>
          </div>

          <button
            onClick={() => onNavigate('markets')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 transition-colors"
          >
            <span>All Indices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* NIFTY 50 & SENSEX Benchmark Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[nifty50, sensex].map((idx) => {
            const isPos = idx.isPositive;
            return (
              <div
                key={idx.name}
                onClick={() => onNavigate('markets')}
                className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {idx.name === 'NIFTY 50' ? 'NSE Benchmark' : 'BSE Benchmark'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {idx.name}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isPos
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                    }`}
                  >
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{idx.change}</span>
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
                      {idx.value}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isPos ? 'Trending higher today' : 'Easing lower today'}
                    </p>
                  </div>

                  {/* Clean SVG Trend Sparkline */}
                  <div className="w-24 h-10 flex items-end">
                    <svg className="w-full h-8 overflow-visible" viewBox="0 0 70 24">
                      {isPos ? (
                        <>
                          <defs>
                            <linearGradient id={`grad-${idx.name}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 2 20 Q 18 16, 32 12 T 52 8 T 68 3"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 2 20 Q 18 16, 32 12 T 52 8 T 68 3 L 68 24 L 2 24 Z"
                            fill={`url(#grad-${idx.name})`}
                          />
                        </>
                      ) : (
                        <>
                          <defs>
                            <linearGradient id={`grad-${idx.name}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 2 4 Q 18 8, 34 12 T 52 16 T 68 21"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 2 4 Q 18 8, 34 12 T 52 16 T 68 21 L 68 24 L 2 24 Z"
                            fill={`url(#grad-${idx.name})`}
                          />
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION B: SEARCH STOCKS
          ======================================================== */}
      <section className="flex flex-col gap-3">
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Search Stocks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore 500+ Indian companies across NSE and BSE.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks or companies (e.g. Reliance, TCS, HDFC, Tata)..."
              className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'Nifty 50', 'Banking', 'Tech', 'Auto'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  searchCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Results Display */}
          {searchQuery.trim() !== '' && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {searchResults.map((stock) => {
                    const isPos = stock.changePercent >= 0;
                    return (
                      <div
                        key={stock.ticker}
                        onClick={() => handleOpenStockDetails(stock)}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {stock.ticker}
                            </span>
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {stock.exchange}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {stock.name}
                          </span>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            ₹{stock.price.toFixed(2)}
                          </span>
                          <span
                            className={`font-mono text-xs font-semibold ${
                              isPos ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center flex flex-col items-center gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    No stocks found for "{searchQuery}"
                  </span>
                  <p className="text-xs text-slate-400">
                    Try searching by company name like "Tata", "Reliance", or "Infosys".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          SECTION C: MY WATCHLIST
          ======================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              My Watchlist
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {watchlistStocks.length} stocks saved for easy tracking
            </p>
          </div>

          <button
            onClick={() => onNavigate('watchlist')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 transition-colors"
          >
            <span>Manage Watchlist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact List of Saved Stocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {watchlistStocks.slice(0, 8).map((stock) => {
            const isPos = stock.changePercent >= 0;
            const isSelected = currentStock.ticker === stock.ticker;

            return (
              <div
                key={stock.ticker}
                onClick={() => handleStockClick(stock)}
                className={`bg-white dark:bg-[#121c2d] border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 relative group ${
                  isSelected
                    ? 'border-teal-500 ring-2 ring-teal-500/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {stock.ticker}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {stock.name}
                    </span>
                  </div>

                  {onToggleWatchlist && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stock.ticker);
                      }}
                      title="Remove from watchlist"
                      className="text-teal-600 hover:text-slate-400 p-1 transition-colors"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    ₹{stock.price.toFixed(2)}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${
                      isPos ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION D: AI STOCK INSIGHTS
          ======================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>AI Stock Insights</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plain-English outlook and reasoning for currently selected stock
            </p>
          </div>

          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
            Active: <strong>{currentStock.ticker}</strong>
          </span>
        </div>

        {/* Selected Stock AI Card */}
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
          {/* Header Row: Stock Name, Price, and Outlook Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold font-mono text-sm border border-teal-200/60 dark:border-teal-800/60 shrink-0">
                {currentStock.ticker.slice(0, 3)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentStock.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono font-semibold">
                    ({currentStock.ticker})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
                    ₹{currentStock.price.toFixed(2)}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      currentStock.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {currentStock.changePercent >= 0 ? '+' : ''}
                    {currentStock.change.toFixed(2)} ({currentStock.changePercent >= 0 ? '+' : ''}
                    {currentStock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* AI Outlook Badge */}
            <div className="flex flex-col sm:items-end gap-1">
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentStock.direction === 'UP'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : currentStock.direction === 'DOWN'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                }`}
              >
                {currentStock.direction === 'UP' ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : currentStock.direction === 'DOWN' ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
                <span>AI Outlook: {currentStock.direction === 'UP' ? 'Bullish' : currentStock.direction === 'DOWN' ? 'Bearish' : 'Neutral'}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Prediction period: Next 5 trading days
              </span>
            </div>
          </div>

          {/* Why Does AI Think This? */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Why this outlook?
            </span>
            <div className="flex flex-col gap-2">
              {aiPlainReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Level & Model Confidence Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* Risk Box */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Risk Level
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentStock.riskCategory === 'LOW'
                    ? 'Low Risk — steady historical price behavior'
                    : currentStock.riskCategory === 'HIGH'
                    ? 'High Risk — wider price swings expected'
                    : 'Medium Risk — normal market fluctuations'}
                </span>
              </div>
            </div>

            {/* Model Confidence */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Activity className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Model Agreement
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {currentStock.confidence}% consensus
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${currentStock.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={() => handleOpenStockDetails(currentStock)}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <span>View Full Stock Details & 5-Day Forecast</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION E: TOP MARKET MOVERS
          ======================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Top Market Movers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Biggest gains and drops across Indian equities today
            </p>
          </div>

          {/* Gainers / Losers Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveMoverTab('gainers')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMoverTab === 'gainers'
                  ? 'bg-white dark:bg-[#121c2d] text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Top Gainers
            </button>
            <button
              onClick={() => setActiveMoverTab('losers')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMoverTab === 'losers'
                  ? 'bg-white dark:bg-[#121c2d] text-rose-700 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Top Losers
            </button>
          </div>
        </div>

        {/* List of Movers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {(activeMoverTab === 'gainers' ? topGainers : topLosers).map((stock) => {
            const isPos = stock.changePercent >= 0;
            return (
              <div
                key={stock.ticker}
                onClick={() => handleStockClick(stock)}
                className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                      {stock.ticker}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold flex items-center ${
                        isPos ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 truncate block mt-0.5">
                    {stock.name}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Price</span>
                  <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                    ₹{stock.price.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION: LATEST MARKET NEWS & HEADLINES
          ======================================================== */}
      <section className="flex flex-col gap-3">
        <MarketNews
          ticker={currentStock.ticker}
          stockName={currentStock.name}
          limit={6}
          onNavigate={onNavigate}
        />
      </section>

      {/* ========================================================
          SECTION F: LEARNING CORNER
          ======================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Learning Corner</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Short, beginner-friendly explanations of stock market concepts
            </p>
          </div>

          <button
            onClick={() => onNavigate('learn')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 transition-colors"
          >
            <span>Full Academy</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Informative Mini-Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
              💡 What is AI Outlook?
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Algorithms analyze recent price trends and volume to forecast whether a stock is likely to move UP, DOWN, or sideways over the next 5 days.
            </p>
          </div>

          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
              📈 Bullish vs Bearish
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Bullish</strong> means buyers are in control and prices are expected to rise. <strong>Bearish</strong> means sellers dominate and prices may soften.
            </p>
          </div>

          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
              📊 Moving Averages
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The 20-day average smooths out daily random noise. When a stock trades comfortably above its 20-day line, it confirms sustained upward strength.
            </p>
          </div>

          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
              🛡️ Understanding Risk
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Predictions are estimates, not guarantees. Always diversify your holdings and avoid risking all your savings on a single trade.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
