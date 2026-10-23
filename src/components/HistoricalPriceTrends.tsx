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
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Sliders,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA, getAllIndianStocks, getStockData } from '../data/stocks';

interface HistoricalPriceTrendsProps {
  currentStock?: StockData;
  onSelectStock?: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export interface MonthlyPricePoint {
  month: string;
  fullDate: string;
  close: number;
  high: number;
  low: number;
  volumeMillion: number;
  momChange: number;
  momPercent: number;
  cumPercent: number;
  sma3m?: number;
}

const POPULAR_TICKERS = [
  'RELIANCE',
  'TCS',
  'HDFCBANK',
  'INFY',
  'ICICIBANK',
  'SBIN',
  'TATAMOTORS'
];

const MONTH_NAMES = [
  { short: "Nov '25", full: 'November 2025' },
  { short: "Dec '25", full: 'December 2025' },
  { short: "Jan '26", full: 'January 2026' },
  { short: "Feb '26", full: 'February 2026' },
  { short: "Mar '26", full: 'March 2026' },
  { short: "Apr '26", full: 'April 2026' },
  { short: "May '26", full: 'May 2026' },
  { short: "Jun '26", full: 'June 2026' },
  { short: "Jul '26", full: 'July 2026' },
  { short: "Aug '26", full: 'August 2026' },
  { short: "Sep '26", full: 'September 2026' },
  { short: "Oct '26", full: 'October 2026' }
];

export const HistoricalPriceTrends: React.FC<HistoricalPriceTrendsProps> = ({
  currentStock,
  onSelectStock,
  onNavigate
}) => {
  // Local active ticker state if none passed or if user switches locally
  const [selectedTicker, setSelectedTicker] = useState<string>(
    currentStock?.ticker || 'RELIANCE'
  );
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showHighLowLines, setShowHighLowLines] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allStocks = useMemo(() => getAllIndianStocks(), []);

  // Determine active stock object
  const activeStock = useMemo<StockData>(() => {
    if (currentStock && currentStock.ticker === selectedTicker) {
      return currentStock;
    }
    return getStockData(selectedTicker) || STOCKS_DATA.RELIANCE;
  }, [currentStock, selectedTicker]);

  // Handle selecting a stock
  const handleStockChange = (ticker: string) => {
    setSelectedTicker(ticker);
    const stock = getStockData(ticker);
    if (stock && onSelectStock) {
      onSelectStock(stock);
    }
  };

  // Generate 12-month historical data points ending at currentStock.price
  const monthlyData = useMemo<MonthlyPricePoint[]>(() => {
    const endPrice = activeStock.price;
    const ticker = activeStock.ticker;

    // Stable pseudo-random generator seeded by ticker
    let seed = 0;
    for (let i = 0; i < ticker.length; i++) {
      seed = (seed << 5) - seed + ticker.charCodeAt(i);
      seed |= 0;
    }
    const pseudoRandom = (step: number) => {
      const x = Math.sin(seed + step * 71.19) * 10000;
      return x - Math.floor(x);
    };

    // Calculate baseline trajectory trend based on stock direction and volatility
    const isBull = activeStock.direction === 'UP';
    const isBear = activeStock.direction === 'DOWN';
    const net12mReturn = isBull ? 0.16 : isBear ? -0.12 : 0.05;
    const vol = (activeStock.annVolatility || 18) / 100;

    // Estimate start price 12 months ago
    const startPrice = endPrice / (1 + net12mReturn);

    // Build raw closing prices over 12 months
    const closes: number[] = new Array(12);
    closes[11] = endPrice;
    closes[0] = Number(startPrice.toFixed(2));

    for (let i = 1; i < 11; i++) {
      const progress = i / 11;
      const trendPrice = startPrice + (endPrice - startPrice) * progress;
      const shock = (pseudoRandom(i) - 0.48) * vol * trendPrice * 0.45;
      closes[i] = Number(Math.max(trendPrice + shock, endPrice * 0.4).toFixed(2));
    }

    // Transform into comprehensive monthly price points with highs, lows, volumes, and 3M SMA
    const points: MonthlyPricePoint[] = [];

    for (let i = 0; i < 12; i++) {
      const close = closes[i];
      const prevClose = i > 0 ? closes[i - 1] : startPrice * 0.98;
      const momChange = Number((close - prevClose).toFixed(2));
      const momPercent = Number(((momChange / prevClose) * 100).toFixed(2));
      const cumPercent = Number((((close - closes[0]) / closes[0]) * 100).toFixed(2));

      // Calculate High / Low
      const highMultiplier = 1 + (pseudoRandom(i + 20) * 0.035 + 0.01);
      const lowMultiplier = 1 - (pseudoRandom(i + 40) * 0.035 + 0.01);
      const high = Number(Math.max(close * highMultiplier, close).toFixed(2));
      const low = Number(Math.min(close * lowMultiplier, close).toFixed(2));

      // Monthly volume in millions (e.g. 10M - 45M)
      const baseVol = 18 + pseudoRandom(i + 60) * 25;
      const volumeMillion = Number(baseVol.toFixed(1));

      // 3-Month Simple Moving Average
      let sma3m: number | undefined;
      if (i >= 2) {
        const sum3 = closes[i] + closes[i - 1] + closes[i - 2];
        sma3m = Number((sum3 / 3).toFixed(2));
      } else if (i === 1) {
        sma3m = Number(((closes[0] + closes[1]) / 2).toFixed(2));
      } else {
        sma3m = closes[0];
      }

      points.push({
        month: MONTH_NAMES[i].short,
        fullDate: MONTH_NAMES[i].full,
        close,
        high,
        low,
        volumeMillion,
        momChange,
        momPercent,
        cumPercent,
        sma3m
      });
    }

    return points;
  }, [activeStock]);

