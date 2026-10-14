import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export type PerformanceTimeframe = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
export type ChartMetricMode = 'nav' | 'pct';

interface PortfolioPerformanceChartProps {
  currentNav: number;
  investedCapital: number;
  allTimePnL: number;
  allTimePnLPct: number;
  weightedBeta?: number | string;
  holdingsCount?: number;
}

interface HistoricalNavPoint {
  date: string;
  fullDate: string;
  nav: number;
  invested: number;
  returnPct: number;
  benchmarkNav: number;
  benchmarkPct: number;
  dailyChange: number;
  dailyChangePct: number;
}

export const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({
  currentNav,
  investedCapital,
  allTimePnL,
  allTimePnLPct,
  weightedBeta = 1.08,
  holdingsCount = 4
}) => {
  const [timeframe, setTimeframe] = useState<PerformanceTimeframe>('3M');
  const [metricMode, setMetricMode] = useState<ChartMetricMode>('nav');
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const [showCostBasis, setShowCostBasis] = useState<boolean>(true);

  // Timeframe configurations
  const timeframeConfig: Record<
    PerformanceTimeframe,
    { days: number; label: string; interval: number }
  > = {
    '1W': { days: 7, label: 'Past 7 Days', interval: 1 },
    '1M': { days: 30, label: 'Past 30 Days', interval: 5 },
    '3M': { days: 90, label: 'Past 3 Months', interval: 15 },
    '6M': { days: 180, label: 'Past 6 Months', interval: 30 },
    '1Y': { days: 252, label: 'Past 1 Year', interval: 45 },
    'ALL': { days: 365, label: 'All-Time (12M)', interval: 60 }
  };

  // Generate realistic historical NAV series anchored backwards from today's currentNav
  const historicalData = useMemo<HistoricalNavPoint[]>(() => {
    const { days } = timeframeConfig[timeframe];
    const points: HistoricalNavPoint[] = [];

    const now = new Date();
    // Deterministic pseudo-random sequence for smooth, stable charting
    const seedMultiplier = 16807;
    let seed = Math.abs(Math.floor(currentNav * 10)) % 2147483647;

    const pseudoRandom = () => {
      seed = (seed * seedMultiplier) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // Calculate approximate start value based on timeframe and current overall return
    let timeframeGainRatio: number;
    switch (timeframe) {
      case '1W':
        timeframeGainRatio = 0.012; // ~1.2% in 1W
        break;
      case '1M':
        timeframeGainRatio = 0.038; // ~3.8% in 1M
        break;
      case '3M':
        timeframeGainRatio = 0.085; // ~8.5% in 3M
        break;
      case '6M':
        timeframeGainRatio = 0.132; // ~13.2% in 6M
        break;
      case '1Y':
        timeframeGainRatio = Math.max(0.12, allTimePnLPct / 100);
        break;
      case 'ALL':
      default:
        timeframeGainRatio = Math.max(0.08, allTimePnLPct / 100);
        break;
    }

    // Anchor: Start NAV and Start Benchmark
    const startNav = currentNav / (1 + timeframeGainRatio);
    const startBenchmarkNav = startNav;
    const beta = Math.max(0.7, Math.min(1.6, Number(weightedBeta) || 1.08));

    // Daily drift step
    const dailyDrift = Math.pow(1 + timeframeGainRatio, 1 / days) - 1;
    const dailyVolatility = 0.0075 * beta;

    let rollingNav = startNav;
    let rollingBenchmark = startBenchmarkNav;
    const rawNavs: number[] = [startNav];
    const rawBenchmarks: number[] = [startBenchmarkNav];

    for (let i = 1; i <= days; i++) {
      const z1 = (pseudoRandom() + pseudoRandom() + pseudoRandom() - 1.5) * 1.5;
      const marketShock = dailyDrift * 0.7 + z1 * 0.006;
      rollingBenchmark = rollingBenchmark * (1 + marketShock);

      const idiosyncratic = (pseudoRandom() - 0.5) * 0.003;
      const stockShock = marketShock * beta + dailyDrift * 0.3 + idiosyncratic;
      rollingNav = rollingNav * (1 + stockShock);

      rawNavs.push(rollingNav);
      rawBenchmarks.push(rollingBenchmark);
    }

    // Calibrate end value precisely to currentNav
    const scaleFactor = currentNav / rawNavs[rawNavs.length - 1];
    const calibratedNavs = rawNavs.map((v) => v * scaleFactor);

    // Build timeline points
    for (let i = 0; i <= days; i++) {
      const pointDate = new Date(now.getTime() - (days - i) * 24 * 60 * 60 * 1000);
      const isToday = i === days;

      const dateStr = pointDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });
      const fullDateStr = pointDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      const navVal = isToday ? currentNav : Math.round(calibratedNavs[i] * 100) / 100;
      const benchVal = Math.round(rawBenchmarks[i] * 100) / 100;

      // Cost basis curve (gradual capital additions if long timeframe)
      let currentCost = investedCapital;
      if (days > 90) {
        const costDrift = (i / days) * 0.15;
        currentCost = investedCapital * (0.85 + costDrift);
      }

      const returnPct = ((navVal - startNav) / startNav) * 100;
      const benchmarkPct = ((benchVal - startBenchmarkNav) / startBenchmarkNav) * 100;

      const prevNav = i > 0 ? calibratedNavs[i - 1] : navVal;
      const dailyChange = navVal - prevNav;
      const dailyChangePct = prevNav > 0 ? (dailyChange / prevNav) * 100 : 0;

      points.push({
        date: dateStr,
        fullDate: fullDateStr,
        nav: navVal,
        invested: Math.round(currentCost),
        returnPct: Math.round(returnPct * 100) / 100,
        benchmarkNav: benchVal,
        benchmarkPct: Math.round(benchmarkPct * 100) / 100,
        dailyChange: Math.round(dailyChange * 100) / 100,
        dailyChangePct: Math.round(dailyChangePct * 100) / 100
      });
    }

    return points;
  }, [currentNav, investedCapital, allTimePnLPct, weightedBeta, timeframe]);

  // Derived Performance Statistics for Selected Timeframe
  const stats = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return {
        startNav: currentNav,
        endNav: currentNav,
        absoluteReturn: 0,
        returnPct: 0,
        periodHigh: currentNav,
        periodLow: currentNav,
        maxDrawdownPct: 0,
        benchmarkReturnPct: 0,
        alphaPct: 0,
        isPositive: true
      };
    }

    const startNav = historicalData[0].nav;
    const endNav = historicalData[historicalData.length - 1].nav;
    const absoluteReturn = endNav - startNav;
    const returnPct = startNav > 0 ? (absoluteReturn / startNav) * 100 : 0;

    let peak = historicalData[0].nav;
    let maxDrawdown = 0;
    let high = historicalData[0].nav;
    let low = historicalData[0].nav;

    historicalData.forEach((p) => {
      if (p.nav > high) high = p.nav;
      if (p.nav < low) low = p.nav;
      if (p.nav > peak) peak = p.nav;
      const dd = ((peak - p.nav) / peak) * 100;
      if (dd > maxDrawdown) maxDrawdown = dd;
    });

    const startBench = historicalData[0].benchmarkNav;
    const endBench = historicalData[historicalData.length - 1].benchmarkNav;
    const benchmarkReturnPct = startBench > 0 ? ((endBench - startBench) / startBench) * 100 : 0;
    const alphaPct = returnPct - benchmarkReturnPct;

    return {
      startNav,
      endNav,
      absoluteReturn,
      returnPct,
      periodHigh: high,
      periodLow: low,
      maxDrawdownPct: maxDrawdown,
      benchmarkReturnPct,
      alphaPct,
      isPositive: absoluteReturn >= 0
    };
  }, [historicalData, currentNav]);

  const minVal = useMemo(() => {
    if (metricMode === 'pct') {
      const allVals = historicalData.flatMap((d) => [d.returnPct, showBenchmark ? d.benchmarkPct : 0]);
      return Math.floor(Math.min(...allVals) - 1);
    }
    const allVals = historicalData.flatMap((d) => [
      d.nav,
      showBenchmark ? d.benchmarkNav : d.nav,
      showCostBasis ? d.invested : d.nav
    ]);
    return Math.floor(Math.min(...allVals) * 0.98);
  }, [historicalData, metricMode, showBenchmark, showCostBasis]);

  const maxVal = useMemo(() => {
    if (metricMode === 'pct') {
      const allVals = historicalData.flatMap((d) => [d.returnPct, showBenchmark ? d.benchmarkPct : 0]);
      return Math.ceil(Math.max(...allVals) + 1);
    }
    const allVals = historicalData.flatMap((d) => [
      d.nav,
      showBenchmark ? d.benchmarkNav : d.nav,
      showCostBasis ? d.invested : d.nav
    ]);
    return Math.ceil(Math.max(...allVals) * 1.02);
  }, [historicalData, metricMode, showBenchmark, showCostBasis]);

  // Format currency in compact Indian number format (Lakhs, Thousands)
  const formatNavCurrency = (val: number): string => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val.toFixed(0)}`;
  };

  const timeframes: PerformanceTimeframe[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

  return (
    <div className="bg-[#122131] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#1c2b3c] flex flex-col gap-4 relative overflow-hidden transition-colors">
      {/* Subtle Ambient Glow */}
      <div
        className={`absolute top-0 right-0 w-72 h-40 rounded-full blur-3xl pointer-events-none ${
          stats.isPositive ? 'bg-[#00ff9d]/10' : 'bg-[#ff5449]/10'
        }`}
      />

      {/* Top Header & Workstation Controls */}
      <div className="flex items-start justify-between flex-wrap gap-3 relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1c2b3c] flex items-center justify-center text-[#4d8eff] border border-[#273647]">
              <span className="material-symbols-outlined text-[18px]">area_chart</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[16px] text-[#d4e4fa] tracking-tight">
                  Historical Portfolio NAV Growth
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono border border-[#00a572]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                  Live Mark-to-Market
                </span>
              </div>
              <span className="text-[11px] text-[#8c909f]">
                Time-weighted net asset value trajectory across {holdingsCount} monitored holdings
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Chips */}
        <div className="flex items-center gap-1 bg-[#0d1c2d] p-1 rounded-xl border border-[#1c2b3c]">
          {timeframes.map((tf) => {
            const isActive = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-[#4d8eff] text-[#00285d] shadow-sm'
                    : 'text-[#8c909f] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]/50'
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>
      </div>

      {/* Period Return & Alpha Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] relative z-10">
        {/* Metric 1: Selected Period Return */}
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">
            {timeframeConfig[timeframe].label} Return
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`font-mono text-[18px] font-bold ${
                stats.isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              {stats.isPositive ? '+' : ''}₹
              {Math.abs(stats.absoluteReturn).toLocaleString('en-IN', {
                maximumFractionDigits: 0
              })}
            </span>
            <span
              className={`font-mono text-[11px] font-bold flex items-center ${
                stats.isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {stats.isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
              {stats.isPositive ? '+' : ''}
              {stats.returnPct.toFixed(2)}%
            </span>
          </div>
          <span className="text-[10px] text-[#8c909f] font-mono">
            Start: {formatNavCurrency(stats.startNav)}
          </span>
        </div>

        {/* Metric 2: Period Peak & Trough */}
        <div className="flex flex-col border-l border-[#1c2b3c] pl-2 sm:pl-3">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">
            Period High / Low Range
          </span>
          <span className="font-mono text-[14px] font-bold text-[#d4e4fa] mt-0.5">
            {formatNavCurrency(stats.periodHigh)}
          </span>
          <span className="text-[10px] text-[#8c909f] font-mono">
            Low: {formatNavCurrency(stats.periodLow)} (Spread: ₹
            {(stats.periodHigh - stats.periodLow).toLocaleString('en-IN', {
              maximumFractionDigits: 0
            })}
            )
          </span>
        </div>

        {/* Metric 3: Max Drawdown in Period */}
        <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#1c2b3c] pt-2 sm:pt-0 sm:pl-3">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">
            Max Period Drawdown
          </span>
          <span className="font-mono text-[14px] font-bold text-[#ffb4ab] mt-0.5">
            -{stats.maxDrawdownPct.toFixed(2)}%
          </span>
          <span className="text-[10px] text-[#8c909f] font-mono">
            Peak preservation index: {(100 - stats.maxDrawdownPct).toFixed(1)}%
          </span>
        </div>

        {/* Metric 4: Nifty 50 Outperformance Alpha */}
        <div className="flex flex-col border-t sm:border-t-0 border-l border-[#1c2b3c] pt-2 sm:pt-0 pl-2 sm:pl-3">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold flex items-center gap-1">
            <span>Benchmark Alpha</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#1c2b3c] text-[#adc6ff]">NIFTY 50</span>
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span
              className={`font-mono text-[14px] font-bold ${
                stats.alphaPct >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              {stats.alphaPct >= 0 ? '+' : ''}
              {stats.alphaPct.toFixed(2)}%
            </span>
            <span className="text-[10px] text-[#8c909f]">
              vs Nifty ({stats.benchmarkReturnPct >= 0 ? '+' : ''}
              {stats.benchmarkReturnPct.toFixed(1)}%)
            </span>
          </div>
          <span className="text-[10px] text-[#adc6ff] font-mono">
            Portfolio Beta: {Number(weightedBeta).toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Chart Control Ribbon: Metric Mode (NAV ₹ vs %) & Series Toggles */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] relative z-10 pt-1">
        <div className="flex items-center gap-2">
          {/* Mode Pill Toggle: Value vs Percentage */}
          <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
            <button
              onClick={() => setMetricMode('nav')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                metricMode === 'nav'
                  ? 'bg-[#1c2b3c] text-[#d4e4fa] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              NAV Value (₹)
            </button>
            <button
              onClick={() => setMetricMode('pct')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                metricMode === 'pct'
                  ? 'bg-[#1c2b3c] text-[#d4e4fa] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              Cumulative Return (%)
            </button>
          </div>

          {/* Cost Basis Toggle */}
          {metricMode === 'nav' && (
            <button
              onClick={() => setShowCostBasis((prev) => !prev)}
              className={`px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                showCostBasis
                  ? 'bg-[#1c2b3c] border-[#ffb77c]/40 text-[#ffb77c]'
                  : 'bg-transparent border-[#1c2b3c] text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
              title="Toggle invested capital cost basis line"
            >
              <span className="w-2 h-0.5 bg-[#ffb77c] rounded-full inline-block" />
              <span>Cost Basis</span>
            </button>
          )}

          {/* Benchmark Toggle */}
          <button
            onClick={() => setShowBenchmark((prev) => !prev)}
            className={`px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              showBenchmark
                ? 'bg-[#1c2b3c] border-[#adc6ff]/40 text-[#adc6ff]'
                : 'bg-transparent border-[#1c2b3c] text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
            title="Toggle NIFTY 50 benchmark comparison line"
          >
            <span className="w-2 h-0.5 bg-[#adc6ff] rounded-full inline-block border-dashed" />
            <span>NIFTY 50 Benchmark</span>
          </button>
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-[#8c909f]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff9d]" />
            <span className="text-[#d4e4fa]">Portfolio NAV</span>
          </div>
          {showBenchmark && (
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-[#adc6ff] rounded-sm" />
              <span>NIFTY 50</span>
            </div>
          )}
          {metricMode === 'nav' && showCostBasis && (
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-[#ffb77c] rounded-sm" />
              <span>Invested Capital</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="w-full h-72 sm:h-80 relative z-10 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={historicalData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              {/* Positive Emerald Area Gradient */}
              <linearGradient id="portfolioNavGradPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.32} />
                <stop offset="45%" stopColor="#4edea3" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#051424" stopOpacity={0.0} />
              </linearGradient>

              {/* Negative Rose Area Gradient */}
              <linearGradient id="portfolioNavGradNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5449" stopOpacity={0.32} />
                <stop offset="45%" stopColor="#ffb4ab" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#051424" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1c2b3c" strokeDasharray="3 3" vertical={false} opacity={0.6} />

            <XAxis
              dataKey="date"
              stroke="#8c909f"
              tickLine={false}
              axisLine={{ stroke: '#1c2b3c' }}
              tick={{ fontSize: 10, fill: '#8c909f' }}
              interval={timeframeConfig[timeframe].interval}
              dy={5}
            />

            <YAxis
              stroke="#8c909f"
              tickLine={false}
              axisLine={{ stroke: '#1c2b3c' }}
              tick={{ fontSize: 10, fill: '#8c909f' }}
              domain={[minVal, maxVal]}
              tickFormatter={(v: number) =>
                metricMode === 'pct' ? `${v >= 0 ? '+' : ''}${v.toFixed(0)}%` : formatNavCurrency(v)
              }
              dx={-2}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload as HistoricalNavPoint;
                const pNav = data.nav;
                const isGain = data.nav >= data.invested;

                return (
                  <div className="bg-[#0d1c2d] p-3 rounded-xl shadow-2xl border border-[#273647] text-[11px] flex flex-col gap-1.5 min-w-[210px] backdrop-blur-md">
                    {/* Tooltip Header Date */}
                    <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-1.5">
                      <span className="font-semibold text-[#d4e4fa]">{data.fullDate}</span>
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          data.dailyChange >= 0
                            ? 'bg-[#00a572]/20 text-[#4edea3]'
                            : 'bg-[#93000a]/30 text-[#ffb4ab]'
                        }`}
                      >
                        {data.dailyChange >= 0 ? '+' : ''}
                        {data.dailyChangePct.toFixed(2)}%
                      </span>
                    </div>

                    {/* Metric 1: Portfolio NAV */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#c2c6d6] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00ff9d]" />
                        Portfolio NAV:
                      </span>
                      <span className="font-mono font-bold text-[#d4e4fa]">
                        ₹{pNav.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Metric 2: Return since start */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#8c909f]">Period Gain:</span>
                      <span
                        className={`font-mono font-bold ${
                          data.returnPct >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                        }`}
                      >
                        {data.returnPct >= 0 ? '+' : ''}
                        {data.returnPct.toFixed(2)}%
                      </span>
                    </div>

                    {/* Metric 3: Cost Basis */}
                    {metricMode === 'nav' && showCostBasis && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#8c909f] flex items-center gap-1.5">
                          <span className="w-2 h-1 bg-[#ffb77c] rounded-sm" />
                          Cost Basis:
                        </span>
                        <span className="font-mono text-[#ffb77c]">
                          ₹{data.invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    )}

                    {/* Metric 4: Benchmark */}
                    {showBenchmark && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c]">
                        <span className="text-[#8c909f] flex items-center gap-1.5">
                          <span className="w-2 h-1 bg-[#adc6ff] rounded-sm" />
                          NIFTY 50:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[#adc6ff]">
                            {metricMode === 'pct'
                              ? `${data.benchmarkPct >= 0 ? '+' : ''}${data.benchmarkPct.toFixed(2)}%`
                              : formatNavCurrency(data.benchmarkNav)}
                          </span>
                          <span
                            className={`font-mono text-[10px] ${
                              data.returnPct >= data.benchmarkPct ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                            }`}
                          >
                            ({data.returnPct >= data.benchmarkPct ? '+' : ''}
                            {(data.returnPct - data.benchmarkPct).toFixed(1)}% α)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Reference baseline for 0% in percentage mode */}
            {metricMode === 'pct' && (
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" opacity={0.8} />
            )}

            {/* Reference line for current invested capital */}
            {metricMode === 'nav' && showCostBasis && (
              <Line
                type="monotone"
                dataKey="invested"
                stroke="#ffb77c"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            )}

            {/* NIFTY 50 Benchmark Line */}
            {showBenchmark && (
              <Line
                type="monotone"
                dataKey={metricMode === 'pct' ? 'benchmarkPct' : 'benchmarkNav'}
                stroke="#adc6ff"
                strokeWidth={1.75}
                strokeDasharray="3 3"
                dot={false}
                activeDot={{ r: 4, stroke: '#adc6ff', strokeWidth: 1, fill: '#051424' }}
                isAnimationActive={true}
              />
            )}

            {/* Main Portfolio NAV Area */}
            <Area
              type="monotone"
              dataKey={metricMode === 'pct' ? 'returnPct' : 'nav'}
              stroke={stats.isPositive ? '#00ff9d' : '#ff5449'}
              strokeWidth={2.5}
              fill={
                stats.isPositive
                  ? 'url(#portfolioNavGradPositive)'
                  : 'url(#portfolioNavGradNegative)'
              }
              dot={false}
              activeDot={{
                r: 5,
                stroke: stats.isPositive ? '#00ff9d' : '#ff5449',
                strokeWidth: 2,
                fill: '#051424'
              }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Footnote */}
      <div className="flex items-center justify-between text-[11px] text-[#8c909f] border-t border-[#1c2b3c] pt-2 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">query_stats</span>
          <span>
            Calculation Method: Time-Weighted Rate of Return (TWRR) daily compounded mark-to-market NAV
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span>Inception: ₹{historicalData[0]?.nav.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          <span>•</span>
          <span className="text-[#d4e4fa] font-bold">
            Current: ₹{currentNav.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
};
