import React, { useState } from 'react';
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
  const deltaPercent = ((deltaRupees) / currentPrice) * 100;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#122131] w-full max-w-lg rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
              <span className="material-symbols-outlined text-[18px]">add_alert</span>
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#d4e4fa] leading-none">
                Price Trigger & Volatility Alert
              </h2>
              <span className="text-[11px] text-[#c2c6d6] mt-0.5 block font-mono">
                {currentStock.ticker} • Real-time Level Watcher
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

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Current Stock Context Display */}
          <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#1c2b3c] flex items-center justify-center font-bold text-[#adc6ff] text-[15px] border border-[#273647]">
                {currentStock.ticker.charAt(0)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px] text-[#d4e4fa]">
                    {currentStock.ticker}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#c2c6d6]">
                    {currentStock.exchange}
                  </span>
                </div>
                <span className="text-[11px] text-[#8c909f]">{currentStock.name}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-mono text-[16px] font-bold text-[#d4e4fa]">
                ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`font-mono text-[11px] font-semibold flex items-center gap-0.5 ${
                  currentStock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {currentStock.changePercent >= 0 ? 'north_east' : 'south_east'}
                </span>
                {currentStock.changePercent >= 0 ? '+' : ''}{currentStock.changePercent}%
              </span>
            </div>
          </div>

          {/* Alert Configuration Form */}
          <form onSubmit={handleCreateAlert} className="bg-[#122131] rounded-xl p-3.5 border border-[#1c2b3c] space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-[#c2c6d6] font-semibold block">
              Set Custom Trigger Condition
            </span>

            {/* Condition Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-[#051424] p-1 rounded-xl border border-[#1c2b3c]">
              <button
                type="button"
                onClick={() => setCondition('ABOVE')}
                className={`py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  condition === 'ABOVE'
                    ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/40 shadow-sm'
                    : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>Rises Above (≥)</span>
              </button>
              <button
                type="button"
                onClick={() => setCondition('BELOW')}
                className={`py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  condition === 'BELOW'
                    ? 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#93000a]/40 shadow-sm'
                    : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">trending_down</span>
                <span>Drops Below (≤)</span>
              </button>
            </div>

            {/* Target Price Input with Delta Preview */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <label className="text-[#c2c6d6] font-medium" htmlFor="targetPriceInput">
                  Target Trigger Price (₹)
                </label>
                <span
                  className={`font-mono text-[11px] font-semibold ${
                    deltaRupees >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                  }`}
                >
                  {deltaRupees >= 0 ? '+' : ''}₹{deltaRupees.toFixed(2)} ({deltaPercent >= 0 ? '+' : ''}{deltaPercent.toFixed(2)}%)
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#8c909f] font-mono font-bold text-[14px]">
                  ₹
                </span>
                <input
                  id="targetPriceInput"
                  type="number"
                  step="0.05"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target price..."
                  className="w-full h-11 pl-8 pr-3 rounded-lg bg-[#051424] text-[#d4e4fa] font-mono text-[14px] font-bold border border-[#1c2b3c] outline-none focus:border-[#4d8eff]"
                  required
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-[#8c909f] uppercase font-semibold shrink-0 mr-1">
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
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all border shrink-0 ${
                    p.val > 0
                      ? 'bg-[#00a572]/15 text-[#4edea3] border-[#00a572]/30 hover:bg-[#00a572]/25'
                      : 'bg-[#93000a]/20 text-[#ffb4ab] border-[#93000a]/30 hover:bg-[#93000a]/30'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Note Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#c2c6d6]" htmlFor="alertNoteInput">
                Execution Memo (Optional)
              </label>
              <input
                id="alertNoteInput"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Key resistance level, stop loss exit..."
                className="w-full h-9 px-3 rounded-lg bg-[#051424] text-[#d4e4fa] text-[12px] border border-[#1c2b3c] outline-none focus:border-[#4d8eff]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[17px]">notifications_active</span>
              <span>Set Alert at ₹{numTargetPrice.toFixed(2)}</span>
            </button>
          </form>

          {/* Test Sandbox: Simulate Mock Market Fluctuation */}
          <div className="bg-[#051424] p-3 rounded-xl border border-[#273647] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#adc6ff]">
                <span className="material-symbols-outlined text-[16px]">science</span>
                <span className="text-[11px] uppercase font-bold tracking-wider">
                  Test Alert Engine (Simulate Price Fluctuation)
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#4edea3]">Real-time Sandbox</span>
            </div>
            <p className="text-[11px] text-[#8c909f] leading-snug">
              Nudge the mock price across thresholds to instantly test real-time toast dispatching:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => onSimulateTick('UP', 2.5)}
                className="h-8 rounded bg-[#00a572]/20 hover:bg-[#00a572]/30 text-[#4edea3] text-[11px] font-semibold font-mono flex items-center justify-center gap-1 border border-[#00a572]/40 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">north</span>
                <span>Simulate +2.5% Spike</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateTick('DOWN', 2.5)}
                className="h-8 rounded bg-[#93000a]/25 hover:bg-[#93000a]/35 text-[#ffb4ab] text-[11px] font-semibold font-mono flex items-center justify-center gap-1 border border-[#93000a]/40 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">south</span>
                <span>Simulate -2.5% Dip</span>
              </button>
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[12px] font-semibold text-[#d4e4fa]">
                Configured Watcher Triggers ({stockAlerts.length})
              </span>
              <span className="text-[11px] text-[#8c909f] font-mono">Stored in LocalStorage</span>
            </div>

            {stockAlerts.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] text-center text-[#8c909f] text-[12px]">
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
                          ? 'bg-[#0d1c2d] border-[#1c2b3c]'
                          : 'bg-[#051424] border-[#1c2b3c]/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isAbove
                              ? 'bg-[#00a572]/20 text-[#4edea3]'
                              : 'bg-[#93000a]/30 text-[#ffb4ab]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isAbove ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[13px] font-bold text-[#d4e4fa]">
                              {isAbove ? '≥' : '≤'} ₹{a.targetPrice.toFixed(2)}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                isAbove
                                  ? 'bg-[#00a572]/15 text-[#4edea3]'
                                  : 'bg-[#93000a]/20 text-[#ffb4ab]'
                              }`}
                            >
                              {distance >= 0 ? '+' : ''}{distance.toFixed(1)}% away
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8c909f] truncate">
                            {a.note || `Base price: ₹${a.createdPrice.toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleAlert(a.id)}
                          className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                            a.isActive
                              ? 'text-[#4edea3] hover:bg-[#00a572]/20'
                              : 'text-[#8c909f] hover:bg-[#1c2b3c]'
                          }`}
                          title={a.isActive ? 'Active watcher' : 'Muted'}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {a.isActive ? 'notifications_active' : 'notifications_off'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(a.id)}
                          className="w-7 h-7 rounded flex items-center justify-center text-[#8c909f] hover:text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors"
                          title="Delete alert"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
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
                <span className="text-[11px] text-[#8c909f] font-mono block pb-1">
                  Other Active Monitored Assets ({otherAlerts.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {otherAlerts.map((oa) => (
                    <span
                      key={oa.id}
                      className="px-2 py-0.5 rounded-full bg-[#1c2b3c] text-[#c2c6d6] text-[10px] font-mono flex items-center gap-1 border border-[#273647]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]"></span>
                      {oa.ticker} ({oa.condition === 'ABOVE' ? '≥' : '≤'} ₹{oa.targetPrice})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center justify-between">
          <span className="text-[11px] text-[#8c909f] font-mono">
            Encrypted Client Trigger Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#273647] hover:bg-[#314256] text-[#d4e4fa] text-[12px] font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
