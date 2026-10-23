import React, { useState } from 'react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA, getStockData } from '../data/stocks';
import { MarketCorrelation } from '../components/MarketCorrelation';

interface WatchlistScreenProps {
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
  onOpenSearch: () => void;
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  watchlist,
  onToggleWatchlist,
  onSelectStock,
  onNavigate,
  onOpenSearch
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'correlation'>('cards');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sectors = ['All', 'Banking & Finance', 'IT & Telecom', 'Automobile & EV', 'Energy', 'FMCG & Consumer', 'Metals'];

  const watchedStocks = watchlist.map((t) => getStockData(t));

  const displayedStocks = watchedStocks.filter((s) => {
    const matchesQuery =
      searchQuery === '' ||
      s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      selectedSector === 'All' ||
      (selectedSector === 'IT & Telecom' && (s.sector.includes('IT') || s.sector.includes('Telecom'))) ||
      (selectedSector === 'Banking & Finance' && (s.sector.includes('Bank') || s.sector.includes('Finance'))) ||
      (selectedSector === 'Automobile & EV' && s.sector.includes('Auto')) ||
      (selectedSector === 'FMCG & Consumer' && s.sector.includes('FMCG')) ||
      (selectedSector === 'Energy' && s.sector.includes('Energy')) ||
      (selectedSector === 'Metals' && (s.sector.includes('Metal') || s.sector.includes('Steel')));

    return matchesQuery && matchesSector;
  });

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[20px] font-bold text-[#d4e4fa] tracking-tight">
            Institutional Watchlist
          </h1>
          <p className="text-[12px] text-[#c2c6d6]">
            Real-time inference feeds, confidence scores & factor telemetry
          </p>
        </div>
        <button
          onClick={onOpenSearch}
          className="h-9 px-3 bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Add Equities</span>
        </button>
      </div>

      {/* View Switcher: List vs Correlation */}
      <div className="grid grid-cols-2 p-1 bg-[#0d1c2d] rounded-xl border border-[#1c2b3c]">
        <button
          onClick={() => setViewMode('cards')}
          className={`py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 transition-all ${
            viewMode === 'cards'
              ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
              : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">format_list_bulleted</span>
          <span>Watched Assets ({displayedStocks.length})</span>
        </button>
        <button
          onClick={() => setViewMode('correlation')}
          className={`py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 transition-all ${
            viewMode === 'correlation'
              ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
              : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">hub</span>
          <span>Market Correlation (Recharts)</span>
        </button>
      </div>

      {viewMode === 'correlation' ? (
        <MarketCorrelation
          watchlist={watchlist}
          currentStock={displayedStocks[0] || STOCKS_DATA.RELIANCE}
          onSelectStock={onSelectStock}
        />
      ) : (
        <>
          {/* Quick Search & Filters */}
          <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter watched tickers..."
            className="w-full h-10 pl-9 pr-3 bg-[#122131] rounded-xl text-[13px] text-[#d4e4fa] placeholder:text-[#8c909f] border border-[#1c2b3c] focus:outline-none focus:border-[#4d8eff]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium shrink-0 transition-all ${
                selectedSector === sec
                  ? 'bg-[#adc6ff] text-[#002e6a] font-semibold shadow-sm'
                  : 'bg-[#1c2b3c] text-[#c2c6d6] hover:text-[#d4e4fa]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Watched Equities List */}
      {displayedStocks.length === 0 ? (
        <div className="bg-[#122131] rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 border border-[#1c2b3c]">
          <span className="material-symbols-outlined text-[36px] text-[#8c909f]">
            folder_off
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-[#d4e4fa]">
              No stocks matched in your watchlist
            </span>
            <span className="text-[12px] text-[#c2c6d6] mt-0.5">
              Add equities to track their automated daily forecasts.
            </span>
          </div>
          <button
            onClick={onOpenSearch}
            className="h-10 px-4 rounded-lg bg-[#4d8eff] text-[#00285d] font-semibold text-[13px] flex items-center gap-1.5 shadow-sm mt-1"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Browse NSE/BSE Universe</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedStocks.map((stock) => {
            const isUp = stock.direction === 'UP';
            const isDown = stock.direction === 'DOWN';

            return (
              <div
                key={stock.ticker}
                className="bg-[#122131] rounded-xl p-4 shadow-sm border border-[#1c2b3c] hover:border-[#273647] transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#1c2b3c] flex items-center justify-center font-bold text-[#adc6ff] text-[16px] shrink-0 border border-[#273647]">
                      {stock.ticker.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[16px] text-[#d4e4fa]">
                          {stock.ticker}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#c2c6d6] text-[10px] font-semibold">
                          {stock.exchange}
                        </span>
                      </div>
                      <span className="text-[12px] text-[#c2c6d6] truncate">
                        {stock.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[15px] font-bold text-[#d4e4fa]">
                        ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-semibold flex items-center gap-0.5 ${
                          stock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {stock.changePercent >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'}
                        </span>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleWatchlist(stock.ticker)}
                      className="w-8 h-8 rounded flex items-center justify-center text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors"
                      title="Remove from watchlist"
                    >
                      <span className="material-symbols-outlined text-[18px]">bookmark_remove</span>
                    </button>
                  </div>
                </div>

                {/* Micro Badges */}
                <div className="flex items-center justify-between bg-[#0d1c2d] p-2.5 rounded-lg border border-[#1c2b3c] text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isUp
                          ? 'bg-[#00a572]/20 text-[#4edea3]'
                          : isDown
                          ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                          : 'bg-[#3131c0]/30 text-[#b0b2ff]'
                      }`}
                    >
                      {stock.directionLabel}
                    </span>
                    <span className="text-[#c2c6d6] font-mono font-medium">
                      {stock.confidence}% Conf.
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8c909f]">Risk:</span>
                    <span
                      className={`font-mono font-bold ${
                        stock.riskScore < 35
                          ? 'text-[#4edea3]'
                          : stock.riskScore < 55
                          ? 'text-[#adc6ff]'
                          : 'text-[#ffb4ab]'
                      }`}
                    >
                      {stock.riskScore}/100
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    onClick={() => {
                      onSelectStock(stock);
                      onNavigate('markets');
                    }}
                    className="h-8 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#d4e4fa] text-[12px] font-medium flex items-center justify-center gap-1 transition-colors border border-[#273647]"
                  >
                    <span className="material-symbols-outlined text-[15px]">trending_up</span>
                    <span>View Chart</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectStock(stock);
                      onNavigate('ai-predict');
                    }}
                    className="h-8 rounded bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#002e6a] text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">psychology</span>
                    <span>Explain AI (XAI)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
};
