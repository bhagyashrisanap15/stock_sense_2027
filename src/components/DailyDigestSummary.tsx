import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Compass,
  Zap,
  Layers,
  Activity,
  ShieldCheck,
  BarChart3,
  Calendar,
  Flame,
  Plus,
  Clock,
  ArrowRight
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { getAllIndianStocks, getStockData, INDICES_DATA } from '../data/stocks';
import { NSE500_SECTORS_DATA, NSESectorNode } from '../data/nse500';

interface DailyDigestSummaryProps {
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
  watchlist: string[];
  onToggleWatchlist?: (ticker: string) => void;
  currentStock?: StockData;
}

type DigestTab = 'all' | 'movers' | 'sectors' | 'watchlist';

export const DailyDigestSummary: React.FC<DailyDigestSummaryProps> = ({
  onSelectStock,
  onNavigate,
  watchlist = [],
  onToggleWatchlist,
  currentStock
}) => {
  const [activeTab, setActiveTab] = useState<DigestTab>('all');
  const [moverType, setMoverType] = useState<'gainers' | 'losers'>('gainers');

  // Today's formatted date string (e.g., Friday, 30 Oct 2026)
  const todayFormatted = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  // Compute live Indian equities
  const allStocks = useMemo(() => getAllIndianStocks(), []);

  // 1. Top Movers: Gainers and Losers
  const { topGainers, topLosers, mostActive } = useMemo(() => {
    const sorted = [...allStocks].sort((a, b) => b.changePercent - a.changePercent);
    const gainers = sorted.filter((s) => s.changePercent > 0).slice(0, 5);
    const losers = [...sorted].reverse().filter((s) => s.changePercent < 0).slice(0, 5);
    // Most active by volume proxy or highest volatility swing
    const active = [...allStocks]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 4);

    return { topGainers: gainers, topLosers: losers, mostActive: active };
  }, [allStocks]);

  // 2. Sector Highlights
  const sectorHighlights = useMemo(() => {
    const sectors = [...NSE500_SECTORS_DATA];
    const sorted = sectors.sort((a, b) => b.changePercent - a.changePercent);
    const topSector = sorted[0];
    const runnerUpSector = sorted[1];
    const laggingSector = sorted[sorted.length - 1];

    let totalAdvances = 0;
    let totalDeclines = 0;
    sectors.forEach((sec) => {
      totalAdvances += sec.advances;
      totalDeclines += sec.declines;
    });

    const totalBreadth = totalAdvances + totalDeclines;
    const advancePercent = totalBreadth > 0 ? Math.round((totalAdvances / totalBreadth) * 100) : 50;

    return {
      topSector,
      runnerUpSector,
      laggingSector,
      allSectors: sorted,
      totalAdvances,
      totalDeclines,
      advancePercent
    };
  }, []);

  // 3. Personalized Watchlist Summary
  const watchlistData = useMemo(() => {
    const stocks = watchlist.map((t) => getStockData(t)).filter(Boolean) as StockData[];
    if (stocks.length === 0) {
      return {
        stocks: [],
        avgChange: 0,
        upCount: 0,
        downCount: 0,
        bestStock: null,
        worstStock: null
      };
    }

    const totalChange = stocks.reduce((acc, s) => acc + s.changePercent, 0);
    const avgChange = totalChange / stocks.length;
    const upCount = stocks.filter((s) => s.changePercent >= 0).length;
    const downCount = stocks.length - upCount;

    const sortedByPerf = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
    const bestStock = sortedByPerf[0];
    const worstStock = sortedByPerf[sortedByPerf.length - 1];

    return {
      stocks,
      avgChange,
      upCount,
      downCount,
      bestStock,
      worstStock
    };
  }, [watchlist]);

  // VIX indicator
  const indiaVix = useMemo(() => {
    return INDICES_DATA.find((i) => i.name === 'INDIA VIX') || {
      name: 'INDIA VIX',
      value: '12.84',
      change: '-3.45%',
      isPositive: true
    };
  }, []);

  return (
    <section className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5 transition-all">
      {/* ---------------------------------------------------- */}
      {/* HEADER: Digest Title, Date & 60-Sec Market Pulse     */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-200/70 dark:border-teal-800/50 shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Daily Market Digest
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 border border-teal-200/60 dark:border-teal-800/40">
                At a Glance
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {todayFormatted}
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Bullish Market Sentiment
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline font-mono text-slate-400">
                VIX: {indiaVix.value} ({indiaVix.change})
              </span>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0 self-start md:self-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All in One
          </button>
          <button
            onClick={() => setActiveTab('movers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'movers'
                ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Top Movers
          </button>
          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'sectors'
                ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sector Highlights
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'watchlist'
                ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Watchlist Update
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 60-SECOND EXECUTIVE BRIEFING BANNER                  */}
      {/* ---------------------------------------------------- */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-200/50 dark:border-teal-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white font-semibold">Today's Pulse:</strong>{' '}
            Indian indices continue resilient trading. Sectoral strength is heavily anchored by{' '}
            <strong className="text-teal-700 dark:text-teal-300">{sectorHighlights.topSector.name}</strong> (+{sectorHighlights.topSector.changePercent}%),
            with <strong className="text-emerald-700 dark:text-emerald-300">{sectorHighlights.advancePercent}%</strong> market breadth in the green.
          </p>
        </div>
        <button
          onClick={() => onNavigate('overview')}
          className="text-xs font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Market Summary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB: ALL-IN-ONE (3 Balanced Pillars side-by-side)    */}
      {/* ---------------------------------------------------- */}
      {(activeTab === 'all' || activeTab === 'movers') && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* ---------------- PILLAR 1: TOP MOVERS ---------------- */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Top Market Movers
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {moverType === 'gainers' ? 'Leading Gainers' : 'Deepest Pullbacks'}
                    </span>
                  </div>
                </div>

                {/* Gainer / Loser Switcher */}
                <div className="flex items-center bg-white dark:bg-[#121c2d] border border-slate-200 dark:border-slate-700 p-0.5 rounded-lg text-[11px]">
                  <button
                    onClick={() => setMoverType('gainers')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                      moverType === 'gainers'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Gainers
                  </button>
                  <button
                    onClick={() => setMoverType('losers')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                      moverType === 'losers'
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Losers
                  </button>
                </div>
              </div>

              {/* Movers List */}
              <div className="flex flex-col gap-2">
                {(moverType === 'gainers' ? topGainers : topLosers).slice(0, 4).map((stock) => {
                  const isPos = stock.changePercent >= 0;
                  const isCurrent = currentStock?.ticker === stock.ticker;
                  return (
                    <div
                      key={stock.ticker}
                      onClick={() => onSelectStock(stock)}
                      className={`p-2.5 rounded-xl bg-white dark:bg-[#121c2d] border hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer flex items-center justify-between group ${
                        isCurrent
                          ? 'border-teal-400 ring-1 ring-teal-400/30'
                          : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                            {stock.ticker}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal truncate max-w-[120px]">
                            {stock.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {stock.sector}
                        </span>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          ₹{stock.price.toFixed(2)}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-bold flex items-center gap-0.5 ${
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

              <button
                onClick={() => onNavigate('markets')}
                className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View All 500+ NSE Movers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ---------------- PILLAR 2: SECTOR HIGHLIGHTS ---------------- */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Sector Highlights
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Industry Performance Leaders
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('heatmap')}
                  className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Heatmap</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Market Breadth Indicator */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#121c2d] border border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    NSE Breadth: {sectorHighlights.totalAdvances} Adv / {sectorHighlights.totalDeclines} Dec
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    {sectorHighlights.advancePercent}% Green
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${sectorHighlights.advancePercent}%` }}
                    title={`${sectorHighlights.totalAdvances} Advancing`}
                  />
                  <div
                    className="bg-rose-500 h-full transition-all duration-500"
                    style={{ width: `${100 - sectorHighlights.advancePercent}%` }}
                    title={`${sectorHighlights.totalDeclines} Declining`}
                  />
                </div>
              </div>

              {/* Leading Sectors Stack */}
              <div className="flex flex-col gap-2">
                {sectorHighlights.allSectors.slice(0, 3).map((sec) => {
                  const isPos = sec.changePercent >= 0;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => onNavigate('heatmap')}
                      className="p-2 rounded-xl bg-white dark:bg-[#121c2d] border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors truncate">
                            {sec.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {sec.code}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {sec.advances} up • {sec.declines} down • {sec.stocksCount} stocks
                        </span>
                      </div>

                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                          isPos
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {isPos ? '+' : ''}{sec.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Lagging: <strong>{sectorHighlights.laggingSector.name}</strong></span>
                <span className="font-mono text-rose-600">
                  {sectorHighlights.laggingSector.changePercent > 0 ? '+' : ''}
                  {sectorHighlights.laggingSector.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* ---------------- PILLAR 3: PERSONALIZED WATCHLIST UPDATE ---------------- */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      My Watchlist Update
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {watchlistData.stocks.length} tracked equities
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('watchlist')}
                  className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Open List</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {watchlistData.stocks.length > 0 ? (
                <>
                  {/* Performance Summary Pill */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#121c2d] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Watchlist Day Avg
                      </span>
                      <span
                        className={`text-sm font-bold font-mono flex items-center gap-1 ${
                          watchlistData.avgChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {watchlistData.avgChange >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {watchlistData.avgChange >= 0 ? '+' : ''}
                        {watchlistData.avgChange.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {watchlistData.upCount} Up
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                        {watchlistData.downCount} Down
                      </span>
                    </div>
                  </div>

                  {/* Top Performer in Watchlist */}
                  {watchlistData.bestStock && (
                    <div
                      onClick={() => onSelectStock(watchlistData.bestStock!)}
                      className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-between cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors group"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                            ⭐ Top Performer
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {watchlistData.bestStock.ticker}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {watchlistData.bestStock.name}
                        </span>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          ₹{watchlistData.bestStock.price.toFixed(2)}
                        </span>
                        <span className="font-mono text-xs font-bold text-emerald-600">
                          +{watchlistData.bestStock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Compact list of 2 more saved stocks */}
                  <div className="flex flex-col gap-1.5">
                    {watchlistData.stocks.slice(1, 3).map((stock) => {
                      const isPos = stock.changePercent >= 0;
                      return (
                        <div
                          key={stock.ticker}
                          onClick={() => onSelectStock(stock)}
                          className="p-2 rounded-xl bg-white dark:bg-[#121c2d] border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                              {stock.ticker}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              AI: {stock.direction} ({stock.confidence}%)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                              ₹{stock.price.toFixed(2)}
                            </span>
                            <span
                              className={`font-mono text-xs font-bold ${
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
                </>
              ) : (
                /* Empty Watchlist State */
                <div className="p-4 rounded-xl bg-white dark:bg-[#121c2d] border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No stocks in your watchlist yet
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Save stocks like Reliance, TCS, or Infosys to see your customized portfolio pulse.
                  </p>
                  <button
                    onClick={() => {
                      if (onToggleWatchlist) onToggleWatchlist('RELIANCE');
                    }}
                    className="mt-1 px-3 py-1 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Track RELIANCE</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => onNavigate('watchlist')}
                className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Manage Watchlist & Alerts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: SECTOR HIGHLIGHTS EXPANDED VIEW                 */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'sectors' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {sectorHighlights.allSectors.map((sec) => {
              const isPos = sec.changePercent >= 0;
              return (
                <div
                  key={sec.id}
                  onClick={() => onNavigate('heatmap')}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono text-slate-400 uppercase">
                        {sec.code}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                        {sec.name}
                      </h4>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                        isPos
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      }`}
                    >
                      {isPos ? '+' : ''}{sec.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                    <span>{sec.advances} Adv / {sec.declines} Dec</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {sec.stocksCount} Stocks
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: WATCHLIST EXPANDED VIEW                         */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'watchlist' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {watchlistData.stocks.map((stock) => {
              const isPos = stock.changePercent >= 0;
              const isCurrent = currentStock?.ticker === stock.ticker;
              return (
                <div
                  key={stock.ticker}
                  onClick={() => onSelectStock(stock)}
                  className={`p-4 rounded-2xl bg-white dark:bg-[#121c2d] border transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                    isCurrent
                      ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                      : 'border-slate-200/80 dark:border-slate-800 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                        {stock.ticker}
                      </h4>
                      <span className="text-xs text-slate-400 block truncate max-w-[140px]">
                        {stock.name}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-mono font-bold flex items-center ${
                        isPos ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹{stock.price.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                      AI: {stock.direction} ({stock.confidence}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
