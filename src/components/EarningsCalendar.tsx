import React, { useState } from 'react';
import { UPCOMING_EARNINGS_DATABASE, EarningsItem } from '../data/earnings';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA } from '../data/stocks';

interface EarningsCalendarProps {
  watchlist?: string[];
  onSelectStock?: (stock: StockData) => void;
  onNavigate?: (tab: ScreenTab) => void;
}

export const EarningsCalendar: React.FC<EarningsCalendarProps> = ({
  watchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATASTEEL'],
  onSelectStock,
  onNavigate
}) => {
  const [filterScope, setFilterScope] = useState<'watchlist' | 'all'>('watchlist');
  const [timeFilter, setTimeFilter] = useState<'all' | '14d' | '30d'>('all');
  const [selectedEarnings, setSelectedEarnings] = useState<EarningsItem | null>(null);

  // Filter items based on watchlist and time
  const items = UPCOMING_EARNINGS_DATABASE.filter((item) => {
    if (filterScope === 'watchlist' && !watchlist.includes(item.ticker)) {
      return false;
    }
    if (timeFilter === '14d' && item.daysRemaining > 14) {
      return false;
    }
    if (timeFilter === '30d' && item.daysRemaining > 30) {
      return false;
    }
    return true;
  }).sort((a, b) => a.daysRemaining - b.daysRemaining);

  const handleSelectStockClick = (ticker: string) => {
    const stock = STOCKS_DATA[ticker];
    if (stock && onSelectStock) {
      onSelectStock(stock);
      if (onNavigate) onNavigate('markets');
    }
    setSelectedEarnings(null);
  };

  return (
    <section className="bg-[#122131] rounded-2xl p-4 shadow-xl border border-[#1c2b3c] flex flex-col gap-3 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0c1ff]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#c0c1ff]/15 text-[#c0c1ff] flex items-center justify-center border border-[#c0c1ff]/30 shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-[#d4e4fa] tracking-tight leading-none">
                Upcoming Earnings Calendar
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#c0c1ff]/20 text-[#c0c1ff] text-[10px] font-bold font-mono border border-[#c0c1ff]/30">
                Q2 FY27
              </span>
            </div>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">
              Release dates & analyst consensus estimates for monitored watchlist
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5">
          {/* Watchlist toggle */}
          <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
            <button
              onClick={() => setFilterScope('watchlist')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                filterScope === 'watchlist'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              Watchlist ({watchlist.length})
            </button>
            <button
              onClick={() => setFilterScope('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                filterScope === 'all'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              All Equities
            </button>
          </div>

          {/* Time range */}
          <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c] hidden sm:flex">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                timeFilter === 'all'
                  ? 'bg-[#1c2b3c] text-[#c0c1ff] shadow-sm'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTimeFilter('14d')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                timeFilter === '14d'
                  ? 'bg-[#1c2b3c] text-[#c0c1ff] shadow-sm'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              &lt; 14 Days
            </button>
          </div>
        </div>
      </div>

      {/* Earnings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 relative z-10">
        {items.map((item) => {
          const buyPct = Math.round((item.analystRatings.buy / item.analystRatings.total) * 100);
          const isSoon = item.daysRemaining <= 7;

          return (
            <div
              key={item.ticker}
              onClick={() => setSelectedEarnings(item)}
              className="bg-[#0d1c2d] hover:bg-[#122131] border border-[#1c2b3c] hover:border-[#273647] rounded-xl p-3.5 transition-all cursor-pointer flex flex-col justify-between gap-2.5 group shadow-sm active:scale-[0.99]"
            >
              {/* Card Top: Date Badge, Ticker & Timing */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Calendar Date Block */}
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center border font-mono shrink-0 shadow-sm ${
                      isSoon
                        ? 'bg-[#ff5449]/15 border-[#ff5449]/30 text-[#ff897d]'
                        : 'bg-[#1c2b3c] border-[#273647] text-[#adc6ff]'
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold leading-none">
                      {item.reportDate.split(' ')[0]}
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      {item.reportDate.split(' ')[1].replace(',', '')}
                    </span>
                  </div>

                  {/* Ticker & Name */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[14px] text-[#d4e4fa] font-mono group-hover:text-[#adc6ff] transition-colors">
                        {item.ticker}
                      </span>
                      <span className="text-[10px] text-[#8c909f] font-mono px-1 py-0.2 rounded bg-[#1c2b3c]">
                        {item.timing === 'AMC' ? 'After Close 🌙' : 'Before Open ☀️'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#c2c6d6] truncate max-w-[170px]">
                      {item.companyName}
                    </span>
                  </div>
                </div>

                {/* Days remaining badge */}
                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                      isSoon
                        ? 'bg-[#ff5449]/20 text-[#ff897d] border-[#ff5449]/30 animate-pulse'
                        : 'bg-[#00a572]/15 text-[#4edea3] border-[#00a572]/25'
                    }`}
                  >
                    {item.daysRemaining === 0
                      ? 'Today'
                      : item.daysRemaining === 1
                      ? 'Tomorrow'
                      : `In ${item.daysRemaining} days`}
                  </span>
                  <span className="text-[9px] font-mono text-[#8c909f] mt-0.5">
                    {item.fiscalQuarter}
                  </span>
                </div>
              </div>

              {/* Consensus Estimates Strip */}
              <div className="grid grid-cols-2 gap-2 bg-[#010f1f]/80 p-2 rounded-lg border border-[#1c2b3c]/80 text-[11px] font-mono">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#8c909f] uppercase font-sans">Consensus EPS</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-bold text-[#d4e4fa] text-[13px]">
                      ₹{item.consensusEPS.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#4edea3] font-semibold">
                      +{item.yoyEPSGrowth}% YoY
                    </span>
                  </div>
                </div>

                <div className="flex flex-col border-l border-[#1c2b3c] pl-2">
                  <span className="text-[9px] text-[#8c909f] uppercase font-sans">Revenue Est.</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-bold text-[#d4e4fa] text-[13px]">
                      ₹{(item.consensusRevenueCr / 1000).toFixed(1)}k Cr
                    </span>
                    <span className="text-[10px] text-[#4edea3] font-semibold">
                      +{item.yoyRevGrowth}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Analyst Sentiment & Implied Move */}
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <div className="flex items-center gap-1.5 text-[#8c909f]">
                  <span className="material-symbols-outlined text-[14px] text-[#4edea3]">recommend</span>
                  <span>
                    <strong className="text-[#4edea3] font-mono">{buyPct}%</strong> Buy ({item.analystRatings.total} analysts)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#adc6ff] text-[11px] font-mono">
                  <span>±{item.impliedMovePct}% Move</span>
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center bg-[#0d1c2d] rounded-xl border border-[#1c2b3c] text-[12px] text-[#8c909f]">
          No upcoming earnings found for the selected filter horizon.
        </div>
      )}

      {/* Modal: In-Depth Earnings Breakdown */}
      {selectedEarnings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#122131] w-full max-w-md rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#c0c1ff]/20 text-[#c0c1ff] flex items-center justify-center font-bold font-mono border border-[#c0c1ff]/30 text-[16px]">
                  {selectedEarnings.ticker.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[16px] font-bold text-[#d4e4fa] font-mono leading-none">
                      {selectedEarnings.ticker}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded bg-[#0d1c2d] text-[#c0c1ff] text-[10px] font-mono border border-[#1c2b3c]">
                      {selectedEarnings.fiscalQuarter}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#c2c6d6] mt-0.5 block truncate max-w-[200px]">
                    {selectedEarnings.companyName}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEarnings(null)}
                className="w-8 h-8 rounded-lg text-[#8c909f] hover:text-[#d4e4fa] hover:bg-[#273647] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5 overflow-y-auto">
              {/* Release Countdown Hero */}
              <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8c909f] uppercase font-semibold block">
                    Expected Reporting Date
                  </span>
                  <span className="text-[15px] font-bold text-[#d4e4fa] mt-0.5 block">
                    {selectedEarnings.reportDate} • {selectedEarnings.timing === 'AMC' ? 'After Market Close' : 'Before Market Open'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-[#c0c1ff]/20 text-[#c0c1ff] border border-[#c0c1ff]/30">
                  In {selectedEarnings.daysRemaining} Days
                </span>
              </div>

              {/* Estimates Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-sans">Consensus EPS</span>
                  <span className="font-bold text-[#d4e4fa] mt-1 text-[14px]">
                    ₹{selectedEarnings.consensusEPS.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#4edea3] mt-0.5">
                    +{selectedEarnings.yoyEPSGrowth}% YoY (Prior: ₹{selectedEarnings.priorQuarterEPS.toFixed(2)})
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-sans">Consensus Revenue</span>
                  <span className="font-bold text-[#d4e4fa] mt-1 text-[14px]">
                    ₹{selectedEarnings.consensusRevenueCr.toLocaleString('en-IN')} Cr
                  </span>
                  <span className="text-[10px] text-[#4edea3] mt-0.5">
                    +{selectedEarnings.yoyRevGrowth}% YoY
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-sans">Prior Quarter Surprise</span>
                  <span
                    className={`font-bold mt-1 text-[14px] ${
                      selectedEarnings.priorQuarterSurprise >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {selectedEarnings.priorQuarterSurprise >= 0 ? '+' : ''}
                    {selectedEarnings.priorQuarterSurprise}% Beat
                  </span>
                  <span className="text-[10px] text-[#8c909f] mt-0.5">Historical Beat Track</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-sans">Implied Volatility Move</span>
                  <span className="font-bold text-[#adc6ff] mt-1 text-[14px]">
                    ±{selectedEarnings.impliedMovePct}%
                  </span>
                  <span className="text-[10px] text-[#8c909f] mt-0.5">Straddle Price Expectation</span>
                </div>
              </div>

              {/* Analyst Consensus Breakdown */}
              <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#d4e4fa]">Wall St / Dalal St Consensus</span>
                  <span className="font-mono text-[#4edea3]">
                    Target: ₹{selectedEarnings.analystRatings.consensusTargetPrice.toFixed(2)}
                  </span>
                </div>

                {/* Horizontal Segmented Bar */}
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#1c2b3c]">
                  <div
                    style={{
                      width: `${(selectedEarnings.analystRatings.buy / selectedEarnings.analystRatings.total) * 100}%`
                    }}
                    className="bg-[#4edea3] h-full"
                    title="Buy"
                  />
                  <div
                    style={{
                      width: `${(selectedEarnings.analystRatings.hold / selectedEarnings.analystRatings.total) * 100}%`
                    }}
                    className="bg-[#c0c1ff] h-full"
                    title="Hold"
                  />
                  <div
                    style={{
                      width: `${(selectedEarnings.analystRatings.sell / selectedEarnings.analystRatings.total) * 100}%`
                    }}
                    className="bg-[#ff5449] h-full"
                    title="Sell"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#8c909f]">
                  <span className="text-[#4edea3]">{selectedEarnings.analystRatings.buy} Buy</span>
                  <span className="text-[#c0c1ff]">{selectedEarnings.analystRatings.hold} Hold</span>
                  <span className="text-[#ffb4ab]">{selectedEarnings.analystRatings.sell} Sell</span>
                </div>
              </div>

              {/* Key Focus Metrics to Watch */}
              <div className="bg-[#010f1f] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#adc6ff]">
                  Key Management Commentary Metrics to Watch
                </span>
                <ul className="space-y-1">
                  {selectedEarnings.keyWatchMetrics.map((metric, i) => (
                    <li key={i} className="text-[11px] text-[#c2c6d6] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedEarnings(null)}
                className="h-9 px-3 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#c2c6d6] text-[12px] font-semibold transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleSelectStockClick(selectedEarnings.ticker)}
                className="h-9 px-4 rounded-lg bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <span>View {selectedEarnings.ticker} Market Analysis</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
