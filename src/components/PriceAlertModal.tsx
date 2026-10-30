import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  FlaskConical,
  Check,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { StockData, PriceAlert } from '../types';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStock: StockData;
  alerts: PriceAlert[];
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
  onSimulateTick: (direction: 'UP' | 'DOWN', percent: number) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  currentStock,
  alerts,
  onAddAlert,
  onDeleteAlert,
  onToggleAlert,
  onSimulateTick
}) => {
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [targetPrice, setTargetPrice] = useState<string>(
    (currentStock.price * 1.02).toFixed(2)
  );
  const [note, setNote] = useState('Resistance breakout target');

  if (!isOpen) return null;

  const currentPrice = currentStock.price;
  const numTargetPrice = parseFloat(targetPrice) || currentPrice;
  const deltaRupees = numTargetPrice - currentPrice;
  const deltaPercent = (deltaRupees / currentPrice) * 100;

  const handlePreset = (pct: number) => {
    const calculated = currentPrice * (1 + pct / 100);
    setTargetPrice(calculated.toFixed(2));
    if (pct > 0) {
      setCondition('ABOVE');
      setNote('Take Profit / Bullish Target');
    } else {
      setCondition('BELOW');
      setNote('Stop-Loss Protection Floor');
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || isNaN(numTargetPrice) || numTargetPrice <= 0) return;

    onAddAlert({
      ticker: currentStock.ticker,
      condition,
      targetPrice: numTargetPrice,
      createdPrice: currentPrice,
      note: note.trim() || undefined
    });

    // Reset default to +2%
    setTargetPrice((currentPrice * 1.02).toFixed(2));
    setNote('');
  };

  const stockAlerts = alerts.filter((a) => a.ticker === currentStock.ticker);
  const otherAlerts = alerts.filter((a) => a.ticker !== currentStock.ticker);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c1524] w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-[#121c2d]/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/70 dark:border-amber-800">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Price Trigger & Alerts
              </h2>
              <span className="text-xs text-slate-400 block font-mono">
                {currentStock.ticker} • Real-time Level Watcher
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Current Stock Context Display */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold font-mono text-sm border border-teal-200/70 dark:border-teal-800">
                {currentStock.ticker.slice(0, 3)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {currentStock.ticker}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {currentStock.exchange}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{currentStock.name}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${
                  currentStock.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {currentStock.changePercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {currentStock.changePercent >= 0 ? '+' : ''}{currentStock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Alert Configuration Form */}
          <form onSubmit={handleCreateAlert} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 space-y-3.5">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
              Set Custom Trigger Condition
            </span>

            {/* Condition Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-slate-200/60 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCondition('ABOVE')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  condition === 'ABOVE'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs border border-emerald-200 dark:border-emerald-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Rises Above (≥)</span>
              </button>
              <button
                type="button"
                onClick={() => setCondition('BELOW')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  condition === 'BELOW'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 shadow-xs border border-rose-200 dark:border-rose-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Drops Below (≤)</span>
              </button>
            </div>

            {/* Target Price Input with Delta Preview */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-slate-700 dark:text-slate-300 font-semibold" htmlFor="targetPriceInput">
                  Target Trigger Price (₹)
                </label>
                <span
                  className={`font-mono text-xs font-bold ${
                    deltaRupees >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {deltaRupees >= 0 ? '+' : ''}₹{deltaRupees.toFixed(2)} ({deltaPercent >= 0 ? '+' : ''}{deltaPercent.toFixed(2)}%)
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 font-mono font-bold text-sm">
                  ₹
                </span>
                <input
                  id="targetPriceInput"
                  type="number"
                  step="0.05"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target price..."
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm font-bold border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  required
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0 mr-1">
                Presets:
              </span>
              {[
                { label: '+1%', val: 1 },
                { label: '+2%', val: 2 },
                { label: '+5%', val: 5 },
                { label: '-1%', val: -1 },
                { label: '-2%', val: -2 },
                { label: '-5%', val: -5 }
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePreset(p.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border shrink-0 cursor-pointer ${
                    p.val > 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Note Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500 dark:text-slate-400 font-medium" htmlFor="alertNoteInput">
                Execution Memo (Optional)
              </label>
              <input
                id="alertNoteInput"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Key resistance breakout, stop loss exit..."
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <BellRing className="w-4 h-4" />
              <span>Set Alert at ₹{numTargetPrice.toFixed(2)}</span>
            </button>
          </form>

          {/* Test Sandbox: Simulate Mock Market Fluctuation */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300">
                <FlaskConical className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">
                  Test Alert Engine
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold">Real-time Sandbox</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Nudge the price across thresholds to instantly test real-time notification dispatching:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => onSimulateTick('UP', 2.5)}
                className="h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold font-mono flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800 active:scale-95 transition-all cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Simulate +2.5% Spike</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateTick('DOWN', 2.5)}
                className="h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold font-mono flex items-center justify-center gap-1 border border-rose-200 dark:border-rose-800 active:scale-95 transition-all cursor-pointer"
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Simulate -2.5% Dip</span>
              </button>
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Active Watcher Triggers ({stockAlerts.length})
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Stored in LocalStorage</span>
            </div>

            {stockAlerts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-center text-slate-400 text-xs">
                No price alerts set for {currentStock.ticker} yet. Configure one above!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {stockAlerts.map((a) => {
                  const isAbove = a.condition === 'ABOVE';
                  const distance = ((a.targetPrice - currentPrice) / currentPrice) * 100;

                  return (
                    <div
                      key={a.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        a.isActive
                          ? 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isAbove
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                          }`}
                        >
                          {isAbove ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {isAbove ? '≥' : '≤'} ₹{a.targetPrice.toFixed(2)}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                isAbove
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              }`}
                            >
                              {distance >= 0 ? '+' : ''}{distance.toFixed(1)}% away
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {a.note || `Base price: ₹${a.createdPrice.toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleAlert(a.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            a.isActive
                              ? 'text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40'
                              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={a.isActive ? 'Active watcher' : 'Muted'}
                        >
                          {a.isActive ? <BellRing className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(a.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Other Active Equities with Alerts */}
            {otherAlerts.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 font-mono block pb-1">
                  Other Active Monitored Assets ({otherAlerts.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {otherAlerts.map((oa) => (
                    <span
                      key={oa.id}
                      className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                      {oa.ticker} ({oa.condition === 'ABOVE' ? '≥' : '≤'} ₹{oa.targetPrice})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50/50 dark:bg-[#121c2d]/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Client Trigger Engine Active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
