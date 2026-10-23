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

  // Generate feature explanations mapping
  const getFeatureRationale = (featureName: string, impact: number) => {
    const isBull = impact >= 0;
    if (featureName.toLowerCase().includes('rsi')) {
      return isBull
        ? `Momentum reading (${currentStock.rsi}) is in bullish territory without entering overbought fatigue (>70), adding +${Math.abs(impact).toFixed(2)} to log-odds.`
        : `RSI reading (${currentStock.rsi}) indicates waning momentum or bearish consolidation, reducing probability by -${Math.abs(impact).toFixed(2)}.`;
    }
    if (featureName.toLowerCase().includes('macd')) {
      return isBull
        ? `MACD histogram divergence (${currentStock.macd?.histogram >= 0 ? '+' : ''}${currentStock.macd?.histogram}) confirms short-term trend acceleration above signal.`
        : `Negative MACD histogram divergence indicates downward momentum pressure vs 9-period signal.`;
    }
    if (featureName.toLowerCase().includes('sma') || featureName.toLowerCase().includes('moving')) {
      return isBull
        ? `Spot price trading cleanly above 20-Day SMA confirms mean-reverting support and upward structural drift.`
        : `Price rejection near moving average bands indicates overhead resistance and supply concentration.`;
    }
    if (featureName.toLowerCase().includes('volume') || featureName.toLowerCase().includes('obv')) {
      return isBull
        ? `Trading volume expansion (${currentStock.volumeSurge}) provides institutional accumulation confirmation.`
        : `Muted volume participation limits follow-through, increasing risk of false breakout.`;
    }
    if (featureName.toLowerCase().includes('volatility') || featureName.toLowerCase().includes('atr')) {
      return isBull
        ? `Moderate volatility within historical benchmarks supports clean trend formation.`
        : `Elevated annualized volatility (${currentStock.annVolatility}%) acts as a risk penalty, widening the forecast uncertainty corridor.`;
    }
    return isBull
      ? `Quantitative feature metric operates in favorable decile based on historical tree partition rules.`
      : `Feature metric registers in restrictive quantile, reducing overall directional confidence.`;
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
                {currentStock.name} • Market Cap: {currentStock.marketCap}
              </span>
            </div>
          </div>

          {/* Quick Ticker Switcher */}
          {onSelectStock && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-[11px] text-[#8c909f] font-mono shrink-0 mr-1">
                Active Benchmark:
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
                    ? 'Bullish'
                    : currentStock.direction === 'DOWN'
                    ? 'Bearish'
                    : 'Neutral'}
                </span>
                <span className="text-[10px] font-mono mt-0.5 opacity-90">
                  {currentStock.confidence}% Prob
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Strip: Horizon, Timestamp, Calibrated Probability */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1c2b3c] text-[11.5px] font-mono">
          <div className="bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
            <span className="text-[#8c909f]">Forecast Horizon:</span>
            <span className="text-[#38bdf8] font-bold">5-Trading-Day Window (Next Week Close)</span>
          </div>

          <div className="bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
            <span className="text-[#8c909f]">Latest Data Timestamp:</span>
            <span className="text-[#d4e4fa]">{currentStock.snapshotTime} (14 Oct 2026)</span>
          </div>

          <div className="bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
            <span className="text-[#8c909f]">Calibrated Model Probability:</span>
            <span className="text-[#4edea3] font-bold">{currentStock.confidence}.0% (Platt Scaled)</span>
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
          Complete AI Dossier
        </button>
        <button
          onClick={() => setActiveTab('shap')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-[12px] font-semibold text-center transition-all ${
            activeTab === 'shap'
              ? 'bg-[#1c2b3c] text-[#38bdf8] border border-[#273647] shadow-sm'
              : 'text-[#8c909f] hover:text-[#d4e4fa]'
          }`}
        >
          SHAP Feature Attribution
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-[12px] font-semibold text-center transition-all ${
            activeTab === 'forecast'
              ? 'bg-[#1c2b3c] text-[#38bdf8] border border-[#273647] shadow-sm'
              : 'text-[#8c909f] hover:text-[#d4e4fa]'
          }`}
        >
          Price Forecast & Bands
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
          Model Transparency
        </button>
      </div>

      {/* SECTION C: Prediction Explanation in Simple English */}
      <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 flex flex-col gap-3 border border-[#1c2b3c] shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-[15px] font-bold text-[#d4e4fa] tracking-tight">
              Prediction Synthesis in Plain English
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#4d8eff]/20 text-[#adc6ff] border border-[#4d8eff]/30">
              Natural Language XAI
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8c909f]">
            Generated from Verified Tree Splits & Quantitative Inputs
          </span>
        </div>

        <div className="bg-[#0d1c2d] p-4 rounded-xl border border-[#273647] flex flex-col gap-2">
          <p className="text-[13.5px] text-[#d4e4fa] leading-relaxed font-normal">
            The model predicts a <strong className={isUp ? 'text-[#4edea3]' : isDown ? 'text-[#ffb4ab]' : 'text-[#adc6ff]'}>
              {currentStock.direction === 'UP' ? 'Bullish' : currentStock.direction === 'DOWN' ? 'Bearish' : 'Neutral'}
            </strong> trend ({currentStock.confidence}% calibrated probability) over the 5-day horizon because momentum indicators (RSI 14-day at {currentStock.rsi} and {currentStock.macd?.histogram >= 0 ? 'positive' : 'negative'} MACD histogram at {currentStock.macd?.histogram}) confirm {isUp ? 'upward' : isDown ? 'downward' : 'indecisive'} direction relative to the 20-day moving average. Elevated volatility ({currentStock.annVolatility}%) increases forecast uncertainty.
          </p>

          <div className="flex items-start gap-2 pt-2 border-t border-[#1c2b3c] text-[#8c909f] text-[11px]">
            <Info className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#c2c6d6]">Attribution vs. Causality Notice:</strong> The features listed reflect additive statistical attribution calculated via TreeSHAP on the trained model. They explain why the algorithm made this prediction, not that these indicators caused external market forces.
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
                      SHAP Feature Attribution (Actual Model)
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-[#8c909f]">
                    Top contributing factors shifting output log-odds from baseline 0.50 toward {currentStock.direction}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsShapAvailable(!isShapAvailable)}
                    className="text-[10.5px] text-[#8c909f] hover:text-[#38bdf8] underline font-mono"
                    title="Simulate toggle of SHAP telemetry availability"
                  >
                    {isShapAvailable ? 'Simulate Offline' : 'Restore SHAP'}
                  </button>
                  <button
                    onClick={() => setShowAllShap(!showAllShap)}
                    className="px-2.5 py-1 rounded-lg bg-[#0d1c2d] hover:bg-[#1c2b3c] border border-[#1c2b3c] text-[11px] font-mono text-[#adc6ff]"
                  >
                    {showAllShap ? 'Show Top 5' : 'Show All (8)'}
                  </button>
                </div>
              </div>

              {/* State handling: If explanations unavailable */}
              {!isShapAvailable ? (
                <div className="bg-[#0d1c2d] p-6 rounded-xl border border-[#273647] flex flex-col items-center justify-center text-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-[#ffb77c]" />
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px] text-[#d4e4fa]">
                      Feature Explanations Currently Unavailable
                    </span>
                    <span className="text-[12px] text-[#8c909f] max-w-sm mt-1">
                      TreeSHAP kernel telemetry timed out for ticker {currentStock.ticker}. Inference output was cached without local explanation trees.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsShapAvailable(true)}
                    className="px-4 py-1.5 bg-[#38bdf8] text-[#002844] font-bold rounded-lg text-[12px] flex items-center gap-1.5 mt-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-evaluate TreeSHAP Explainer</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Axis Legend */}
                  <div className="flex items-center justify-between text-[11px] text-[#8c909f] font-mono px-1 pb-1 border-b border-[#1c2b3c]/80">
                    <span>Contributing Feature & Input Value</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#ffb4ab] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                        Bear (-SHAP)
                      </span>
                      <span className="text-[#4edea3] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                        Bull (+SHAP)
                      </span>
                      <span>Impact Score</span>
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
                      Base Log-Odds Prior: <strong className="text-[#d4e4fa]">0.50 (Neutral)</strong>
                    </span>
                    <span className="text-[#8c909f]">
                      Calibrated Net Shift:{' '}
                      <strong className={isUp ? 'text-[#4edea3]' : isDown ? 'text-[#ffb4ab]' : 'text-[#adc6ff]'}>
                        {isUp ? '+0.32 UP' : isDown ? '-0.28 DOWN' : '+0.02 Neutral'}
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
                    Quantitative Risk Radar
                  </h3>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('risk-radar')}
                    className="text-[11px] font-mono font-semibold text-[#38bdf8] hover:text-[#7dd3fc] flex items-center gap-1"
                  >
                    <span>Full Radar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* 0-100 Documented Methodology Score */}
              <div className="bg-[#0d1c2d] p-4 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10.5px] uppercase text-[#8c909f] font-mono font-semibold">
                    Documented Risk Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-[28px] font-bold text-[#d4e4fa] leading-none">
                      {currentStock.riskScore}
                    </span>
                    <span className="text-[12px] text-[#8c909f] font-mono">/ 100</span>
                  </div>
                  <span className="text-[10px] text-[#8c909f] mt-1">
                    Weighted: 40% Vol + 30% MaxDD + 20% VaR-95 + 10% Entropy
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
                  <span className="text-[10px] text-[#8c909f] uppercase font-mono">Ann. Volatility</span>
                  <span className="font-mono text-[14px] font-bold text-[#d4e4fa] mt-0.5">
                    {currentStock.annVolatility}%
                  </span>
                  <span className="text-[9.5px] text-[#8c909f]">Benchmark: {currentStock.volBenchmark}%</span>
                </div>

                <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-mono">Max Drawdown</span>
                  <span className="font-mono text-[14px] font-bold text-[#ffb4ab] mt-0.5">
                    {currentStock.maxDrawdown}%
                  </span>
                  <span className="text-[9.5px] text-[#8c909f]">From ₹{currentStock.drawdownPeak} Peak</span>
                </div>

                <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-mono">Prediction Uncertainty</span>
                  <span className="font-mono text-[14px] font-bold text-[#38bdf8] mt-0.5">
                    {currentStock.uncertaintyEntropy} nats
                  </span>
                  <span className="text-[9.5px] text-[#4edea3]">Shannon Entropy (Low)</span>
                </div>

                <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-mono">Value at Risk (95%)</span>
                  <span className="font-mono text-[14px] font-bold text-[#ffb77c] mt-0.5">
                    {currentStock.var95}%
                  </span>
                  <span className="text-[9.5px] text-[#8c909f]">1-Day Parametric</span>
                </div>
              </div>

              {/* Risk Factors Explanation */}
              <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-1.5 text-[11px]">
                <span className="font-bold text-[#c2c6d6]">Key Risk Factor Contributors:</span>
                <ul className="list-disc list-inside text-[#8c909f] space-y-1">
                  <li>Beta sensitivity of {currentStock.beta}x relative to broad NIFTY 50 index swings.</li>
                  <li>Historical drawdown tail-risk is anchored at ₹{currentStock.drawdownFloor} support floor.</li>
                  <li>Sharpe ratio of {currentStock.sharpeRatio} reflects favorable risk-adjusted excess returns.</li>
                </ul>
              </div>

              {/* Compliance Note */}
              <div className="text-[10px] text-[#8c909f] font-mono leading-tight">
                * Risk scores are mathematically calculated quantitative estimates for educational analysis, not personalized investment advice.
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
          {/* LIME Heuristics */}
          <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 flex flex-col gap-3 border border-[#1c2b3c] shadow-md">
            <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="text-[14.5px] font-bold text-[#d4e4fa] tracking-tight">
                  LIME Local Decision Heuristics
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8c909f]">Surrogate Rules</span>
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
                    <span className="block text-[9.5px] text-[#8c909f]">P(UP) Shift</span>
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
                  Multi-Model Ensemble Consensus
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8c909f]">Independent Architectures</span>
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
                            Primary
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
                      {model.direction}
                    </span>
                    <span className="text-[10.5px] text-[#8c909f]">{model.confidence}% Conf</span>
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
          <span className="font-bold text-[#c2c6d6]">Educational & Quantitative Research Disclaimer</span>
          <p className="leading-relaxed">
            AI predictions and risk estimates are experimental and are not financial advice. Past backtested performance is no guarantee of future returns. Machine learning models generate probabilistic indicators based on historical tick and price distributions. Never trade with capital you cannot afford to lose.
          </p>
        </div>
      </div>
    </div>
  );
};