  // Key 12-month summary metrics
  const stats = useMemo(() => {
    if (!monthlyData.length) {
      return {
        high12m: 0,
        highMonth: '',
        low12m: 0,
        lowMonth: '',
        startPrice: 0,
        endPrice: 0,
        netDelta: 0,
        netPercent: 0,
        avgPrice: 0,
        isPositive: true
      };
    }

    let high = monthlyData[0].high;
    let highMonth = monthlyData[0].month;
    let low = monthlyData[0].low;
    let lowMonth = monthlyData[0].month;
    let sumClose = 0;

    monthlyData.forEach((pt) => {
      if (pt.high > high) {
        high = pt.high;
        highMonth = pt.month;
      }
      if (pt.low < low) {
        low = pt.low;
        lowMonth = pt.month;
      }
      sumClose += pt.close;
    });

    const startPrice = monthlyData[0].close;
    const endPrice = monthlyData[11].close;
    const netDelta = Number((endPrice - startPrice).toFixed(2));
    const netPercent = Number(((netDelta / startPrice) * 100).toFixed(2));
    const avgPrice = Number((sumClose / monthlyData.length).toFixed(2));

    return {
      high12m: high,
      highMonth,
      low12m: low,
      lowMonth,
      startPrice,
      endPrice,
      netDelta,
      netPercent,
      avgPrice,
      isPositive: netPercent >= 0
    };
  }, [monthlyData]);

  // Compute nice Y-axis domain with padding
  const yDomain = useMemo(() => {
    const min = stats.low12m * 0.94;
    const max = stats.high12m * 1.05;
    return [Math.floor(min / 10) * 10, Math.ceil(max / 10) * 10];
  }, [stats]);

