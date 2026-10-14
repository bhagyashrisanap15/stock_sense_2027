import React, { useState, useMemo } from 'react';
import { NSE500_SECTORS_DATA, NSESectorNode, NSEStockNode } from '../data/nse500';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA } from '../data/stocks';

interface MarketHeatmapProps {
  onSelectStock?: (stock: StockData) => void;
  onNavigate?: (tab: ScreenTab) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  onSelectStock,
  onNavigate
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'gainers' | 'losers'>('all');
  const [sizeMetric, setSizeMetric] = useState<'mcap' | 'volume'>('mcap');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStock, setActiveStock] = useState<NSEStockNode | null>(null);

  // Active sector if drilled down
  const selectedSector = useMemo(
    () => NSE500_SECTORS_DATA.find((s) => s.id === selectedSectorId) || null,
    [selectedSectorId]
  );

  // Total Market Stats
  const totalMarketCap = useMemo(
    () => NSE500_SECTORS_DATA.reduce((acc, s) => acc + s.marketCapTrillion, 0),
    []
  );

  const totalStocksCount = useMemo(
    () => NSE500_SECTORS_DATA.reduce((acc, s) => acc + s.stocks.length, 0),
    []
  );

  const totalAdvances = useMemo(
    () =>
      NSE500_SECTORS_DATA.reduce(
        (acc, s) => acc + s.stocks.filter((st) => st.changePercent > 0).length,
        0
      ),
    []
  );

  const totalDeclines = useMemo(
    () =>
      NSE500_SECTORS_DATA.reduce(
        (acc, s) => acc + s.stocks.filter((st) => st.changePercent < 0).length,
        0
      ),
    []
  );

  // Color mapping based on % return
  const getTileColor = (pct: number) => {
    if (pct >= 3.0) {
      return {
        bg: 'bg-[#004d2e]',
        border: 'border-[#00ff9d]/70',
        text: 'text-[#00ff9d]',
        badge: 'bg-[#00a572]/30 text-[#00ff9d]',
        gradient: 'from-[#005c37] to-[#002e1c]'
      };
    }
    if (pct >= 1.5) {
      return {
        bg: 'bg-[#003823]',
        border: 'border-[#4edea3]/50',
        text: 'text-[#4edea3]',
        badge: 'bg-[#00a572]/20 text-[#4edea3]',
        gradient: 'from-[#00472c] to-[#002617]'
      };
    }
    if (pct > 0) {
      return {
        bg: 'bg-[#0c2e22]',
        border: 'border-[#00a572]/40',
        text: 'text-[#4edea3]',
        badge: 'bg-[#00a572]/15 text-[#4edea3]',
        gradient: 'from-[#12382b] to-[#092017]'
      };
    }
    if (pct === 0) {
      return {
        bg: 'bg-[#1c2b3c]',
        border: 'border-[#273647]',
        text: 'text-[#c2c6d6]',
        badge: 'bg-[#122131] text-[#c2c6d6]',
        gradient: 'from-[#1c2b3c] to-[#122131]'
      };
    }
    if (pct > -1.5) {
      return {
        bg: 'bg-[#331418]',
        border: 'border-[#ffb4ab]/40',
        text: 'text-[#ffb4ab]',
        badge: 'bg-[#93000a]/20 text-[#ffb4ab]',
        gradient: 'from-[#42171c] to-[#250d10]'
      };
    }
    return {
      bg: 'bg-[#4d0f15]',
      border: 'border-[#ff5449]/60',
      text: 'text-[#ff897d]',
      badge: 'bg-[#93000a]/40 text-[#ff897d]',
      gradient: 'from-[#5e1119] to-[#36080d]'
    };
  };

  // Filtered Sectors
  const filteredSectors = useMemo(() => {
    return NSE500_SECTORS_DATA.filter((s) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSector =
          s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query);
        const matchesStock = s.stocks.some(
          (st) =>
            st.ticker.toLowerCase().includes(query) || st.name.toLowerCase().includes(query)
        );
        return matchesSector || matchesStock;
      }
      if (filterMode === 'gainers') return s.changePercent > 0;
      if (filterMode === 'losers') return s.changePercent < 0;
      return true;
    });
  }, [searchQuery, filterMode]);

  // Filtered Stocks in selected sector
  const filteredStocks = useMemo(() => {
    if (!selectedSector) return [];
    return selectedSector.stocks.filter((st) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          st.ticker.toLowerCase().includes(query) || st.name.toLowerCase().includes(query)
        );
      }
      if (filterMode === 'gainers') return st.changePercent > 0;
      if (filterMode === 'losers') return st.changePercent < 0;
      return true;
    });
  }, [selectedSector, searchQuery, filterMode]);

  // Handle stock click
  const handleStockClick = (stockNode: NSEStockNode) => {
    setActiveStock(stockNode);
  };

  // Navigate to stock analysis
  const handleOpenStockAnalysis = (ticker: string) => {
    const fullStock = STOCKS_DATA[ticker] || {
      ticker,
      name: activeStock?.name || `${ticker} Ltd.`,
      exchange: 'NSE',
      sector: selectedSector?.name || 'General',
      marketCap: `₹${activeStock?.marketCapTrillion}T`,
      price: activeStock?.price || 1000,
      change: activeStock?.changeValue || 10,
      changePercent: activeStock?.changePercent || 1.0,
      direction: activeStock?.direction || 'UP',
      directionLabel: activeStock?.direction === 'UP' ? 'Bullish' : 'Bearish',
      confidence: activeStock?.aiConfidence || 80,
      activeModel: 'XGBoost + LSTM Ensemble',
      winRate: '78.5%',
      snapshotTime: '09:45 IST',
      synthesisNote: 'Market heatmap constituent tracking high institutional liquidity.',
      riskScore: 35,
      riskCategory: 'LOW',
      annVolatility: 18.5,
      volBenchmark: 15.0,
      maxDrawdown: -12.4,
      drawdownPeak: 2900,
      var95: -2.1,
      sharpeRatio: 1.85,
      beta: activeStock?.beta || 1.0,
      drawdownFloor: 2450,
      uncertaintyEntropy: 0.18,
      rsi: activeStock?.rsi || 55,
      macd: { macdLine: 1.2, signalLine: 0.8, histogram: 0.4 },
      volume24h: `${activeStock?.volumeMillion || 5}M`,
      volumeSurge: '+18%',
      vol20dAvg: '4.2M',
      shapFactors: [
        { feature: 'Market Momentum', impact: 0.32, isBullish: true },
        { feature: 'Sector Outperformance', impact: 0.24, isBullish: true }
      ]
    };

    if (onSelectStock) onSelectStock(fullStock as StockData);
    if (onNavigate) onNavigate('markets');
  };

  return (
    <section className="bg-[#122131] rounded-2xl p-4 shadow-xl border border-[#1c2b3c] flex flex-col gap-3 relative overflow-hidden">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#4d8eff]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30 shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">view_quilt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#d4e4fa] tracking-tight leading-none">
                  NSE 500 Market Heatmap
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono border border-[#00a572]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                  Treemap Trellis
                </span>
              </div>
              <p className="text-[11px] text-[#c2c6d6] mt-0.5">
                Hierarchical sector-to-stock market visualization sized by market weight
              </p>
            </div>
          </div>

          {/* Breadcrumb / Back to Sectors button */}
          {selectedSector && (
            <button
              onClick={() => setSelectedSectorId(null)}
              className="px-3 py-1.5 rounded-xl bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] hover:text-[#d4e4fa] text-[12px] font-semibold border border-[#273647] flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>All Sectors</span>
            </button>
          )}
        </div>

        {/* Breadcrumb Indicator Bar */}
        <div className="flex items-center gap-2 text-[12px] bg-[#0d1c2d] px-3 py-1.5 rounded-xl border border-[#1c2b3c]">
          <button
            onClick={() => setSelectedSectorId(null)}
            className={`font-semibold transition-colors ${
              !selectedSector ? 'text-[#4edea3]' : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            NSE 500
          </button>
          {selectedSector && (
            <>
              <span className="text-[#8c909f]">/</span>
              <span className="text-[#4edea3] font-bold">{selectedSector.name}</span>
              <span className="text-[10px] font-mono text-[#8c909f] px-1.5 py-0.2 rounded bg-[#1c2b3c]">
                {selectedSector.code}
              </span>
            </>
          )}
          <span className="ml-auto text-[11px] font-mono text-[#8c909f]">
            {selectedSector
              ? `${filteredStocks.length} Stocks in Sector`
              : `${totalStocksCount} Monitored Equities Across ${NSE500_SECTORS_DATA.length} Sectors`}
          </span>
        </div>

        {/* Controls Row: Search + Filter Pills + Size Metric */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
          {/* Quick Search */}
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c909f] text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker, company or sector..."
              className="w-full h-8 pl-8 pr-3 bg-[#0d1c2d] text-[#d4e4fa] placeholder:text-[#8c909f] text-[11px] rounded-lg border border-[#1c2b3c] focus:outline-none focus:border-[#4d8eff] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-[#d4e4fa]"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Filter Pills */}
            <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
              {(['all', 'gainers', 'losers'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${
                    filterMode === mode
                      ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                      : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Size Metric Toggle */}
            <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
              <button
                onClick={() => setSizeMetric('mcap')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  sizeMetric === 'mcap'
                    ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                    : 'text-[#8c909f] hover:text-[#d4e4fa]'
                }`}
                title="Size by Market Cap"
              >
                M.Cap
              </button>
              <button
                onClick={() => setSizeMetric('volume')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  sizeMetric === 'volume'
                    ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                    : 'text-[#8c909f] hover:text-[#d4e4fa]'
                }`}
                title="Size by Traded Volume"
              >
                Vol
              </button>
            </div>
          </div>
        </div>

        {/* Market Breadth Stat Strip */}
        <div className="grid grid-cols-4 gap-2 bg-[#0d1c2d] p-2 rounded-xl border border-[#1c2b3c] text-center text-[11px]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Tracked Cap</span>
            <span className="font-mono text-[12px] font-bold text-[#d4e4fa] mt-0.5">
              ₹{totalMarketCap.toFixed(1)}T
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Advancing</span>
            <span className="font-mono text-[12px] font-bold text-[#4edea3] mt-0.5">
              {totalAdvances} Stocks
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Declining</span>
            <span className="font-mono text-[12px] font-bold text-[#ffb4ab] mt-0.5">
              {totalDeclines} Stocks
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">A/D Ratio</span>
            <span className="font-mono text-[12px] font-bold text-[#adc6ff] mt-0.5">
              {(totalAdvances / (totalDeclines || 1)).toFixed(2)}x
            </span>
          </div>
        </div>
      </div>

      {/* TREEMAP CANVAS CONTAINER */}
      <div className="relative z-10 w-full min-h-[360px] bg-[#0d1c2d] p-2 rounded-2xl border border-[#1c2b3c] overflow-hidden">
        {!selectedSector ? (
          /* ================= LEVEL 1: SECTORS TREEMAP ================= */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredSectors.map((sector) => {
              const colors = getTileColor(sector.changePercent);
              const isPositive = sector.changePercent >= 0;

              // Size weight scaling class
              const isLarge = sector.weightPct >= 12;
              const isMedium = sector.weightPct >= 6 && sector.weightPct < 12;

              return (
                <div
                  key={sector.id}
                  onClick={() => setSelectedSectorId(sector.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between group active:scale-[0.98] hover:shadow-lg ${
                    isLarge ? 'col-span-2 row-span-2 min-h-[140px]' : isMedium ? 'col-span-1 min-h-[110px]' : 'col-span-1 min-h-[90px]'
                  } ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[13px] text-[#d4e4fa] truncate group-hover:text-[#adc6ff] transition-colors">
                          {sector.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8c909f] uppercase">
                        {sector.code} • {sector.stocksCount} Equities
                      </span>
                    </div>

                    <div
                      className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold font-mono flex items-center gap-0.5 border ${colors.badge} ${colors.border}`}
                    >
                      <span className="material-symbols-outlined text-[13px] leading-none">
                        {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                      </span>
                      <span>
                        {isPositive ? '+' : ''}
                        {sector.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Micro constituents badges preview */}
                  <div className="flex flex-wrap gap-1 my-1">
                    {sector.stocks.slice(0, isLarge ? 5 : 3).map((st) => (
                      <span
                        key={st.ticker}
                        className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                          st.changePercent >= 0 ? 'bg-[#00a572]/20 text-[#4edea3]' : 'bg-[#93000a]/20 text-[#ffb4ab]'
                        }`}
                      >
                        {st.ticker} {st.changePercent >= 0 ? '+' : ''}{st.changePercent}%
                      </span>
                    ))}
                    {sector.stocks.length > (isLarge ? 5 : 3) && (
                      <span className="text-[9px] font-mono text-[#8c909f]">
                        +{sector.stocks.length - (isLarge ? 5 : 3)} more
                      </span>
                    )}
                  </div>

                  {/* Bottom metrics */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-[#8c909f] font-mono">
                    <span>M.Cap ₹{sector.marketCapTrillion}T ({sector.weightPct}%)</span>
                    <span className="flex items-center gap-0.5 text-[#adc6ff] group-hover:translate-x-0.5 transition-transform">
                      <span>Drill Down</span>
                      <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= LEVEL 2: CONSTITUENT STOCKS TREEMAP ================= */
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 text-[12px] text-[#c2c6d6]">
              <span className="font-semibold">
                Showing all {filteredStocks.length} constituents for {selectedSector.name}
              </span>
              <span className="font-mono text-[#8c909f] text-[11px]">
                Click any tile to inspect real-time performance & AI score
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filteredStocks.map((stock) => {
                const colors = getTileColor(stock.changePercent);
                const isPositive = stock.changePercent >= 0;

                // Scale tile size by market cap
                const isMajor = stock.marketCapTrillion >= 4.0;
                const isMid = stock.marketCapTrillion >= 1.5 && stock.marketCapTrillion < 4.0;

                return (
                  <div
                    key={stock.ticker}
                    onClick={() => handleStockClick(stock)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between group active:scale-[0.98] hover:shadow-lg ${
                      isMajor ? 'col-span-2 row-span-2 min-h-[130px]' : isMid ? 'col-span-1 min-h-[100px]' : 'col-span-1 min-h-[85px]'
                    } ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[14px] text-[#d4e4fa] font-mono truncate group-hover:text-[#adc6ff] transition-colors">
                          {stock.ticker}
                        </span>
                        <span className="text-[11px] text-[#c2c6d6] truncate max-w-[130px]">
                          {stock.name}
                        </span>
                      </div>

                      <div
                        className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold font-mono flex items-center gap-0.5 border ${colors.badge} ${colors.border}`}
                      >
                        <span className="material-symbols-outlined text-[13px] leading-none">
                          {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                        </span>
                        <span>
                          {isPositive ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* Stock Price & Stats */}
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex flex-col">
                        <span className="font-mono text-[14px] font-bold text-[#d4e4fa]">
                          ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <span
                          className={`font-mono text-[10px] ${
                            isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          {isPositive ? '+' : ''}₹{stock.changeValue.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-col items-end text-[10px] font-mono text-[#8c909f]">
                        <span>Cap: ₹{stock.marketCapTrillion}T</span>
                        <span>P/E: {stock.peRatio}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Heatmap Scale Legend */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c] text-[10px] text-[#8c909f] relative z-10 flex-wrap gap-2">
        <span className="font-semibold">Performance Legend:</span>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#4d0f15] border border-[#ff5449]" />
            &lt;-1.5%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#331418] border border-[#ffb4ab]/40" />
            -1.5% to 0%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#0c2e22] border border-[#00a572]/40" />
            0% to +1.5%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#003823] border border-[#4edea3]/50" />
            +1.5% to +3%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#004d2e] border border-[#00ff9d]" />
            &gt;+3%
          </span>
        </div>
      </div>

      {/* ================= STOCK DETAIL MODAL / DRAWER ================= */}
      {activeStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#122131] w-full max-w-md rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/20 text-[#adc6ff] flex items-center justify-center font-bold font-mono border border-[#4d8eff]/30 text-[16px]">
                  {activeStock.ticker.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[16px] font-bold text-[#d4e4fa] font-mono leading-none">
                      {activeStock.ticker}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded bg-[#0d1c2d] text-[#8c909f] text-[10px] font-mono border border-[#1c2b3c]">
                      NSE
                    </span>
                  </div>
                  <span className="text-[12px] text-[#c2c6d6] mt-0.5 block truncate max-w-[200px]">
                    {activeStock.name}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveStock(null)}
                className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Real-Time Price & Day Return Hero */}
              <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Live Market Price</span>
                  <span className="font-mono text-[22px] font-bold text-[#d4e4fa] mt-0.5">
                    ₹{activeStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`font-mono text-[14px] font-bold flex items-center gap-0.5 ${
                      activeStock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {activeStock.changePercent >= 0 ? 'north_east' : 'south_east'}
                    </span>
                    {activeStock.changePercent >= 0 ? '+' : ''}
                    {activeStock.changePercent}%
                  </span>
                  <span
                    className={`font-mono text-[11px] ${
                      activeStock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {activeStock.changePercent >= 0 ? '+' : ''}₹{activeStock.changeValue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 52-Week Range Bar */}
              <div className="bg-[#010f1f] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] text-[#8c909f] font-mono">
                  <span>52W Low: ₹{activeStock.week52Low}</span>
                  <span className="text-[#adc6ff] font-semibold">52-Week Range</span>
                  <span>52W High: ₹{activeStock.week52High}</span>
                </div>
                <div className="w-full h-2 bg-[#1c2b3c] rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#4d8eff] to-[#4edea3] rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((activeStock.price - activeStock.week52Low) /
                            (activeStock.week52High - activeStock.week52Low)) *
                            100
                        )
                      )}%`
                    }}
                  />
                </div>
              </div>

              {/* 4-Metric Fundamentals Bento */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-sans">Market Capitalization</span>
                  <span className="font-bold text-[#d4e4fa] mt-1 text-[13px]">
                    ₹{activeStock.marketCapTrillion} Lakh Cr
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-sans">Price to Earnings (P/E)</span>
                  <span className="font-bold text-[#adc6ff] mt-1 text-[13px]">
                    {activeStock.peRatio}x
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-sans">24h Traded Volume</span>
                  <span className="font-bold text-[#d4e4fa] mt-1 text-[13px]">
                    {activeStock.volumeMillion}M shares
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex flex-col">
                  <span className="text-[10px] text-[#8c909f] uppercase font-sans">Stock Beta (vs Nifty)</span>
                  <span className="font-bold text-[#4edea3] mt-1 text-[13px]">
                    {activeStock.beta}
                  </span>
                </div>
              </div>

              {/* AI Forecast & Signal Strip */}
              <div className="p-3 rounded-xl bg-[#0d1c2d] border border-[#1c2b3c] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">memory</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#d4e4fa] font-semibold">AI Next-Day Outlook</span>
                    <span className="text-[10px] text-[#8c909f]">Ensemble Model Consensus</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeStock.direction === 'UP'
                        ? 'bg-[#00a572]/20 text-[#4edea3]'
                        : 'bg-[#93000a]/20 text-[#ffb4ab]'
                    }`}
                  >
                    PREDICTED {activeStock.direction} ({activeStock.aiConfidence}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveStock(null)}
                className="h-9 px-3 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#c2c6d6] text-[12px] font-semibold transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  handleOpenStockAnalysis(activeStock.ticker);
                  setActiveStock(null);
                }}
                className="h-9 px-4 rounded-lg bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <span>Full Candlestick Analysis</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
