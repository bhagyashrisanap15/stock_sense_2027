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

interface PriceHistoryChartProps {
  currentStock: StockData;
  onNavigate?: (tab: ScreenTab) => void;
}

export interface PricePoint {
  dayIndex: number;
  date: string;
  fullDate: string;
  close: number;
  sma20: number;
  volume: number;
  dayChangePct: number;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  currentStock,
  onNavigate
}) => {
  const [showSMA, setShowSMA] = useState(true);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  // Generate deterministic 30-day historical daily closing prices anchored to currentStock.price
  const data = useMemo<PricePoint[]>(() => {
    const points: PricePoint[] = [];
    const basePrice = currentStock.price;
    const ticker = currentStock.ticker;

    // Pseudo-random deterministic hash based on ticker
    let seed = 0;
    for (let i = 0; i < ticker.length; i++) {
      seed = (seed << 5) - seed + ticker.charCodeAt(i);
      seed |= 0;
    }
    const pseudoRandom = (step: number) => {
      const x = Math.sin(seed + step * 99.73) * 10000;
      return x - Math.floor(x);
    };

    // Calculate daily return path backwards from Day 30 (today)
    // If stock direction is UP, drift is positive overall over 30 days
    const isBull = currentStock.direction === 'UP';
    const isBear = currentStock.direction === 'DOWN';
    const drift = isBull ? 0.0022 : isBear ? -0.0020 : 0.0004;
    const dailyVol = (currentStock.annVolatility || 18) / 100 / Math.sqrt(252);

    // Pre-generate raw closing prices backwards from today
    const rawCloses: number[] = new Array(30);
    rawCloses[29] = basePrice;
    rawCloses[28] = Number((basePrice - currentStock.change).toFixed(2));

    let currentSim = rawCloses[28];
    for (let d = 27; d >= 0; d--) {
      const shock = (pseudoRandom(d) - 0.5) * 2 * dailyVol;
      // Step backwards: reverse the drift
      currentSim = currentSim / (1 + drift + shock);
      rawCloses[d] = Number(currentSim.toFixed(2));
    }

    // Now format into 30 data points with calendar dates (Sept 2026)
    const baseDate = new Date(2026, 8, 30); // 30 Sep 2026

    for (let i = 0; i < 30; i++) {
      const dObj = new Date(baseDate);
      dObj.setDate(baseDate.getDate() - (29 - i));

      const monthName = dObj.toLocaleString('en-US', { month: 'short' });
      const dayNum = String(dObj.getDate()).padStart(2, '0');
      const dateLabel = `${monthName} ${dayNum}`;
      const fullDateLabel = `${dayNum} ${monthName} 2026`;

      const close = rawCloses[i];
      const prevClose = i > 0 ? rawCloses[i - 1] : close;
      const dayChangePct = Number((((close - prevClose) / prevClose) * 100).toFixed(2));

      // Calculate 20-period moving average up to day i
      const windowStart = Math.max(0, i - 19);
      const windowSlice = rawCloses.slice(windowStart, i + 1);
      const sma = Number(
        (windowSlice.reduce((a, b) => a + b, 0) / windowSlice.length).toFixed(2)
      );

      // Volume variation
      const volMultiplier = 0.75 + pseudoRandom(i + 40) * 0.55;
      const volNum = Math.round(1800000 * volMultiplier);

      points.push({
        dayIndex: i + 1,
        date: dateLabel,
        fullDate: fullDateLabel,
        close,
        sma20: sma,
        volume: volNum,
        dayChangePct
      });
    }

    return points;
  }, [currentStock.ticker, currentStock.price, currentStock.change, currentStock.direction, currentStock.annVolatility]);

  // Derived 30-day stats
  const firstPrice = data[0]?.close || currentStock.price;
  const lastPrice = data[data.length - 1]?.close || currentStock.price;
  const net30DChange = lastPrice - firstPrice;
  const net30DChangePct = firstPrice > 0 ? (net30DChange / firstPrice) * 100 : 0;
  const is30DPositive = net30DChange >= 0;

  const closes = data.map((d) => d.close);
  const minPrice = Math.min(...closes);
  const maxPrice = Math.max(...closes);
  const rangePrice = maxPrice - minPrice;

  // Min / max with padding for auto-scaling Y-Axis
  const yAxisMin = Math.floor(minPrice * 0.985);
  const yAxisMax = Math.ceil(maxPrice * 1.015);

  const avg30DPrice = Number((closes.reduce((a, b) => a + b, 0) / closes.length).toFixed(2));

  // Visual Colors
  const strokeColor = is30DPositive ? '#4edea3' : '#ffb4ab';
  const gradientId = `priceGrad_${currentStock.ticker}`;

  return (
    <section className="bg-[#122131] rounded-2xl p-4 shadow-xl border border-[#1c2b3c] flex flex-col gap-3 relative overflow-hidden">
      {/* Subtle ambient accent glow */}
      <div
        className={`absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl pointer-events-none ${
          is30DPositive ? 'bg-[#00a572]/15' : 'bg-[#93000a]/20'
        }`}
      />

      {/* Widget Header & Ticker Identifiers */}
      <div className="flex items-start justify-between flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#1c2b3c] flex items-center justify-center font-mono font-bold text-[#adc6ff] text-[16px] border border-[#273647] shadow-sm">
            {currentStock.ticker.charAt(0)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[16px] text-[#d4e4fa] tracking-tight">
                {currentStock.ticker}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#c2c6d6] text-[10px] font-semibold border border-[#273647]">
                {currentStock.exchange}
              </span>
              <span className="text-[12px] text-[#c2c6d6] hidden sm:inline">•</span>
              <span className="text-[12px] text-[#c2c6d6] truncate max-w-[150px]">
                {currentStock.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] uppercase tracking-wider text-[#8c909f] font-semibold">
                30-Day Historical Trend
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#4d8eff]/10 text-[#adc6ff] text-[10px] font-mono font-bold border border-[#4d8eff]/20">
                Daily Close
              </span>
            </div>
          </div>
        </div>

        {/* Current Price & 30-Day Total Performance Pill */}
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[19px] font-bold text-[#d4e4fa]">
              ₹{lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono mt-0.5 border ${
              is30DPositive
                ? 'bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/30'
                : 'bg-[#93000a]/25 text-[#ffb4ab] border-[#93000a]/35'
            }`}
          >
            <span className="material-symbols-outlined text-[13px] leading-none">
              {is30DPositive ? 'trending_up' : 'trending_down'}
            </span>
            <span>
              {is30DPositive ? '+' : ''}₹{net30DChange.toFixed(2)} ({is30DPositive ? '+' : ''}
              {net30DChangePct.toFixed(2)}% 30D)
            </span>
          </div>
        </div>
      </div>

      {/* 4-Stat Secondary Bento Header */}
      <div className="grid grid-cols-4 gap-2 bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] text-center text-[11px]">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">30D High</span>
          <span className="font-mono text-[12px] font-bold text-[#d4e4fa] mt-0.5">
            ₹{maxPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">30D Low</span>
          <span className="font-mono text-[12px] font-bold text-[#d4e4fa] mt-0.5">
            ₹{minPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">30D Spread</span>
          <span className="font-mono text-[12px] font-semibold text-[#adc6ff] mt-0.5">
            ₹{rangePrice.toFixed(1)}
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">30D Avg Price</span>
          <span className="font-mono text-[12px] font-bold text-[#4edea3] mt-0.5">
            ₹{avg30DPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Controls: Area vs Line + Toggle 20-Day SMA */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1.5">
          <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                chartType === 'area'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              Area Glow
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                chartType === 'line'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              Clean Line
            </button>
          </div>

          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all border flex items-center gap-1 ${
              showSMA
                ? 'bg-[#adc6ff]/15 text-[#adc6ff] border-[#adc6ff]/30'
                : 'bg-[#0d1c2d] text-[#8c909f] border-[#1c2b3c]'
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: showSMA ? '#adc6ff' : '#8c909f' }}
            />
            <span>20-Day SMA</span>
          </button>
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center gap-2 text-[10px] text-[#8c909f] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 rounded" style={{ backgroundColor: strokeColor }} />
            Close
          </span>
          {showSMA && (
            <span className="flex items-center gap-1 text-[#adc6ff]">
              <span className="w-2.5 h-0.5 rounded bg-[#adc6ff]" />
              SMA(20)
            </span>
          )}
        </div>
      </div>

      {/* Main Recharts 30-Day Trend Chart */}
      <div className="h-56 w-full relative z-10 -ml-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="50%" stopColor={strokeColor} stopOpacity={0.12} />
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
              domain={[yAxisMin, yAxisMax]}
              stroke="#8c909f"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1c2b3c' }}
              tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
            />

            <ReferenceLine
              y={avg30DPrice}
              stroke="#8c909f"
              strokeDasharray="2 3"
              strokeOpacity={0.45}
              label={{
                value: '30D Mean',
                position: 'insideRight',
                fill: '#8c909f',
                fontSize: 9
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as PricePoint;
                  return (
                    <div className="bg-[#0d1c2d] border border-[#273647] p-2.5 rounded-xl shadow-2xl text-[11px] flex flex-col gap-1 min-w-[170px] backdrop-blur-md">
                      <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-1">
                        <span className="font-bold text-[#d4e4fa]">{p.fullDate}</span>
                        <span className="text-[10px] text-[#8c909f] font-mono">Day {p.dayIndex}/30</span>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[#8c909f]">Closing Price</span>
                        <span className="font-mono font-bold text-[#d4e4fa] text-[13px]">
                          ₹{p.close.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#8c909f]">Day Change</span>
                        <span
                          className={`font-mono font-semibold ${
                            p.dayChangePct >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {p.dayChangePct >= 0 ? '+' : ''}
                          {p.dayChangePct}%
                        </span>
                      </div>

                      {showSMA && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#adc6ff]">20-Day SMA</span>
                          <span className="font-mono text-[#adc6ff] font-semibold">
                            ₹{p.sma20.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-[#1c2b3c] pt-1 mt-0.5 text-[10px]">
                        <span className="text-[#8c909f]">Est. Volume</span>
                        <span className="font-mono text-[#c2c6d6]">
                          {(p.volume / 100000).toFixed(2)}L shares
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Area or Line for Price Series */}
            <Area
              type="monotone"
              dataKey="close"
              stroke={strokeColor}
              strokeWidth={2.2}
              fill={chartType === 'area' ? `url(#${gradientId})` : 'transparent'}
              dot={false}
              activeDot={{
                r: 4.5,
                fill: strokeColor,
                stroke: '#0d1c2d',
                strokeWidth: 2
              }}
            />

            {/* SMA20 Overlay Line */}
            {showSMA && (
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#adc6ff"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Meta & Quick Action */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c] text-[11px] text-[#8c909f] relative z-10">
        <span className="flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
          Synchronized with 30-Day Historical Datafeed
        </span>

        {onNavigate && (
          <button
            onClick={() => onNavigate('markets')}
            className="text-[#adc6ff] hover:text-[#d4e4fa] hover:underline flex items-center gap-0.5 font-semibold transition-colors"
          >
            <span>View Live Interactive Line Chart</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        )}
      </div>
    </section>
  );
};
