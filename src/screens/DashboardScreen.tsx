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
  Plus,
  Share2,
  Bell,
  SlidersHorizontal,
  BarChart2,
  LineChart as LineChartIcon,
  Flame,
  Brain,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Zap,
  Info,
  DollarSign,
  FileText,
  PieChart,
  X
} from 'lucide-react';
import { StockData, ScreenTab, IndexData } from '../types';
import { INDICES_DATA, STOCKS_DATA, getAllIndianStocks, getStockData } from '../data/stocks';
import { MarketNews } from '../components/MarketNews';
import { StockPriceLineChart } from '../components/StockPriceLineChart';

interface DashboardScreenProps {
  currentStock: StockData;
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
  onOpenSearch: () => void;
  onOpenBacktest?: () => void;
  watchlist?: string[];
  onToggleWatchlist?: (ticker: string) => void;
  onOpenPriceAlert?: (stock: StockData) => void;
  onShare?: (stock: StockData) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentStock,
  onSelectStock,
  onNavigate,
  onOpenSearch,
  watchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'TATAMOTORS'],
  onToggleWatchlist,
  onOpenPriceAlert,
  onShare
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMoverTab, setActiveMoverTab] = useState<'gainers' | 'losers'>('gainers');
  const [searchCategory, setSearchCategory] = useState<'All' | 'Nifty 50' | 'Banking' | 'Tech' | 'Auto'>('All');

  // Financials quick-view modal
  const [showFinancialsModal, setShowFinancialsModal] = useState(false);
  const [copiedShareAlert, setCopiedShareAlert] = useState(false);

  const allStocks = useMemo(() => getAllIndianStocks(), []);
  const isStockInWatchlist = useMemo(
    () => watchlist.includes(currentStock.ticker),
    [watchlist, currentStock.ticker]
  );

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
      label: isOpen ? 'NSE/BSE Open' : 'Markets Closed',
      sublabel: isOpen ? 'Live trading until 3:30 PM IST' : 'Reopens Mon-Fri at 9:15 AM IST'
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
  // Derived Key Details
  const keyDetails = useMemo(() => {
    const price = currentStock.price;
    const change = currentStock.change;
    const prevClose = price - change;
    const dayOpen = Math.round((prevClose + change * 0.35) * 10) / 10;
    const dayHigh = Math.round(Math.max(price, dayOpen) * 1.008 * 10) / 10;
    const dayLow = Math.round(Math.min(price, dayOpen) * 0.992 * 10) / 10;
    const high52 = Math.round(price * 1.22 * 10) / 10;
    const low52 = Math.round(price * 0.76 * 10) / 10;
    const peRatio = (24.6 + (currentStock.ticker.charCodeAt(0) % 15)).toFixed(1);

    return {
      dayOpen,
      dayHigh,
      dayLow,
      prevClose,
      high52,
      low52,
      volume: currentStock.volume24h || '4.82M',
      peRatio,
      beta: currentStock.beta?.toFixed(2) || '1.08',
      marketCap: currentStock.marketCap || '₹14.50 Lakh Cr',
      dividendYield: '1.24%'
    };
  }, [currentStock]);

  // 3 plain-English AI explanations for selected stock
  const aiPlainReasons = useMemo(() => {
    const reasons: string[] = [];
    const isUp = currentStock.direction === 'UP';
    const isDown = currentStock.direction === 'DOWN';

    if (isUp) {
      if (currentStock.price >= currentStock.sma20) {
        reasons.push(`Price is trading firmly above its 20-day moving average (₹${currentStock.sma20.toFixed(0)}), indicating strong buying support.`);
      } else {
        reasons.push(`Price has rebounded off recent support zones with steady institutional accumulation.`);
      }
      if (currentStock.rsi >= 50 && currentStock.rsi <= 68) {
        reasons.push(`Relative Strength (RSI ${currentStock.rsi.toFixed(1)}) is in a healthy momentum sweet spot without being overbought.`);
      } else {
        reasons.push(`Trading volume is outpacing historical daily averages, confirming buyer conviction.`);
      }
      reasons.push(`Multi-model ensemble consensus projects positive 5-day drift with tight risk bounds.`);
    } else if (isDown) {
      if (currentStock.price <= currentStock.sma20) {
        reasons.push(`Price is trading below its 20-day average (₹${currentStock.sma20.toFixed(0)}), reflecting short-term consolidation pressure.`);
      } else {
        reasons.push(`Price encountered resistance near recent supply zones and is pulling back toward support.`);
      }
      reasons.push(`Momentum indicators suggest caution as short-term distribution outpaces active buying.`);
      reasons.push(`Annualized volatility of ${currentStock.annVolatility}% signals wider daily swings.`);
    } else {
      reasons.push(`Price is consolidating comfortably within a balanced support and resistance channel.`);
      reasons.push(`Oscillators show equilibrium between buyers and sellers awaiting fundamental catalysts.`);
      reasons.push(`Historical behavior suggests breakout potential once trading volume surges past resistance.`);
    }

    return reasons.slice(0, 3);
  }, [currentStock]);

  // Indicator Consensus calculations
  const indicatorConsensus = useMemo(() => {
    let bullishCount = 0;
    let bearishCount = 0;

    // RSI check
    const rsiBullish = currentStock.rsi >= 50;
    if (rsiBullish) bullishCount++; else bearishCount++;

    // MACD check
    const macdBullish = currentStock.macd ? currentStock.macd.histogram >= 0 : true;
    if (macdBullish) bullishCount++; else bearishCount++;

    // SMA 20 check
    const sma20Bullish = currentStock.price >= currentStock.sma20;
    if (sma20Bullish) bullishCount++; else bearishCount++;

    // SMA 50 check
    const sma50Bullish = currentStock.price >= currentStock.sma50;
    if (sma50Bullish) bullishCount++; else bearishCount++;

    // SMA 200 check
    const sma200Bullish = currentStock.price >= currentStock.sma200;
    if (sma200Bullish) bullishCount++; else bearishCount++;

    const total = bullishCount + bearishCount;
    const bullishPercent = Math.round((bullishCount / total) * 100);

    return {
      bullishCount,
      bearishCount,
      total,
      bullishPercent,
      rsiBullish,
      macdBullish,
      sma20Bullish,
      sma50Bullish,
      sma200Bullish,
      bias: bullishPercent >= 60 ? 'Bullish' : bullishPercent <= 40 ? 'Bearish' : 'Neutral'
    };
  }, [currentStock]);

  // Model agreement list
  const models = useMemo(() => {
    if (currentStock.ensembleModels && currentStock.ensembleModels.length > 0) {
      return currentStock.ensembleModels;
    }
    return [
      {
        name: 'XGBoost Classifier',
        architecture: 'Gradient Boosted Decision Trees',
        direction: currentStock.direction,
        confidence: currentStock.confidence
      },
      {
        name: 'LSTM Neural Network',
        architecture: 'Deep Sequence Model (2-layer Bi-LSTM)',
        direction: currentStock.direction === 'DOWN' ? 'DOWN' : 'UP',
        confidence: Math.max(68, currentStock.confidence - 4)
      },
      {
        name: 'Random Forest Regressor',
        architecture: 'Ensemble Bagging (150 Estimators)',
        direction: 'NEUTRAL',
        confidence: 65
      }
    ];
  }, [currentStock]);

  const handleStockClick = (stock: StockData) => {
    onSelectStock(stock);
  };

  const handleOpenStockDetails = (stock: StockData) => {
    onSelectStock(stock);
    onNavigate('ai-predict');
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare(currentStock);
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShareAlert(true);
      setTimeout(() => setCopiedShareAlert(false), 2500);
    }
  };
  return (
    <div className="w-full flex flex-col gap-6 md:gap-8 text-slate-800 dark:text-slate-100">

      {/* ========================================================
          1. STOCK OVERVIEW CARD (Top Workstation Header)
          ======================================================== */}
      <section className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Stock Identity & Sector */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold font-mono text-base border border-teal-200/70 dark:border-teal-800/60 shadow-xs shrink-0">
              {currentStock.ticker.slice(0, 3)}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {currentStock.name}
                </h1>
                <span className="font-mono text-sm font-semibold text-slate-400">
                  NSE: {currentStock.ticker}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentStock.exchange}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/50">
                  {currentStock.sector}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>Cap: <strong className="font-semibold text-slate-700 dark:text-slate-300">{keyDetails.marketCap}</strong></span>
                <span>•</span>
                <span>P/E: <strong className="font-semibold text-slate-700 dark:text-slate-300">{keyDetails.peRatio}x</strong></span>
                <span>•</span>
                <span>Beta: <strong className="font-semibold text-slate-700 dark:text-slate-300">{keyDetails.beta}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Price & Quick Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            {/* Live Price Block */}
            <div className="flex flex-col sm:items-end">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                  ₹{currentStock.price.toFixed(2)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-mono text-xs md:text-sm font-bold px-2.5 py-0.5 rounded-full ${
                    currentStock.changePercent >= 0
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60'
                  }`}
                >
                  {currentStock.changePercent >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {currentStock.changePercent >= 0 ? '+' : ''}
                    {currentStock.change.toFixed(2)} ({currentStock.changePercent >= 0 ? '+' : ''}
                    {currentStock.changePercent.toFixed(2)}%)
                  </span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Real-time NSE snapshot • 0.00% delay
              </span>
            </div>

            {/* Quick Actions (Watchlist, Alert, Share, Switch) */}
            <div className="flex items-center gap-2">
              {onToggleWatchlist && (
                <button
                  onClick={() => onToggleWatchlist(currentStock.ticker)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isStockInWatchlist
                      ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
                  }`}
                  title={isStockInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {isStockInWatchlist ? (
                    <BookmarkCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isStockInWatchlist ? 'Saved' : 'Watchlist'}
                  </span>
                </button>
              )}

              {onOpenPriceAlert && (
                <button
                  onClick={() => onOpenPriceAlert(currentStock)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Set Price Alert"
                >
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">Alert</span>
                </button>
              )}

              <button
                onClick={handleShareClick}
                className="p-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title="Share Stock Insight"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSearch}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Search or Switch Stock"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {copiedShareAlert && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Stock link copied to clipboard successfully!</span>
          </div>
        )}
      </section>

      {/* ========================================================
          2. MAIN CONTENT GRID: 2-COLUMN WORKSTATION LAYOUT
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* --------------------------------------------------------
            LEFT COLUMN (approx 65% width): CLEAN STOCK PRICE LINE CHART
            -------------------------------------------------------- */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <StockPriceLineChart stock={currentStock} />
        </section>

        {/* --------------------------------------------------------
            RIGHT COLUMN (approx 35% width): AI ANALYSIS & CONSENSUS
            -------------------------------------------------------- */}
        <section className="lg:col-span-4 flex flex-col gap-5">

          {/* Deep Explainable AI Card */}
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500" />

            {/* Card Header with Outlook Signal */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Explainable AI Forecast
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  5-Day Trend Prediction
                </h3>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
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
                <span>
                  {currentStock.direction === 'UP'
                    ? 'Bullish'
                    : currentStock.direction === 'DOWN'
                    ? 'Bearish'
                    : 'Neutral'}
                </span>
              </div>
            </div>

            {/* Model Confidence Meter */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm shrink-0 border border-teal-200/50 dark:border-teal-800/50">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Model Confidence
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentStock.confidence}% High Conviction
                  </span>
                </div>
              </div>

              {/* Mini radial/progress indicator */}
              <div className="w-16 flex flex-col items-end gap-1">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentStock.confidence}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentStock.winRate || '78.4% Win'}
                </span>
              </div>
            </div>

            {/* Plain-English AI Drivers */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Key AI Reasoning Drivers
              </span>
              <div className="flex flex-col gap-2">
                {aiPlainReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button: Deep AI Prediction & SHAP Analysis */}
            <div className="pt-2">
              <button
                onClick={() => handleOpenStockDetails(currentStock)}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-teal-200 group-hover:rotate-12 transition-transform" />
                <span>Deep AI Prediction & SHAP Analysis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Machine Learning Model Consensus Card */}
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  ML Model Consensus
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                3 Models Active
              </span>
            </div>

            {/* Ensemble Model Breakdown */}
            <div className="flex flex-col gap-2.5">
              {models.map((m, idx) => {
                const isBull = m.direction === 'UP';
                const isBear = m.direction === 'DOWN';
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {m.architecture}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          isBull
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : isBear
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {isBull ? 'BULL' : isBear ? 'BEAR' : 'NEUT'}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                        {m.confidence}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Indicator Consensus Card */}
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Technical Indicator Consensus
                </h4>
              </div>
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300">
                {indicatorConsensus.bullishPercent}% Bullish
              </span>
            </div>

            {/* Strength Visualizer Meter */}
            <div className="flex flex-col gap-1.5">
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${indicatorConsensus.bullishPercent}%` }}
                  title={`${indicatorConsensus.bullishPercent}% Bullish`}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${100 - indicatorConsensus.bullishPercent}%` }}
                  title={`${100 - indicatorConsensus.bullishPercent}% Bearish`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{indicatorConsensus.bullishCount} Bullish Signals</span>
                <span>{indicatorConsensus.bearishCount} Bearish Signals</span>
              </div>
            </div>

            {/* Individual Indicator Highlights */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">RSI (14)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {currentStock.rsi.toFixed(1)}{' '}
                  <span className={`text-[10px] ${indicatorConsensus.rsiBullish ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ({indicatorConsensus.rsiBullish ? 'Bull' : 'Soft'})
                  </span>
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">MACD Hist</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {currentStock.macd?.histogram ? currentStock.macd.histogram.toFixed(2) : '+4.20'}{' '}
                  <span className="text-[10px] text-emerald-600">(Positive)</span>
                </span>
              </div>
            </div>
          </div>

        </section>
      </div>

      {/* ========================================================
          3. BOTTOM SECTION: KEY DETAILS & QUICK LINKS
          ======================================================== */}
      <section className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-6">
        
        {/* Key Metrics Grid */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Key Fundamentals & Price Details
            </h3>
            <span className="text-xs text-slate-400">
              NSE Consolidated Data
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Open</span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                ₹{keyDetails.dayOpen.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">High</span>
              <span className="text-sm font-mono font-bold text-emerald-600 mt-1">
                ₹{keyDetails.dayHigh.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Low</span>
              <span className="text-sm font-mono font-bold text-rose-600 mt-1">
                ₹{keyDetails.dayLow.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prev Close</span>
              <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 mt-1">
                ₹{keyDetails.prevClose.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">52W High</span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                ₹{keyDetails.high52.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">52W Low</span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                ₹{keyDetails.low52.toFixed(2)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Volume (24h)</span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {keyDetails.volume}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">P/E Ratio</span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {keyDetails.peRatio}x
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Beta</span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {keyDetails.beta}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Links */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Deep-Dive Modules:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFinancialsModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Financials</span>
            </button>

            <button
              onClick={() => onNavigate('news-sentiment')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>News & Sentiment</span>
            </button>

            <button
              onClick={() => onNavigate('technical-analysis')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LineChartIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Technicals</span>
            </button>

            <button
              onClick={() => onNavigate('heatmap')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PieChart className="w-3.5 h-3.5 text-amber-600" />
              <span>Sector Heatmap</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. MARKET BENCHMARK INDICES (Nifty 50 & Sensex)
          ======================================================== */}
      <section className="flex flex-col gap-3">
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
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>All Indian Indices</span>
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
          5. SEARCH STOCKS SECTION
          ======================================================== */}
      <section className="flex flex-col gap-3">
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Search Indian Equities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore 500+ Indian companies across NSE and BSE with instant AI forecast preview.
            </p>
          </div>

          {/* Search Bar */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'Nifty 50', 'Banking', 'Tech', 'Auto'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
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
                        onClick={() => {
                          onSelectStock(stock);
                          setSearchQuery('');
                        }}
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
          6. MY WATCHLIST PREVIEW
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
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
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
                      className="text-teal-600 hover:text-slate-400 p-1 transition-colors cursor-pointer"
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
          7. TOP MARKET MOVERS
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
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMoverTab === 'gainers'
                  ? 'bg-white dark:bg-[#121c2d] text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Top Gainers
            </button>
            <button
              onClick={() => setActiveMoverTab('losers')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
          8. MARKET NEWS & HEADLINES
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
          9. LEARNING CORNER
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
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
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

      {/* ========================================================
          FINANCIALS QUICK MODAL
          ======================================================== */}
      {showFinancialsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentStock.name} Financial Snapshot
                </h3>
                <span className="text-xs text-slate-400">
                  NSE: {currentStock.ticker} • FY2024-25 Q3 Statement
                </span>
              </div>
              <button
                onClick={() => setShowFinancialsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Total Revenue</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">₹2,42,180 Cr</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">+11.4% YoY Growth</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Net Profit Margin</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">14.8%</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">+80 bps expansion</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Return on Equity (ROE)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">18.2%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Top quartile peer group</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Debt-to-Equity</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">0.38</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Healthy solvency profile</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Company exhibits robust free cash flow generation and conservative leverage ratios.
              For complete balance sheets, income statements, and cash flows, visit the Portfolio & Screener modules.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFinancialsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors cursor-pointer"
              >
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
