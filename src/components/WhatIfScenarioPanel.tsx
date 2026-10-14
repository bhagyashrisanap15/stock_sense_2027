import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { StockData } from '../types';
import { apiService, WhatIfSimulationResult } from '../services/api';

interface WhatIfScenarioPanelProps {
  currentStock: StockData;
}

export const WhatIfScenarioPanel: React.FC<WhatIfScenarioPanelProps> = ({ currentStock }) => {
  // Input parameter states initialized to actual stock metrics
  const [rsi, setRsi] = useState<number>(currentStock.rsi || 62.4);
  const [macdHistogram, setMacdHistogram] = useState<number>(currentStock.macd?.histogram || 5.7);
  const [volatility, setVolatility] = useState<number>(currentStock.annVolatility || 18.4);
  const [volumeSurge, setVolumeSurge] = useState<number>(18); // %
  const [activePreset, setActivePreset] = useState<'custom' | 'bullish' | 'neutral' | 'bearish'>('custom');

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>(null);

  // Apply scenario presets
  const handleApplyPreset = async (preset: 'bullish' | 'neutral' | 'bearish') => {
    setActivePreset(preset);
    let newRsi = 62.4;
    let newMacd = 5.7;
    let newVol = 18.4;
    let newSurge = 18;

    if (preset === 'bullish') {
      newRsi = 74.5;
      newMacd = 16.2;
      newVol = 13.5;
      newSurge = 45;
    } else if (preset === 'neutral') {
      newRsi = 50.2;
      newMacd = 0.5;
      newVol = 16.0;
      newSurge = 2;
    } else if (preset === 'bearish') {
      newRsi = 34.0;
      newMacd = -14.8;
      newVol = 29.5;
      newSurge = -35;
    }

    setRsi(newRsi);
    setMacdHistogram(newMacd);
    setVolatility(newVol);
    setVolumeSurge(newSurge);

    await runSimulation(newRsi, newMacd, newVol, newSurge);
  };

  const handleResetToBaseline = async () => {
    setActivePreset('custom');
    const baseRsi = currentStock.rsi || 62.4;
    const baseMacd = currentStock.macd?.histogram || 5.7;
    const baseVol = currentStock.annVolatility || 18.4;
    const baseSurge = 18;

    setRsi(baseRsi);
    setMacdHistogram(baseMacd);
    setVolatility(baseVol);
    setVolumeSurge(baseSurge);

    await runSimulation(baseRsi, baseMacd, baseVol, baseSurge);
  };

  const runSimulation = async (
    simRsi = rsi,
    simMacd = macdHistogram,
    simVol = volatility,
    simSurge = volumeSurge
  ) => {
    setIsSimulating(true);
    try {
      const res = await apiService.runWhatIfScenario({
        ticker: currentStock.ticker,
        rsi: simRsi,
        macdHistogram: simMacd,
        annualizedVolatility: simVol,
        volumeSurgePct: simSurge
      });
      setSimulationResult(res);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-[#122131] rounded-2xl p-4 lg:p-5 flex flex-col gap-4 border border-[#1c2b3c] shadow-md">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-[15px] font-bold text-[#d4e4fa] tracking-tight">
              Interactive What-If Scenario Analysis
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30">
              Simulation Sandbox
            </span>
          </div>
          <p className="text-[11.5px] text-[#8c909f]">
            Perturb quantitative feature inputs and re-evaluate decision boundaries through the trained XGBoost tree ensemble
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 bg-[#0d1c2d] p-1 rounded-xl border border-[#1c2b3c] self-start sm:self-auto">
          <button
            onClick={() => handleApplyPreset('bullish')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              activePreset === 'bullish'
                ? 'bg-[#00a572]/30 text-[#4edea3] border border-[#00a572]/40 shadow-sm'
                : 'text-[#8c909f] hover:text-[#4edea3]'
            }`}
          >
            Bull Scenario
          </button>
          <button
            onClick={() => handleApplyPreset('neutral')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              activePreset === 'neutral'
                ? 'bg-[#1c2b3c] text-[#adc6ff] border border-[#273647] shadow-sm'
                : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            Neutral
          </button>
          <button
            onClick={() => handleApplyPreset('bearish')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              activePreset === 'bearish'
                ? 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#93000a]/40 shadow-sm'
                : 'text-[#8c909f] hover:text-[#ffb4ab]'
            }`}
          >
            Bear Scenario
          </button>
          <button
            onClick={handleResetToBaseline}
            title="Reset to Actual Market Values"
            className="p-1 rounded-lg text-[#8c909f] hover:text-white hover:bg-[#1c2b3c] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c]">
        {/* RSI Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-[#c2c6d6] font-medium">RSI (14-Period)</span>
            <span className="font-mono font-bold text-[#38bdf8]">{rsi.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            step="0.5"
            value={rsi}
            onChange={(e) => {
              setActivePreset('custom');
              setRsi(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-[#1c2b3c] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
          />
          <div className="flex justify-between text-[9.5px] text-[#8c909f] font-mono">
            <span>10 (Oversold)</span>
            <span>50</span>
            <span>90 (Overbought)</span>
          </div>
        </div>

        {/* MACD Histogram Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-[#c2c6d6] font-medium">MACD Divergence</span>
            <span
              className={`font-mono font-bold ${
                macdHistogram >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              {macdHistogram >= 0 ? '+' : ''}
              {macdHistogram.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            step="0.5"
            value={macdHistogram}
            onChange={(e) => {
              setActivePreset('custom');
              setMacdHistogram(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-[#1c2b3c] rounded-lg appearance-none cursor-pointer accent-[#4d8eff]"
          />
          <div className="flex justify-between text-[9.5px] text-[#8c909f] font-mono">
            <span>-25 (Bear)</span>
            <span>0</span>
            <span>+25 (Bull)</span>
          </div>
        </div>

        {/* Volatility Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-[#c2c6d6] font-medium">Ann. Volatility</span>
            <span className="font-mono font-bold text-[#ffb77c]">{volatility.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="8"
            max="45"
            step="0.5"
            value={volatility}
            onChange={(e) => {
              setActivePreset('custom');
              setVolatility(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-[#1c2b3c] rounded-lg appearance-none cursor-pointer accent-[#ffb77c]"
          />
          <div className="flex justify-between text-[9.5px] text-[#8c909f] font-mono">
            <span>8% (Calm)</span>
            <span>20%</span>
            <span>45% (Crisis)</span>
          </div>
        </div>

        {/* Volume Surge Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-[#c2c6d6] font-medium">Volume vs 20D Avg</span>
            <span
              className={`font-mono font-bold ${
                volumeSurge >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              {volumeSurge >= 0 ? '+' : ''}
              {volumeSurge.toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="100"
            step="2"
            value={volumeSurge}
            onChange={(e) => {
              setActivePreset('custom');
              setVolumeSurge(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-[#1c2b3c] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
          />
          <div className="flex justify-between text-[9.5px] text-[#8c909f] font-mono">
            <span>-50% (Drying)</span>
            <span>0%</span>
            <span>+100% (Surge)</span>
          </div>
        </div>
      </div>

      {/* Action Button & Comparison Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] text-[#8c909f]">
          <Info className="w-4 h-4 text-[#38bdf8] shrink-0" />
          <span>Altering sliders recalculates simulated model log-odds and SHAP vectors in real-time.</span>
        </div>

        <button
          onClick={() => runSimulation()}
          disabled={isSimulating}
          className="w-full sm:w-auto px-4 py-2 bg-[#38bdf8] hover:bg-[#7dd3fc] text-[#002844] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Computing Inference...' : 'Rerun Simulation Engine'}</span>
        </button>
      </div>

      {/* Simulation Result Comparison Card */}
      {simulationResult && (
        <div className="bg-[#0d1c2d] p-4 rounded-xl border border-[#273647] flex flex-col gap-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c2b3c] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
              <span className="text-[12.5px] font-bold text-[#d4e4fa]">
                Simulation Output ({simulationResult.computedAt})
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#ffb77c]/20 text-[#ffb77c] border border-[#ffb77c]/30">
                Hypothetical Scenario
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8c909f]">Baseline Direction:</span>
              <span className="text-[11px] font-mono font-bold text-[#4edea3]">
                {currentStock.directionLabel} ({currentStock.confidence}%)
              </span>
              <span className="text-[#8c909f]">→</span>
              <span
                className={`text-[12px] font-mono font-bold px-2 py-0.5 rounded ${
                  simulationResult.direction === 'UP'
                    ? 'bg-[#00a572]/20 text-[#4edea3]'
                    : simulationResult.direction === 'DOWN'
                    ? 'bg-[#93000a]/20 text-[#ffb4ab]'
                    : 'bg-[#1c2b3c] text-[#adc6ff]'
                }`}
              >
                {simulationResult.directionLabel} ({simulationResult.calibratedConfidence}%)
              </span>
            </div>
          </div>

          {/* Simple English Explanation */}
          <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
            {simulationResult.summaryExplanation}
          </p>

          {/* Simulated SHAP Factors Bar Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
            {simulationResult.simulatedShapFactors.map((f, i) => (
              <div
                key={i}
                className="bg-[#122131] p-2 rounded-lg border border-[#1c2b3c] flex flex-col justify-between"
              >
                <span className="text-[10px] text-[#8c909f] truncate">{f.feature}</span>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      f.impact >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {f.impact >= 0 ? '+' : ''}
                    {f.impact.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-[#8c909f] font-mono">SHAP Shift</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10.5px] text-[#8c909f] italic">
            * Methodology Note: What-if scenarios compute instantaneous gradient shifts along the trained decision trees. They are hypothetical simulations and never promise market returns.
          </div>
        </div>
      )}
    </div>
  );
};
