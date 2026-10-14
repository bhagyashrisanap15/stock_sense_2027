import React, { useState } from 'react';
import { StockData, ScreenTab } from '../types';
import { INDICES_DATA, STOCKS_DATA, HOTLINKED_ASSETS } from '../data/stocks';
import { SectorPerformance } from '../components/SectorPerformance';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { MarketSentimentGauge } from '../components/MarketSentimentGauge';
import { MarketHeatmap } from '../components/MarketHeatmap';
import { EarningsCalendar } from '../components/EarningsCalendar';
import { VolatilityMonitor } from '../components/VolatilityMonitor';

interface DashboardScreenProps {
  currentStock: StockData;
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
  onOpenSearch: () => void;
  onOpenBacktest: () => void;
  watchlist?: string[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentStock,
  onSelectStock,
  onNavigate,
  onOpenSearch,
  onOpenBacktest,
  watchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATASTEEL']
}) => {
  const [showBanner, setShowBanner] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Nifty 50');
  const [searchFilter, setSearchFilter] = useState('');
  const [showTreemap, setShowTreemap] = useState(false);

  const filterCategories = ['Nifty 50', 'Large Cap', 'Tech & IT', 'Auto', 'Banking'];

  const watchlistItems = [
    STOCKS_DATA.TCS,
    STOCKS_DATA.INFY,
    STOCKS_DATA.HDFCBANK,
    STOCKS_DATA.TATASTEEL
  ];

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-8">
      {/* Compliance / Educational Disclaimer Banner */}
      {showBanner && (
        <aside className="relative overflow-hidden bg-[#0d1c2d] rounded-xl p-3 shadow-sm flex items-start justify-between gap-3 border border-[#1c2b3c]">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-1 self-stretch rounded-full bg-[#c0c1ff] shrink-0" />
            <div className="flex-1 flex flex-col py-0.5 min-w-0">
              <div className="flex items-center gap-1.5 text-[#c0c1ff]">
                <span className="material-symbols-outlined text-[16px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
                <span className="font-semibold text-[11px] uppercase tracking-wider">
                  Educational & Research Sandbox
                </span>
              </div>
              <p className="text-[12px] text-[#c2c6d6] mt-0.5 leading-snug">
                StockSense is an analytical research platform. AI predictions, risk scores, and mathematical attributions are experimental and not financial advice.
              </p>
            </div>
          </div>
          <button
            aria-label="Dismiss banner"
            className="text-[#c2c6d6] hover:text-[#d4e4fa] p-1 rounded-lg transition-colors shrink-0"
            onClick={() => setShowBanner(false)}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </aside>
      )}

      {/* Greeting & Top Action Workspace Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#122131] p-4 rounded-2xl border border-[#1c2b3c] shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#1c2b3c] flex items-center justify-center shrink-0 shadow-sm relative border border-[#273647]">
            <span className="material-symbols-outlined text-[#adc6ff] text-[24px]">model_training</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] absolute top-1.5 right-1.5 ring-2 ring-[#122131]"></span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[20px] lg:text-[22px] font-bold text-[#d4e4fa] tracking-tight truncate">
                Quant Terminal • Dr. K. Sharma
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#4d8eff]/15 text-[#adc6ff] text-[11px] font-semibold border border-[#4d8eff]/30">
                Institutional Lead
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-[#00a572]/15 text-[#4edea3] text-[11px] font-mono border border-[#00a572]/30 gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                FastAPI v2.8 Live
              </span>
            </div>
            <p className="text-[12px] text-[#c2c6d6] mt-0.5 truncate">
              Active Focus: <strong className="text-[#adc6ff] font-semibold">{currentStock.ticker}</strong> ({currentStock.name}) • Market Direction: <span className="text-[#4edea3] font-semibold">{currentStock.directionLabel}</span>
            </p>
          </div>
        </div>

        {/* Top Fast Action Toolbar for Laptop */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => onNavigate('markets')}
            className="h-9 px-3 rounded-xl bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#002e6a] text-[12px] font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px]">analytics</span>
            <span>Technical Workspace</span>
          </button>
          <button
            onClick={() => onNavigate('paper-trading')}
            className="h-9 px-3 rounded-xl bg-[#1c2b3c] hover:bg-[#273647] text-[#4edea3] text-[12px] font-semibold flex items-center gap-1.5 border border-[#273647] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px]">candlestick_chart</span>
            <span>Paper Trading</span>
          </button>
          <button
            onClick={onOpenBacktest}
            className="h-9 px-3 rounded-xl bg-[#1c2b3c] hover:bg-[#273647] text-[#c2c6d6] hover:text-[#d4e4fa] text-[12px] font-semibold flex items-center gap-1.5 border border-[#273647] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px]">model_training</span>
            <span>Backtest 10k</span>
          </button>
        </div>
      </section>

      {/* Market Overview Indices Track - Full Laptop 6-Index Responsive Grid */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#c2c6d6] uppercase tracking-wider font-semibold">
              NSE / BSE Benchmark Indices
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#adc6ff] font-mono">
              6 Core Feeds
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#4edea3] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping"></span> Live 09:42 IST
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {INDICES_DATA.map((idx) => (
            <article
              key={idx.name}
              className="bg-[#122131] rounded-xl p-3 flex flex-col justify-between shadow-sm border border-[#1c2b3c] hover:border-[#273647] transition-all group"
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#8c909f] group-hover:text-[#adc6ff] transition-colors truncate">
                  {idx.name}
                </span>
                <span className="font-mono text-[15px] text-[#d4e4fa] font-bold tracking-tight mt-0.5">
                  {idx.value}
                </span>
                <span
                  className={`font-mono text-[11px] inline-flex items-center gap-0.5 font-semibold mt-0.5 ${
                    idx.isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {idx.isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                  </span>
                  {idx.change}
                </span>
              </div>
              <div className="mt-2 h-7 w-full flex items-end">
                <svg className="w-full h-6 overflow-visible" fill="none" viewBox="0 0 70 24">
                  {idx.isPositive ? (
                    <>
                      <path
                        d="M1 20 Q 15 17, 24 14 T 48 9 T 69 3"
                        fill="none"
                        stroke="#4edea3"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M1 20 Q 15 17, 24 14 T 48 9 T 69 3 L 69 24 L 1 24 Z"
                        fill="url(#grad-green)"
                        opacity="0.18"
                      />
                      <defs>
                        <linearGradient id="grad-green" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#4edea3" />
                          <stop offset="100%" stopColor="#4edea3" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </>
                  ) : (
                    <>
                      <path
                        d="M1 4 Q 16 7, 30 11 T 50 16 T 69 21"
                        fill="none"
                        stroke="#ffb4ab"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M1 4 Q 16 7, 30 11 T 50 16 T 69 21 L 69 24 L 1 24 Z"
                        fill="url(#grad-red)"
                        opacity="0.2"
                      />
                      <defs>
                        <linearGradient id="grad-red" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#ffb4ab" />
                          <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </>
                  )}
                </svg>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Laptop Institutional Dual-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols on xl, 7 cols on lg): Primary Analytical Charts & Macro Breadth */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Quick Search & Category Filter Bar */}
          <section className="bg-[#122131] rounded-2xl p-3 border border-[#1c2b3c] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[18px]">
                search
              </span>
              <input
                className="w-full h-10 pl-10 pr-10 bg-[#0d1c2d] text-[#d4e4fa] placeholder:text-[#8c909f] text-[13px] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4d8eff] transition-colors border border-[#1c2b3c]"
                placeholder="Search symbol (RELIANCE, TCS, INFY, HDFCBANK)..."
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onOpenSearch();
                }}
              />
              <button
                aria-label="Open search dialog"
                className="absolute right-3 text-[#8c909f] hover:text-[#d4e4fa] transition-colors flex items-center"
                onClick={onOpenSearch}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {filterCategories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#adc6ff] text-[#002e6a] shadow-sm font-semibold'
                        : 'bg-[#0d1c2d] text-[#c2c6d6] hover:text-[#d4e4fa] border border-[#1c2b3c]'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[13px] leading-none">check</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 30-Day Price History Trend Chart Widget */}
          <PriceHistoryChart currentStock={currentStock} onNavigate={onNavigate} />

          {/* 30-Day Rolling Volatility Monitor Mini Chart with Toggle Modes */}
          <VolatilityMonitor currentStock={currentStock} onNavigate={onNavigate} />

          {/* Macro Breadth Section: Sector Performance & NSE 500 Heatmap Switcher */}
          <div className="flex flex-col gap-3">
            <div className="bg-[#0d1c2d] p-1.5 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowTreemap(false)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                    !showTreemap
                      ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                      : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  <span>Sector Health Grid</span>
                </button>
                <button
                  onClick={() => setShowTreemap(true)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                    showTreemap
                      ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                      : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">view_quilt</span>
                  <span>NSE 500 Market Treemap</span>
                </button>
              </div>

              <span className="text-[11px] text-[#8c909f] font-mono hidden sm:inline px-2">
                {showTreemap ? 'Constituent drill-down active' : '11 Sectors tracked'}
              </span>
            </div>

            {showTreemap ? (
              <MarketHeatmap onSelectStock={onSelectStock} onNavigate={onNavigate} />
            ) : (
              <SectorPerformance onSelectStock={onSelectStock} onNavigate={onNavigate} />
            )}
          </div>

          {/* Upcoming Quarterly Earnings Calendar Widget */}
          <EarningsCalendar
            watchlist={watchlist}
            onSelectStock={onSelectStock}
            onNavigate={onNavigate}
          />

          {/* Project Tech Stack & Quant Architecture Badge Footer */}
          <footer className="bg-[#122131] rounded-2xl p-4 border border-[#1c2b3c] flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">architecture</span>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#d4e4fa] font-bold">Quant Pipeline Architecture</span>
                <span className="text-[11px] text-[#8c909f]">B.Tech Capstone Analytical Engine</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
              <span className="px-2.5 py-1 rounded-lg bg-[#0d1c2d] text-[#d4e4fa] text-[11px] font-mono flex items-center gap-1.5 border border-[#1c2b3c]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]"></span>FastAPI
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0d1c2d] text-[#d4e4fa] text-[11px] font-mono flex items-center gap-1.5 border border-[#1c2b3c]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>PyTorch / LSTM
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0d1c2d] text-[#d4e4fa] text-[11px] font-mono flex items-center gap-1.5 border border-[#1c2b3c]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4d8eff]"></span>XGBoost
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0d1c2d] text-[#d4e4fa] text-[11px] font-mono flex items-center gap-1.5 border border-[#1c2b3c]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>SHAP / LIME
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0d1c2d] text-[#d4e4fa] text-[11px] font-mono flex items-center gap-1.5 border border-[#1c2b3c]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>MongoDB
              </span>
            </div>
          </footer>
        </div>

        {/* Right Column (4 cols on xl, 5 cols on lg): Market Sentiment, Signals & Watchlist */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          {/* Market Sentiment (D3 Fear & Greed Radial Gauge) Widget */}
          <MarketSentimentGauge onNavigate={onNavigate} />

          {/* AI Daily Trend Prediction Highlight Card */}
          <article className="relative overflow-hidden bg-[#122131] rounded-2xl p-4 shadow-md flex flex-col gap-3.5 border border-[#1c2b3c]">
            {/* Ambient Glow */}
            <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-[#00a572]/15 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-1 border-b border-[#1c2b3c] relative z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">auto_graph</span>
                <h2 className="text-[15px] font-bold text-[#d4e4fa]">AI Daily Alpha Signal</h2>
              </div>
              <span className="text-[11px] text-[#adc6ff] font-mono px-2 py-0.5 rounded bg-[#1c2b3c]">
                Next-Day Horizon
              </span>
            </div>

            {/* Top Row: Stock Info + Trend Pill */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#273647] flex items-center justify-center font-mono font-bold text-[#adc6ff] text-[16px] shadow-sm border border-[#1c2b3c] shrink-0">
                  {currentStock.ticker.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[16px] text-[#d4e4fa] tracking-tight truncate">
                      {currentStock.ticker}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#1c2b3c] text-[#c2c6d6] text-[11px] font-semibold">
                      {currentStock.exchange}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#c2c6d6] truncate">
                    {currentStock.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-mono text-[17px] text-[#d4e4fa] font-bold">
                  ₹{currentStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`font-mono text-[12px] font-semibold flex items-center ${
                    currentStock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {currentStock.changePercent >= 0 ? 'north_east' : 'south_east'}
                  </span>
                  {currentStock.changePercent >= 0 ? '+' : ''}
                  {currentStock.changePercent}%
                </span>
              </div>
            </div>

            {/* Center Machine Learning Insights Section */}
            <div className="bg-[#0d1c2d] rounded-xl p-3 flex flex-col gap-2 relative z-10 border border-[#1c2b3c]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#adc6ff] text-[16px]">memory</span>
                  <span className="text-[11px] text-[#c2c6d6] font-medium truncate">
                    {currentStock.activeModel}
                  </span>
                </div>
                {/* Predicted Trend Pill */}
                <div
                  className={`px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-bold ${
                    currentStock.direction === 'UP'
                      ? 'bg-[#00a572]/20 text-[#4edea3]'
                      : currentStock.direction === 'DOWN'
                      ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                      : 'bg-[#3131c0]/30 text-[#b0b2ff]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      currentStock.direction === 'UP'
                        ? 'bg-[#4edea3]'
                        : currentStock.direction === 'DOWN'
                        ? 'bg-[#ffb4ab]'
                        : 'bg-[#b0b2ff]'
                    }`}
                  />
                  PREDICTED {currentStock.direction}
                </div>
              </div>

              {/* Confidence Gauge Bar */}
              <div className="flex flex-col gap-1 mt-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#d4e4fa]">Model Confidence</span>
                  <span className="font-mono text-[#4edea3] font-semibold">
                    {currentStock.confidence}% ({currentStock.confidence >= 80 ? 'High' : 'Moderate'})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#273647] overflow-hidden">
                  <div
                    className="h-full bg-[#4edea3] rounded-full transition-all duration-500"
                    style={{ width: `${currentStock.confidence}%` }}
                  />
                </div>
              </div>

              {/* Drivers Attribution */}
              <div className="mt-1 flex items-start gap-2 bg-[#1c2b3c]/60 p-2.5 rounded-lg border border-[#273647]/50">
                <span className="material-symbols-outlined text-[#adc6ff] text-[18px] shrink-0 mt-0.5">
                  insights
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-[#d4e4fa] font-semibold">
                    Primary Feature Attribution
                  </span>
                  <p className="text-[12px] text-[#4edea3] mt-0.5 font-medium leading-snug">
                    {currentStock.shapFactors[0]?.feature} (+{currentStock.shapFactors[0]?.impact}) & {currentStock.shapFactors[1]?.feature}
                  </p>
                  <span className="text-[10px] text-[#c2c6d6] mt-0.5">
                    Historical 30-day directional backtest win rate: {currentStock.winRate}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
              <button
                onClick={() => onNavigate('ai-predict')}
                className="h-9 px-3 bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#002e6a] rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">bubble_chart</span>
                <span>View SHAP</span>
              </button>
              <button
                onClick={() => onNavigate('risk-radar')}
                className="h-9 px-3 bg-[#273647] hover:bg-[#314256] text-[#d4e4fa] hover:text-[#adc6ff] rounded-lg text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">shield</span>
                <span>Risk Metrics</span>
              </button>
            </div>
          </article>

          {/* Quick Dual Bento: Watchlist Portfolio NAV & Paper Trading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {/* Watchlist Portfolio Quick Widget */}
            <section
              onClick={() => onNavigate('portfolio')}
              className="bg-[#122131] hover:bg-[#1c2b3c] cursor-pointer rounded-2xl p-4 shadow-sm border border-[#1c2b3c] hover:border-[#273647] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center shrink-0 border border-[#4d8eff]/30 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#d4e4fa]">Watchlist NAV</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono">
                      +11.41%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#c2c6d6] truncate">
                    Real-time valuation across 5 holdings
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[14px] font-bold text-[#d4e4fa]">₹5,48,250</span>
                  <span className="font-mono text-[10px] text-[#4edea3] flex items-center gap-0.5">
                    +₹4,820 today
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#8c909f] group-hover:text-[#adc6ff] transition-colors text-[18px]">
                  chevron_right
                </span>
              </div>
            </section>

            {/* Paper Trading Simulation Quick Launcher */}
            <section
              onClick={() => onNavigate('paper-trading')}
              className="bg-[#122131] hover:bg-[#1c2b3c] cursor-pointer rounded-2xl p-4 shadow-sm border border-[#00a572]/30 hover:border-[#4edea3]/50 transition-all flex items-center justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00a572]/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 min-w-0 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center shrink-0 border border-[#00a572]/30 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">candlestick_chart</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#d4e4fa]">Paper Trading</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono">
                      ₹10L Cash
                    </span>
                  </div>
                  <span className="text-[11px] text-[#c2c6d6] truncate">
                    Virtual execution & P&L tracking
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 relative z-10">
                <span className="text-[11px] text-[#4edea3] font-semibold hidden xl:inline">
                  Open
                </span>
                <span className="material-symbols-outlined text-[#4edea3] group-hover:translate-x-0.5 transition-transform text-[18px]">
                  arrow_forward
                </span>
              </div>
            </section>
          </div>

          {/* Live Model Watchlist Preview */}
          <section className="bg-[#122131] rounded-2xl p-4 border border-[#1c2b3c] flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px]">visibility</span>
                <h2 className="text-[14px] font-bold text-[#d4e4fa]">Live Model Watchlist</h2>
              </div>
              <button
                onClick={() => onNavigate('watchlist')}
                className="text-[11px] text-[#adc6ff] hover:underline flex items-center gap-0.5 font-medium"
              >
                <span>View All ({watchlistItems.length + 2})</span>
                <span className="material-symbols-outlined text-[13px]">chevron_right</span>
              </button>
            </div>

            {/* Assets List */}
            <div className="flex flex-col gap-2">
              {watchlistItems.map((stock) => {
                const isUp = stock.direction === 'UP';
                const isDown = stock.direction === 'DOWN';

                return (
                  <article
                    key={stock.ticker}
                    onClick={() => {
                      onSelectStock(stock);
                      onNavigate('markets');
                    }}
                    className="bg-[#0d1c2d] hover:bg-[#1c2b3c] rounded-xl p-2.5 flex items-center justify-between shadow-sm transition-all border border-[#1c2b3c] hover:border-[#273647] cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#1c2b3c] group-hover:bg-[#273647] flex items-center justify-center font-mono font-bold text-[#adc6ff] text-[11px] shrink-0 border border-[#273647]">
                        {stock.ticker.slice(0, 2)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[13px] text-[#d4e4fa] group-hover:text-[#adc6ff] transition-colors truncate">
                            {stock.ticker}
                          </span>
                          <span
                            className={`px-1 py-0.2 rounded text-[9px] font-semibold flex items-center gap-0.5 ${
                              isUp
                                ? 'bg-[#00a572]/20 text-[#4edea3]'
                                : isDown
                                ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                                : 'bg-[#3131c0]/30 text-[#b0b2ff]'
                            }`}
                          >
                            {stock.direction}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8c909f] truncate">
                          {stock.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-[13px] text-[#d4e4fa] font-semibold">
                          ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-medium ${
                            stock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {stock.changePercent >= 0 ? '+' : ''}
                          {stock.changePercent}%
                        </span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-center ${
                          stock.riskCategory === 'LOW'
                            ? 'bg-[#4edea3]/10 text-[#4edea3]'
                            : stock.riskCategory === 'MODERATE'
                            ? 'bg-[#4d8eff]/10 text-[#adc6ff]'
                            : 'bg-[#93000a]/30 text-[#ffb4ab]'
                        }`}
                      >
                        {stock.riskCategory}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Research Engine Visual Showcase Card */}
          <section className="relative rounded-2xl overflow-hidden bg-[#122131] p-4 shadow-sm flex flex-col gap-2.5 border border-[#1c2b3c]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#c0c1ff] uppercase font-semibold tracking-wider">
                  Quant Research Sandbox
                </span>
                <span className="text-[14px] font-bold text-[#d4e4fa]">
                  Neural Factor Attribution
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#3131c0]/30 flex items-center justify-center text-[#c0c1ff] border border-[#3131c0]/50">
                <span className="material-symbols-outlined text-[17px]">dataset</span>
              </div>
            </div>

            <div className="relative w-full h-24 rounded-xl overflow-hidden flex items-center justify-center bg-[#010f1f]">
              <img
                src={HOTLINKED_ASSETS.researchBanner}
                alt="Institutional quant financial visualization"
                className="w-full h-full object-cover opacity-60"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122131] via-[#122131]/40 to-transparent flex items-end p-2.5">
                <p className="text-[12px] text-[#d4e4fa] leading-snug font-medium">
                  Multi-layer LSTM + XGBoost ensemble calibrated on 12 years of tick data.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
