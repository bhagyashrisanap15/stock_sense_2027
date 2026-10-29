import React, { useState } from 'react';
import { StockData, ScreenTab } from '../types';
import { MarketNews } from '../components/MarketNews';
import { MarketCorrelation } from '../components/MarketCorrelation';
import { SectorPerformance } from '../components/SectorPerformance';
import { MarketHeatmap } from '../components/MarketHeatmap';
import { StockPriceLineChart } from '../components/StockPriceLineChart';

interface MarketsScreenProps {
  currentStock: StockData;
  onNavigate: (tab: ScreenTab) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  onShare: () => void;
  onSetAlert: () => void;
  watchlist?: string[];
  onSelectStock?: (stock: StockData) => void;
}

export const MarketsScreen: React.FC<MarketsScreenProps> = ({
  currentStock,
  onNavigate,
  isWatchlisted,
  onToggleWatchlist,
  onShare,
  onSetAlert,
  watchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATASTEEL'],
  onSelectStock
}) => {
  const [intelTab, setIntelTab] = useState<'news' | 'correlation' | 'sectors' | 'heatmap'>('news');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
      setTimeout(() => {
        onNavigate('ai-predict');
      }, 900);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-8">
      {/* Stock Header Card */}
      <div className="flex flex-col bg-[#122131] rounded-xl p-4 shadow-sm border border-[#1c2b3c]">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#1c2b3c] flex items-center justify-center text-[#adc6ff] text-[18px] font-bold shrink-0 border border-[#273647]">
              {currentStock.ticker.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[18px] font-bold text-[#d4e4fa] tracking-tight">
                  {currentStock.ticker}
                </span>
                <span className="bg-[#1c2b3c] text-[#c2c6d6] text-[11px] font-semibold px-1.5 py-0.5 rounded">
                  {currentStock.exchange}
                </span>
              </div>
              <span className="text-[13px] text-[#c2c6d6] truncate">
                {currentStock.name}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              aria-label="Toggle Watchlist"
              onClick={onToggleWatchlist}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${
                isWatchlisted
                  ? 'bg-[#00a572]/20 border-[#00a572]/40 text-[#4edea3]'
                  : 'bg-[#1c2b3c] border-[#273647] text-[#c2c6d6] hover:text-[#adc6ff]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isWatchlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                star
              </span>
            </button>
            <button
              aria-label="Share Analysis"
              onClick={onShare}
              className="w-9 h-9 rounded-lg bg-[#1c2b3c] border border-[#273647] flex items-center justify-center text-[#c2c6d6] hover:text-[#d4e4fa] transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
            </button>
            <button
              aria-label="Price Alert"
              onClick={onSetAlert}
              className="w-9 h-9 rounded-lg bg-[#1c2b3c] border border-[#273647] flex items-center justify-center text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">add_alert</span>
            </button>
          </div>
        </div>

        {/* Price and Return Display */}
        <div className="flex items-baseline justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[32px] font-bold text-[#d4e4fa] tracking-tight font-mono">
              ₹{currentStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <div
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[12px] font-semibold font-mono ${
                currentStock.changePercent >= 0
                  ? 'bg-[#00a572]/20 text-[#4edea3]'
                  : 'bg-[#93000a]/30 text-[#ffb4ab]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {currentStock.changePercent >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
              <span>
                {currentStock.changePercent >= 0 ? '+' : ''}₹{Math.abs(currentStock.change).toFixed(2)} ({currentStock.changePercent >= 0 ? '+' : ''}{currentStock.changePercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Fundamental Micro Pills */}
        <div className="flex items-center gap-3 mt-3 bg-[#0d1c2d] rounded-lg p-2.5 border border-[#1c2b3c]">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] text-[#c2c6d6]">Market Cap</span>
            <span className="text-[14px] font-semibold text-[#d4e4fa] truncate">
              {currentStock.marketCap}
            </span>
          </div>
          <div className="w-px h-6 bg-[#1c2b3c]" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] text-[#c2c6d6]">Sector</span>
            <span className="text-[14px] font-semibold text-[#d4e4fa] truncate">
              {currentStock.sector}
            </span>
          </div>
        </div>
      </div>

      {/* Laptop Dual-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols on xl, 7 cols on lg): Chart & Market Intelligence */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
          {/* Beginner-friendly Continuous Stock Price Line Chart (Groww / INDmoney inspired) */}
          <StockPriceLineChart stock={currentStock} />

      {/* Market Intelligence Switcher: News Sentiment vs Watchlist Correlation vs Sector Grid vs NSE 500 Heatmap */}
      <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-[#0d1c2d] rounded-xl border border-[#1c2b3c] gap-1">
              <button
                onClick={() => setIntelTab('news')}
                className={`py-2 px-2 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  intelTab === 'news'
                    ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                    : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">newspaper</span>
                <span>News & NLP</span>
              </button>
              <button
                onClick={() => setIntelTab('correlation')}
                className={`py-2 px-2 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  intelTab === 'correlation'
                    ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                    : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">hub</span>
                <span>Correlation</span>
              </button>
              <button
                onClick={() => setIntelTab('sectors')}
                className={`py-2 px-2 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  intelTab === 'sectors'
                    ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                    : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>Sector Grid</span>
              </button>
              <button
                onClick={() => setIntelTab('heatmap')}
                className={`py-2 px-2 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  intelTab === 'heatmap'
                    ? 'bg-[#1c2b3c] text-[#4edea3] shadow-sm border border-[#00a572]/40'
                    : 'text-[#c2c6d6] hover:text-[#4edea3]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#4edea3]">view_quilt</span>
                <span>NSE 500 Heatmap</span>
              </button>
            </div>

            {/* Render selected intelligence panel */}
            {intelTab === 'news' ? (
              <MarketNews ticker={currentStock.ticker} stockName={currentStock.name} />
            ) : intelTab === 'correlation' ? (
              <MarketCorrelation
                watchlist={watchlist}
                currentStock={currentStock}
              />
            ) : intelTab === 'sectors' ? (
              <SectorPerformance onNavigate={onNavigate} onSelectStock={onSelectStock} />
            ) : (
              <MarketHeatmap onNavigate={onNavigate} onSelectStock={onSelectStock} />
            )}
          </div>
        </div>

        {/* Right Column (4 cols on xl, 5 cols on lg): Indicators & AI Action */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          {/* Machine Learning Explainable Prediction Engine Action Card */}
          <div className="bg-[#122131] rounded-2xl p-4 border border-[#1c2b3c] flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">psychology</span>
                <span className="text-[14px] font-bold text-[#d4e4fa]">Deep Explainable AI</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#4d8eff]/15 text-[#adc6ff] text-[10px] font-mono font-bold">
                XGBoost + LSTM
              </span>
            </div>
            <p className="text-[11px] text-[#c2c6d6] leading-relaxed">
              Generate mathematical SHAP waterfall attributions, counterfactual rules, and risk decomposition for {currentStock.ticker}.
            </p>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`w-full h-11 font-semibold text-[13px] rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                analysisDone
                  ? 'bg-[#00a572] text-[#00311f]'
                  : 'bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#00285d] border-t-transparent rounded-full animate-spin" />
                  <span>Computing SHAP Attributions...</span>
                </>
              ) : analysisDone ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Analysis Ready • View XAI</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span>Run AI Prediction & SHAP</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>

          {/* AI Indicator Consensus Summary Banner */}
          <div className="bg-[#1c2b3c] rounded-2xl p-4 shadow-md flex flex-col gap-1.5 relative overflow-hidden border border-[#273647]">
        <div className="flex items-center gap-2 text-[#adc6ff]">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            insights
          </span>
          <span className="font-semibold text-[13px] uppercase tracking-wider text-[#adc6ff]">
            Indicator Consensus
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[11px] font-bold border border-[#00a572]/30">
            5 / 6 Bullish
          </span>
        </div>
        <p className="text-[13px] text-[#d4e4fa] leading-snug">
          5 of 6 technical indicators indicate bullish continuation with strong volume expansion.
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-[#010f1f] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#4edea3]" style={{ width: '83.3%' }} />
            <div className="h-full bg-[#3131c0]" style={{ width: '16.7%' }} />
          </div>
          <span className="text-[11px] text-[#4edea3] font-mono font-semibold">83.3% Strength</span>
        </div>
      </div>

      {/* Technical Indicator Deep-Dive Cards Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-semibold text-[15px] text-[#d4e4fa]">Technical Indicators</span>
          <span className="text-[11px] text-[#c2c6d6] font-mono">Realtime Feed</span>
        </div>

        {/* 1. RSI Indicator Card */}
        <div className="bg-[#122131] rounded-xl p-4 flex flex-col gap-2 shadow-sm border border-[#1c2b3c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-[#d4e4fa]">RSI (14)</span>
              <span className="px-2 py-0.5 bg-[#00a572]/15 text-[#4edea3] rounded-full text-[11px] font-semibold border border-[#00a572]/30">
                Bullish Momentum
              </span>
            </div>
            <span className="text-[20px] font-bold font-mono text-[#4edea3]">
              {currentStock.rsi.toFixed(1)}
            </span>
          </div>

          {/* Segmented RSI Track Gauge */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="relative w-full h-2.5 bg-[#010f1f] rounded-full overflow-hidden flex">
              <div className="h-full w-[30%] bg-[#1c2b3c] opacity-70" title="Oversold zone (0-30)" />
              <div className="h-full w-[40%] bg-[#273647]" title="Neutral zone (30-70)" />
              <div className="h-full w-[30%] bg-[#1c2b3c] opacity-70" title="Overbought zone (70-100)" />
              {/* Needle Pointer */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-[#adc6ff] rounded-full shadow-[0_0_8px_rgba(173,198,255,0.8)]"
                style={{ left: `calc(${currentStock.rsi}% - 3px)` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#8c909f] font-mono">
              <span>Oversold (30)</span>
              <span>Neutral (50)</span>
              <span>Overbought (70)</span>
            </div>
          </div>
        </div>

        {/* 2. MACD Indicator Card */}
        <div className="bg-[#122131] rounded-xl p-4 flex flex-col gap-2 shadow-sm border border-[#1c2b3c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-[#d4e4fa]">MACD (12, 26, 9)</span>
              <span className="px-2 py-0.5 bg-[#00a572]/15 text-[#4edea3] rounded-full text-[11px] font-semibold border border-[#00a572]/30">
                Positive Expansion
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#4edea3] text-[12px] font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>Expansion</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="bg-[#0d1c2d] rounded-lg p-2 flex flex-col border border-[#1c2b3c]">
              <span className="text-[11px] text-[#c2c6d6]">MACD Line</span>
              <span className="text-[14px] font-bold font-mono text-[#adc6ff]">
                +{currentStock.macd.macdLine.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#0d1c2d] rounded-lg p-2 flex flex-col border border-[#1c2b3c]">
              <span className="text-[11px] text-[#c2c6d6]">Signal Line</span>
              <span className="text-[14px] font-bold font-mono text-[#d4e4fa]">
                +{currentStock.macd.signalLine.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#0d1c2d] rounded-lg p-2 flex flex-col border border-[#1c2b3c]">
              <span className="text-[11px] text-[#c2c6d6]">Histogram</span>
              <span className="text-[14px] font-bold font-mono text-[#4edea3]">
                +{currentStock.macd.histogram.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Inline Mini Histogram Illustration */}
          <div className="h-6 flex items-end gap-1.5 pt-1 px-1 bg-[#010f1f] rounded">
            <div className="w-1/6 h-1.5 bg-[#4edea3]/40 rounded-t" />
            <div className="w-1/6 h-2 bg-[#4edea3]/50 rounded-t" />
            <div className="w-1/6 h-3 bg-[#4edea3]/70 rounded-t" />
            <div className="w-1/6 h-4 bg-[#4edea3]/80 rounded-t" />
            <div className="w-1/6 h-5 bg-[#4edea3] rounded-t" />
            <div className="w-1/6 h-5.5 bg-[#4edea3] rounded-t" />
          </div>
        </div>

        {/* 3. Moving Averages Alignment Card */}
        <div className="bg-[#122131] rounded-xl p-4 flex flex-col gap-2 shadow-sm border border-[#1c2b3c]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[15px] text-[#d4e4fa]">Moving Averages Alignment</span>
            <span className="px-2 py-0.5 bg-[#00a572]/15 text-[#4edea3] rounded-full text-[11px] font-semibold border border-[#00a572]/30">
              Strong Bullish (3/3)
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {/* SMA 20 */}
            <div className="flex items-center justify-between bg-[#0d1c2d] p-2 rounded-lg border border-[#1c2b3c]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4d8eff] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#d4e4fa] font-medium">SMA 20 (Short-term)</span>
                  <span className="text-[11px] text-[#4edea3]">Price Above (+1.43%)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-bold font-mono text-[#d4e4fa]">
                  ₹{currentStock.sma20.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[11px] text-[#4edea3] font-medium">Bullish</span>
              </div>
            </div>

            {/* SMA 50 */}
            <div className="flex items-center justify-between bg-[#0d1c2d] p-2 rounded-lg border border-[#1c2b3c]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c0c1ff] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#d4e4fa] font-medium">SMA 50 (Medium-term)</span>
                  <span className="text-[11px] text-[#4edea3]">Golden cross intact</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-bold font-mono text-[#d4e4fa]">
                  ₹{currentStock.sma50.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[11px] text-[#4edea3] font-medium">Bullish</span>
              </div>
            </div>

            {/* SMA 200 */}
            <div className="flex items-center justify-between bg-[#0d1c2d] p-2 rounded-lg border border-[#1c2b3c]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#adc6ff] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#d4e4fa] font-medium">SMA 200 (Long-term)</span>
                  <span className="text-[11px] text-[#c2c6d6]">Long-term support base</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-bold font-mono text-[#d4e4fa]">
                  ₹{currentStock.sma200.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[11px] text-[#4edea3] font-medium">Strong Bullish</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bollinger Bands Card */}
        <div className="bg-[#122131] rounded-xl p-4 flex flex-col gap-2 shadow-sm border border-[#1c2b3c]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[15px] text-[#d4e4fa]">Bollinger Bands (20, 2)</span>
            <span className="font-mono text-[11px] text-[#adc6ff] bg-[#4d8eff]/10 px-2 py-0.5 rounded border border-[#4d8eff]/20 font-semibold">
              %B: {currentStock.bollinger.pb.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="bg-[#0d1c2d] p-2 rounded-lg flex flex-col border border-[#1c2b3c]">
              <span className="text-[11px] text-[#c2c6d6]">Upper Band</span>
              <span className="text-[13px] font-bold font-mono text-[#d4e4fa]">
                ₹{currentStock.bollinger.upper.toFixed(0)}
              </span>
            </div>
            <div className="bg-[#0d1c2d] p-2 rounded-lg flex flex-col border border-[#1c2b3c]">
              <span className="text-[11px] text-[#c2c6d6]">Middle (SMA)</span>
              <span className="text-[13px] font-bold font-mono text-[#d4e4fa]">
                ₹{currentStock.bollinger.middle.toFixed(0)}
              </span>
            </div>
            <div className="bg-[#0d1c2d] p-2 rounded-lg flex flex-col border border-[#1c2b3c]">
              <span className="text-[11px] text-[#c2c6d6]">Lower Band</span>
              <span className="text-[13px] font-bold font-mono text-[#d4e4fa]">
                ₹{currentStock.bollinger.lower.toFixed(0)}
              </span>
            </div>
          </div>

          {/* %B Location Tracker */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="w-full bg-[#010f1f] h-2 rounded-full relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4d8eff]/40 to-[#4edea3]"
                style={{ width: `${currentStock.bollinger.pb * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#8c909f] font-mono">
              <span>Lower Band (0.0)</span>
              <span className="text-[#4edea3]">Current ({currentStock.bollinger.pb}) Upper Expansion</span>
              <span>Upper Band (1.0)</span>
            </div>
          </div>
        </div>

        {/* 5. Volume & Liquidity Card */}
        <div className="bg-[#122131] rounded-xl p-4 flex flex-col gap-2 shadow-sm border border-[#1c2b3c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-[#d4e4fa]">Volume & Liquidity Profile</span>
              <span className="px-2 py-0.5 bg-[#00a572]/15 text-[#4edea3] rounded-full text-[11px] font-semibold border border-[#00a572]/30">
                High Inflow
              </span>
            </div>
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">bar_chart</span>
          </div>

          <div className="flex items-center justify-between bg-[#0d1c2d] p-3 rounded-lg mt-1 border border-[#1c2b3c]">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#c2c6d6]">24h Traded Volume</span>
              <span className="text-[18px] font-bold font-mono text-[#d4e4fa]">
                {currentStock.volume24h}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-[#c2c6d6]">vs. 20D Avg ({currentStock.vol20dAvg})</span>
              <span className="text-[14px] font-bold font-mono text-[#4edea3]">
                {currentStock.volumeSurge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

