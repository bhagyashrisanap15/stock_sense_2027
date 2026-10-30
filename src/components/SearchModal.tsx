import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  History,
  TrendingUp,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { StockData } from '../types';
import { getAllIndianStocks, getStockData } from '../data/stocks';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (stock: StockData) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  watchlist,
  onToggleWatchlist
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState([
    { ticker: 'RELIANCE', change: '+1.42%', isPositive: true },
    { ticker: 'TCS', change: '+0.85%', isPositive: true },
    { ticker: 'HDFCBANK', change: '+1.10%', isPositive: true },
    { ticker: 'ICICIBANK', change: '+1.45%', isPositive: true },
    { ticker: 'SBIN', change: '+1.95%', isPositive: true }
  ]);

  const allStocks = useMemo(() => getAllIndianStocks(), []);

  if (!isOpen) return null;

  const filterOptions = [
    { id: 'all', label: 'All NSE / BSE Equities' },
    { id: 'IT / Tech', label: 'IT & Software' },
    { id: 'Banking', label: 'Banks & NBFCs' },
    { id: 'Auto & Metals', label: 'Auto & Metals' },
    { id: 'Bullish (UP)', label: 'AI Bullish' },
    { id: 'Neutral', label: 'AI Neutral' },
    { id: 'Energy', label: 'Energy & Petrochem' }
  ];

  // Filter stocks based on query and selected category
  const filteredStocks = allStocks.filter((s) => {
    const matchesQuery =
      query.trim() === '' ||
      s.ticker.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (selectedFilter === 'IT / Tech') {
      return s.sector.includes('IT') || s.sector.includes('Telecom');
    }
    if (selectedFilter === 'Banking') {
      return s.sector.includes('Bank') || s.sector.includes('Finance');
    }
    if (selectedFilter === 'Auto & Metals') {
      return s.sector.includes('Auto') || s.sector.includes('Metal') || s.sector.includes('Steel');
    }
    if (selectedFilter === 'Energy') {
      return s.sector.includes('Energy') || s.sector.includes('Power') || s.sector.includes('Oil');
    }
    if (selectedFilter === 'Bullish (UP)') {
      return s.direction === 'UP';
    }
    if (selectedFilter === 'Neutral') {
      return s.direction === 'NEUTRAL';
    }
    return true;
  });

  const handleSelect = (stock: StockData) => {
    onSelectStock(stock);
    onClose();
  };

  const removeRecent = (ticker: string) => {
    setRecentSearches((prev) => prev.filter((item) => item.ticker !== ticker));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#121c2d]/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-200/60 dark:border-teal-800">
              <Search className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Search Indian Equities
              </h2>
              <span className="text-xs text-slate-400">
                Live NSE/BSE price lookup & AI forecast
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex flex-col gap-3 shrink-0">
          <div className="relative flex items-center w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by company name, ticker or sector (e.g. Reliance, TCS, HDFC)..."
              className="w-full h-12 pl-11 pr-20 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {filterOptions.map((f) => {
              const isActive = selectedFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(isActive ? 'all' : f.id)}
                  className={`shrink-0 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Recent Searches Strip */}
          {recentSearches.length > 0 && !query && (
            <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <History className="w-3 h-3" />
                Recent:
              </span>
              <div className="flex items-center gap-1.5">
                {recentSearches.map((item) => (
                  <div
                    key={item.ticker}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono border border-slate-200/60 dark:border-slate-700"
                  >
                    <button
                      onClick={() => {
                        const stock = getStockData(item.ticker);
                        if (stock) handleSelect(stock);
                      }}
                      className="font-bold text-slate-800 dark:text-slate-200 hover:text-teal-600 cursor-pointer"
                    >
                      {item.ticker}
                    </button>
                    <span className={`text-[11px] font-semibold ${item.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.change}
                    </span>
                    <button
                      onClick={() => removeRecent(item.ticker)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stock Results Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-2.5 min-h-[240px]">
          {filteredStocks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredStocks.map((stock) => {
                const isWatchlisted = watchlist.includes(stock.ticker);
                const isPos = stock.changePercent >= 0;

                return (
                  <div
                    key={stock.ticker}
                    onClick={() => handleSelect(stock)}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5 min-w-0 pr-2">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold font-mono text-xs border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                          {stock.ticker.slice(0, 3)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                              {stock.ticker}
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {stock.exchange}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {stock.name}
                          </span>
                          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                            {stock.sector}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          ₹{stock.price.toFixed(2)}
                        </span>
                        <span
                          className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${
                            isPos ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        AI: <strong className="text-slate-700 dark:text-slate-300">{stock.direction}</strong> ({stock.confidence}%)
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(stock.ticker);
                          }}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                            isWatchlisted
                              ? 'text-teal-600 bg-teal-50 dark:bg-teal-950/40'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                          title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          {isWatchlisted ? (
                            <BookmarkCheck className="w-4 h-4 text-teal-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <span className="text-teal-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No matching Indian equities found
              </span>
              <p className="text-xs text-slate-400 max-w-sm">
                Try searching for company names like "Tata", "Reliance", "Infosys", or sector names like "Banking".
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-50/50 dark:bg-[#121c2d]/50 shrink-0">
          <span>{filteredStocks.length} Indian Equities Loaded</span>
          <span className="font-mono">Press ESC or click Outside to Close</span>
        </div>

      </div>
    </div>
  );
};
