import React, { useState, useMemo, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Sparkles,
  PieChart,
  ArrowRight,
  PlusCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { DEFAULT_MOCK_PORTFOLIO, getStockData } from '../data/stocks';

interface PositionData {
  ticker: string;
  shares: number;
  avgBuyPrice: number;
  purchaseDate: string;
}

interface PortfolioSummaryProps {
  onNavigate: (tab: ScreenTab) => void;
  onSelectStock: (stock: StockData) => void;
  watchlist?: string[];
  className?: string;
}

const STORAGE_KEY = 'stocksense_portfolio_positions_v2';

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  onNavigate,
  onSelectStock,
  watchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'TATAMOTORS'],
  className = ''
}) => {
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'today' | 'overall'>('today');

  // Load positions from localStorage or fallback to defaults
  const [positions, setPositions] = useState<Record<string, PositionData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read portfolio positions:', e);
    }

    const initial: Record<string, PositionData> = {};
    const tickersToLoad = Array.from(new Set([...Object.keys(DEFAULT_MOCK_PORTFOLIO), ...watchlist]));
    
    tickersToLoad.forEach((ticker) => {
      if (DEFAULT_MOCK_PORTFOLIO[ticker]) {
        initial[ticker] = { ...DEFAULT_MOCK_PORTFOLIO[ticker], ticker };
      } else {
        const stock = getStockData(ticker);
        const basePrice = stock ? stock.price * 0.95 : 1000;
        initial[ticker] = {
          ticker,
          shares: 40,
          avgBuyPrice: Math.round(basePrice * 100) / 100,
          purchaseDate: '2024-05-15'
        };
      }
    });
    return initial;
  });

  // Re-sync if localStorage updates
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setPositions(JSON.parse(saved));
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Compute calculated metrics
  const portfolioHoldings = useMemo(() => {
    const holdings = Object.keys(positions)
      .map((ticker) => {
        const stock = getStockData(ticker);
        if (!stock) return null;
        const pos = positions[ticker];
        if (!pos || pos.shares <= 0) return null;

        const invested = pos.shares * pos.avgBuyPrice;
        const currentValue = pos.shares * stock.price;
        const totalReturn = currentValue - invested;
        const totalReturnPct = invested > 0 ? (totalReturn / invested) * 100 : 0;
        const todayReturn = pos.shares * stock.change;
        const todayReturnPct = stock.changePercent;

        return {
          stock,
          position: pos,
          invested,
          currentValue,
          totalReturn,
          totalReturnPct,
          todayReturn,
          todayReturnPct
        };
      })
      .filter(Boolean) as Array<{
        stock: StockData;
        position: PositionData;
        invested: number;
        currentValue: number;
        totalReturn: number;
        totalReturnPct: number;
        todayReturn: number;
        todayReturnPct: number;
      }>;

    return holdings;
  }, [positions]);

  // Aggregate totals
  const totals = useMemo(() => {
    const totalInvested = portfolioHoldings.reduce((sum, h) => sum + h.invested, 0);
    const totalCurrentValue = portfolioHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalOverallPnL = totalCurrentValue - totalInvested;
    const totalOverallPnLPct = totalInvested > 0 ? (totalOverallPnL / totalInvested) * 100 : 0;

    const totalTodayPnL = portfolioHoldings.reduce((sum, h) => sum + h.todayReturn, 0);
    const prevDayValue = totalCurrentValue - totalTodayPnL;
    const totalTodayPnLPct = prevDayValue > 0 ? (totalTodayPnL / prevDayValue) * 100 : 0;

    // Top Gainers and Losers
    // Sorted by today's return percentage
    const sortedToday = [...portfolioHoldings].sort((a, b) => b.todayReturnPct - a.todayReturnPct);
    const topTodayGainer = sortedToday.length > 0 ? sortedToday[0] : null;
    const topTodayLoser = sortedToday.length > 1 ? sortedToday[sortedToday.length - 1] : null;

    // Sorted by overall return percentage
    const sortedOverall = [...portfolioHoldings].sort((a, b) => b.totalReturnPct - a.totalReturnPct);
    const topOverallGainer = sortedOverall.length > 0 ? sortedOverall[0] : null;
    const topOverallLoser = sortedOverall.length > 1 ? sortedOverall[sortedOverall.length - 1] : null;

    return {
      totalInvested,
      totalCurrentValue,
      totalOverallPnL,
      totalOverallPnLPct,
      totalTodayPnL,
      totalTodayPnLPct,
      isTodayPositive: totalTodayPnL >= 0,
      isOverallPositive: totalOverallPnL >= 0,
      topTodayGainer,
      topTodayLoser,
      topOverallGainer,
      topOverallLoser,
      holdingsCount: portfolioHoldings.length
    };
  }, [portfolioHoldings]);

  const activeTopGainer = activeTab === 'today' ? totals.topTodayGainer : totals.topOverallGainer;
  const activeTopLoser = activeTab === 'today' ? totals.topTodayLoser : totals.topOverallLoser;

  return (
    <div
      className={`bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5 ${className}`}
    >
      {/* 1. Header Bar: Identity & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/60 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Portfolio Summary
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {totals.holdingsCount} Holdings
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time asset valuation, profit/loss, and portfolio leaders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Hide/Show Balance Toggle */}
          <button
            onClick={() => setHideBalance(!hideBalance)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title={hideBalance ? 'Show portfolio values' : 'Hide portfolio values'}
            aria-label="Toggle balance visibility"
          >
            {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Navigate to Full Portfolio */}
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/40"
          >
            <span>Full Portfolio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row: Total Assets, Daily P&L, Overall Return */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Assets Card */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/90 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Total Assets
            </span>
            <span className="text-[10px] font-mono text-slate-400">Current Value</span>
          </div>
          <div>
            <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {hideBalance
                ? '••••••••'
                : `₹${totals.totalCurrentValue.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Invested:{' '}
              {hideBalance
                ? '••••••'
                : `₹${totals.totalInvested.toLocaleString('en-IN', {
                    maximumFractionDigits: 0
                  })}`}
            </p>
          </div>
        </div>

        {/* Today's P&L Card */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/90 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Today's P&L
            </span>
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                totals.isTodayPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
              }`}
            >
              {totals.isTodayPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>
                {totals.isTodayPositive ? '+' : ''}
                {totals.totalTodayPnLPct.toFixed(2)}%
              </span>
            </span>
          </div>
          <div>
            <span
              className={`font-mono text-2xl font-bold tracking-tight ${
                totals.isTodayPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {hideBalance
                ? '••••••••'
                : `${totals.isTodayPositive ? '+' : ''}₹${totals.totalTodayPnL.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              1-day performance across Indian equities
            </p>
          </div>
        </div>

        {/* Overall Return Card */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/90 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Total Returns
            </span>
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                totals.isOverallPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
              }`}
            >
              {totals.isOverallPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>
                {totals.isOverallPositive ? '+' : ''}
                {totals.totalOverallPnLPct.toFixed(2)}%
              </span>
            </span>
          </div>
          <div>
            <span
              className={`font-mono text-2xl font-bold tracking-tight ${
                totals.isOverallPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {hideBalance
                ? '••••••••'
                : `${totals.isOverallPositive ? '+' : ''}₹${totals.totalOverallPnL.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Net profit since portfolio inception
            </p>
          </div>
        </div>
      </div>

      {/* 3. Top Gainers & Losers Section */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Portfolio Leaders
          </span>

          {/* Toggle between Today's Leaders and Overall Leaders */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'today'
                  ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today's Movers
            </button>
            <button
              onClick={() => setActiveTab('overall')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'overall'
                  ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All-Time Leaders
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Top Gainer Card */}
          {activeTopGainer ? (
            <div
              onClick={() => onSelectStock(activeTopGainer.stock)}
              className="p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200 dark:border-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {activeTopGainer.stock.ticker}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      Top Gainer
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {activeTopGainer.stock.name} • {activeTopGainer.position.shares} shares
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  ₹{activeTopGainer.stock.price.toFixed(2)}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  +
                  {activeTab === 'today'
                    ? `${activeTopGainer.todayReturnPct.toFixed(2)}%`
                    : `${activeTopGainer.totalReturnPct.toFixed(2)}%`}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No holdings found
            </div>
          )}

          {/* Top Loser Card */}
          {activeTopLoser ? (
            <div
              onClick={() => onSelectStock(activeTopLoser.stock)}
              className="p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-800/60 bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-200 dark:border-rose-700">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {activeTopLoser.stock.ticker}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-100/80 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                      {activeTab === 'today' ? 'Top Dip' : 'Lagging'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {activeTopLoser.stock.name} • {activeTopLoser.position.shares} shares
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  ₹{activeTopLoser.stock.price.toFixed(2)}
                </span>
                <span
                  className={`font-mono text-xs font-bold flex items-center ${
                    (activeTab === 'today' ? activeTopLoser.todayReturnPct : activeTopLoser.totalReturnPct) >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {(activeTab === 'today' ? activeTopLoser.todayReturnPct : activeTopLoser.totalReturnPct) >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {(activeTab === 'today' ? activeTopLoser.todayReturnPct : activeTopLoser.totalReturnPct) >= 0 ? '+' : ''}
                  {activeTab === 'today'
                    ? `${activeTopLoser.todayReturnPct.toFixed(2)}%`
                    : `${activeTopLoser.totalReturnPct.toFixed(2)}%`}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No holdings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
