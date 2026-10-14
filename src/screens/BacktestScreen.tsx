import React, { useState } from 'react';
import {
  Cpu,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Play,
  RotateCcw,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA } from '../data/stocks';

interface BacktestScreenProps {
  currentStock: StockData;
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export const BacktestScreen: React.FC<BacktestScreenProps> = ({
  currentStock,
  onSelectStock,
  onNavigate
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(currentStock.ticker);
  const [modelType, setModelType] = useState('XGBoost Multi-Factor Ensemble');
  const [horizon, setHorizon] = useState<'1Y' | '3Y' | '5Y'>('3Y');
  const [initialCapital, setInitialCapital] = useState<number>(1000000);
  const [stopLossPct, setStopLossPct] = useState<number>(3.5);
  const [takeProfitPct, setTakeProfitPct] = useState<number>(7.0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(true);

  const tickers = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATASTEEL'];

  const handleTickerChange = (ticker: string) => {
    setSelectedTicker(ticker);
    if (STOCKS_DATA[ticker]) {
      onSelectStock(STOCKS_DATA[ticker]);
    }
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 900);
  };

  // Simulated Equity Curve Data based on Horizon & Stock
  const curveData = [
    { period: 'Q1 Y1', strategy: 1000000, benchmark: 1000000 },
    { period: 'Q2 Y1', strategy: 1064000, benchmark: 1021000 },
    { period: 'Q3 Y1', strategy: 1142000, benchmark: 1045000 },
    { period: 'Q4 Y1', strategy: 1210000, benchmark: 1082000 },
    { period: 'Q1 Y2', strategy: 1285000, benchmark: 1094000 },
    { period: 'Q2 Y2', strategy: 1390000, benchmark: 1140000 },
    { period: 'Q3 Y2', strategy: 1475000, benchmark: 1162000 },
    { period: 'Q4 Y2', strategy: 1560000, benchmark: 1210000 },
    { period: 'Q1 Y3', strategy: 1680000, benchmark: 1245000 },
    { period: 'Q2 Y3', strategy: 1820000, benchmark: 1290000 },
    { period: 'Q3 Y3', strategy: 1940000, benchmark: 1335000 },
    { period: 'Q4 Y3', strategy: 2085400, benchmark: 1380000 }
  ];

  // Trade Execution Log
  const tradeLogs = [
    { id: 'TR-904', date: '14 Oct 2024', side: 'BUY', price: '₹2,780.00', returnPct: '+5.4%', pnl: '+₹54,200', exitReason: 'Take Profit Hit', status: 'WIN' },
    { id: 'TR-892', date: '28 Sep 2024', side: 'SELL', price: '₹2,840.00', returnPct: '+3.8%', pnl: '+₹38,000', exitReason: 'SHAP Reversal Signal', status: 'WIN' },
    { id: 'TR-881', date: '11 Sep 2024', side: 'BUY', price: '₹2,810.00', returnPct: '-2.1%', pnl: '-₹21,000', exitReason: 'Stop Loss Hit', status: 'LOSS' },
    { id: 'TR-870', date: '24 Aug 2024', side: 'BUY', price: '₹2,695.00', returnPct: '+7.1%', pnl: '+₹71,400', exitReason: 'Take Profit Hit', status: 'WIN' },
    { id: 'TR-863', date: '05 Aug 2024', side: 'BUY', price: '₹2,620.00', returnPct: '+6.2%', pnl: '+₹62,000', exitReason: 'Momentum Climax', status: 'WIN' }
  ];

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1c2b3c] border border-[#273647] flex items-center justify-center text-cyan-400 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-white tracking-tight">
                Quantitative Strategy Backtesting Engine
              </h1>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-mono font-bold">
                Walk-Forward Tested
              </span>
            </div>
            <p className="text-[13px] text-[#94a3b8] mt-0.5">
              Simulate machine learning alpha signals against historical tick data with transaction cost and slippage modeling.
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

      {/* Configuration & Parameter Panel */}
      <div className="bg-[#122131] rounded-2xl p-4 border border-[#1c2b3c] flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Strategy Model */}
          <div>
            <label className="text-[11px] font-mono text-[#64748b] block mb-1">Alpha Model</label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a1424] border border-[#1c2b3c] rounded-xl text-[13px] text-white focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="XGBoost Multi-Factor Ensemble">XGBoost Multi-Factor Ensemble</option>
              <option value="LightGBM Momentum Drift">LightGBM Momentum Drift</option>
              <option value="LSTM Sequential Attention">LSTM Sequential Attention</option>
              <option value="Mean Reversion + SHAP Filter">Mean Reversion + SHAP Filter</option>
            </select>
          </div>

          {/* Time Horizon */}
          <div>
            <label className="text-[11px] font-mono text-[#64748b] block mb-1">Horizon</label>
            <div className="grid grid-cols-3 gap-1 bg-[#0a1424] p-1 rounded-xl border border-[#1c2b3c]">
              {(['1Y', '3Y', '5Y'] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`py-1.5 text-center text-[12px] font-mono font-bold rounded-lg transition-colors ${
                    horizon === h
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-[#64748b] hover:text-white'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Capital */}
          <div>
            <label className="text-[11px] font-mono text-[#64748b] block mb-1">Initial Capital (INR)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#0a1424] border border-[#1c2b3c] rounded-xl text-[13px] font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Stop Loss & Take Profit */}
          <div>
            <label className="text-[11px] font-mono text-[#64748b] block mb-1">Stop Loss / Take Profit</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={stopLossPct}
                onChange={(e) => setStopLossPct(Number(e.target.value))}
                className="w-1/2 px-2.5 py-2 bg-[#0a1424] border border-[#1c2b3c] rounded-xl text-[12px] font-mono text-rose-400 text-center"
                title="Stop Loss %"
              />
              <span className="text-[#64748b]">:</span>
              <input
                type="number"
                step="0.5"
                value={takeProfitPct}
                onChange={(e) => setTakeProfitPct(Number(e.target.value))}
                className="w-1/2 px-2.5 py-2 bg-[#0a1424] border border-[#1c2b3c] rounded-xl text-[12px] font-mono text-emerald-400 text-center"
                title="Take Profit %"
              />
            </div>
          </div>

          {/* Execute CTA */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Computing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Performance Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">CAGR Return</span>
          <span className="text-[20px] font-mono font-bold text-emerald-400 mt-1">+27.8%</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">vs +11.2% NIFTY 50</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Sharpe Ratio</span>
          <span className="text-[20px] font-mono font-bold text-cyan-300 mt-1">2.14</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">Risk-adjusted benchmark</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Max Drawdown</span>
          <span className="text-[20px] font-mono font-bold text-rose-400 mt-1">-8.6%</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">Bench peak: -17.4%</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Win Rate</span>
          <span className="text-[20px] font-mono font-bold text-emerald-400 mt-1">74.2%</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">89 of 120 Trades</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Profit Factor</span>
          <span className="text-[20px] font-mono font-bold text-cyan-400 mt-1">2.68</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">Gross Win / Gross Loss</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Final NAV</span>
          <span className="text-[20px] font-mono font-bold text-white mt-1">₹20.85 L</span>
          <span className="text-[10px] text-emerald-400 mt-0.5">+108.5% Net Profit</span>
        </div>
      </div>

      {/* Equity Curve Chart */}
      <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2b3c] mb-4 gap-2">
          <div>
            <h3 className="text-[16px] font-bold text-white tracking-tight">
              Historical Equity Growth vs Benchmark
            </h3>
            <span className="text-[12px] text-[#94a3b8]">
              Strategy simulation incorporates 0.05% brokerage and slippage drag.
            </span>
          </div>
          <div className="flex items-center gap-3 text-[12px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400" />
              <span className="text-cyan-300 font-semibold">XGBoost Strategy (+108.5%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500" />
              <span className="text-[#94a3b8]">Nifty 50 (+38.0%)</span>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curveData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2b3c" />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={['dataMin - 100000', 'dataMax + 100000']}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a1424',
                  borderColor: '#1e3453',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
              />
              <Line
                type="monotone"
                dataKey="strategy"
                stroke="#22d3ee"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#22d3ee' }}
                activeDot={{ r: 6 }}
                name="ML Alpha Strategy"
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Nifty 50 Index"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trade Log Table */}
      <div className="bg-[#122131] rounded-2xl border border-[#1c2b3c] overflow-hidden shadow-lg">
        <div className="p-4 bg-[#0b1522] border-b border-[#1c2b3c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-white">Recent Historical Trade Executions</h3>
            <span className="text-[11px] font-mono text-[#64748b]">· Walk-Forward Validated</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('ai-predict')}
            className="text-[12px] text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>Compare with Live AI Prediction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#0b1522]/60 text-[#64748b] font-mono text-[11px] uppercase tracking-wider border-b border-[#182637]">
              <tr>
                <th className="py-2.5 px-4">Trade ID</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Side</th>
                <th className="py-2.5 px-4">Execution Price</th>
                <th className="py-2.5 px-4">Exit Signal / Rationale</th>
                <th className="py-2.5 px-4 text-right">Return %</th>
                <th className="py-2.5 px-4 text-right">Realized PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182637]">
              {tradeLogs.map((trade) => (
                <tr key={trade.id} className="hover:bg-[#16273b]/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[12px] text-cyan-300 font-semibold">{trade.id}</td>
                  <td className="py-3 px-4 text-[#94a3b8] text-[12px]">{trade.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      trade.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{trade.price}</td>
                  <td className="py-3 px-4 text-[#cbd5e1] text-[12px]">{trade.exitReason}</td>
                  <td className={`py-3 px-4 text-right font-mono font-bold ${
                    trade.status === 'WIN' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {trade.returnPct}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-bold ${
                    trade.status === 'WIN' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {trade.pnl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