  // Filtered stocks for dropdown search
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allStocks
      .filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allStocks, searchQuery]);

  return (
    <div className="w-full bg-[#122131] rounded-2xl p-5 md:p-6 shadow-xl border border-[#1c2b3c] flex flex-col gap-6 relative overflow-hidden">
      {/* Visual Accent Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#4d8eff]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#4edea3]/5 blur-3xl pointer-events-none" />

      {/* Header & Stock Selection Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1c2b3c]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
              <BarChart3 className="w-5 h-5 text-[#adc6ff]" />
            </div>
            <div>
              <h2 className="text-[19px] md:text-[21px] font-bold text-[#d4e4fa] tracking-tight flex items-center gap-2">
                Historical Price Trends
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#273647] text-[#adc6ff] border border-[#3b4959]">
                  Last 12 Months
                </span>
              </h2>
              <p className="text-[12.5px] text-[#c2c6d6]">
                Track month-end closing values, 52-week extremes, and moving averages in simple terms.
              </p>
            </div>
          </div>
        </div>

        {/* Stock Quick-Select Chips + Search */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#8c909f] font-medium mr-1 hidden sm:inline-block">
            Quick Stocks:
          </span>
          {POPULAR_TICKERS.map((t) => (
            <button
              key={t}
              onClick={() => handleStockChange(t)}
              className={`px-2.5 py-1 text-[11.5px] font-mono rounded-lg transition-all border ${
                selectedTicker === t
                  ? 'bg-[#4d8eff] text-[#00285d] font-bold border-[#4d8eff] shadow-sm'
                  : 'bg-[#0d1c2d] hover:bg-[#1c2b3c] text-[#c2c6d6] border-[#1c2b3c]'
              }`}
            >
              {t}
            </button>
          ))}

          {/* Search Dropdown Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 sm:w-36 px-2.5 py-1 text-[11.5px] bg-[#0d1c2d] text-[#d4e4fa] placeholder-[#8c909f] rounded-lg border border-[#1c2b3c] focus:outline-none focus:border-[#4d8eff]"
            />
            {filteredStocks.length > 0 && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-[#0d1c2d] border border-[#273647] rounded-xl shadow-2xl z-30 overflow-hidden py-1">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.ticker}
                    onClick={() => {
                      handleStockChange(stock.ticker);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1c2b3c] flex items-center justify-between text-[12px] text-[#d4e4fa] transition-colors"
                  >
                    <span className="font-mono font-semibold">{stock.ticker}</span>
                    <span className="text-[11px] text-[#8c909f] truncate max-w-[120px]">
                      {stock.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock Highlight Header & 4 Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Latest Closing Price */}
        <div className="bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c] flex flex-col gap-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8c909f] uppercase tracking-wider font-semibold">
              Latest Close (Oct '26)
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1c2b3c] text-[#adc6ff]">
              {activeStock.ticker}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] md:text-[22px] font-bold font-mono text-[#d4e4fa]">
              ₹{activeStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11.5px]">
            {stats.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-[#4edea3]" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-[#ffb4ab]" />
            )}
            <span
              className={`font-mono font-semibold ${
                stats.isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              {stats.isPositive ? '+' : ''}₹{stats.netDelta.toLocaleString('en-IN')} (
              {stats.isPositive ? '+' : ''}
              {stats.netPercent}%)
            </span>
            <span className="text-[10px] text-[#8c909f]">12M return</span>
          </div>
        </div>

        {/* Metric 2: 12-Month High */}
        <div className="bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c] flex flex-col gap-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8c909f] uppercase tracking-wider font-semibold">
              12-Month High
            </span>
            <span className="font-mono text-[10px] text-[#4edea3] bg-[#00a572]/15 px-1.5 py-0.5 rounded border border-[#00a572]/30">
              Peak {stats.highMonth}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] md:text-[22px] font-bold font-mono text-[#4edea3]">
              ₹{stats.high12m.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[11px] text-[#8c909f]">
            Highest monthly high recorded over the year
          </span>
        </div>

        {/* Metric 3: 12-Month Low */}
        <div className="bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c] flex flex-col gap-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8c909f] uppercase tracking-wider font-semibold">
              12-Month Low
            </span>
            <span className="font-mono text-[10px] text-[#ffb4ab] bg-[#93000a]/20 px-1.5 py-0.5 rounded border border-[#93000a]/30">
              Floor {stats.lowMonth}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] md:text-[22px] font-bold font-mono text-[#ffb4ab]">
              ₹{stats.low12m.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[11px] text-[#8c909f]">
            Lowest monthly dip recorded over the year
          </span>
        </div>

        {/* Metric 4: 12-Month Trend Health */}
        <div className="bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c] flex flex-col gap-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8c909f] uppercase tracking-wider font-semibold">
              Annual Trend State
            </span>
            <span className="font-mono text-[10px] text-[#adc6ff] bg-[#4d8eff]/15 px-1.5 py-0.5 rounded border border-[#4d8eff]/30">
              Avg ₹{stats.avgPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[17px] md:text-[18px] font-bold ${
                stats.netPercent >= 8
                  ? 'text-[#4edea3]'
                  : stats.netPercent <= -8
                  ? 'text-[#ffb4ab]'
                  : 'text-[#adc6ff]'
              }`}
            >
              {stats.netPercent >= 8
                ? 'Strong Uptrend'
                : stats.netPercent >= 2
                ? 'Moderate Bullish'
                : stats.netPercent <= -8
                ? 'Strong Downtrend'
                : stats.netPercent <= -2
                ? 'Moderate Bearish'
                : 'Consolidation'}
            </span>
          </div>
          <span className="text-[11px] text-[#8c909f]">
            {stats.netPercent >= 0 ? 'Closed above' : 'Closed below'} 12-month starting price
          </span>
        </div>
      </div>

      {/* Chart Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-[12px] text-[#c2c6d6]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
          <span className="font-semibold text-[#d4e4fa]">
            {activeStock.name} ({activeStock.ticker})
          </span>
          <span className="text-[#8c909f] hidden sm:inline">•</span>
          <span className="text-[#8c909f] hidden sm:inline">{activeStock.sector}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle 3M SMA */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11.5px] font-medium transition-colors border ${
              showSMA
                ? 'bg-[#c0c1ff]/20 text-[#c0c1ff] border-[#c0c1ff]/40'
                : 'bg-[#0d1c2d] text-[#8c909f] border-[#1c2b3c] hover:text-[#c2c6d6]'
            }`}
          >
            <span
              className={`w-2 h-0.5 rounded-full ${showSMA ? 'bg-[#c0c1ff]' : 'bg-[#8c909f]'}`}
            />
            <span>3-Month Moving Average</span>
          </button>

          {/* Toggle High/Low Guidelines */}
          <button
            onClick={() => setShowHighLowLines(!showHighLowLines)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11.5px] font-medium transition-colors border ${
              showHighLowLines
                ? 'bg-[#4d8eff]/20 text-[#adc6ff] border-[#4d8eff]/40'
                : 'bg-[#0d1c2d] text-[#8c909f] border-[#1c2b3c] hover:text-[#c2c6d6]'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>High/Low Guides</span>
          </button>
        </div>
      </div>

      {/* Recharts 12-Month Closing Price Area Chart */}
      <div className="w-full h-80 sm:h-96 bg-[#010f1f] rounded-xl p-3 border border-[#1c2b3c] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyData}
            margin={{ top: 20, right: 24, left: 16, bottom: 8 }}
          >
            <defs>
              <linearGradient id="historicalCloseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={stats.isPositive ? '#38bdf8' : '#f87171'}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={stats.isPositive ? '#38bdf8' : '#f87171'}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1c2b3c"
              vertical={false}
              strokeOpacity={0.8}
            />

            <XAxis
              dataKey="month"
              stroke="#8c909f"
              tickLine={false}
              axisLine={{ stroke: '#1c2b3c' }}
              tick={{ fill: '#8c909f', fontSize: 11, fontFamily: 'monospace' }}
            />

            <YAxis
              stroke="#8c909f"
              tickLine={false}
              axisLine={{ stroke: '#1c2b3c' }}
              domain={yDomain}
              tick={{ fill: '#8c909f', fontSize: 11, fontFamily: 'monospace' }}
              tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`}
            />

            {/* Optional 12-Month High reference line */}
            {showHighLowLines && (
              <ReferenceLine
                y={stats.high12m}
                stroke="#4edea3"
                strokeDasharray="4 4"
                strokeOpacity={0.7}
                label={{
                  value: `12M High: ₹${stats.high12m.toLocaleString('en-IN')}`,
                  fill: '#4edea3',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />
            )}

            {/* Optional 12-Month Low reference line */}
            {showHighLowLines && (
              <ReferenceLine
                y={stats.low12m}
                stroke="#ffb4ab"
                strokeDasharray="4 4"
                strokeOpacity={0.7}
                label={{
                  value: `12M Low: ₹${stats.low12m.toLocaleString('en-IN')}`,
                  fill: '#ffb4ab',
                  fontSize: 10,
                  position: 'insideBottomRight'
                }}
              />
            )}

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0].payload as MonthlyPricePoint;
                return (
                  <div className="bg-[#0d1c2d] border border-[#273647] rounded-xl p-3.5 shadow-2xl text-[12px] min-w-[230px]">
                    <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-2 mb-2.5">
                      <span className="font-semibold text-[#d4e4fa] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#adc6ff]" />
                        {point.fullDate}
                      </span>
                      <span className="text-[10px] font-mono text-[#8c909f] bg-[#1c2b3c] px-1.5 py-0.5 rounded">
                        {activeStock.ticker}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8c909f] flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: stats.isPositive ? '#38bdf8' : '#f87171'
                            }}
                          />
                          Closing Price:
                        </span>
                        <span className="font-mono font-bold text-[#d4e4fa] text-[13px]">
                          ₹{point.close.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#8c909f]">Month Range:</span>
                        <span className="font-mono text-[11px] text-[#c2c6d6]">
                          ₹{point.low.toLocaleString('en-IN')} - ₹
                          {point.high.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#8c909f]">Monthly Change:</span>
                        <span
                          className={`font-mono font-semibold ${
                            point.momChange >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {point.momChange >= 0 ? '+' : ''}₹{point.momChange} (
                          {point.momPercent >= 0 ? '+' : ''}
                          {point.momPercent}%)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#8c909f]">12M Cumulative:</span>
                        <span
                          className={`font-mono font-semibold ${
                            point.cumPercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {point.cumPercent >= 0 ? '+' : ''}
                          {point.cumPercent}%
                        </span>
                      </div>

                      {point.sma3m && (
                        <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c]">
                          <span className="text-[#c0c1ff]">3M Moving Avg:</span>
                          <span className="font-mono text-[#c0c1ff]">
                            ₹{point.sma3m.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10.5px] text-[#8c909f] pt-0.5">
                        <span>Trading Volume:</span>
                        <span className="font-mono text-[#d4e4fa]">
                          {point.volumeMillion}M shares
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            {/* Main Area Chart for Closing Prices */}
            <Area
              type="monotone"
              dataKey="close"
              stroke={stats.isPositive ? '#38bdf8' : '#f87171'}
              strokeWidth={2.8}
              fill="url(#historicalCloseGrad)"
              activeDot={{
                r: 5,
                stroke: '#0d1c2d',
                strokeWidth: 2,
                fill: stats.isPositive ? '#38bdf8' : '#f87171'
              }}
            />

            {/* Optional 3-Month Moving Average Line */}
            {showSMA && (
              <Line
                type="monotone"
                dataKey="sma3m"
                stroke="#c0c1ff"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Beginner Explanation Box + Action Navigation Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-1">
        {/* Beginner Explainer Callout (8 cols) */}
        <div className="lg:col-span-8 bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c] flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center shrink-0 mt-0.5 border border-[#4d8eff]/30">
            <Info className="w-4 h-4 text-[#adc6ff]" />
          </div>
          <div className="flex flex-col gap-1 text-[12px]">
            <span className="font-semibold text-[#d4e4fa] flex items-center gap-1.5">
              Beginner Guide: Understanding 12-Month Closing Trends
            </span>
            <p className="text-[#c2c6d6] leading-relaxed">
              Day-to-day stock prices fluctuate randomly, but looking at monthly closing prices reveals
              the <strong>true direction</strong>. When the line slopes upward above its 3-month average,
              buyers are consistently in control. If it hits higher peaks (52W high), it signals long-term strength.
            </p>
          </div>
        </div>

        {/* Action Buttons to explore deeper analysis (4 cols) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] font-semibold text-[13px] rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Predict {activeStock.ticker}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('technical-analysis')}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-[#0d1c2d] hover:bg-[#1c2b3c] text-[#d4e4fa] font-medium text-[13px] rounded-xl transition-colors border border-[#1c2b3c]"
          >
            <TrendingUp className="w-4 h-4 text-[#4edea3]" />
            <span>Technical Indicators</span>
          </button>
        </div>
      </div>
    </div>
  );
};
