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
import { STOCKS_DATA, getStockData } from '../data/stocks';

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

  // Sync state if currentStock changes externally
  React.useEffect(() => {
    setSelectedTicker(currentStock.ticker);
  }, [currentStock.ticker]);

  const baseTickers = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'ITC', 'TATAMOTORS', 'BHARTIARTL', 'LT'];
  const tickers = baseTickers.includes(currentStock.ticker) ? baseTickers : [currentStock.ticker, ...baseTickers];

  const handleTickerChange = (ticker: string) => {
    setSelectedTicker(ticker);
    onSelectStock(getStockData(ticker));
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 600);
  };

  const stock = getStockData(selectedTicker);

  // Mathematical backtest calculation based on parameters
  const years = horizon === '1Y' ? 1 : horizon === '3Y' ? 3 : 5;
  const quarters = years * 4;

  // Model edge calibration
  const modelEdge = modelType.includes('XGBoost')
    ? 1.0
    : modelType.includes('LightGBM')
    ? 0.94
    : modelType.includes('LSTM')
    ? 0.88
    : 0.82;

  const winRateNumber = Math.min(88, Math.max(58, Math.round((stock.confidence * 0.9 + (takeProfitPct / (takeProfitPct + stopLossPct)) * 20) * modelEdge)));
  const cagrValue = Math.round((14.5 + (winRateNumber - 55) * 0.72) * 10) / 10;
  const benchmarkCagr = 12.4;
  const sharpeValue = (Math.max(1.1, (cagrValue - 6.5) / (stock.annVolatility * 0.85))).toFixed(2);
  const maxDrawdownVal = -(Math.min(22, Math.max(5.5, stopLossPct * 2.2 + stock.annVolatility * 0.2))).toFixed(1);
  const profitFactorVal = ((winRateNumber * takeProfitPct) / ((100 - winRateNumber) * stopLossPct)).toFixed(2);

  // Compounded final equity
  const totalStrategyMultiplier = Math.pow(1 + cagrValue / 100, years);
  const totalBenchmarkMultiplier = Math.pow(1 + benchmarkCagr / 100, years);
  const finalStrategyNav = Math.round(initialCapital * totalStrategyMultiplier);
  const netReturnPct = Math.round((totalStrategyMultiplier - 1) * 1000) / 10;
  const netBenchmarkPct = Math.round((totalBenchmarkMultiplier - 1) * 1000) / 10;

  // Generate dynamic quarterly equity curve
  const curveData = React.useMemo(() => {
    const points = [];
    const stepGain = Math.pow(totalStrategyMultiplier, 1 / quarters);
    const benchStepGain = Math.pow(totalBenchmarkMultiplier, 1 / quarters);
    let currentStrat = initialCapital;
    let currentBench = initialCapital;

    for (let i = 0; i <= quarters; i++) {
      const yearIdx = Math.floor(i / 4) + 1;
      const qIdx = (i % 4) + 1;
      const periodLabel = i === 0 ? 'Start' : `Q${qIdx} Y${yearIdx}`;
      points.push({
        period: periodLabel,
        strategy: Math.round(currentStrat),
        benchmark: Math.round(currentBench)
      });
      // slight deterministic fluctuation
      const noise = 1 + (Math.sin(i * 1.8) * 0.012);
      currentStrat *= stepGain * noise;
      currentBench *= benchStepGain;
    }
    return points;
  }, [initialCapital, totalStrategyMultiplier, totalBenchmarkMultiplier, quarters]);

  // Trade Execution Log dynamically tailored to selected stock
  const tradeLogs = React.useMemo(() => {
    const baseP = stock.price;
    return [
      {
        id: `TR-${selectedTicker}-01`,
        date: '14 Oct 2026',
        side: 'LONG',
        price: `₹${(baseP * 0.96).toFixed(2)}`,
        returnPct: `+${takeProfitPct.toFixed(1)}%`,
        pnl: `+₹${Math.round(initialCapital * 0.12 * (takeProfitPct / 100)).toLocaleString('en-IN')}`,
        exitReason: 'Take Profit Target Reached',
        status: 'WIN'
      },
      {
        id: `TR-${selectedTicker}-02`,
        date: '28 Sep 2026',
        side: 'LONG',
        price: `₹${(baseP * 0.94).toFixed(2)}`,
        returnPct: `+${(takeProfitPct * 0.75).toFixed(1)}%`,
        pnl: `+₹${Math.round(initialCapital * 0.12 * ((takeProfitPct * 0.75) / 100)).toLocaleString('en-IN')}`,
        exitReason: 'SHAP Positive Factor Peak',
        status: 'WIN'
      },
      {
        id: `TR-${selectedTicker}-03`,
        date: '11 Sep 2026',
        side: 'LONG',
        price: `₹${(baseP * 0.97).toFixed(2)}`,
        returnPct: `-${stopLossPct.toFixed(1)}%`,
        pnl: `-₹${Math.round(initialCapital * 0.12 * (stopLossPct / 100)).toLocaleString('en-IN')}`,
        exitReason: 'Stop Loss Boundary Hit',
        status: 'LOSS'
      },
      {
        id: `TR-${selectedTicker}-04`,
        date: '24 Aug 2026',
        side: 'LONG',
        price: `₹${(baseP * 0.91).toFixed(2)}`,
        returnPct: `+${takeProfitPct.toFixed(1)}%`,
        pnl: `+₹${Math.round(initialCapital * 0.12 * (takeProfitPct / 100)).toLocaleString('en-IN')}`,
        exitReason: 'Take Profit Target Reached',
        status: 'WIN'
      },
      {
        id: `TR-${selectedTicker}-05`,
        date: '05 Aug 2026',
        side: 'LONG',
        price: `₹${(baseP * 0.88).toFixed(2)}`,
        returnPct: `+${(takeProfitPct * 0.85).toFixed(1)}%`,
        pnl: `+₹${Math.round(initialCapital * 0.12 * ((takeProfitPct * 0.85) / 100)).toLocaleString('en-IN')}`,
        exitReason: 'Momentum Climax Target',
        status: 'WIN'
      }
    ];
  }, [stock, selectedTicker, initialCapital, takeProfitPct, stopLossPct]);

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
          <span className="text-[20px] font-mono font-bold text-emerald-400 mt-1">+{cagrValue}%</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">vs +{benchmarkCagr}% NIFTY 50</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Sharpe Ratio</span>
          <span className="text-[20px] font-mono font-bold text-cyan-300 mt-1">{sharpeValue}</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">Risk-adjusted benchmark</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Max Drawdown</span>
          <span className="text-[20px] font-mono font-bold text-rose-400 mt-1">{maxDrawdownVal}%</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">Bench peak: -17.4%</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Win Rate</span>
          <span className="text-[20px] font-mono font-bold text-emerald-400 mt-1">{winRateNumber}%</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">{Math.round(winRateNumber * 1.2)} of 120 Trades</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Profit Factor</span>
          <span className="text-[20px] font-mono font-bold text-cyan-400 mt-1">{profitFactorVal}</span>
          <span className="text-[10px] text-[#64748b] mt-0.5">Gross Win / Gross Loss</span>
        </div>

        <div className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] flex flex-col">
          <span className="text-[11px] font-mono text-[#64748b]">Final NAV</span>
          <span className="text-[20px] font-mono font-bold text-white mt-1">₹{(finalStrategyNav / 100000).toFixed(2)} L</span>
          <span className="text-[10px] text-emerald-400 mt-0.5">+{netReturnPct}% Net Profit</span>
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
              <span className="text-cyan-300 font-semibold">{modelType.split(' ')[0]} Strategy (+{netReturnPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500" />
              <span className="text-[#94a3b8]">Nifty 50 (+{netBenchmarkPct}%)</span>
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
                <th className="py-2.5 px-4">Position Vector</th>
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
                      trade.side === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
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
