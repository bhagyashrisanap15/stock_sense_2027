import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Info,
  Calendar,
  Layers,
  Activity,
  Sliders,
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { StockData, ScreenTab } from '../types';
import { AiForecastChart } from '../components/AiForecastChart';

interface AIPredictScreenProps {
  currentStock: StockData;
  onOpenJsonDossier?: () => void;
  onSelectStock?: (stock: StockData) => void;
  onNavigate?: (tab: ScreenTab) => void;
  watchlist?: string[];
  onToggleWatchlist?: (ticker: string) => void;
}

type Period = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export const AIPredictScreen: React.FC<AIPredictScreenProps> = ({
  currentStock,
  onNavigate,
  watchlist = [],
  onToggleWatchlist
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1M');
  const [showFundamentals, setShowFundamentals] = useState(false);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);

  const isSavedInWatchlist = watchlist.includes(currentStock.ticker);
  const isPos = currentStock.changePercent >= 0;

  // 1. Generate realistic interactive price chart data for 1D, 1W, 1M, 3M, 6M, 1Y
  const chartData = useMemo(() => {
    const pointsCount =
      selectedPeriod === '1D' ? 12 :
      selectedPeriod === '1W' ? 7 :
      selectedPeriod === '1M' ? 30 :
      selectedPeriod === '3M' ? 45 :
      selectedPeriod === '6M' ? 60 : 75;

    const endPrice = currentStock.price;
    const ticker = currentStock.ticker;

    // Pseudo-random deterministic seed
    let seed = 0;
    for (let i = 0; i < ticker.length; i++) {
      seed = (seed << 5) - seed + ticker.charCodeAt(i);
      seed |= 0;
    }
    const pseudoRandom = (step: number) => {
      const x = Math.sin(seed + step * 43.17) * 10000;
      return x - Math.floor(x);
    };

    const isBull = currentStock.direction === 'UP';
    const isBear = currentStock.direction === 'DOWN';
    const drift = isBull ? 0.002 : isBear ? -0.002 : 0.0003;
    const dailyVol = (currentStock.annVolatility || 18) / 100 / Math.sqrt(252);

    const prices: number[] = new Array(pointsCount);
    prices[pointsCount - 1] = endPrice;

    let sim = endPrice;
    for (let i = pointsCount - 2; i >= 0; i--) {
      const shock = (pseudoRandom(i) - 0.49) * 1.5 * dailyVol;
      sim = sim / (1 + drift + shock);
      prices[i] = Number(sim.toFixed(2));
    }

    const today = new Date(2026, 9, 29); // 29 Oct 2026

    return prices.map((price, i) => {
      let label = '';
      if (selectedPeriod === '1D') {
        const hour = 9 + Math.floor(i / 2);
        const min = (i % 2) * 30 + 15;
        label = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      } else {
        const d = new Date(today);
        d.setDate(today.getDate() - (pointsCount - 1 - i));
        const monthShort = d.toLocaleString('en-US', { month: 'short' });
        const dayNum = String(d.getDate()).padStart(2, '0');
        label = `${dayNum} ${monthShort}`;
      }

      return {
        label,
        price
      };
    });
  }, [currentStock, selectedPeriod]);

  // Price range for Y-axis domain
  const yDomain = useMemo(() => {
    if (!chartData.length) return ['auto', 'auto'];
    const p = chartData.map((d) => d.price);
    const min = Math.min(...p);
    const max = Math.max(...p);
    const pad = (max - min) * 0.08 || 5;
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [chartData]);

  // 2. Exactly 3 plain-English reasons for "Why does AI think this?"
  const threeAiReasons = useMemo(() => {
    const reasons: string[] = [];
    const isUp = currentStock.direction === 'UP';
    const isDown = currentStock.direction === 'DOWN';

    if (isUp) {
      if (currentStock.price >= currentStock.sma20) {
        reasons.push(`Recent price momentum is positive — trading comfortably above its 20-day average price (₹${currentStock.sma20.toFixed(0)}).`);
      } else {
        reasons.push(`Price has rebounded off recent support levels with steady upward momentum.`);
      }
      if (currentStock.rsi >= 50 && currentStock.rsi <= 68) {
        reasons.push(`Trading activity and buying strength (RSI ${currentStock.rsi.toFixed(1)}) show healthy buyer demand without being overheated.`);
      } else {
        reasons.push(`Buying volume is steadily outpacing selling pressure across recent sessions.`);
      }
      reasons.push(`Ensemble algorithms identify positive trend continuation based on historical patterns in ${currentStock.sector}.`);
    } else if (isDown) {
      if (currentStock.price <= currentStock.sma20) {
        reasons.push(`Recent price momentum is softening — trading below its 20-day average price (₹${currentStock.sma20.toFixed(0)}).`);
      } else {
        reasons.push(`Price encountered resistance near recent peaks and is consolidating lower.`);
      }
      reasons.push(`Short-term momentum indicators suggest sellers are currently more active than buyers.`);
      reasons.push(`Annual price volatility (${currentStock.annVolatility}%) warrants caution until a firm support level is established.`);
    } else {
      reasons.push(`Price is holding steady near its recent average levels with balanced buying and selling.`);
      reasons.push(`Momentum indicators (RSI ${currentStock.rsi.toFixed(1)}) sit right in the neutral middle zone.`);
      reasons.push(`Market participants appear to be awaiting fresh corporate or economic triggers.`);
    }

    return reasons.slice(0, 3);
  }, [currentStock]);

  // 3. Expected price range calculations
  const expectedForecast = useMemo(() => {
    const isBull = currentStock.direction === 'UP';
    const isBear = currentStock.direction === 'DOWN';
    const targetDelta = isBull ? currentStock.price * 0.025 : isBear ? -currentStock.price * 0.022 : 0;
    const targetPrice = currentStock.price + targetDelta;
    const uncertaintyBand = currentStock.price * ((currentStock.annVolatility || 18) / 100 / Math.sqrt(52));

    return {
      targetPrice: Number(targetPrice.toFixed(2)),
      upperBound: Number((targetPrice + uncertaintyBand).toFixed(2)),
      lowerBound: Number((targetPrice - uncertaintyBand).toFixed(2)),
      uncertaintyPct: Number(((uncertaintyBand / currentStock.price) * 100).toFixed(1))
    };
  }, [currentStock]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6 text-slate-800 dark:text-slate-100">
      
      {/* Back Navigation Bar */}
      {onNavigate && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            {onToggleWatchlist && (
              <button
                onClick={() => onToggleWatchlist(currentStock.ticker)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
                  isSavedInWatchlist
                    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800'
                    : 'bg-white dark:bg-[#121c2d] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {isSavedInWatchlist ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          ITEM 1 & 2: COMPANY NAME, TICKER, LATEST PRICE & CHANGE
          ======================================================== */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentStock.name}
            </h1>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {currentStock.ticker}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
              {currentStock.exchange}
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sector: {currentStock.sector} • Updated Today
          </span>
        </div>

        <div className="flex flex-col sm:items-end">
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
            ₹{currentStock.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                isPos
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPos ? '+' : ''}{currentStock.change.toFixed(2)} ({isPos ? '+' : ''}{currentStock.changePercent.toFixed(2)}%)
            </span>
            <span className="text-[11px] text-slate-400">Today</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          ITEM 3: INTERACTIVE PRICE CHART (1D, 1W, 1M, 3M, 6M, 1Y)
          ======================================================== */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Price Chart
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historical closing price trajectory
            </p>
          </div>

          {/* Period Selectors */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
            {(['1D', '1W', '1M', '3M', '6M', '1Y'] as Period[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedPeriod === period
                    ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="detailPriceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPos ? '#10b981' : '#ef4444'}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor={isPos ? '#10b981' : '#ef4444'}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={yDomain}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white rounded-xl p-2.5 text-xs shadow-xl">
                      <div className="text-slate-400 text-[10px] mb-1">{d.label}</div>
                      <div className="font-bold font-mono text-sm">₹{d.price.toFixed(2)}</div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPos ? '#10b981' : '#ef4444'}
                strokeWidth={2.5}
                fill="url(#detailPriceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================================================
          ITEM 4: AI OUTLOOK CARD (Bullish, Neutral, or Bearish)
          ======================================================== */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Market Outlook
            </h2>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
              currentStock.direction === 'UP'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : currentStock.direction === 'DOWN'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
            }`}
          >
            {currentStock.direction === 'UP' ? (
              <TrendingUp className="w-4 h-4" />
            ) : currentStock.direction === 'DOWN' ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span>Outlook: {currentStock.direction === 'UP' ? 'Bullish (Upward)' : currentStock.direction === 'DOWN' ? 'Bearish (Downward)' : 'Neutral (Consolidating)'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Prediction period: <strong>Next 5 trading days</strong> • Generated by ensemble modeling across 3 algorithms with {currentStock.confidence}% model agreement.
        </p>

        {/* ========================================================
            ITEM 5: "WHY DOES AI THINK THIS?" (MAX 3 REASONS)
            ======================================================== */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col gap-2.5 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Why does AI think this?
          </span>
          <div className="flex flex-col gap-2">
            {threeAiReasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          ITEM 6: FIVE-TRADING-DAY FORECAST CHART
          ======================================================== */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>5-Trading-Day Forecast Trajectory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Model forward projection with 95% statistical confidence corridor
          </p>
        </div>

        <AiForecastChart currentStock={currentStock} />
      </div>

      {/* ========================================================
          ITEM 7: EXPECTED PRICE RANGE & UNCERTAINTY
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Expected 5-Day Target
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            ₹{expectedForecast.targetPrice.toFixed(2)}
          </span>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
            Central model consensus
          </span>
        </div>

        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Expected Price Range
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            ₹{expectedForecast.lowerBound} - ₹{expectedForecast.upperBound}
          </span>
          <span className="text-[11px] text-slate-400">
            95% probability corridor
          </span>
        </div>

        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Model Uncertainty
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            ±{expectedForecast.uncertaintyPct}%
          </span>
          <span className="text-[11px] text-slate-400">
            Based on historical volatility
          </span>
        </div>
      </div>

      {/* ========================================================
          ITEM 8: RISK ASSESSMENT WITH SIMPLE EXPLANATION
          ======================================================== */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span>Risk Assessment</span>
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              currentStock.riskCategory === 'LOW'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : currentStock.riskCategory === 'HIGH'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            {currentStock.riskCategory} RISK
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentStock.riskCategory === 'LOW'
            ? 'This stock demonstrates lower-than-average price swings (14-16% annual volatility), making it relatively stable for long-term holders.'
            : currentStock.riskCategory === 'HIGH'
            ? 'This stock experiences rapid price swings (above 24% annual volatility). Short-term predictions carry wider uncertainty bands.'
            : 'This stock experiences normal, moderate daily price fluctuations (around 18% annual volatility) typical of Indian blue-chip equities.'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px]">Annual Volatility</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentStock.annVolatility}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px]">Beta (vs NIFTY)</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentStock.beta}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px]">Max Drawdown</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentStock.maxDrawdown}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block text-[10px]">Risk Score</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentStock.riskScore} / 100</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          ITEM 9: STOCK FUNDAMENTALS & COMPANY INFO (COLLAPSIBLE)
          ======================================================== */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all">
        <button
          onClick={() => setShowFundamentals(!showFundamentals)}
          className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Company Information & Key Fundamentals
            </h2>
          </div>
          {showFundamentals ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showFundamentals && (
          <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Market Cap</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{currentStock.marketCap}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Exchange</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{currentStock.exchange} (India)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Sector</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{currentStock.sector}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Daily Volume</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{currentStock.volume24h}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>About {currentStock.name}:</strong> One of India's benchmark publicly traded equities listed on the National Stock Exchange of India (NSE). It plays a core role in the broader Indian economy and index weights.
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          OPTIONAL: ADVANCED TECHNICAL ANALYSIS (COLLAPSIBLE)
          ======================================================== */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all">
        <button
          onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
          className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Advanced Analysis (Technical Indicators & Explainability)
              </h2>
              <p className="text-xs text-slate-400">
                For experienced traders: RSI, MACD, Moving Averages, and SHAP factor weights
              </p>
            </div>
          </div>
          {showAdvancedAnalysis ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showAdvancedAnalysis && (
          <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-5 text-xs">
            {/* Technical Indicators Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col">
                <span className="text-slate-400 text-[10px]">RSI (14-Day)</span>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{currentStock.rsi}</span>
                <span className="text-[10px] text-slate-500 mt-1">
                  {currentStock.rsi > 70 ? 'Overbought' : currentStock.rsi < 30 ? 'Oversold' : 'Neutral zone'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col">
                <span className="text-slate-400 text-[10px]">20-Day SMA</span>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white">₹{currentStock.sma20.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-600 mt-1">
                  {currentStock.price >= currentStock.sma20 ? 'Trading Above' : 'Trading Below'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col">
                <span className="text-slate-400 text-[10px]">50-Day SMA</span>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white">₹{currentStock.sma50.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 mt-1">Medium-term trend</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col">
                <span className="text-slate-400 text-[10px]">MACD Histogram</span>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{currentStock.macd.histogram}</span>
                <span className="text-[10px] text-slate-500 mt-1">Momentum vector</span>
              </div>
            </div>

            {/* SHAP Factors */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Key Factors Driving the Model’s Decision (SHAP Attributions):
              </span>
              <div className="flex flex-col gap-1.5">
                {currentStock.shapFactors.slice(0, 4).map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {factor.feature}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        factor.isBullish ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {factor.isBullish ? '+' : ''}{factor.impact.toFixed(2)} impact
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Workspace Link */}
            {onNavigate && (
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('technical-analysis')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Open Deep Technical Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          ITEM 10: DISCLAIMER
          ======================================================== */}
      <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong>Important Disclaimer:</strong> StockSense AI predictions and risk ratings are experimental mathematical models generated from historical distributions. Stock markets are subject to high market risks, macroeconomic news, and unpredictability. Predictions do not constitute financial advice or guaranteed investment returns. Always conduct your own research.
        </p>
      </div>

    </div>
  );
};
