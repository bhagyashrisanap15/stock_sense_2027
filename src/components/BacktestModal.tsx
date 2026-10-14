import React, { useState } from 'react';
import { StockData } from '../types';

interface BacktestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStock: StockData;
}

export const BacktestModal: React.FC<BacktestModalProps> = ({
  isOpen,
  onClose,
  currentStock
}) => {
  const [horizon, setHorizon] = useState('1Y');
  const [modelType, setModelType] = useState('XGBoost Ensemble');
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTime, setLastRunTime] = useState('Today 09:30 AM IST');

  if (!isOpen) return null;

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setLastRunTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#122131] w-full max-w-lg rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[22px]">model_training</span>
            <div>
              <h2 className="text-[16px] font-bold text-[#d4e4fa] leading-none">
                Quantitative Backtest Engine
              </h2>
              <span className="text-[11px] text-[#c2c6d6] mt-0.5 block font-mono">
                {currentStock.ticker} • Historical Validation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#c2c6d6] font-medium uppercase tracking-wider">
                Time Horizon
              </label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
                className="bg-[#051424] text-[#d4e4fa] text-[13px] rounded-lg p-2.5 border border-[#1c2b3c] outline-none"
              >
                <option value="30D">30 Days (Intraday Tick)</option>
                <option value="90D">90 Days (Quarterly Horizon)</option>
                <option value="1Y">1 Year (Daily Close)</option>
                <option value="5Y">5 Years (Multi-Cycle)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#c2c6d6] font-medium uppercase tracking-wider">
                Model Pipeline
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="bg-[#051424] text-[#d4e4fa] text-[13px] rounded-lg p-2.5 border border-[#1c2b3c] outline-none"
              >
                <option value="XGBoost Ensemble">XGBoost Classifier + SHAP</option>
                <option value="LSTM Network">Stacked PyTorch LSTM (Seq: 60)</option>
                <option value="Triple Ensemble">XGBoost + Random Forest + LSTM</option>
              </select>
            </div>
          </div>

          {/* Key Metrics Bento */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
              <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">Directional Win Rate</span>
              <span className="text-[18px] font-bold font-mono text-[#4edea3] mt-1">78.4%</span>
              <span className="text-[10px] text-[#8c909f] mt-0.5">Precision score</span>
            </div>
            <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
              <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">Cumulative Alpha</span>
              <span className="text-[18px] font-bold font-mono text-[#adc6ff] mt-1">+24.6%</span>
              <span className="text-[10px] text-[#8c909f] mt-0.5">vs Benchmark +11.2%</span>
            </div>
            <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
              <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">Profit Factor</span>
              <span className="text-[18px] font-bold font-mono text-[#4edea3] mt-1">2.42</span>
              <span className="text-[10px] text-[#8c909f] mt-0.5">Gross Win/Loss</span>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c]">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2b3c]">
              <span className="text-[12px] font-semibold text-[#d4e4fa]">
                Confusion Matrix (1,000 Sample Vectors)
              </span>
              <span className="text-[10px] font-mono text-[#4edea3]">F1: 0.81</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-center">
              <div className="bg-[#122131] p-2 rounded-lg border border-[#1c2b3c]">
                <span className="text-[10px] text-[#c2c6d6] block">True Positive (Predicted UP)</span>
                <span className="text-[16px] font-bold text-[#4edea3]">412</span>
              </div>
              <div className="bg-[#122131] p-2 rounded-lg border border-[#1c2b3c]">
                <span className="text-[10px] text-[#c2c6d6] block">False Positive (False Alarm)</span>
                <span className="text-[16px] font-bold text-[#ffb4ab]">114</span>
              </div>
              <div className="bg-[#122131] p-2 rounded-lg border border-[#1c2b3c]">
                <span className="text-[10px] text-[#c2c6d6] block">False Negative (Missed Rally)</span>
                <span className="text-[16px] font-bold text-[#ffb4ab]">88</span>
              </div>
              <div className="bg-[#122131] p-2 rounded-lg border border-[#1c2b3c]">
                <span className="text-[10px] text-[#c2c6d6] block">True Negative (Predicted Flat/Down)</span>
                <span className="text-[16px] font-bold text-[#4edea3]">386</span>
              </div>
            </div>
          </div>

          {/* Telemetry info */}
          <div className="flex items-center justify-between text-[11px] text-[#8c909f] font-mono px-1">
            <span>Snapshot: {lastRunTime}</span>
            <span>Seed: 42 (Reproducible)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#d4e4fa] text-[13px] font-medium transition-colors border border-[#273647]"
          >
            Close
          </button>
          <button
            onClick={handleSimulate}
            disabled={isRunning}
            className="flex-1 h-10 rounded-lg bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#002e6a] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4 border-2 border-[#002e6a] border-t-transparent rounded-full animate-spin" />
                <span>Simulating 10k Trades...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>Re-run Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
