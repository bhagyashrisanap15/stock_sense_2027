import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  BarChart2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA } from '../data/stocks';

interface TechnicalAnalysisScreenProps {
  currentStock: StockData;
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export const TechnicalAnalysisScreen: React.FC<TechnicalAnalysisScreenProps> = ({
  currentStock,
  onSelectStock,
  onNavigate
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(currentStock.ticker);
  const tickers = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATASTEEL'];

  const handleTickerChange = (ticker: string) => {
    setSelectedTicker(ticker);
    if (STOCKS_DATA[ticker]) {
      onSelectStock(STOCKS_DATA[ticker]);
    }
  };

  const stock = STOCKS_DATA[selectedTicker] || currentStock;

  // Technical calculations
  const priceVsSma20 = (((stock.price - stock.sma20) / stock.sma20) * 100).toFixed(2);
  const priceVsSma50 = (((stock.price - stock.sma50) / stock.sma50) * 100).toFixed(2);
  const priceVsSma200 = (((stock.price - stock.sma200) / stock.sma200) * 100).toFixed(2);

  // Technical confluence score
  const isRsiBullish = stock.rsi >= 50 && stock.rsi <= 70;
  const isMacdBullish = (stock.macd?.histogram ?? 0) > 0;
  const isSma20Bullish = stock.price > stock.sma20;
  const isSma50Bullish = stock.price > stock.sma50;
  const isSma200Bullish = stock.price > stock.sma200;
  const isBollingerBullish = (stock.bollinger?.pb ?? 0.5) > 0.5;

  const bullishIndicators = [isRsiBullish, isMacdBullish, isSma20Bullish, isSma50Bullish, isSma200Bullish, isBollingerBullish].filter(Boolean).length;
  const totalIndicators = 6;
  const confluencePct = Math.round((bullishIndicators / totalIndicators) * 100);

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1c2b3c] border border-[#273647] flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-white tracking-tight">
                Technical Analysis & Indicator Workspace
              </h1>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-mono font-bold">
                Multi-Timeframe
              </span>
            </div>
            <p className="text-[13px] text-[#94a3b8] mt-0.5">
              Oscillator confluence, trend-following moving average bands, and volatility envelope telemetry.
            </p>
          </div>
        </div>

        {/* Quick Ticker Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0a1424] rounded-xl border border-[#1c2b3c]">
          {tickers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTickerChange(t)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-mono font-bold transition-all ${
                selectedTicker === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-[#64748b] hover:text-white hover:bg-[#132238]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Overview Bar */}
      <div className="bg-[#122131] rounded-2xl p-4 border border-[#1c2b3c] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider block">Target Asset</span>
            <span className="text-[18px] font-bold text-white">{stock.ticker}</span>
            <span className="text-[12px] text-[#94a3b8] ml-2 font-normal">({stock.name})</span>
          </div>

          <div className="h-8 w-[1px] bg-[#1c2b3c] hidden sm:block" />

          <div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider block">Spot Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-mono font-bold text-white">
                ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-[12px] font-mono font-semibold ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Confluence Rating */}
        <div className="flex items-center gap-3 bg-[#0a1424] px-4 py-2 rounded-xl border border-[#1c2b3c]">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-mono text-[#64748b]">Technical Confluence</span>
            <span className="text-[14px] font-mono font-bold text-cyan-400">
              {bullishIndicators} of {totalIndicators} Bullish ({confluencePct}%)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('ai-predict')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[12px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>View SHAP Attribution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* RSI 14 Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Relative Strength (14)</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                stock.rsi > 70 ? 'bg-amber-500/20 text-amber-400' : stock.rsi < 30 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {stock.rsi > 70 ? 'OVERBOUGHT (>70)' : stock.rsi < 30 ? 'OVERSOLD (<30)' : 'EQUILIBRIUM'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[28px] font-mono font-extrabold text-white">{stock.rsi.toFixed(1)}</span>
              <span className="text-[12px] text-[#94a3b8]">/ 100 Index</span>
            </div>

            {/* Gauge bar */}
            <div className="relative w-full h-3 bg-[#0a1424] rounded-full overflow-hidden border border-[#1c2b3c] my-3">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, stock.rsi))}%` }}
              />
              {/* Neutral zone markers */}
              <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-white/30" />
              <div className="absolute top-0 bottom-0 left-[70%] w-[1px] bg-white/30" />
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              {stock.rsi >= 50
                ? 'Oscillator demonstrates structural buying momentum above the 50 median without overbought fatigue.'
                : 'Oscillator reads in defensive lower quartile, reflecting seller dominance and mean-reverting pressure.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b] flex justify-between">
            <span>Oversold: 30.0</span>
            <span>Median: 50.0</span>
            <span>Overbought: 70.0</span>
          </div>
        </div>

        {/* MACD Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">MACD (12, 26, 9)</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                (stock.macd?.histogram ?? 0) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {(stock.macd?.histogram ?? 0) >= 0 ? 'BULLISH DIVERGENCE' : 'BEARISH CROSS'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 mb-3 bg-[#0a1424] p-3 rounded-xl border border-[#1a293b]">
              <div>
                <span className="text-[10px] font-mono text-[#64748b] block">MACD Line</span>
                <span className="text-[14px] font-mono font-bold text-cyan-300">{stock.macd?.macdLine?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64748b] block">Signal Line</span>
                <span className="text-[14px] font-mono font-bold text-[#94a3b8]">{stock.macd?.signalLine?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64748b] block">Histogram</span>
                <span className={`text-[14px] font-mono font-bold ${
                  (stock.macd?.histogram ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {stock.macd?.histogram ? (stock.macd.histogram >= 0 ? '+' : '') + stock.macd.histogram.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              {(stock.macd?.histogram ?? 0) >= 0
                ? 'Fast moving average is outpacing the signal line, confirming upward acceleration across 12-day window.'
                : 'Histogram registers below zero datum line, showing short-term momentum deceleration relative to 26-day anchor.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b]">
            Trigger: Exponential 9-Day EMA Signal
          </div>
        </div>

        {/* Moving Averages Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Moving Average Stack</span>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">
                {stock.price > stock.sma200 ? 'GOLDEN REGIME' : 'DEATH CROSS ZONE'}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0a1424] border border-[#1a293b] text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-[#94a3b8]">20-Day SMA</span>
                </div>
                <div className="font-mono">
                  <span className="text-white font-bold mr-2">₹{stock.sma20.toLocaleString()}</span>
                  <span className={Number(priceVsSma20) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    ({Number(priceVsSma20) >= 0 ? '+' : ''}{priceVsSma20}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0a1424] border border-[#1a293b] text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-[#94a3b8]">50-Day SMA</span>
                </div>
                <div className="font-mono">
                  <span className="text-white font-bold mr-2">₹{stock.sma50.toLocaleString()}</span>
                  <span className={Number(priceVsSma50) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    ({Number(priceVsSma50) >= 0 ? '+' : ''}{priceVsSma50}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0a1424] border border-[#1a293b] text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="text-[#94a3b8]">200-Day SMA</span>
                </div>
                <div className="font-mono">
                  <span className="text-white font-bold mr-2">₹{stock.sma200.toLocaleString()}</span>
                  <span className={Number(priceVsSma200) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    ({Number(priceVsSma200) >= 0 ? '+' : ''}{priceVsSma200}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b]">
            Institutional Anchor: 200-Day Structural Trend
          </div>
        </div>

        {/* Bollinger Bands Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Bollinger Bands (20, 2)</span>
              <span className="text-[11px] font-mono text-cyan-300 font-bold">
                %B = {stock.bollinger?.pb?.toFixed(2) ?? '0.70'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-[#0a1424] border border-[#1a293b] mb-3 text-[11px] font-mono">
              <div>
                <span className="text-[#64748b] block">Lower Band</span>
                <span className="text-white font-bold">₹{stock.bollinger?.lower?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-cyan-400 block">Middle (SMA)</span>
                <span className="text-white font-bold">₹{stock.bollinger?.middle?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#64748b] block">Upper Band</span>
                <span className="text-white font-bold">₹{stock.bollinger?.upper?.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              Price trades at the upper quartile of the 2-standard-deviation envelope, indicating strong expansion with low contraction risk.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b]">
            Bandwidth: 2 Standard Deviations
          </div>
        </div>

        {/* Volume & Liquidity Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Volume & Liquidity Flow</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {stock.volumeSurge}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#94a3b8]">24h Volume</span>
                <span className="font-mono font-bold text-white">{stock.volume24h}</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#94a3b8]">20-Day Avg Volume</span>
                <span className="font-mono font-bold text-[#94a3b8]">{stock.vol20dAvg}</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#94a3b8]">Institutional Flow</span>
                <span className="font-mono font-bold text-cyan-400">Net Accumulation</span>
              </div>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              Volume surge confirms active participation and validates the current price vector against false breakout noise.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b]">
            Surge Threshold: &gt; +10% vs 20-Day Baseline
          </div>
        </div>

        {/* Volatility & ATR Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Annualized Volatility</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                stock.annVolatility > 20 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {stock.annVolatility > 20 ? 'HIGH VOL' : 'NORMAL REGIME'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[28px] font-mono font-extrabold text-white">{stock.annVolatility}%</span>
              <span className="text-[12px] text-[#94a3b8]">vs {stock.volBenchmark}% Benchmark</span>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              Daily price dispersion standard deviation annualized across 252 trading sessions. Feeds directly into SHAP uncertainty penalty calculations.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b] flex justify-between">
            <span>Drawdown: {stock.maxDrawdown}%</span>
            <span>Beta: {stock.beta}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
