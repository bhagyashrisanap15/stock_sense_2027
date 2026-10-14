import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { StockData, ScreenTab } from '../types';

interface VolatilityMonitorProps {
  currentStock: StockData;
  onNavigate?: (tab: ScreenTab) => void;
}

export interface VolatilityPoint {
  dayIndex: number;
  date: string;
  fullDate: string;
  close: number;
  dailyReturnPct: number;
  rollingVol30: number; // 30-Day Annualized Volatility %
  rollingVol10: number; // 10-Day Annualized Volatility %
  benchmarkVol: number; // Benchmark Volatility %
  volSpread: number; // rollingVol - benchmark
  regime: 'LOW' | 'NORMAL' | 'HIGH';
}

export const VolatilityMonitor: React.FC<VolatilityMonitorProps> = ({
  currentStock,
  onNavigate
}) => {
  // Toggle modes
  const [windowMode, setWindowMode] = useState<'30D' | '10D' | 'spread'>('30D');
  const [chartStyle, setChartStyle] = useState<'area' | 'line'>('area');
  const [showBenchmark, setShowBenchmark] = useState(true);

  // Calculate deterministic price history & rolling volatility series
  const { data, stats } = useMemo(() => {
    const basePrice = currentStock.price;
    const ticker = currentStock.ticker;
    const targetAnnVol = currentStock.annVolatility || 18.5;
    const benchmark = currentStock.volBenchmark || 15.0;

    // Deterministic pseudo-random seed
    let seed = 0;
    for (let i = 0; i < ticker.length; i++) {
      seed = (seed << 5) - seed + ticker.charCodeAt(i);
      seed |= 0;
    }
    const pseudoRandom = (step: number) => {
      const x = Math.sin(seed + step * 99.73) * 10000;
      return x - Math.floor(x);
    };

    // Generate 65 trading days backwards to compute proper 30-day rolling windows
    const totalDays = 60;
    const dailyVol = targetAnnVol / 100 / Math.sqrt(252);
    const drift = currentStock.direction === 'UP' ? 0.0018 : currentStock.direction === 'DOWN' ? -0.0015 : 0.0003;

    const rawCloses: number[] = new Array(totalDays);
    rawCloses[totalDays - 1] = basePrice;
    rawCloses[totalDays - 2] = Number((basePrice - currentStock.change).toFixed(2));

    let simPrice = rawCloses[totalDays - 2];
    for (let d = totalDays - 3; d >= 0; d--) {
      // Modulate shock variance slightly to generate realistic volatility clustering
      const clusterMultiplier = 0.7 + 0.6 * Math.sin((d / 12) * Math.PI);
      const shock = (pseudoRandom(d) - 0.5) * 2 * dailyVol * clusterMultiplier;
      simPrice = simPrice / (1 + drift + shock);
      rawCloses[d] = Number(simPrice.toFixed(2));
    }

    // Calculate daily log returns
    const dailyReturns: number[] = new Array(totalDays);
    dailyReturns[0] = 0;
    for (let i = 1; i < totalDays; i++) {
      dailyReturns[i] = Math.log(rawCloses[i] / rawCloses[i - 1]);
    }

    // Helper for rolling annualized volatility (in %)
    const calcAnnualizedVol = (returnsSlice: number[]): number => {
      if (returnsSlice.length < 2) return targetAnnVol;
      const mean = returnsSlice.reduce((a, b) => a + b, 0) / returnsSlice.length;
      const variance =
        returnsSlice.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / (returnsSlice.length - 1);
      const dailyStd = Math.sqrt(variance);
      return Number((dailyStd * Math.sqrt(252) * 100).toFixed(2));
    };

    // Take the last 30 calendar days for the dashboard display
    const points: VolatilityPoint[] = [];
    const baseDate = new Date(2026, 8, 30); // 30 Sep 2026

    for (let i = 30; i < totalDays; i++) {
      const dayOffset = totalDays - 1 - i;
      const dObj = new Date(baseDate);
      dObj.setDate(baseDate.getDate() - dayOffset);

      const monthName = dObj.toLocaleString('en-US', { month: 'short' });
      const dayNum = String(dObj.getDate()).padStart(2, '0');
      const dateLabel = `${monthName} ${dayNum}`;
      const fullDateLabel = `${dayNum} ${monthName} 2026`;

      // 30-day window ending at day i
      const window30 = dailyReturns.slice(i - 29, i + 1);
      const vol30 = calcAnnualizedVol(window30);

      // 10-day window ending at day i
      const window10 = dailyReturns.slice(i - 9, i + 1);
      const vol10 = calcAnnualizedVol(window10);

      const close = rawCloses[i];
      const prevClose = rawCloses[i - 1];
      const dailyRetPct = Number((((close - prevClose) / prevClose) * 100).toFixed(2));
      const spread = Number((vol30 - benchmark).toFixed(2));

      let regime: 'LOW' | 'NORMAL' | 'HIGH' = 'NORMAL';
      if (vol30 < benchmark - 2) regime = 'LOW';
      else if (vol30 > benchmark + 4) regime = 'HIGH';

      points.push({
        dayIndex: i - 29,
        date: dateLabel,
        fullDate: fullDateLabel,
        close,
        dailyReturnPct: dailyRetPct,
        rollingVol30: vol30,
        rollingVol10: vol10,
        benchmarkVol: benchmark,
        volSpread: spread,
        regime
      });
    }

    // Compute derived statistical summary
    const volValues = points.map((p) => p.rollingVol30);
    const currentVol = volValues[volValues.length - 1] || targetAnnVol;
    const initialVol = volValues[0] || targetAnnVol;
    const minVol = Math.min(...volValues);
    const maxVol = Math.max(...volValues);
    const avgVol = Number((volValues.reduce((a, b) => a + b, 0) / volValues.length).toFixed(2));
    const volChange = Number((currentVol - initialVol).toFixed(2));
    const isExpanding = volChange > 0;

    return {
      data: points,
      stats: {
        currentVol,
        initialVol,
        minVol,
        maxVol,
        avgVol,
        volChange,
        isExpanding,
        benchmark
      }
    };
  }, [currentStock.ticker, currentStock.price, currentStock.change, currentStock.direction, currentStock.annVolatility, currentStock.volBenchmark]);

  // Determine active metric based on windowMode
  const activeDataKey = windowMode === '30D' ? 'rollingVol30' : windowMode === '10D' ? 'rollingVol10' : 'volSpread';

  // Dynamic colors based on volatility level
  const isHighVol = stats.currentVol > stats.benchmark + 3;
  const isLowVol = stats.currentVol < stats.benchmark - 2;

  const strokeColor = windowMode === 'spread'
    ? stats.currentVol >= stats.benchmark ? '#ffb77c' : '#4edea3'
    : isHighVol ? '#ffb4ab' : isLowVol ? '#4edea3' : '#adc6ff';

  const gradientId = `volGrad_${currentStock.ticker}_${windowMode}`;

  // Y-axis bounds
  const minVal = Math.min(...data.map((d) => d[activeDataKey as keyof VolatilityPoint] as number));
  const maxVal = Math.max(...data.map((d) => d[activeDataKey as keyof VolatilityPoint] as number));
  const yDomainMin = Math.floor(Math.min(minVal, windowMode === 'spread' ? -5 : stats.benchmark) * 0.95);
  const yDomainMax = Math.ceil(Math.max(maxVal, windowMode === 'spread' ? 5 : stats.benchmark) * 1.05);

  return (
    <section className="bg-[#122131] rounded-2xl p-4 shadow-xl border border-[#1c2b3c] flex flex-col gap-3 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className={`absolute -top-14 -right-14 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isHighVol ? 'bg-[#93000a]' : 'bg-[#4d8eff]'
        }`}
      />

      {/* Header with Title & Current Metric Pill */}
      <div className="flex items-start justify-between flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30 shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">ssid_chart</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-bold text-[#d4e4fa] tracking-tight leading-none">
                Volatility Monitor
              </h3>
              <span className="px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#adc6ff] text-[10px] font-mono font-bold border border-[#273647]">
                {currentStock.ticker}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                  isHighVol
                    ? 'bg-[#93000a]/25 text-[#ffb4ab] border-[#93000a]/40'
                    : isLowVol
                    ? 'bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/30'
                    : 'bg-[#4d8eff]/15 text-[#adc6ff] border-[#4d8eff]/30'
                }`}
              >
                {isHighVol ? 'ELEVATED REGIME' : isLowVol ? 'COMPRESSED (CALM)' : 'BALANCED REGIME'}
              </span>
            </div>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">
              Rolling historical realized volatility & dispersion shocks (Annualized %)
            </p>
          </div>
        </div>

        {/* Current Volatility Readout Hero */}
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-[20px] font-bold text-[#d4e4fa]">
              {windowMode === 'spread'
                ? `${(stats.currentVol - stats.benchmark).toFixed(2)}%`
                : `${stats.currentVol.toFixed(2)}%`}
            </span>
            <span className="text-[10px] text-[#8c909f] font-mono uppercase font-semibold">
              {windowMode === 'spread' ? 'Spread' : 'Annualized'}
            </span>
          </div>
          <div
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono mt-0.5 border ${
              stats.isExpanding
                ? 'bg-[#93000a]/20 text-[#ffb4ab] border-[#93000a]/30'
                : 'bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/30'
            }`}
          >
            <span className="material-symbols-outlined text-[12px] leading-none">
              {stats.isExpanding ? 'north_east' : 'south_east'}
            </span>
            <span>
              {stats.volChange > 0 ? '+' : ''}
              {stats.volChange}% (30D {stats.isExpanding ? 'Expansion' : 'Compression'})
            </span>
          </div>
        </div>
      </div>

      {/* 4-Stat Secondary Bento Header */}
      <div className="grid grid-cols-4 gap-2 bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] text-center text-[11px] relative z-10">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">30D Peak Vol</span>
          <span className="font-mono text-[12px] font-bold text-[#ffb4ab] mt-0.5">
            {stats.maxVol.toFixed(1)}%
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">30D Low Vol</span>
          <span className="font-mono text-[12px] font-bold text-[#4edea3] mt-0.5">
            {stats.minVol.toFixed(1)}%
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">30D Mean Vol</span>
          <span className="font-mono text-[12px] font-bold text-[#adc6ff] mt-0.5">
            {stats.avgVol.toFixed(1)}%
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Benchmark Vol</span>
          <span className="font-mono text-[12px] font-semibold text-[#c2c6d6] mt-0.5">
            {stats.benchmark.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* TOGGLE CONTROLS: Mode, Window & Chart Style */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5 relative z-10">
        {/* Toggle Mode 1: Window Horizon */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-[#8c909f] uppercase hidden sm:inline">
            Mode:
          </span>
          <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
            <button
              onClick={() => setWindowMode('30D')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                windowMode === '30D'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              30D Rolling HV
            </button>
            <button
              onClick={() => setWindowMode('10D')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                windowMode === '10D'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              10D Fast HV
            </button>
            <button
              onClick={() => setWindowMode('spread')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                windowMode === 'spread'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              Spread vs Benchmark
            </button>
          </div>
        </div>

        {/* Toggle Mode 2: Chart Style & Benchmark Overlay */}
        <div className="flex items-center gap-1.5">
          {/* Area vs Line toggle */}
          <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
            <button
              onClick={() => setChartStyle('area')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                chartStyle === 'area'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              Area Glow
            </button>
            <button
              onClick={() => setChartStyle('line')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                chartStyle === 'line'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              Clean Line
            </button>
          </div>

          {/* Benchmark line toggle */}
          {windowMode !== 'spread' && (
            <button
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all border flex items-center gap-1 ${
                showBenchmark
                  ? 'bg-[#adc6ff]/15 text-[#adc6ff] border-[#adc6ff]/30'
                  : 'bg-[#0d1c2d] text-[#8c909f] border-[#1c2b3c]'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: showBenchmark ? '#adc6ff' : '#8c909f' }}
              />
              <span>Benchmark ({stats.benchmark}%)</span>
            </button>
          )}
        </div>
      </div>

      {/* Mini Line / Area Chart */}
      <div className="h-44 w-full relative z-10 -ml-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="60%" stopColor={strokeColor} stopOpacity={0.1} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1c2b3c" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#8c909f"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1c2b3c' }}
              interval={5}
            />

            <YAxis
              domain={[yDomainMin, yDomainMax]}
              stroke="#8c909f"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1c2b3c' }}
              tickFormatter={(val) => `${val}%`}
            />

            {/* Benchmark Reference Line */}
            {showBenchmark && windowMode !== 'spread' && (
              <ReferenceLine
                y={stats.benchmark}
                stroke="#8c909f"
                strokeDasharray="3 3"
                strokeOpacity={0.65}
                label={{
                  value: `Benchmark (${stats.benchmark}%)`,
                  position: 'insideRight',
                  fill: '#8c909f',
                  fontSize: 9
                }}
              />
            )}

            {/* Zero Line for Spread Mode */}
            {windowMode === 'spread' && (
              <ReferenceLine
                y={0}
                stroke="#8c909f"
                strokeDasharray="2 2"
                strokeOpacity={0.7}
                label={{
                  value: 'Neutral',
                  position: 'insideRight',
                  fill: '#8c909f',
                  fontSize: 9
                }}
              />
            )}

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as VolatilityPoint;
                  return (
                    <div className="bg-[#0d1c2d] border border-[#273647] p-2.5 rounded-xl shadow-2xl text-[11px] flex flex-col gap-1 min-w-[180px] backdrop-blur-md">
                      <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-1">
                        <span className="font-bold text-[#d4e4fa]">{p.fullDate}</span>
                        <span
                          className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                            p.regime === 'HIGH'
                              ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                              : p.regime === 'LOW'
                              ? 'bg-[#00a572]/20 text-[#4edea3]'
                              : 'bg-[#1c2b3c] text-[#adc6ff]'
                          }`}
                        >
                          {p.regime} VOL
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[#8c909f]">30D Realized Vol</span>
                        <span className="font-mono font-bold text-[#d4e4fa] text-[12px]">
                          {p.rollingVol30}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#8c909f]">10D Fast Vol</span>
                        <span className="font-mono font-semibold text-[#adc6ff]">
                          {p.rollingVol10}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#8c909f]">Benchmark Spread</span>
                        <span
                          className={`font-mono font-semibold ${
                            p.volSpread > 0 ? 'text-[#ffb77c]' : 'text-[#4edea3]'
                          }`}
                        >
                          {p.volSpread > 0 ? '+' : ''}
                          {p.volSpread}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#1c2b3c] pt-1 mt-0.5 text-[10px]">
                        <span className="text-[#8c909f]">Daily Price Shock</span>
                        <span
                          className={`font-mono font-semibold ${
                            p.dailyReturnPct >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {p.dailyReturnPct >= 0 ? '+' : ''}
                          {p.dailyReturnPct}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Area or Line Render */}
            <Area
              type="monotone"
              dataKey={activeDataKey}
              stroke={strokeColor}
              strokeWidth={2.2}
              fill={chartStyle === 'area' ? `url(#${gradientId})` : 'transparent'}
              dot={false}
              activeDot={{
                r: 4.5,
                fill: strokeColor,
                stroke: '#0d1c2d',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Meta & Direct Link to Risk Radar */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c] text-[11px] text-[#8c909f] relative z-10">
        <span className="flex items-center gap-1 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
          Realized σ² calculated using 252-day log return variance
        </span>

        {onNavigate && (
          <button
            onClick={() => onNavigate('risk-radar')}
            className="text-[#adc6ff] hover:text-[#d4e4fa] hover:underline flex items-center gap-0.5 font-semibold transition-colors"
          >
            <span>Full Risk Radar</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        )}
      </div>
    </section>
  );
};
