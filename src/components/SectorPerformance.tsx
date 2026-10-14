import React, { useState } from 'react';
import { SECTOR_PERFORMANCE_DATA, SectorData } from '../data/sectors';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA } from '../data/stocks';

interface SectorPerformanceProps {
  onSelectStock?: (stock: StockData) => void;
  onNavigate?: (tab: ScreenTab) => void;
}

export const SectorPerformance: React.FC<SectorPerformanceProps> = ({
  onSelectStock,
  onNavigate
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterMode, setFilterMode] = useState<'all' | 'gainers' | 'losers'>('all');
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);

  // Helper to extract performance value based on active timeframe
  const getChangeValue = (sector: SectorData): number => {
    switch (timeframe) {
      case '1W':
        return sector.change1W;
      case '1M':
        return sector.change1M;
      case '1D':
      default:
        return sector.change1D;
    }
  };

  // Color styling based on return percentage
  const getTileStyles = (val: number) => {
    if (val >= 2.0) {
      return {
        tileClass: 'sector-tile sector-tile-strong-bull',
        bg: 'bg-gradient-to-br from-[#003823]/80 via-[#0d1c2d] to-[#010f1f]',
        border: 'border-[#00a572]/60 hover:border-[#4edea3]',
        text: 'text-[#4edea3]',
        badgeBg: 'sector-badge bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/30',
        glow: 'shadow-[0_0_12px_rgba(78,222,163,0.12)]'
      };
    }
    if (val > 0) {
      return {
        tileClass: 'sector-tile sector-tile-bull',
        bg: 'bg-gradient-to-br from-[#0c2e22]/60 via-[#0d1c2d] to-[#010f1f]',
        border: 'border-[#00a572]/35 hover:border-[#00a572]',
        text: 'text-[#4edea3]',
        badgeBg: 'sector-badge bg-[#00a572]/15 text-[#4edea3] border-[#00a572]/25',
        glow: ''
      };
    }
    if (val === 0) {
      return {
        tileClass: 'sector-tile sector-tile-neutral',
        bg: 'bg-[#0d1c2d]',
        border: 'border-[#1c2b3c] hover:border-[#273647]',
        text: 'text-[#c2c6d6]',
        badgeBg: 'sector-badge bg-[#1c2b3c] text-[#c2c6d6] border-[#273647]',
        glow: ''
      };
    }
    if (val > -1.0) {
      return {
        tileClass: 'sector-tile sector-tile-bear',
        bg: 'bg-gradient-to-br from-[#2e1418]/60 via-[#0d1c2d] to-[#010f1f]',
        border: 'border-[#93000a]/40 hover:border-[#ffb4ab]/60',
        text: 'text-[#ffb4ab]',
        badgeBg: 'sector-badge bg-[#93000a]/20 text-[#ffb4ab] border-[#93000a]/30',
        glow: ''
      };
    }
    // Strongly negative
    return {
      tileClass: 'sector-tile sector-tile-strong-bear',
      bg: 'bg-gradient-to-br from-[#440d12]/80 via-[#0d1c2d] to-[#010f1f]',
      border: 'border-[#ff5449]/50 hover:border-[#ff897d]',
      text: 'text-[#ff897d]',
      badgeBg: 'sector-badge bg-[#93000a]/35 text-[#ff897d] border-[#ff5449]/40',
      glow: 'shadow-[0_0_12px_rgba(255,84,73,0.12)]'
    };
  };

  // Filter & sort sectors
  const filteredSectors = SECTOR_PERFORMANCE_DATA.filter((s) => {
    const val = getChangeValue(s);
    if (filterMode === 'gainers') return val > 0;
    if (filterMode === 'losers') return val < 0;
    return true;
  }).sort((a, b) => getChangeValue(b) - getChangeValue(a));

  // Compute market-wide sector stats
  const totalAdvances = SECTOR_PERFORMANCE_DATA.reduce((acc, s) => acc + s.advances, 0);
  const totalDeclines = SECTOR_PERFORMANCE_DATA.reduce((acc, s) => acc + s.declines, 0);
  const advancingSectorsCount = SECTOR_PERFORMANCE_DATA.filter((s) => getChangeValue(s) > 0).length;
  const decliningSectorsCount = SECTOR_PERFORMANCE_DATA.filter((s) => getChangeValue(s) < 0).length;
  const avgSectorReturn = (
    SECTOR_PERFORMANCE_DATA.reduce((acc, s) => acc + getChangeValue(s), 0) /
    SECTOR_PERFORMANCE_DATA.length
  ).toFixed(2);

  return (
    <section className="bg-[#122131] rounded-2xl p-4 shadow-xl border border-[#1c2b3c] flex flex-col gap-3 relative overflow-hidden">
      {/* Decorative subtle ambient backdrop */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#4d8eff]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4d8eff]/20 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-[#d4e4fa] tracking-tight leading-none">
                  Sector Performance
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono border border-[#00a572]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                  NSE Broad Heatmap
                </span>
              </div>
              <p className="text-[11px] text-[#c2c6d6] mt-0.5">
                Average daily performance across Indian industry sectors
              </p>
            </div>
          </div>

          {/* Timeframe & Mode Selector */}
          <div className="flex items-center gap-1.5">
            {/* 1D / 1W / 1M buttons */}
            <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
              {(['1D', '1W', '1M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    timeframe === tf
                      ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                      : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Grid vs List View */}
            <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm'
                    : 'text-[#8c909f] hover:text-[#d4e4fa]'
                }`}
                title="Color-Coded Grid Heatmap"
                aria-label="Grid view"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm'
                    : 'text-[#8c909f] hover:text-[#d4e4fa]'
                }`}
                title="Ranked List"
                aria-label="List view"
              >
                <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              </button>
            </div>
          </div>
        </div>

        {/* Market Breadth & Sentiment Ticker Bar */}
        <div className="grid grid-cols-3 gap-2 bg-[#0d1c2d] p-2 rounded-xl border border-[#1c2b3c] text-center text-[11px]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Sector Avg ({timeframe})</span>
            <span
              className={`font-mono font-bold mt-0.5 ${
                Number(avgSectorReturn) >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              {Number(avgSectorReturn) >= 0 ? '+' : ''}{avgSectorReturn}%
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[#1c2b3c] px-1">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Advancing / Declining</span>
            <div className="flex items-center gap-1.5 font-mono font-semibold mt-0.5">
              <span className="text-[#4edea3]">{advancingSectorsCount} Adv</span>
              <span className="text-[#8c909f]">•</span>
              <span className="text-[#ffb4ab]">{decliningSectorsCount} Dec</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Market Breadth</span>
            <span className="font-mono text-[#adc6ff] font-semibold mt-0.5">
              {totalAdvances}:{totalDeclines} (A/D)
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {[
            { id: 'all', label: `All Sectors (${SECTOR_PERFORMANCE_DATA.length})` },
            { id: 'gainers', label: `Leading (${advancingSectorsCount})` },
            { id: 'losers', label: `Lagging (${decliningSectorsCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as 'all' | 'gainers' | 'losers')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                filterMode === tab.id
                  ? 'bg-[#adc6ff] text-[#002e6a] font-semibold shadow-sm'
                  : 'bg-[#1c2b3c] text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sector Visualization: Color-Coded Grid Heatmap */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 relative z-10">
          {filteredSectors.map((sector) => {
            const val = getChangeValue(sector);
            const styles = getTileStyles(val);
            const isPositive = val >= 0;

            return (
              <div
                key={sector.id}
                onClick={() => setSelectedSector(sector)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 select-none group active:scale-[0.98] ${styles.tileClass} ${styles.bg} ${styles.border} ${styles.glow}`}
              >
                {/* Sector Name & Return */}
                <div className="flex items-start justify-between gap-1">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-[#d4e4fa] truncate group-hover:text-[#adc6ff] transition-colors">
                      {sector.name}
                    </span>
                    <span className="text-[10px] text-[#8c909f] font-mono uppercase">
                      {sector.indexSymbol}
                    </span>
                  </div>

                  <div
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold font-mono flex items-center gap-0.5 border ${styles.badgeBg}`}
                  >
                    <span className="material-symbols-outlined text-[13px] leading-none">
                      {isPositive ? 'north_east' : 'south_east'}
                    </span>
                    <span>
                      {isPositive ? '+' : ''}
                      {val.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Breadth Progress bar & Details */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className="w-full h-1.5 bg-[#1c2b3c] rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#4edea3]"
                      style={{
                        width: `${(sector.advances / (sector.advances + sector.declines)) * 100}%`
                      }}
                      title={`${sector.advances} Advancing`}
                    />
                    <div
                      className="h-full bg-[#ffb4ab]"
                      style={{
                        width: `${(sector.declines / (sector.advances + sector.declines)) * 100}%`
                      }}
                      title={`${sector.declines} Declining`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#8c909f] font-mono">
                    <span className="text-[#4edea3]">{sector.advances} Adv</span>
                    <span className="truncate max-w-[80px]">M.Cap ₹{sector.marketCapTrillion}T</span>
                    <span className="text-[#ffb4ab]">{sector.declines} Dec</span>
                  </div>
                </div>

                {/* Top Performer Chip */}
                <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-[#8c909f] truncate">
                    Top: <strong className="text-[#d4e4fa] font-mono">{sector.topGainer.symbol}</strong>
                  </span>
                  <span className="font-mono text-[#4edea3] font-semibold">
                    +{sector.topGainer.changePct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Ranked List View */
        <div className="flex flex-col gap-1.5 relative z-10">
          {filteredSectors.map((sector, rank) => {
            const val = getChangeValue(sector);
            const isPositive = val >= 0;
            const styles = getTileStyles(val);

            return (
              <div
                key={sector.id}
                onClick={() => setSelectedSector(sector)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:border-[#273647] ${styles.tileClass} ${styles.bg} ${styles.border}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 font-mono text-[11px] font-bold text-[#8c909f] text-center">
                    #{rank + 1}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#d4e4fa] truncate">
                        {sector.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#8c909f] font-mono">
                        {sector.indexSymbol}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8c909f] truncate">
                      {sector.keyConstituents.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-col items-end">
                    <span
                      className={`font-mono text-[13px] font-bold flex items-center gap-0.5 ${
                        isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                      </span>
                      {isPositive ? '+' : ''}
                      {val.toFixed(2)}%
                    </span>
                    <span className="text-[10px] font-mono text-[#8c909f]">
                      {sector.advances} Adv / {sector.declines} Dec
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#8c909f] text-[16px]">
                    chevron_right
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c] text-[10px] text-[#8c909f]">
        <span>Scale:</span>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#440d12] border border-[#ff5449]/50"></span>
            &lt;-1%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#2e1418] border border-[#93000a]/40"></span>
            -1% to 0%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#0c2e22] border border-[#00a572]/40"></span>
            0% to +2%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#003823] border border-[#00a572]"></span>
            &gt;+2%
          </span>
        </div>
      </div>

      {/* Sector Deep Dive Modal */}
      {selectedSector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#122131] w-full max-w-md rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#4d8eff]/20 text-[#adc6ff] flex items-center justify-center font-bold font-mono border border-[#4d8eff]/30">
                  {selectedSector.indexSymbol.slice(0, 3)}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#d4e4fa] leading-none">
                    {selectedSector.name}
                  </h3>
                  <span className="text-[11px] text-[#adc6ff] font-mono mt-0.5 block">
                    {selectedSector.indexSymbol} • Weight: {selectedSector.marketWeightPct}% of Nifty
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSector(null)}
                className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Performance Across Horizons */}
              <div className="grid grid-cols-3 gap-2 bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] text-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-semibold">1-Day Average</span>
                  <span
                    className={`font-mono text-[14px] font-bold mt-0.5 ${
                      selectedSector.change1D >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {selectedSector.change1D >= 0 ? '+' : ''}
                    {selectedSector.change1D}%
                  </span>
                </div>
                <div className="flex flex-col border-x border-[#1c2b3c] px-1">
                  <span className="text-[10px] text-[#8c909f] uppercase font-semibold">1-Week</span>
                  <span
                    className={`font-mono text-[14px] font-bold mt-0.5 ${
                      selectedSector.change1W >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {selectedSector.change1W >= 0 ? '+' : ''}
                    {selectedSector.change1W}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-semibold">1-Month</span>
                  <span
                    className={`font-mono text-[14px] font-bold mt-0.5 ${
                      selectedSector.change1M >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {selectedSector.change1M >= 0 ? '+' : ''}
                    {selectedSector.change1M}%
                  </span>
                </div>
              </div>

              {/* Market Catalyst & Drivers Note */}
              <div className="bg-[#010f1f] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#adc6ff]">
                  <span className="material-symbols-outlined text-[15px]">campaign</span>
                  <span>Primary Market Catalyst & Sector Driver</span>
                </div>
                <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
                  {selectedSector.catalyst}
                </p>
              </div>

              {/* Top Gainer & Loser */}
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="p-2.5 rounded-xl bg-[#00a572]/10 border border-[#00a572]/20 flex flex-col">
                  <span className="text-[10px] text-[#4edea3] font-semibold uppercase">Sector Top Gainer</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-[#d4e4fa] font-mono">{selectedSector.topGainer.symbol}</span>
                    <span className="font-mono text-[#4edea3] font-bold">+{selectedSector.topGainer.changePct}%</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#93000a]/15 border border-[#93000a]/30 flex flex-col">
                  <span className="text-[10px] text-[#ffb4ab] font-semibold uppercase">Sector Top Lag</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-[#d4e4fa] font-mono">{selectedSector.topLoser.symbol}</span>
                    <span className="font-mono text-[#ffb4ab] font-bold">{selectedSector.topLoser.changePct}%</span>
                  </div>
                </div>
              </div>

              {/* Key Sector Constituents */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">
                  Top Index Constituents ({selectedSector.keyConstituents.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSector.keyConstituents.map((ticker) => {
                    const stock = STOCKS_DATA[ticker];
                    return (
                      <button
                        key={ticker}
                        onClick={() => {
                          if (stock && onSelectStock) {
                            onSelectStock(stock);
                            setSelectedSector(null);
                            if (onNavigate) onNavigate('markets');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0d1c2d] hover:bg-[#1c2b3c] border border-[#1c2b3c] hover:border-[#4d8eff] flex items-center gap-1.5 text-[11px] transition-all"
                      >
                        <span className="font-mono font-bold text-[#d4e4fa]">{ticker}</span>
                        {stock && (
                          <span
                            className={`font-mono text-[10px] ${
                              stock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                            }`}
                          >
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedSector(null)}
                className="h-9 px-4 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#d4e4fa] text-[12px] font-semibold transition-colors"
              >
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
