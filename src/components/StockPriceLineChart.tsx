import React, { useState, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { StockData } from '../types';

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

interface ChartPoint {
  date: string;
  fullDate: string;
  price: number;
  timeLabel?: string;
}

interface StockPriceLineChartProps {
  stock: StockData;
  initialRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  className?: string;
  showCardHeader?: boolean;
}

const TIME_RANGES: { id: TimeRange; label: string; fullLabel: string }[] = [
  { id: '1D', label: '1D', fullLabel: 'Intraday (Today)' },
  { id: '1W', label: '1W', fullLabel: '1 Week' },
  { id: '1M', label: '1M', fullLabel: '1 Month' },
  { id: '3M', label: '3M', fullLabel: '3 Months' },
  { id: '6M', label: '6M', fullLabel: '6 Months' },
  { id: '1Y', label: '1Y', fullLabel: '1 Year' },
  { id: '5Y', label: '5Y', fullLabel: '5 Years' },
  { id: 'ALL', label: 'ALL', fullLabel: 'All Time' }
];

export const StockPriceLineChart: React.FC<StockPriceLineChartProps> = ({
  stock,
  initialRange = '1M',
  onRangeChange,
  className = '',
  showCardHeader = true
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(initialRange);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRangeSelect = (range: TimeRange) => {
    if (range === selectedRange) return;
    setIsLoading(true);
    setSelectedRange(range);
    setHoveredPoint(null);
    if (onRangeChange) {
      onRangeChange(range);
    }
    // Brief realistic calculation delay for smooth interaction
    setTimeout(() => {
      setIsLoading(false);
    }, 150);
  };

  // Generate realistic historical time series anchored exactly to stock.price
  const seriesData = useMemo<ChartPoint[]>(() => {
    const endPrice = stock.price;
    const ticker = stock.ticker;
    const isBull = stock.direction === 'UP';
    const isBear = stock.direction === 'DOWN';
    const dailyChange = stock.change;
    const vol = (stock.annVolatility || 18) / 100;

    // Stable deterministic pseudo-random hash generator based on ticker and range
    let seed = 0;
    const seedStr = `${ticker}_${selectedRange}`;
    for (let i = 0; i < seedStr.length; i++) {
      seed = (seed << 5) - seed + seedStr.charCodeAt(i);
      seed |= 0;
    }
    const pseudoRandom = (step: number) => {
      const x = Math.sin(seed + step * 59.33) * 10000;
      return x - Math.floor(x);
    };

    const points: ChartPoint[] = [];

    // Configuration per timeframe
    switch (selectedRange) {
      case '1D': {
        // Intraday: 9:15 AM to 3:30 PM IST (26 intervals of 15 min)
        const times = [
          '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45',
          '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30',
          '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15',
          '14:30', '14:45', '15:00', '15:15', '15:30'
        ];
        const prevClose = Number((endPrice - dailyChange).toFixed(2));
        const count = times.length;
        const prices: number[] = new Array(count);
        prices[0] = prevClose;
        prices[count - 1] = endPrice;

        for (let i = 1; i < count - 1; i++) {
          const progress = i / (count - 1);
          const baseline = prevClose + (endPrice - prevClose) * progress;
          const noise = (pseudoRandom(i) - 0.48) * (endPrice * 0.004);
          prices[i] = Number((baseline + noise).toFixed(2));
        }

        times.forEach((t, i) => {
          points.push({
            date: t,
            fullDate: `Today at ${t} IST`,
            price: prices[i],
            timeLabel: t
          });
        });
        break;
      }

      case '1W': {
        // 7 days ending today
        const count = 7;
        const netChange = endPrice * (isBull ? 0.024 : isBear ? -0.021 : 0.005);
        const startPrice = endPrice - netChange;
        const prices: number[] = new Array(count);
        prices[count - 1] = endPrice;
        prices[0] = Number(startPrice.toFixed(2));

        for (let i = 1; i < count - 1; i++) {
          const progress = i / (count - 1);
          const baseline = startPrice + (endPrice - startPrice) * progress;
          const shock = (pseudoRandom(i) - 0.5) * (endPrice * 0.012);
          prices[i] = Number((baseline + shock).toFixed(2));
        }

        const baseDate = new Date(2026, 9, 29); // 29 Oct 2026
        for (let i = 0; i < count; i++) {
          const d = new Date(baseDate);
          d.setDate(baseDate.getDate() - (count - 1 - i));
          const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
          const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          points.push({
            date: `${dayName}, ${dateStr}`,
            fullDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            price: prices[i]
          });
        }
        break;
      }

      case '1M': {
        // 30 days
        const count = 30;
        const netChange = endPrice * (isBull ? 0.048 : isBear ? -0.042 : 0.012);
        const startPrice = endPrice - netChange;
        const prices: number[] = new Array(count);
        prices[count - 1] = endPrice;
        prices[0] = Number(startPrice.toFixed(2));

        for (let i = 1; i < count - 1; i++) {
          const progress = i / (count - 1);
          const baseline = startPrice + (endPrice - startPrice) * progress;
          const shock = (pseudoRandom(i) - 0.49) * (endPrice * 0.02);
          prices[i] = Number((baseline + shock).toFixed(2));
        }

        const baseDate = new Date(2026, 9, 29);
        for (let i = 0; i < count; i++) {
          const d = new Date(baseDate);
          d.setDate(baseDate.getDate() - (count - 1 - i));
          const dateShort = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          points.push({
            date: dateShort,
            fullDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            price: prices[i]
          });
        }
        break;
      }

      case '3M': {
        // ~45 points over 90 days
        const count = 45;
        const netChange = endPrice * (isBull ? 0.082 : isBear ? -0.075 : 0.025);
        const startPrice = endPrice - netChange;
        const prices: number[] = new Array(count);
        prices[count - 1] = endPrice;
        prices[0] = Number(startPrice.toFixed(2));

        for (let i = 1; i < count - 1; i++) {
          const progress = i / (count - 1);
          const baseline = startPrice + (endPrice - startPrice) * progress;
          const shock = (pseudoRandom(i) - 0.5) * (endPrice * 0.035);
          prices[i] = Number((baseline + shock).toFixed(2));
        }

        const baseDate = new Date(2026, 9, 29);
        for (let i = 0; i < count; i++) {
          const d = new Date(baseDate);
          d.setDate(baseDate.getDate() - Math.round(((count - 1 - i) / (count - 1)) * 90));
          const dateShort = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          points.push({
            date: dateShort,
            fullDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            price: prices[i]
          });
        }
        break;
      }

      case '6M': {
        // ~50 points over 180 days
        const count = 50;
        const netChange = endPrice * (isBull ? 0.125 : isBear ? -0.11 : 0.04);
        const startPrice = endPrice - netChange;
        const prices: number[] = new Array(count);
        prices[count - 1] = endPrice;
        prices[0] = Number(startPrice.toFixed(2));

        for (let i = 1; i < count - 1; i++) {
          const progress = i / (count - 1);
          const baseline = startPrice + (endPrice - startPrice) * progress;
          const shock = (pseudoRandom(i) - 0.48) * (endPrice * 0.045);
          prices[i] = Number((baseline + shock).toFixed(2));
        }

        const baseDate = new Date(2026, 9, 29);
        for (let i = 0; i < count; i++) {
          const d = new Date(baseDate);
          d.setDate(baseDate.getDate() - Math.round(((count - 1 - i) / (count - 1)) * 180));
          const dateShort = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          points.push({
            date: dateShort,
            fullDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            price: prices[i]
          });
        }
        break;
      }

      case '1Y': {
        // ~60 points over 365 days
        const count = 60;
        const netChange = endPrice * (isBull ? 0.19 : isBear ? -0.15 : 0.07);
        const startPrice = endPrice - netChange;
        const prices: number[] = new Array(count);
        prices[count - 1] = endPrice;
        prices[0] = Number(startPrice.toFixed(2));

        for (let i = 1; i < count - 1; i++) {
          const progress = i / (count - 1);
          const baseline = startPrice + (endPrice - startPrice) * progress;
          const shock = (pseudoRandom(i) - 0.49) * (endPrice * 0.06);
          prices[i] = Number((baseline + shock).toFixed(2));
        }

        const baseDate = new Date(2026, 9, 29);
        for (let i = 0; i < count; i++) {
          const d = new Date(baseDate);
          d.setDate(baseDate.getDate() - Math.round(((count - 1 - i) / (count - 1)) * 365));
          const dateShort = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
          points.push({
            date: dateShort,
            fullDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            price: prices[i]
          });
        }
        break;
      }

      case '5Y': {
        // 60 monthly points over 5 years
        const count = 60;
        const netChange = endPrice * (isBull ? 0.85 : isBear ? -0.22 : 0.35);
        const startPrice = endPrice / (1 + (isBull ? 0.85 : isBear ? -0.22 : 0.35));
        const prices: number[] = new Array(count);
        prices[count - 1] = endPrice;
        prices[0] = Number(startPrice.toFixed(2));

        for (let i = 1; i < count - 1; i++) {
          const progress = i / (count - 1);
          const baseline = startPrice + (endPrice - startPrice) * Math.pow(progress, 0.9);
          const shock = (pseudoRandom(i) - 0.48) * (endPrice * 0.09);
          prices[i] = Number(Math.max(baseline + shock, startPrice * 0.4).toFixed(2));
        }

        const baseDate = new Date(2026, 9, 29);
        for (let i = 0; i < count; i++) {
          const d = new Date(baseDate);
          d.setMonth(baseDate.getMonth() - (count - 1 - i));
          const dateShort = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
          points.push({
            date: dateShort,
            fullDate: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
            price: prices[i]
          });
        }
        break;
      }

      case 'ALL':
      default: {
        // All-time series (80 points spanning 8+ years)
        const count = 75;
        const startPrice = Math.max(endPrice * 0.28, 50);
        const prices: number[] = new Array(count);
        prices[count - 1] = endPrice;
        prices[0] = Number(startPrice.toFixed(2));

        for (let i = 1; i < count - 1; i++) {
          const progress = i / (count - 1);
          const baseline = startPrice + (endPrice - startPrice) * Math.pow(progress, 1.15);
          const shock = (pseudoRandom(i) - 0.47) * (endPrice * 0.08);
          prices[i] = Number(Math.max(baseline + shock, startPrice * 0.8).toFixed(2));
        }

        const baseYear = 2018;
        for (let i = 0; i < count; i++) {
          const year = baseYear + Math.floor((i / count) * 8.8);
          points.push({
            date: `'${String(year).slice(-2)}`,
            fullDate: `Year ${year}`,
            price: prices[i]
          });
        }
        break;
      }
    }

    return points;
  }, [stock.price, stock.change, stock.ticker, stock.direction, stock.annVolatility, selectedRange]);

  // Derive Period Statistics & Dynamic Colors
  const startPoint = seriesData[0] || { price: stock.price, fullDate: '' };
  const endPoint = seriesData[seriesData.length - 1] || { price: stock.price, fullDate: '' };

  // If hovering, show hovered price and its delta vs start of period
  const activePrice = hoveredPoint ? hoveredPoint.price : endPoint.price;
  const periodDelta = activePrice - startPoint.price;
  const periodDeltaPct = startPoint.price > 0 ? (periodDelta / startPoint.price) * 100 : 0;
  const isPositive = periodDelta >= 0;

  // Min / Max for subtle axis margins and high/low labels
  const priceValues = seriesData.map((d) => d.price);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);
  const yPadding = (maxPrice - minPrice) * 0.08 || minPrice * 0.02;
  const yMin = Math.floor(minPrice - yPadding);
  const yMax = Math.ceil(maxPrice + yPadding);

  // Modern Indian App Palette (Groww / INDmoney inspired clean teal-green & warm red)
  const strokeColor = isPositive ? '#00b386' : '#eb5b3c';
  const gradientId = `growwAreaGrad_${stock.ticker}_${selectedRange}`;

  const handleMouseMove = useCallback((state: any) => {
    if (state && state.activePayload && state.activePayload.length) {
      setHoveredPoint(state.activePayload[0].payload as ChartPoint);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  return (
    <div
      className={`bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 ${className}`}
    >
      {/* 1. Header: Stock Identity, Live / Hovered Price, and Period Return */}
      {showCardHeader && (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {stock.name}
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {stock.ticker}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                {stock.exchange}
              </span>
            </div>

            {/* Price display that updates smoothly when hovered */}
            <div className="flex items-baseline gap-2.5 mt-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
                ₹{activePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>

              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                  isPositive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {isPositive ? '+' : ''}₹{periodDelta.toFixed(2)} ({isPositive ? '+' : ''}
                  {periodDeltaPct.toFixed(2)}%)
                </span>
                <span className="text-[10px] font-normal opacity-80">
                  {hoveredPoint ? 'at point' : selectedRange}
                </span>
              </div>
            </div>

            {/* Sub-label: Hovered date or period baseline */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              {hoveredPoint ? (
                <>
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {hoveredPoint.fullDate}
                  </span>
                  <span>(Touch/Hover point)</span>
                </>
              ) : (
                <>
                  <span>
                    Started at ₹{startPoint.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span>•</span>
                  <span>{startPoint.fullDate}</span>
                </>
              )}
            </p>
          </div>

          {/* Quick Period High / Low Summary Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex flex-col items-start sm:items-end bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                {selectedRange} High
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                ₹{maxPrice.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </span>
            </div>
            <div className="flex flex-col items-start sm:items-end bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                {selectedRange} Low
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                ₹{minPrice.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Time Range Selector Tabs */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
          {TIME_RANGES.map((r) => {
            const isSelected = selectedRange === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRangeSelect(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none ${
                  isSelected
                    ? 'bg-white dark:bg-[#121c2d] text-teal-600 dark:text-teal-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={r.fullLabel}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: strokeColor }}
          />
          <span>Continuous Price Line</span>
        </div>
      </div>

      {/* 3. Recharts Smooth Line / Area Canvas with Right-aligned Y-Axis */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 select-none">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl animate-pulse">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium">
              Loading {selectedRange} price data...
            </span>
          </div>
        ) : seriesData.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <Info className="w-6 h-6 text-slate-400" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No price data available for {selectedRange}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={seriesData}
              margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseLeave}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.22} />
                  <stop offset="60%" stopColor={strokeColor} stopOpacity={0.06} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Subtle Horizontal Grid Lines only */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                vertical={false}
              />

              {/* Bottom Time / Date Axis */}
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500 text-[11px]"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={selectedRange === '1D' ? 35 : 45}
              />

              {/* Price Labels on Right Side */}
              <YAxis
                orientation="right"
                domain={[yMin, yMax]}
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500 text-[11px] font-mono"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                width={selectedRange === '5Y' || selectedRange === 'ALL' ? 64 : 58}
              />

              {/* Vertical Crosshair Marker */}
              <Tooltip
                cursor={{
                  stroke: '#64748b',
                  strokeWidth: 1.2,
                  strokeDasharray: '3 3'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const p = payload[0].payload as ChartPoint;
                    const diff = p.price - startPoint.price;
                    const diffPct = startPoint.price > 0 ? (diff / startPoint.price) * 100 : 0;
                    const pointPos = diff >= 0;

                    return (
                      <div className="bg-white dark:bg-[#0c1524] border border-slate-200 dark:border-slate-700/80 p-3 rounded-xl shadow-xl text-xs flex flex-col gap-1 min-w-[170px] backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {p.fullDate}
                          </span>
                          <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                            {selectedRange}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <span className="text-slate-400">Price:</span>
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            ₹{p.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-400">Change:</span>
                          <span
                            className={`font-mono font-semibold flex items-center gap-0.5 ${
                              pointPos ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {pointPos ? '+' : ''}₹{diff.toFixed(2)} ({pointPos ? '+' : ''}
                            {diffPct.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Continuous Clean Stock Price Line with Gradient Area */}
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2.4}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: strokeColor,
                  stroke: '#ffffff',
                  strokeWidth: 2.5
                }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 4. Bottom Info Strip: Beginner Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Tap or hover over the chart to inspect prices at any specific time</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Range: {selectedRange}</span>
          <span>•</span>
          <span className="font-mono">NSE: {stock.ticker}</span>
        </div>
      </div>
    </div>
  );
};
