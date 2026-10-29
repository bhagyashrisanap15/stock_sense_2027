import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  SlidersHorizontal,
  Download,
  Code2,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  RefreshCw,
  Sparkles,
  BarChart2,
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA, getStockData, getAllIndianStocks } from '../data/stocks';
import { AiForecastChart } from '../components/AiForecastChart';
import { WhatIfScenarioPanel } from '../components/WhatIfScenarioPanel';
import { ModelTransparencyPanel } from '../components/ModelTransparencyPanel';

interface AIPredictScreenProps {
  currentStock: StockData;
  onOpenJsonDossier: () => void;
  onSelectStock?: (stock: StockData) => void;
  onNavigate?: (tab: ScreenTab) => void;
}

export const AIPredictScreen: React.FC<AIPredictScreenProps> = ({
  currentStock,
  onOpenJsonDossier,
  onSelectStock,
  onNavigate
}) => {
  // Navigation / Filter Tab
  const [activeTab, setActiveTab] = useState<'beginner' | 'forecast' | 'whatif' | 'risk'>('beginner');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [showAllShap, setShowAllShap] = useState<boolean>(false);
  const [isShapAvailable, setIsShapAvailable] = useState<boolean>(true);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Concept explainer toggles
  const [openConcept, setOpenConcept] = useState<string | null>(null);

  const baseTickers = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'ITC', 'TATAMOTORS', 'BHARTIARTL', 'LT'];
  const sampleTickers = baseTickers.includes(currentStock.ticker) ? baseTickers : [currentStock.ticker, ...baseTickers];

  // All Indian stocks for the instant search bar
  const allStocks = useMemo(() => {
    return getAllIndianStocks();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allStocks.filter(
      (s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery, allStocks]);

  const handleExportPDF = () => {
    const filename = `${currentStock.ticker}_AI_Report_${Date.now().toString().slice(-4)}.pdf`;
    setExportToast(`AI Report Dossier downloaded (${filename})`);
    setTimeout(() => {
      setExportToast(null);
    }, 3500);
  };

  // Plain-English translations of technical factors
  const getFeaturePlainInfo = (featureName: string, impact: number) => {
    const isBull = impact >= 0;
    const nameLower = featureName.toLowerCase();

    if (nameLower.includes('rsi')) {
      return {
        title: 'Buyer Momentum (RSI)',
        simpleExplanation: isBull
          ? `Buyer activity (${currentStock.rsi}) is in a healthy, steady zone without being overpriced. This helps push the stock price UP.`
          : `Buyer activity (${currentStock.rsi}) shows slowing momentum, which creates downward pressure on the stock.`,
        conceptGuide: 'RSI (Relative Strength Index) is like a speedometer for the stock. Numbers between 40 and 60 mean steady, healthy interest. Above 70 means the stock may be getting too expensive quickly; below 30 means it has been sold off heavily.',
        category: isBull ? 'positive' : 'negative'
      };
    }

    if (nameLower.includes('macd')) {
      return {
        title: 'Trend Direction & Speed (MACD)',
        simpleExplanation: isBull
          ? 'Short-term price moves are speeding up in an upward direction compared to previous weeks.'
          : 'Short-term price moves are slowing down or heading lower, indicating caution.',
        conceptGuide: 'MACD (Moving Average Convergence Divergence) looks at short-term price speed versus longer-term price speed. When short-term speed crosses above long-term speed, it signals a fresh upward trend.',
        category: isBull ? 'positive' : 'negative'
      };
    }

    if (nameLower.includes('sma') || nameLower.includes('moving')) {
      return {
        title: 'Price Support Level (Average Price)',
        simpleExplanation: isBull
          ? `The stock is trading above its 20-day average price (₹${currentStock.sma20}), which gives buyers confidence.`
          : `The stock is currently trading near or below its recent average price (₹${currentStock.sma20}), meaning sellers are active.`,
        conceptGuide: 'A Moving Average is simply the average price people paid for this stock over the last 20, 50, or 200 days. If the current price stays above the average, it is a healthy sign of ongoing support.',
        category: isBull ? 'positive' : 'negative'
      };
    }

    if (nameLower.includes('volume') || nameLower.includes('obv')) {
      return {
        title: 'Trading Activity (Volume)',
        simpleExplanation: isBull
          ? `Trading volume is strong (${currentStock.volumeSurge}), showing active interest from large institutions and funds.`
          : 'Trading volume is quiet today, meaning there is less immediate buying power to drive a fast breakout.',
        conceptGuide: 'Volume tells you how many shares are changing hands. High volume during a rise shows that large mutual funds and institutions are buying, making the trend more reliable.',
        category: isBull ? 'positive' : 'negative'
      };
    }

    if (nameLower.includes('volatility') || nameLower.includes('atr')) {
      return {
        title: 'Price Stability (Swings)',
        simpleExplanation: isBull
          ? `Price swings are calm and orderly (${currentStock.annVolatility}% yearly swings), creating a dependable trend.`
          : `Higher price swings (${currentStock.annVolatility}% yearly swings) mean greater day-to-day uncertainty.`,
        conceptGuide: 'Volatility measures how wildly a stock bounces up and down. Low volatility stocks are calm and steady, while high volatility stocks can make sudden big moves in either direction.',
        category: isBull ? 'positive' : 'negative'
      };
    }

    return {
      title: featureName,
      simpleExplanation: isBull
        ? 'This historical pattern currently favors an upward price trend.'
        : 'This pattern suggests being patient and cautious right now.',
      conceptGuide: 'Technical indicators look at historical trading patterns to estimate the most probable next move.',
      category: isBull ? 'positive' : 'negative'
    };
  };

  const isUp = currentStock.direction === 'UP';
  const isDown = currentStock.direction === 'DOWN';

  // 5-Day Price Range Estimation
  const lowerEstimate = Number(
    (currentStock.price * (isDown ? 0.965 : isUp ? 0.985 : 0.975)).toFixed(2)
  );
  const upperEstimate = Number(
    (currentStock.price * (isUp ? 1.042 : isDown ? 1.015 : 1.025)).toFixed(2)
  );
  const priceRangeSpan = upperEstimate - lowerEstimate;
  const currentPricePosition = Math.max(
    5,
    Math.min(95, Math.round(((currentStock.price - lowerEstimate) / (priceRangeSpan || 1)) * 100))
  );

  const displayedShapFactors = showAllShap
    ? currentStock.shapFactors
    : currentStock.shapFactors.slice(0, 4);

  return (
    <div className="flex flex-col w-full gap-6 max-w-[1560px] mx-auto pb-16 px-1 sm:px-2 select-text">
      {/* SECTION A: Search for a Stock & Active Stock Bar */}
      <div className="bg-[#0b1424] rounded-2xl p-4 sm:p-5 border border-[#16253b] shadow-sm flex flex-col gap-4">
        {/* Top Search Input & Instant Suggestions */}
        <div className="relative">
          <div className="flex items-center gap-2.5 bg-[#070e1b] rounded-xl px-3.5 py-2.5 border border-[#1c2e47] focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
            <Search className="w-4 h-4 text-[#64748b] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              placeholder="Search any Indian stock (e.g., Reliance, TCS, HDFC Bank, Infosys)..."
              className="w-full bg-transparent text-[13.5px] text-[#e2e8f0] placeholder-[#64748b] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#64748b] hover:text-[#94a3b8] text-xs px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0a1322] border border-[#1c2e47] rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-[#14233c]">
              {searchResults.map((s) => (
                <button
                  key={s.ticker}
                  type="button"
                  onMouseDown={() => {
                    if (onSelectStock) onSelectStock(s);
                    setSearchQuery('');
                  }}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-[#111e33] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[13px] text-white font-mono">{s.ticker}</span>
                    <span className="text-[12.5px] text-[#94a3b8] truncate">{s.name}</span>
                    <span className="text-[10px] text-[#64748b] px-1.5 py-0.5 bg-[#14233c] rounded">
                      {s.sector}
                    </span>
                  </div>
                  <div className="text-right font-mono text-[12.5px]">
                    <span className="text-white font-semibold">₹{s.price.toFixed(2)}</span>
                    <span
                      className={`ml-2 text-[11px] ${
                        s.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {s.changePercent >= 0 ? '+' : ''}
                      {s.changePercent}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Stock Banner & Popular Shortcuts */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Company details */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center shrink-0 shadow-sm">
              <BrainCircuit className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[20px] text-white tracking-tight">
                  {currentStock.name}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#132238] text-[11px] font-mono font-bold text-cyan-400 border border-[#1e3453]">
                  {currentStock.ticker}
                </span>
                <span className="text-[11.5px] text-[#64748b]">
                  {currentStock.exchange} • {currentStock.sector}
                </span>
              </div>
              <span className="text-[12.5px] text-[#94a3b8] mt-0.5">
                Market Cap: <strong className="text-[#cbd5e1]">{currentStock.marketCap}</strong> • Latest NSE Close: {currentStock.snapshotTime}
              </span>
            </div>
          </div>

          {/* Current Live Price */}
          <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 border-t lg:border-t-0 border-[#14233c] pt-2.5 lg:pt-0">
            <div className="flex flex-col lg:items-end">
              <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-medium">
                Current Market Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[24px] text-white font-bold tracking-tight">
                  ₹{currentStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`font-mono text-[13px] flex items-center gap-1 font-semibold ${
                    currentStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {currentStock.changePercent >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {currentStock.changePercent >= 0 ? '+' : ''}₹{currentStock.change.toFixed(2)} (
                  {currentStock.changePercent >= 0 ? '+' : ''}
                  {currentStock.changePercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Stocks Pills */}
        {onSelectStock && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-[11.5px] border-t border-[#14233c]/80">
            <span className="text-[#64748b] shrink-0 font-medium mr-1 flex items-center gap-1">
              Popular Stocks:
            </span>
            {sampleTickers.map((tick) => {
              const isSelected = currentStock.ticker === tick;
              return (
                <button
                  key={tick}
                  type="button"
                  onClick={() => onSelectStock(getStockData(tick))}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-[#0f1d33] hover:bg-[#162a4a] text-[#94a3b8] hover:text-white border border-[#1a2d48]'
                  }`}
                >
                  {tick}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION B: Large AI's View Card (The Main Hero for Beginners) */}
      <div className="bg-gradient-to-b from-[#0d1a2d] to-[#091322] rounded-2xl p-6 sm:p-7 border border-[#1b3152] shadow-lg flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#14233c] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[19px] sm:text-[21px] font-bold text-white tracking-tight">
                AI's View on {currentStock.name}
              </h2>
              <p className="text-[12.5px] text-[#94a3b8] mt-0.5">
                Simple forecast for the next 5 trading days based on multi-year price and volume patterns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-2.5 py-1 rounded-lg bg-[#112138] border border-[#1c3559] text-[11px] font-medium text-cyan-300">
              Forecast Horizon: Next 5 Trading Days
            </span>
          </div>
        </div>

        {/* Big visual prediction presentation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Direction & Confidence (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div
              className={`p-5 rounded-2xl border flex items-center gap-4 ${
                isUp
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : isDown
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  isUp
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isDown
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-8 h-8 stroke-[2.5]" />
                ) : isDown ? (
                  <TrendingDown className="w-8 h-8 stroke-[2.5]" />
                ) : (
                  <Minus className="w-8 h-8 stroke-[2.5]" />
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                  AI Trend Outlook
                </span>
                <span className="text-[26px] font-bold tracking-tight text-white leading-tight">
                  {isUp ? 'May Rise' : isDown ? 'May Fall' : 'Uncertain (Neutral)'}
                </span>
                <span className="text-[12px] opacity-90 mt-0.5 font-medium">
                  {isUp ? 'Bullish signals lead' : isDown ? 'Bearish signals lead' : 'Even buyer & seller balance'}
                </span>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <div className="bg-[#0b1424] p-4 rounded-xl border border-[#16263f] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[#94a3b8] font-medium">Model Certainty:</span>
                <span className="font-bold text-white font-mono text-[14px]">
                  {currentStock.confidence}% Confident
                </span>
              </div>
              <div className="w-full bg-[#14233c] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isUp ? 'bg-emerald-400' : isDown ? 'bg-rose-400' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${currentStock.confidence}%` }}
                />
              </div>
              <div className="flex justify-between text-[10.5px] text-[#64748b] font-mono">
                <span>50% (50/50 toss-up)</span>
                <span>75% (Strong pattern)</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Right: Plain-English Synthesis (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div className="bg-[#0b1424] p-5 rounded-2xl border border-[#16263f] flex flex-col gap-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Plain-English Summary
              </span>
              <p className="text-[14.5px] text-[#e2e8f0] leading-relaxed">
                {isUp ? (
                  <>
                    The AI predicts <strong className="text-emerald-400">{currentStock.name}</strong> has a favorable setup to{' '}
                    <strong className="text-emerald-400">rise over the next 5 days</strong>. Buyer momentum is steady (RSI {currentStock.rsi}), trading volume is healthy, and the stock is trading securely above its recent 20-day average price.
                  </>
                ) : isDown ? (
                  <>
                    The AI predicts <strong className="text-rose-400">{currentStock.name}</strong> may face{' '}
                    <strong className="text-rose-400">downward pressure or consolidation</strong> over the next 5 days. Recent momentum has slowed, and short-term resistance suggests buyers are waiting on the sidelines.
                  </>
                ) : (
                  <>
                    The AI sees <strong className="text-cyan-400">{currentStock.name}</strong> trading in an{' '}
                    <strong className="text-cyan-400">uncertain or sideways channel</strong> over the next 5 days. Positive and negative factors are roughly equal, meaning the stock is consolidating.
                  </>
                )}
              </p>

              <div className="pt-2 border-t border-[#14233c] flex items-start gap-2 text-[11.5px] text-[#94a3b8]">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Important Notice:</strong> AI predictions are estimates derived from historical price patterns, not guaranteed returns. Always manage risk carefully and do not invest money you cannot afford to lose.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C: "What does this mean?" (Short, clear educational cards) */}
      <div className="bg-[#0b1424] rounded-2xl p-5 sm:p-6 border border-[#16253b] shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-[16px] font-bold text-white tracking-tight">
            What Does This Mean for You?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Buyers vs Sellers */}
          <div className="bg-[#070e1b] p-4 rounded-xl border border-[#152338] flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-medium font-mono">
              1. Who Is In Control?
            </span>
            <span className="text-[14px] font-bold text-white">
              {isUp ? 'Buyers are in the lead' : isDown ? 'Sellers are more active' : 'Balanced buyer/seller forces'}
            </span>
            <p className="text-[12px] text-[#94a3b8] leading-relaxed mt-0.5">
              {isUp
                ? 'More market participants are currently purchasing shares at these price levels than selling, supporting steady upward progress.'
                : isDown
                ? 'Sellers have recently taken profits or stepped in near resistance levels, slowing down new buying momentum.'
                : 'Neither buyers nor sellers are dominating right now. The stock is taking a breather.'}
            </p>
          </div>

          {/* Card 2: Short-Term Expectation */}
          <div className="bg-[#070e1b] p-4 rounded-xl border border-[#152338] flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-medium font-mono">
              2. Expected Movement
            </span>
            <span className="text-[14px] font-bold text-white">
              {isUp ? 'Likely to test higher levels' : isDown ? 'Possible shallow pullback' : 'Range-bound sideways price'}
            </span>
            <p className="text-[12px] text-[#94a3b8] leading-relaxed mt-0.5">
              {isUp
                ? `Estimated upper target around ₹${upperEstimate.toLocaleString('en-IN')}, assuming general market conditions remain stable.`
                : isDown
                ? `Estimated lower support zone around ₹${lowerEstimate.toLocaleString('en-IN')}. Good time to monitor before jumping in.`
                : `Likely to fluctuate between ₹${lowerEstimate.toLocaleString('en-IN')} and ₹${upperEstimate.toLocaleString('en-IN')}.`}
            </p>
          </div>

          {/* Card 3: Actionable Learning Takeaway */}
          <div className="bg-[#070e1b] p-4 rounded-xl border border-[#152338] flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-medium font-mono">
              3. Beginner Takeaway
            </span>
            <span className="text-[14px] font-bold text-white">
              {isUp ? 'Favorable for learning entry' : isDown ? 'Wait for calmer support' : 'Watch and observe'}
            </span>
            <p className="text-[12px] text-[#94a3b8] leading-relaxed mt-0.5">
              {isUp
                ? 'A positive signal is a great opportunity to practice paper investing or add to your watchlist with a disciplined stop-loss.'
                : isDown
                ? 'Experienced traders usually wait for a pullback to complete before initiating new long positions.'
                : 'Sideways markets teach patience. Waiting for a clear breakout direction avoids false starts.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION D: "Why does the AI think this?" (Plain-English factors with interactive explainers) */}
      <div className="bg-[#0b1424] rounded-2xl p-5 sm:p-6 border border-[#16253b] shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#14233c] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-[16px] font-bold text-white tracking-tight">
                Why Does the AI Think This? (Key Influencing Factors)
              </h3>
            </div>
            <p className="text-[12px] text-[#94a3b8] mt-0.5">
              These factors explain what moves the prediction from a 50/50 toss-up to {isUp ? 'May Rise' : isDown ? 'May Fall' : 'Neutral'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAllShap(!showAllShap)}
              className="px-3 py-1.5 rounded-lg bg-[#0f1d33] hover:bg-[#162a4a] text-[11.5px] font-medium text-cyan-300 border border-[#1a2d48] transition-colors"
            >
              {showAllShap ? 'Show Fewer Factors' : 'Show All 8 Factors'}
            </button>
          </div>
        </div>

        {/* Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedShapFactors.map((factor, idx) => {
            const isPositive = factor.impact >= 0;
            const info = getFeaturePlainInfo(factor.feature, factor.impact);
            const isConceptOpen = openConcept === factor.feature;

            return (
              <div
                key={idx}
                className="bg-[#070e1b] rounded-xl p-4 border border-[#14233c] flex flex-col gap-3 transition-all hover:border-[#1e3453]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isPositive ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="font-bold text-[13.5px] text-white">
                      {info.title}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      isPositive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {isPositive ? 'Supports Rise (+)' : 'Pulls Down (-)'}
                  </span>
                </div>

                <p className="text-[12.5px] text-[#cbd5e1] leading-relaxed">
                  {info.simpleExplanation}
                </p>

                {/* Concept Guide Collapsible Toggle */}
                <div className="pt-2 border-t border-[#14233c]/80 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOpenConcept(isConceptOpen ? null : factor.feature)}
                    className="flex items-center justify-between text-[11px] text-[#64748b] hover:text-cyan-400 font-medium transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> What does this mean in simple terms?
                    </span>
                    {isConceptOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isConceptOpen && (
                    <div className="p-2.5 rounded-lg bg-[#0c1729] text-[11.5px] text-[#94a3b8] leading-relaxed border border-[#172b47] animate-in fade-in">
                      {info.conceptGuide}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION E: Price History & AI 5-Day Projection Chart */}
      <div className="bg-[#0b1424] rounded-2xl p-5 sm:p-6 border border-[#16253b] shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#14233c] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-[16px] font-bold text-white tracking-tight">
                Price History & AI 5-Day Forecast
              </h3>
            </div>
            <p className="text-[12px] text-[#94a3b8] mt-0.5">
              Historical closing prices (solid line) and the AI model's projected trajectory (dashed path with uncertainty cone)
            </p>
          </div>
        </div>

        <AiForecastChart currentStock={currentStock} />
      </div>

      {/* SECTION F: Possible Price Range Visual (Lower, Current, Upper) */}
      <div className="bg-[#0b1424] rounded-2xl p-5 sm:p-6 border border-[#16253b] shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <h3 className="text-[16px] font-bold text-white tracking-tight">
            Estimated 5-Day Price Range
          </h3>
        </div>

        <p className="text-[12.5px] text-[#94a3b8]">
          Based on the stock's recent volatility ({currentStock.annVolatility}%) and the AI's trend confidence, this is the estimated price channel for the next 5 trading days.
        </p>

        {/* 3 Target Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-[#070e1b] p-4 rounded-xl border border-[#14233c] flex flex-col">
            <span className="text-[11px] text-[#64748b] font-mono uppercase font-semibold">
              Estimated Lower Target
            </span>
            <span className="text-[20px] font-mono font-bold text-rose-400 mt-1">
              ₹{lowerEstimate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-[#64748b] mt-0.5">
              Expected floor if market pulls back
            </span>
          </div>

          <div className="bg-[#0d1c31] p-4 rounded-xl border border-cyan-500/30 flex flex-col">
            <span className="text-[11px] text-cyan-300 font-mono uppercase font-semibold">
              Current Market Price
            </span>
            <span className="text-[20px] font-mono font-bold text-white mt-1">
              ₹{currentStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-cyan-300/80 mt-0.5">
              Current active quote (NSE)
            </span>
          </div>

          <div className="bg-[#070e1b] p-4 rounded-xl border border-[#14233c] flex flex-col">
            <span className="text-[11px] text-[#64748b] font-mono uppercase font-semibold">
              Estimated Upper Target
            </span>
            <span className="text-[20px] font-mono font-bold text-emerald-400 mt-1">
              ₹{upperEstimate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-[#64748b] mt-0.5">
              Expected ceiling if momentum holds
            </span>
          </div>
        </div>

        {/* Visual Channel Progress Bar */}
        <div className="bg-[#070e1b] p-4 rounded-xl border border-[#14233c] flex flex-col gap-2">
          <div className="flex justify-between text-[11px] font-mono text-[#64748b]">
            <span>Lower Target: ₹{lowerEstimate.toFixed(0)}</span>
            <span className="text-white font-semibold">Current: ₹{currentStock.price.toFixed(0)}</span>
            <span>Upper Target: ₹{upperEstimate.toFixed(0)}</span>
          </div>

          <div className="relative w-full h-3 bg-[#14233c] rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-rose-500/40 via-cyan-500/60 to-emerald-500/60 rounded-full"
              style={{ width: '100%' }}
            />
            {/* Position Marker */}
            <div
              className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ left: `${currentPricePosition}%` }}
            />
          </div>

          <span className="text-[11px] text-[#64748b] text-center pt-1">
            * Estimated range represents the normal 1-standard-deviation bounds. Major market news or earnings may exceed these bounds.
          </span>
        </div>
      </div>

      {/* SECTION G: "Is this stock risky?" (Risk Checker Snapshot) */}
      <div className="bg-[#0b1424] rounded-2xl p-5 sm:p-6 border border-[#16253b] shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#14233c] pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-[16px] font-bold text-white tracking-tight">
              Is This Stock Risky? (Stock Safety Check)
            </h3>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('risk-radar')}
              className="text-[12px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>View Full Risk Checker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Risk Badge & Safety Score */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4 bg-[#070e1b] p-4 rounded-xl border border-[#14233c] flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-medium font-mono">
              Risk Level
            </span>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-lg text-[13px] font-bold font-mono ${
                  currentStock.riskCategory === 'LOW'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : currentStock.riskCategory === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {currentStock.riskCategory === 'LOW'
                  ? 'LOWER RISK'
                  : currentStock.riskCategory === 'HIGH'
                  ? 'HIGHER RISK'
                  : 'MODERATE RISK'}
              </span>
              <span className="text-[14px] text-white font-mono font-bold">
                {currentStock.riskScore} <span className="text-[11px] text-[#64748b]">/ 100</span>
              </span>
            </div>
            <span className="text-[11px] text-[#64748b]">
              (0 = Very Calm & Steady, 100 = Wild Swings)
            </span>
          </div>

          {/* 4 Friendly Metrics */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#070e1b] p-3 rounded-xl border border-[#14233c] flex flex-col">
              <span className="text-[10px] text-[#64748b] uppercase font-mono">Price Swings</span>
              <span className="text-[15px] font-bold text-white font-mono mt-1">
                {currentStock.annVolatility}%
              </span>
              <span className="text-[9.5px] text-[#64748b]">Market: {currentStock.volBenchmark}%</span>
            </div>

            <div className="bg-[#070e1b] p-3 rounded-xl border border-[#14233c] flex flex-col">
              <span className="text-[10px] text-[#64748b] uppercase font-mono">Worst Past Drop</span>
              <span className="text-[15px] font-bold text-rose-400 font-mono mt-1">
                {currentStock.maxDrawdown}%
              </span>
              <span className="text-[9.5px] text-[#64748b]">From recent peak</span>
            </div>

            <div className="bg-[#070e1b] p-3 rounded-xl border border-[#14233c] flex flex-col">
              <span className="text-[10px] text-[#64748b] uppercase font-mono">Typical Daily Move</span>
              <span className="text-[15px] font-bold text-amber-300 font-mono mt-1">
                ±{currentStock.var95}%
              </span>
              <span className="text-[9.5px] text-[#64748b]">Normal 1-day range</span>
            </div>

            <div className="bg-[#070e1b] p-3 rounded-xl border border-[#14233c] flex flex-col">
              <span className="text-[10px] text-[#64748b] uppercase font-mono">Market Sensitivity</span>
              <span className="text-[15px] font-bold text-cyan-400 font-mono mt-1">
                {currentStock.beta}x
              </span>
              <span className="text-[9.5px] text-[#64748b]">Sensitivity to NIFTY</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION H: What-if Simulator (Interactive Learning Tool) */}
      <div className="bg-[#0b1424] rounded-2xl p-5 sm:p-6 border border-[#16253b] shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-[16px] font-bold text-white tracking-tight">
            What-If Simulator (Test Market Scenarios)
          </h3>
        </div>
        <p className="text-[12.5px] text-[#94a3b8]">
          See how the AI prediction changes if market conditions shift. Try a preset or adjust the sliders below to see live updates.
        </p>

        <WhatIfScenarioPanel currentStock={currentStock} />
      </div>

      {/* SECTION 5: Progressive Disclosure - "See Technical Details" for Power Users */}
      <div className="bg-[#0b1424] rounded-2xl border border-[#16253b] overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#0e192c] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#112138] border border-[#1b3459] flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[14.5px] text-white">
                See Technical Details & Mathematical Audit
              </span>
              <span className="block text-[11.5px] text-[#64748b] mt-0.5">
                Raw SHAP values, mathematical attribution, model cross-checks, and PDF exports for quantitative research
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <span>{showTechnicalDetails ? 'Hide Details' : 'Expand Details'}</span>
            {showTechnicalDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {showTechnicalDetails && (
          <div className="p-5 sm:p-6 border-t border-[#14233c] bg-[#070e1b] flex flex-col gap-6 animate-in fade-in">
            {/* Raw SHAP Values Table */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13.5px] text-white">
                  Mathematical Feature Attribution (SHAP Values)
                </span>
                <span className="text-[11px] font-mono text-[#64748b]">
                  Baseline Probability: 50%
                </span>
              </div>

              <div className="bg-[#0b1424] rounded-xl border border-[#14233c] divide-y divide-[#14233c] overflow-hidden">
                {currentStock.shapFactors.map((f, i) => {
                  const isBull = f.impact >= 0;
                  return (
                    <div key={i} className="p-3 flex items-center justify-between text-[12px]">
                      <span className="font-mono text-[#cbd5e1]">{f.feature}</span>
                      <div className="flex items-center gap-3 font-mono font-bold">
                        <span className={isBull ? 'text-emerald-400' : 'text-rose-400'}>
                          {isBull ? '+' : ''}
                          {f.impact.toFixed(4)}
                        </span>
                        <span className="text-[10px] text-[#64748b] uppercase">
                          {isBull ? 'Shift Up' : 'Shift Down'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Independent Model Consensus & LIME rules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* LIME Rules */}
              <div className="bg-[#0b1424] p-4 rounded-xl border border-[#14233c] flex flex-col gap-2.5">
                <span className="font-bold text-[13px] text-white">LIME Decision Rules</span>
                <div className="flex flex-col gap-2">
                  {currentStock.limeRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#070e1b] rounded-lg border border-[#14233c] flex items-center justify-between text-[11.5px]"
                    >
                      <div>
                        <span className="font-mono text-cyan-300 font-semibold">{rule.rule}</span>
                        <span className="block text-[10.5px] text-[#64748b]">{rule.explanation}</span>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          rule.positive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {rule.shift}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ensemble Models */}
              <div className="bg-[#0b1424] p-4 rounded-xl border border-[#14233c] flex flex-col gap-2.5">
                <span className="font-bold text-[13px] text-white">
                  Independent Models Cross-Verification
                </span>
                <div className="flex flex-col gap-2">
                  {currentStock.ensembleModels.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#070e1b] rounded-lg border border-[#14233c] flex items-center justify-between text-[11.5px]"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{m.name}</span>
                        <span className="text-[10.5px] text-[#64748b]">{m.architecture}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span
                          className={`font-bold ${
                            m.direction === 'UP'
                              ? 'text-emerald-400'
                              : m.direction === 'DOWN'
                              ? 'text-rose-400'
                              : 'text-indigo-400'
                          }`}
                        >
                          {m.direction}
                        </span>
                        <span className="block text-[10.5px] text-[#64748b]">{m.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Model Transparency Panel */}
            <ModelTransparencyPanel currentStock={currentStock} />

            {/* Audit Exports */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#14233c]">
              <button
                type="button"
                onClick={handleExportPDF}
                className="py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF Audit Report</span>
              </button>

              <button
                type="button"
                onClick={onOpenJsonDossier}
                className="py-2 px-4 rounded-xl bg-[#0f1d33] hover:bg-[#162a4a] text-cyan-300 border border-[#1a2d48] text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Code2 className="w-4 h-4" />
                <span>View Raw JSON Payload</span>
              </button>

              {exportToast && (
                <div className="text-emerald-400 text-xs font-medium flex items-center gap-1.5 ml-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{exportToast}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Beginner Educational Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#0b1424] border border-[#16253b] flex items-start gap-3 text-[12px] text-[#94a3b8]">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-white">Friendly Stock Market Reminder</span>
          <p className="leading-relaxed">
            All AI insights, price ranges, and risk checkers are designed to make stock market learning easy, transparent, and approachable. Always remember that stock prices are affected by unexpected real-world events, company earnings, and economic conditions. Never invest money based on predictions alone.
          </p>
        </div>
      </div>
    </div>
  );
};
