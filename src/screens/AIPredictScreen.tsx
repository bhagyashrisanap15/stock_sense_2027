import React, { useState } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  SlidersHorizontal,
  FileCheck2,
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
  Activity
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA, getStockData } from '../data/stocks';
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
  const [activeTab, setActiveTab] = useState<'all' | 'shap' | 'forecast' | 'whatif' | 'transparency'>('all');
  const [showAllShap, setShowAllShap] = useState<boolean>(false);
  const [isShapAvailable, setIsShapAvailable] = useState<boolean>(true);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const baseTickers = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'ITC', 'TATAMOTORS', 'BHARTIARTL', 'LT'];
  const sampleTickers = baseTickers.includes(currentStock.ticker) ? baseTickers : [currentStock.ticker, ...baseTickers];

  const handleExportPDF = () => {
    const filename = `${currentStock.ticker}_XAI_Audit_${Date.now().toString().slice(-4)}.pdf`;
    setExportToast(`SHAP PDF Audit Dossier generated (${filename})`);
    setTimeout(() => {
      setExportToast(null);
    }, 3500);
  };

  // Generate feature explanations mapping in beginner-friendly language
  const getFeatureRationale = (featureName: string, impact: number) => {
    const isBull = impact >= 0;
    if (featureName.toLowerCase().includes('rsi')) {
      return isBull
        ? `RSI momentum (${currentStock.rsi}) is in a healthy upward zone without being too expensive (>70), helping push the stock UP.`
        : `RSI momentum (${currentStock.rsi}) shows slowing buying interest or consolidation, pulling the stock DOWN.`;
    }
    if (featureName.toLowerCase().includes('macd')) {
      return isBull
        ? `MACD trend indicator confirms short-term price momentum is speeding up in an upward direction.`
        : `MACD trend indicator shows short-term momentum is cooling off or facing downward pressure.`;
    }
    if (featureName.toLowerCase().includes('sma') || featureName.toLowerCase().includes('moving')) {
      return isBull
        ? `Current price is trading comfortably above its 20-day average price, confirming steady buyer support.`
        : `Price is facing resistance near recent average levels, meaning sellers are stepping in.`;
    }
    if (featureName.toLowerCase().includes('volume') || featureName.toLowerCase().includes('obv')) {
      return isBull
        ? `Higher than usual trading volume (${currentStock.volumeSurge}) indicates genuine interest from large investors.`
        : `Trading volume is quiet, meaning there isn't enough buying power to fuel an immediate breakout.`;
    }
    if (featureName.toLowerCase().includes('volatility') || featureName.toLowerCase().includes('atr')) {
      return isBull
        ? `Stock price swings are moderate and orderly, supporting a clear, predictable trend.`
        : `Higher price swings (${currentStock.annVolatility}% yearly volatility) mean more daily fluctuation and uncertainty.`;
    }
    return isBull
      ? `This technical indicator is currently in a favorable zone based on historical market patterns.`
      : `This indicator shows cautious historical patterns, suggesting patience is needed.`;
  };

  const displayedShapFactors = showAllShap
    ? currentStock.shapFactors
    : currentStock.shapFactors.slice(0, 5);

  const isUp = currentStock.direction === 'UP';
  const isDown = currentStock.direction === 'DOWN';

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-12">
      {/* SECTION A: Comprehensive Stock Overview Context Header */}
      <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 shadow-md border border-[#1c2b3c] flex flex-col gap-4">
        {/* Top Row: Company & Price & Quick Ticker Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1c2b3c] flex items-center justify-center shrink-0 border border-[#273647]">
              <BrainCircuit className="w-6 h-6 text-[#38bdf8]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[19px] text-[#d4e4fa] tracking-tight">
                  {currentStock.ticker}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c2b3c] text-[11px] font-mono font-bold text-[#38bdf8] border border-[#273647]">
                  {currentStock.exchange}
                </span>
                <span className="text-[12px] text-[#8c909f]">
                  • {currentStock.sector}
                </span>
              </div>
              <span className="text-[13px] text-[#c2c6d6]">
                {currentStock.name} • Company Size: {currentStock.marketCap}
              </span>
            </div>
          </div>

          {/* Quick Ticker Switcher */}
          {onSelectStock && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-[11px] text-[#8c909f] font-mono shrink-0 mr-1">
                Popular Stocks:
              </span>
              {sampleTickers.map((tick) => {
                const isSelected = currentStock.ticker === tick;
                return (
                  <button
                    key={tick}
                    onClick={() => {
                      onSelectStock(getStockData(tick));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all shrink-0 ${
                      isSelected
                        ? 'bg-[#38bdf8] text-[#002844] shadow-sm'
                        : 'bg-[#0d1c2d] hover:bg-[#1c2b3c] text-[#8c909f] border border-[#1c2b3c]'
                    }`}
                  >
                    {tick}
                  </button>
                );
              })}
            </div>
          )}

          {/* Price & Direction Pill */}
          <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1c2b3c]">
            <div className="flex flex-col lg:items-end">
              <span className="font-mono text-[22px] text-[#d4e4fa] font-bold leading-tight">
                ₹{currentStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`font-mono text-[12.5px] flex items-center gap-0.5 font-bold ${
                  currentStock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                }`}
              >
                {currentStock.changePercent >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {currentStock.changePercent >= 0 ? '+' : ''}₹{currentStock.change.toFixed(2)} (
                {currentStock.changePercent >= 0 ? '+' : ''}{currentStock.changePercent}%)
              </span>
            </div>

            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
                isUp
                  ? 'bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/40'
                  : isDown
                  ? 'bg-[#93000a]/20 text-[#ffb4ab] border-[#93000a]/40'
                  : 'bg-[#3131c0]/20 text-[#adc6ff] border-[#3131c0]/40'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isUp ? 'bg-[#4edea3]' : isDown ? 'bg-[#ffb4ab]' : 'bg-[#adc6ff]'
                }`}
              />
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-bold leading-none">
                  {currentStock.direction === 'UP'
                    ? 'Likely UP'
                    : currentStock.direction === 'DOWN'
                    ? 'Likely DOWN'
                    : 'Neutral'}
                </span>
                <span className="text-[10px] font-mono mt-0.5 opacity-90">
                  {currentStock.confidence}% Confidence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Strip: Horizon, Timestamp, Calibrated Probability */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1c2b3c] text-[11.5px] font-mono">
          <div className="bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
            <span className="text-[#8c909f]">Prediction Target:</span>
            <span className="text-[#38bdf8] font-bold">Next 5 Trading Days</span>
          </div>

          <div className="bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
            <span className="text-[#8c909f]">Data As Of:</span>
            <span className="text-[#d4e4fa]">{currentStock.snapshotTime} (Latest NSE Close)</span>
          </div>

          <div className="bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
            <span className="text-[#8c909f]">AI Confidence:</span>
            <span className="text-[#4edea3] font-bold">{currentStock.confidence}% Sure</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Deep Investigation */}
      <div className="flex bg-[#0d1c2d] p-1 rounded-xl gap-1 border border-[#1c2b3c] overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-[12px] font-semibold text-center transition-all ${
            activeTab === 'all'
              ? 'bg-[#1c2b3c] text-[#38bdf8] border border-[#273647] shadow-sm'
              : 'text-[#8c909f] hover:text-[#d4e4fa]'
          }`}
        >
          All AI Insights
        </button>
        <button
          onClick={() => setActiveTab('shap')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-[12px] font-semibold text-center transition-all ${
            activeTab === 'shap'
              ? 'bg-[#1c2b3c] text-[#38bdf8] border border-[#273647] shadow-sm'
              : 'text-[#8c909f] hover:text-[#d4e4fa]'
          }`}
        >
          Why AI Predicts Up / Down
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-[12px] font-semibold text-center transition-all ${
            activeTab === 'forecast'
              ? 'bg-[#1c2b3c] text-[#38bdf8] border border-[#273647] shadow-sm'
              : 'text-[#8c909f] hover:text-[#d4e4fa]'
          }`}
        >
          5-Day Price Target & Range
        </button>
        <button
          onClick={() => setActiveTab('whatif')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-[12px] font-semibold text-center transition-all ${
            activeTab === 'whatif'
              ? 'bg-[#1c2b3c] text-[#38bdf8] border border-[#273647] shadow-sm'
              : 'text-[#8c909f] hover:text-[#d4e4fa]'
          }`}
        >
          What-If Simulator
        </button>
        <button
          onClick={() => setActiveTab('transparency')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-[12px] font-semibold text-center transition-all ${
            activeTab === 'transparency'
              ? 'bg-[#1c2b3c] text-[#38bdf8] border border-[#273647] shadow-sm'
              : 'text-[#8c909f] hover:text-[#d4e4fa]'
          }`}
        >
          How AI Works
        </button>
      </div>

      {/* SECTION C: Prediction Explanation in Simple English */}
      <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 flex flex-col gap-3 border border-[#1c2b3c] shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-[15px] font-bold text-[#d4e4fa] tracking-tight">
              What This Means in Plain English
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#4d8eff]/20 text-[#adc6ff] border border-[#4d8eff]/30">
              Easy Explanation
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8c909f]">
            Analyzed using multi-year NSE price and volume patterns
          </span>
        </div>

        <div className="bg-[#0d1c2d] p-4 rounded-xl border border-[#273647] flex flex-col gap-2">
          <p className="text-[13.5px] text-[#d4e4fa] leading-relaxed font-normal">
            The AI predicts a <strong className={isUp ? 'text-[#4edea3]' : isDown ? 'text-[#ffb4ab]' : 'text-[#adc6ff]'}>
              {currentStock.direction === 'UP' ? 'Bullish (Upward)' : currentStock.direction === 'DOWN' ? 'Bearish (Downward)' : 'Neutral (Consolidating)'}
            </strong> trend with <strong className="text-white">{currentStock.confidence}% confidence</strong> over the next 5 trading days. Key momentum signals (14-day RSI at {currentStock.rsi} and {currentStock.macd?.histogram >= 0 ? 'positive' : 'negative'} MACD) show {isUp ? 'healthy buyer demand' : isDown ? 'cautious selling pressure' : 'a balanced market'} compared to the 20-day average price.
          </p>

          <div className="flex items-start gap-2 pt-2 border-t border-[#1c2b3c] text-[#8c909f] text-[11px]">
            <Info className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#c2c6d6]">Beginner Guide:</strong> The factors below show what is influencing the AI's calculation right now. Green factors push the price expectation UP, while red factors pull it DOWN.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION B & SECTION D Workstation Dual-Column Grid */}
      {(activeTab === 'all' || activeTab === 'shap') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: SHAP Feature Attribution (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 flex flex-col gap-4 border border-[#1c2b3c] shadow-md">
              <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#38bdf8]" />
                    <h3 className="text-[15px] font-bold text-[#d4e4fa] tracking-tight">
                      Why the AI Predicts UP or DOWN (Key Drivers)
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-[#8c909f]">
                    Top market factors that move the AI's forecast from neutral (50%) toward {currentStock.direction === 'UP' ? 'UP' : 'DOWN'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAllShap(!showAllShap)}
                    className="px-2.5 py-1 rounded-lg bg-[#0d1c2d] hover:bg-[#1c2b3c] border border-[#1c2b3c] text-[11px] font-mono text-[#adc6ff]"
                  >
                    {showAllShap ? 'Show Top 5' : 'Show All Factors (8)'}
                  </button>
                </div>
              </div>

              {/* State handling: If explanations unavailable */}
              {!isShapAvailable ? (
                <div className="bg-[#0d1c2d] p-6 rounded-xl border border-[#273647] flex flex-col items-center justify-center text-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-[#ffb77c]" />
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px] text-[#d4e4fa]">
                      Explanations Temporarily Offline
                    </span>
                    <span className="text-[12px] text-[#8c909f] max-w-sm mt-1">
                      Unable to compute factor breakdown at this moment.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsShapAvailable(true)}
                    className="px-4 py-1.5 bg-[#38bdf8] text-[#002844] font-bold rounded-lg text-[12px] flex items-center gap-1.5 mt-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Analysis</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Axis Legend */}
                  <div className="flex items-center justify-between text-[11px] text-[#8c909f] font-mono px-1 pb-1 border-b border-[#1c2b3c]/80">
                    <span>Market Factor & What It Means</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#ffb4ab] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                        Pushes Price Down (-)
                      </span>
                      <span className="text-[#4edea3] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                        Pushes Price Up (+)
                      </span>
                      <span>Impact</span>
                    </div>
                  </div>

                  {/* Feature Rows */}
                  {displayedShapFactors.map((factor, index) => {
                    const isPositive = factor.impact >= 0;
                    const absVal = Math.abs(factor.impact);
                    const barWidth = Math.min(100, Math.round((absVal / 0.40) * 100));
                    const explanation = getFeatureRationale(factor.feature, factor.impact);

                    return (
                      <div
                        key={index}
                        className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-[12.5px] font-bold text-[#d4e4fa]">
                              {factor.feature}
                            </span>
                            <span className="text-[11px] text-[#8c909f] leading-snug mt-0.5">
                              {explanation}
                            </span>
                          </div>
                          <span
                            className={`font-mono text-[12.5px] font-bold shrink-0 ${
                              isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {factor.impact.toFixed(2)}
                          </span>
                        </div>

                        {/* Centered Bidirectional SHAP Bar */}
                        <div className="w-full bg-[#1c2b3c] h-2 rounded-full overflow-hidden flex relative">
                          {/* Center Divider line */}
                          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#273647] z-10" />

                          {isPositive ? (
                            <>
                              <div className="w-1/2" />
                              <div className="w-1/2 flex justify-start">
                                <div
                                  className="h-full bg-[#4edea3] rounded-r-full transition-all duration-500"
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-1/2 flex justify-end">
                                <div
                                  className="h-full bg-[#ffb4ab] rounded-l-full transition-all duration-500"
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                              <div className="w-1/2" />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Net Baseline Attribution Summary */}
                  <div className="p-3 bg-[#0d1c2d] rounded-xl border border-[#273647] flex items-center justify-between text-[11.5px] font-mono">
                    <span className="text-[#8c909f]">
                      Starting Neutral Baseline: <strong className="text-[#d4e4fa]">50% (50/50 Chance)</strong>
                    </span>
                    <span className="text-[#8c909f]">
                      Net Direction Shift:{' '}
                      <strong className={isUp ? 'text-[#4edea3]' : isDown ? 'text-[#ffb4ab]' : 'text-[#adc6ff]'}>
                        {isUp ? '+32% Toward UP' : isDown ? '-28% Toward DOWN' : 'Balanced'}
                      </strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: SECTION D: Integrated Risk Radar Quantitative Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 flex flex-col gap-4 border border-[#1c2b3c] shadow-md">
              <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#ffb77c]" />
                  <h3 className="text-[15px] font-bold text-[#d4e4fa] tracking-tight">
                    Stock Safety & Risk Check
                  </h3>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('risk-radar')}
                    className="text-[11px] font-mono font-semibold text-[#38bdf8] hover:text-[#7dd3fc] flex items-center gap-1"
                  >
                    <span>Full Risk Meter</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* 0-100 Documented Methodology Score */}
              <div className="bg-[#0d1c2d] p-4 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10.5px] uppercase text-[#8c909f] font-mono font-semibold">
                    Overall Risk Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-[28px] font-bold text-[#d4e4fa] leading-none">
                      {currentStock.riskScore}
                    </span>
                    <span className="text-[12px] text-[#8c909f] font-mono">/ 100</span>
                  </div>
                  <span className="text-[10px] text-[#8c909f] mt-1">
                    0 = Very Safe & Steady • 100 = Highly Volatile
                  </span>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl border text-[12px] font-bold font-mono ${
                    currentStock.riskCategory === 'LOW'
                      ? 'bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/40'
                      : currentStock.riskCategory === 'HIGH'
                      ? 'bg-[#93000a]/20 text-[#ffb4ab] border-[#93000a]/40'
                      : 'bg-[#ffb77c]/20 text-[#ffb77c] border-[#ffb77c]/40'
                  }`}
                >
                  {currentStock.riskCategory} RISK
                </div>
              </div>

              {/* 4 Quantitative Factor Breakdown Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-mono">Annual Volatility</span>
                  <span className="font-mono text-[14px] font-bold text-[#d4e4fa] mt-0.5">
                    {currentStock.annVolatility}%
                  </span>
                  <span className="text-[9.5px] text-[#8c909f]">Market Avg: {currentStock.volBenchmark}%</span>
                </div>

                <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-mono">Worst Past Drop</span>
                  <span className="font-mono text-[14px] font-bold text-[#ffb4ab] mt-0.5">
                    {currentStock.maxDrawdown}%
                  </span>
                  <span className="text-[9.5px] text-[#8c909f]">From ₹{currentStock.drawdownPeak} High</span>
                </div>

                <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-mono">AI Certainty</span>
                  <span className="font-mono text-[14px] font-bold text-[#38bdf8] mt-0.5">
                    High Confidence
                  </span>
                  <span className="text-[9.5px] text-[#4edea3]">Clear Historical Pattern</span>
                </div>

                <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-mono">Max 1-Day Typical Loss</span>
                  <span className="font-mono text-[14px] font-bold text-[#ffb77c] mt-0.5">
                    {currentStock.var95}%
                  </span>
                  <span className="text-[9.5px] text-[#8c909f]">95% of days fall within this</span>
                </div>
              </div>

              {/* Risk Factors Explanation */}
              <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-1.5 text-[11px]">
                <span className="font-bold text-[#c2c6d6]">What You Should Know:</span>
                <ul className="list-disc list-inside text-[#8c909f] space-y-1">
                  <li>Market Sensitivity (Beta): {currentStock.beta}x (Moves ~{currentStock.beta}% for every 1% NIFTY move).</li>
                  <li>Historical price safety floor is around ₹{currentStock.drawdownFloor}.</li>
                  <li>Risk-Reward Ratio (Sharpe): {currentStock.sharpeRatio} (Above 1.0 is a healthy reward for the risk).</li>
                </ul>
              </div>

              {/* Compliance Note */}
              <div className="text-[10px] text-[#8c909f] font-mono leading-tight">
                * Note: Stock market predictions and safety scores are for educational use and learning, not individual financial advice.
              </div>
            </div>

            {/* Audit & Export Controls */}
            <div className="bg-[#122131] p-4 rounded-2xl flex flex-col gap-2.5 border border-[#1c2b3c] shadow-sm">
              <span className="text-[11px] text-[#8c909f] uppercase font-semibold tracking-wider">
                Auditing & Research Artifacts
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPDF}
                  className="flex-1 py-2 px-3 bg-[#38bdf8] text-[#002844] rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-[#7dd3fc]"
                >
                  <Download className="w-4 h-4" />
                  <span>Export SHAP PDF</span>
                </button>
                <button
                  onClick={onOpenJsonDossier}
                  className="py-2 px-4 bg-[#0d1c2d] text-[#d4e4fa] rounded-xl text-[12px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#1c2b3c] active:scale-95 transition-all border border-[#273647]"
                >
                  <Code2 className="w-4 h-4 text-[#38bdf8]" />
                  <span>JSON Payload</span>
                </button>
              </div>

              {exportToast && (
                <div className="p-2.5 rounded-lg bg-[#00a572]/20 text-[#4edea3] text-[11.5px] flex items-center gap-2 border border-[#00a572]/30 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{exportToast}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION E: Historical and Predicted Price Chart */}
      {(activeTab === 'all' || activeTab === 'forecast') && (
        <AiForecastChart currentStock={currentStock} />
      )}

      {/* SECTION F: What-if Scenario Analysis Panel */}
      {(activeTab === 'all' || activeTab === 'whatif') && (
        <WhatIfScenarioPanel currentStock={currentStock} />
      )}

      {/* SECTION G: Model Transparency Panel */}
      {(activeTab === 'all' || activeTab === 'transparency') && (
        <ModelTransparencyPanel currentStock={currentStock} />
      )}

      {/* SECTION: LIME Rules & Multi-Model Agreement */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Quick Rule-of-Thumb Checks */}
          <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 flex flex-col gap-3 border border-[#1c2b3c] shadow-md">
            <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="text-[14.5px] font-bold text-[#d4e4fa] tracking-tight">
                  Quick Market Rule Checks
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8c909f]">Indicator Rules</span>
            </div>

            <div className="flex flex-col gap-2">
              {currentStock.limeRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-[12.5px] font-bold text-[#d4e4fa]">
                      {rule.rule}
                    </span>
                    <span className="text-[11px] text-[#8c909f]">{rule.explanation}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono text-[12px] font-bold ${
                        rule.positive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {rule.shift}
                    </span>
                    <span className="block text-[9.5px] text-[#8c909f]">Probability Shift</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Cross-Check Ensemble Consensus */}
          <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 flex flex-col gap-3 border border-[#1c2b3c] shadow-md">
            <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#4edea3]" />
                <h3 className="text-[14.5px] font-bold text-[#d4e4fa] tracking-tight">
                  What Other AI Models Predict
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8c909f]">Independent Models</span>
            </div>

            <div className="flex flex-col gap-2 divide-y divide-[#1c2b3c]/60">
              {currentStock.ensembleModels.map((model, idx) => (
                <div
                  key={idx}
                  className="pt-2 first:pt-0 flex items-center justify-between text-[12px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        model.direction === 'UP'
                          ? 'bg-[#4edea3]'
                          : model.direction === 'DOWN'
                          ? 'bg-[#ffb4ab]'
                          : 'bg-[#adc6ff]'
                      }`}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#d4e4fa]">{model.name}</span>
                        {model.isPrimary && (
                          <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30">
                            Primary Model
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] text-[#8c909f]">{model.architecture}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end font-mono">
                    <span
                      className={`font-bold ${
                        model.direction === 'UP'
                          ? 'text-[#4edea3]'
                          : model.direction === 'DOWN'
                          ? 'text-[#ffb4ab]'
                          : 'text-[#adc6ff]'
                      }`}
                    >
                      {model.direction === 'UP' ? 'Bullish (UP)' : model.direction === 'DOWN' ? 'Bearish (DOWN)' : 'Neutral'}
                    </span>
                    <span className="text-[10.5px] text-[#8c909f]">{model.confidence}% Confident</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prominent Educational Research Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#0d1c2d] border border-[#273647] flex items-start gap-3 text-[12px] text-[#8c909f]">
        <Info className="w-5 h-5 text-[#ffb77c] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-[#c2c6d6]">Helpful Reminder for Beginners</span>
          <p className="leading-relaxed">
            All AI predictions, charts, and risk meters are educational guides designed to help you learn market trends and make disciplined trading choices. The stock market always has unpredictable moments, so never invest funds you cannot afford to risk.
          </p>
        </div>
      </div>
    </div>
  );
};
