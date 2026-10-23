import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Search,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Activity,
  BarChart3,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA, getAllIndianStocks } from '../data/stocks';

interface ScreenerScreenProps {
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export const ScreenerScreen: React.FC<ScreenerScreenProps> = ({
  onSelectStock,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedSignal, setSelectedSignal] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'confidence' | 'price' | 'change' | 'riskScore'>('confidence');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const stockList = useMemo(() => getAllIndianStocks(), []);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(stockList.map((s) => s.sector)));
    return ['ALL', ...list];
  }, [stockList]);

  // Apply filters
  const filteredStocks = useMemo(() => {
    return stockList.filter((stock) => {
      // Search
      const matchesSearch =
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Sector
      if (selectedSector !== 'ALL' && stock.sector !== selectedSector) return false;

      // Signal
      if (selectedSignal !== 'ALL' && stock.direction !== selectedSignal) return false;

      // Risk
      if (selectedRisk !== 'ALL' && stock.riskCategory !== selectedRisk) return false;

      // Confidence
      if (stock.confidence < minConfidence) return false;

      return true;
    }).sort((a, b) => {
      let valA = a[sortBy] ?? 0;
      let valB = b[sortBy] ?? 0;
      if (sortBy === 'change') {
        valA = a.changePercent;
        valB = b.changePercent;
      }
      if (sortDirection === 'desc') {
        return (valB as number) - (valA as number);
      }
      return (valA as number) - (valB as number);
    });
  }, [stockList, searchQuery, selectedSector, selectedSignal, selectedRisk, minConfidence, sortBy, sortDirection]);

  // Preset Filters
  const applyPreset = (preset: 'high-bullish' | 'low-risk' | 'momentum' | 'oversold') => {
    if (preset === 'high-bullish') {
      setSelectedSignal('UP');
      setMinConfidence(75);
      setSelectedRisk('ALL');
      setSelectedSector('ALL');
    } else if (preset === 'low-risk') {
      setSelectedRisk('LOW');
      setSelectedSignal('ALL');
      setMinConfidence(50);
      setSelectedSector('ALL');
    } else if (preset === 'momentum') {
      setSelectedSignal('UP');
      setMinConfidence(70);
      setSelectedRisk('ALL');
    } else if (preset === 'oversold') {
      setSelectedSignal('DOWN');
      setMinConfidence(50);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSector('ALL');
    setSelectedSignal('ALL');
    setSelectedRisk('ALL');
    setMinConfidence(50);
    setSortBy('confidence');
    setSortDirection('desc');
  };

  const handleSelectAndInspect = (stock: StockData) => {
    onSelectStock(stock);
    onNavigate('ai-predict');
  };

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1c2b3c] border border-[#273647] flex items-center justify-center text-cyan-400 shrink-0">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-white tracking-tight">
                Quantitative Stock Screener
              </h1>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-mono font-bold">
                XAI Multi-Factor
              </span>
            </div>
            <p className="text-[13px] text-[#94a3b8] mt-0.5">
              Screen NSE equities filtered by ensemble ML trend conviction, calibrated probability, and VaR risk profiles.
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-mono text-[#64748b] mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('high-bullish')}
            className="px-2.5 py-1 rounded-lg bg-[#1a2d47] hover:bg-[#233b5c] text-[11px] font-medium text-cyan-300 border border-[#233b5c] transition-colors"
          >
            High Bullish (&gt;75%)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('low-risk')}
            className="px-2.5 py-1 rounded-lg bg-[#1a2d47] hover:bg-[#233b5c] text-[11px] font-medium text-emerald-300 border border-[#233b5c] transition-colors"
          >
            Low Risk
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-2 py-1 rounded-lg bg-[#111e33] hover:bg-[#1a2d47] text-[11px] font-medium text-[#94a3b8] border border-[#1c2e4a] flex items-center gap-1 transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#122131] rounded-2xl p-4 border border-[#1c2b3c] flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker or name..."
              className="w-full pl-9 pr-3 py-2 bg-[#0a1424] border border-[#1c2b3c] rounded-xl text-[13px] text-white placeholder-[#64748b] focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Sector Filter */}
          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a1424] border border-[#1c2b3c] rounded-xl text-[13px] text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  Sector: {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Signal Filter */}
          <div>
            <select
              value={selectedSignal}
              onChange={(e) => setSelectedSignal(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a1424] border border-[#1c2b3c] rounded-xl text-[13px] text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              <option value="ALL">Trend: All Signals</option>
              <option value="UP">Bullish (UP)</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="DOWN">Bearish (DOWN)</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a1424] border border-[#1c2b3c] rounded-xl text-[13px] text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              <option value="ALL">Risk: All Tiers</option>
              <option value="LOW">Low Risk</option>
              <option value="MODERATE">Moderate Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>

          {/* Min Confidence Slider */}
          <div className="flex flex-col justify-center px-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8] mb-1">
              <span>Min Confidence:</span>
              <span className="text-cyan-400 font-bold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-[#1c2b3c] rounded-lg"
            />
          </div>
        </div>

        {/* Results summary strip */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1a293b] text-[12px] text-[#64748b]">
          <div className="flex items-center gap-3">
            <span>
              Matching Equities: <strong className="text-white font-mono">{filteredStocks.length}</strong> of {stockList.length}
            </span>
            <span>·</span>
            <span>
              Sorted by: <strong className="text-cyan-300 font-mono capitalize">{sortBy}</strong> ({sortDirection.toUpperCase()})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Sort:</span>
            <button
              onClick={() => {
                if (sortBy === 'confidence') setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
                else { setSortBy('confidence'); setSortDirection('desc'); }
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                sortBy === 'confidence' ? 'bg-cyan-500/20 text-cyan-300' : 'text-[#64748b] hover:text-white'
              }`}
            >
              Confidence
            </button>
            <button
              onClick={() => {
                if (sortBy === 'change') setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
                else { setSortBy('change'); setSortDirection('desc'); }
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                sortBy === 'change' ? 'bg-cyan-500/20 text-cyan-300' : 'text-[#64748b] hover:text-white'
              }`}
            >
              24h %
            </button>
            <button
              onClick={() => {
                if (sortBy === 'riskScore') setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
                else { setSortBy('riskScore'); setSortDirection('asc'); }
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                sortBy === 'riskScore' ? 'bg-cyan-500/20 text-cyan-300' : 'text-[#64748b] hover:text-white'
              }`}
            >
              Risk
            </button>
          </div>
        </div>
      </div>

      {/* Screened Table */}
      <div className="bg-[#122131] rounded-2xl border border-[#1c2b3c] overflow-hidden shadow-lg">
        {filteredStocks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-[#1c2b3c] flex items-center justify-center text-[#64748b] mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-[16px]">No stocks match criteria</h3>
            <p className="text-[13px] text-[#64748b] max-w-sm mt-1">
              Adjust your minimum confidence slider or clear filters to view more assets.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[13px] font-medium hover:bg-cyan-500/30 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#0b1522] border-b border-[#1c2b3c] text-[#64748b] font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Equity</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">24h Change</th>
                  <th className="py-3 px-4">AI Prediction</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">RSI (14)</th>
                  <th className="py-3 px-4">Risk Profile</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182637]">
                {filteredStocks.map((stock) => {
                  const isUp = stock.direction === 'UP';
                  const isDown = stock.direction === 'DOWN';

                  return (
                    <tr
                      key={stock.ticker}
                      className="hover:bg-[#16273b]/60 transition-colors group"
                    >
                      {/* Equity */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-[14px] group-hover:text-cyan-300 transition-colors">
                            {stock.ticker}
                          </span>
                          <span className="text-[11px] text-[#94a3b8] truncate max-w-[150px]">
                            {stock.name}
                          </span>
                        </div>
                      </td>

                      {/* Sector */}
                      <td className="py-3.5 px-4 text-[#cbd5e1] text-[12px]">
                        {stock.sector}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                        ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Change */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span
                          className={`inline-block font-semibold ${
                            stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {stock.changePercent >= 0 ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </td>

                      {/* Signal */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono ${
                            isUp
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                              : isDown
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                              : 'bg-slate-500/10 text-slate-300 border border-slate-500/25'
                          }`}
                        >
                          {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                          {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                          {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
                          {isUp ? 'BULLISH' : isDown ? 'BEARISH' : 'NEUTRAL'}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 w-28">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-white font-bold">{stock.confidence}%</span>
                            <span className="text-[#64748b]">calibrated</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#0a1424] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                              style={{ width: `${stock.confidence}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* RSI */}
                      <td className="py-3.5 px-4 font-mono text-[12px]">
                        <span
                          className={
                            stock.rsi > 70
                              ? 'text-amber-400 font-bold'
                              : stock.rsi < 30
                              ? 'text-cyan-400 font-bold'
                              : 'text-[#94a3b8]'
                          }
                        >
                          {stock.rsi.toFixed(1)}
                        </span>
                      </td>

                      {/* Risk */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              stock.riskCategory === 'LOW'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : stock.riskCategory === 'HIGH'
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            }`}
                          >
                            {stock.riskCategory} ({stock.riskScore}/100)
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectAndInspect(stock)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[12px] font-medium inline-flex items-center gap-1.5 transition-all group-hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                        >
                          <span>Analyze XAI</span>
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
