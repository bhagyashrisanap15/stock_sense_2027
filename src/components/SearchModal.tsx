import React, { useState, useMemo } from 'react';
import { StockData } from '../types';
import { HOTLINKED_ASSETS, getAllIndianStocks, getStockData, STOCKS_DATA } from '../data/stocks';

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
    { id: 'all', label: 'All NSE / BSE Equities', icon: 'check' },
    { id: 'IT / Tech', label: 'IT & Software', icon: 'memory' },
    { id: 'Banking', label: 'Banks & NBFCs' },
    { id: 'Auto & Metals', label: 'Auto & Metals' },
    { id: 'Bullish (UP)', label: 'AI Bullish', dotColor: '#4edea3' },
    { id: 'Neutral', label: 'AI Neutral', dotColor: '#adc6ff' },
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
      return s.sector.includes('Energy') || s.sector.includes('Oil') || s.sector.includes('Petro');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#051424] flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 pt-safe bg-[#051424]/90 backdrop-blur-xl border-b border-[#1c2b3c] shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={onClose}
              className="w-10 h-10 -ml-1 flex items-center justify-center text-[#c2c6d6] hover:text-[#d4e4fa] rounded-lg hover:bg-[#1c2b3c] transition-colors"
              aria-label="Close search modal"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <div className="w-7 h-7 rounded bg-[#1c2b3c] p-1 flex items-center justify-center shrink-0 border border-[#273647]">
              <span className="material-symbols-outlined text-[18px] text-[#4d8eff]">analytics</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[#d4e4fa] font-semibold text-[17px] tracking-tight leading-none truncate">
                Search Modal
              </h1>
              <span className="text-[#c2c6d6] text-[11px] leading-tight truncate mt-0.5">
                StockSense Intelligence
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <img
              src={HOTLINKED_ASSETS.profile}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#4d8eff]/30"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Search Bar Container */}
        <div className="relative flex items-center w-full bg-[#122131] rounded-xl shadow-md border border-[#1c2b3c]">
          <div className="pl-3.5 pr-2 flex items-center justify-center text-[#adc6ff] pointer-events-none">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stock by name, symbol, or ISIN (e.g. RELIANCE, TCS)..."
            className="w-full bg-transparent py-3 pr-2 font-mono text-[13px] text-[#d4e4fa] focus:outline-none placeholder:text-[#8c909f]"
            autoFocus
          />
          <div className="flex items-center space-x-1.5 pr-3">
            {query && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1c2b3c] text-[#adc6ff] text-[11px] font-semibold tracking-wide">
                QUERY: {query.toUpperCase()}
              </span>
            )}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647] transition-colors"
                title="Clear input"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Execution Micro-pill (FastAPI Telemetry) */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#c2c6d6]">
          <div className="flex items-center space-x-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="text-[#4edea3] font-semibold">18ms</span>
            <span>•</span>
            <span className="text-[#8c909f]">via FastAPI /api/stocks/search</span>
          </div>
          <span className="text-[#8c909f] font-mono">
            {filteredStocks.length} Instruments Found
          </span>
        </div>

        {/* Horizontal Scrollable Filter Ribbons */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {filterOptions.map((f) => {
            const isActive = selectedFilter === f.id || (f.id === 'all' && selectedFilter === 'all');
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id === selectedFilter ? 'all' : f.id)}
                className={`flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#4d8eff] text-[#00285d] font-semibold shadow-sm'
                    : 'bg-[#1c2b3c] text-[#d4e4fa] hover:bg-[#273647]'
                }`}
              >
                {f.icon === 'memory' && (
                  <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">memory</span>
                )}
                {f.dotColor && (
                  <span
                    className="w-2 h-2 rounded-full inline-block mr-0.5"
                    style={{ backgroundColor: f.dotColor }}
                  />
                )}
                <span>{f.label}</span>
                {isActive && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Recent Searches & Trending History Strip */}
        {recentSearches.length > 0 && (
          <section className="flex flex-col space-y-1 bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c]/80">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center space-x-1.5 text-[#c2c6d6] text-[11px] uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">history</span>
                <span>Recent Searches & Trending</span>
              </div>
              <button
                onClick={() => setRecentSearches([])}
                className="text-[#adc6ff] hover:text-[#d4e4fa] text-[11px] font-medium transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {recentSearches.map((item) => (
                <div
                  key={item.ticker}
                  className="flex items-center space-x-1.5 bg-[#122131] px-2.5 py-1.5 rounded-lg text-[#d4e4fa] text-[12px] border border-[#1c2b3c]"
                >
                  <button
                    onClick={() => {
                      const stock = getStockData(item.ticker);
                      if (stock) handleSelect(stock);
                    }}
                    className="font-mono hover:text-[#adc6ff] transition-colors font-medium"
                  >
                    {item.ticker}
                  </button>
                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      item.isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {item.change}
                  </span>
                  <button
                    onClick={() => removeRecent(item.ticker)}
                    className="text-[#8c909f] hover:text-[#ffb4ab] transition-colors ml-0.5"
                    aria-label={`Remove ${item.ticker}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Search Results Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">troubleshoot</span>
            <h2 className="text-[#d4e4fa] font-semibold text-[15px]">Verified Match Results</h2>
          </div>
          <span className="text-[#c2c6d6] text-[11px] font-mono">Models: Daily Close (v4.2)</span>
        </div>

        {/* Result Cards Stack */}
        <div className="flex flex-col space-y-3">
          {filteredStocks.map((stock) => {
            const isWatchlisted = watchlist.includes(stock.ticker);
            const isUp = stock.direction === 'UP';
            const isDown = stock.direction === 'DOWN';
            const isNeutral = stock.direction === 'NEUTRAL';

            return (
              <div
                key={stock.ticker}
                className="bg-[#122131] p-4 rounded-xl shadow-sm border border-[#1c2b3c] flex flex-col space-y-3 relative overflow-hidden transition-all hover:border-[#273647]"
              >
                {/* Accent Top Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isUp
                      ? 'bg-[#4edea3]'
                      : isDown
                      ? 'bg-[#ffb4ab]'
                      : 'bg-[#adc6ff]'
                  }`}
                />

                {/* Header Row: Symbol & Price */}
                <div className="flex items-start justify-between min-w-0 pt-1">
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[17px] text-[#d4e4fa] tracking-tight">
                        {stock.ticker}
                      </span>
                      <span className="text-[#c2c6d6] text-[13px] truncate">
                        • {stock.name}
                      </span>
                    </div>
                    <span className="text-[#8c909f] text-[11px] font-mono mt-0.5">
                      {stock.exchange}: {stock.ticker}
                    </span>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-bold text-[16px] text-[#d4e4fa] font-mono">
                      ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`font-mono text-[12px] flex items-center space-x-0.5 ${
                        stock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {stock.changePercent >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      <span>
                        {stock.changePercent >= 0 ? '+' : ''}
                        {stock.changePercent}% intraday
                      </span>
                    </span>
                  </div>
                </div>

                {/* Metadata & Sector Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#c2c6d6]">
                  <span className="px-2 py-0.5 rounded bg-[#1c2b3c] text-[#d4e4fa]">
                    {stock.sector}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#1c2b3c] text-[#c2c6d6]">
                    {stock.marketCap}
                  </span>
                </div>

                {/* Machine Learning Predictive Signal Block */}
                <div className="bg-[#010f1f]/80 p-3 rounded-lg flex flex-col space-y-2 border border-[#1c2b3c]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isUp ? 'bg-[#4edea3]' : isDown ? 'bg-[#ffb4ab]' : 'bg-[#adc6ff]'
                        }`}
                      />
                      <span
                        className={`text-[12px] font-semibold tracking-wide ${
                          isUp ? 'text-[#4edea3]' : isDown ? 'text-[#ffb4ab]' : 'text-[#adc6ff]'
                        }`}
                      >
                        {stock.directionLabel}
                      </span>
                    </div>
                    <span className="text-[#c2c6d6] text-[11px] font-mono">
                      {stock.confidence}% Conf. • {stock.activeModel}
                    </span>
                  </div>

                  {/* SHAP Factor Highlight */}
                  {stock.shapFactors.length > 0 && (
                    <div className="pt-1 flex flex-col space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8c909f]">Key Factor Attribution (SHAP)</span>
                        <span className="text-[#4edea3] font-mono font-medium">
                          {isUp ? '+0.47 Net Boost' : '-0.03 delta'}
                        </span>
                      </div>
                      <div className="bg-[#1c2b3c] rounded p-2 text-[12px] space-y-1">
                        {stock.shapFactors.slice(0, 2).map((factor, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-[#c2c6d6] flex items-center space-x-1 truncate max-w-[200px]">
                              <span
                                className={`material-symbols-outlined text-[14px] ${
                                  factor.impact >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                                }`}
                              >
                                {factor.impact >= 0 ? 'north_east' : 'south_east'}
                              </span>
                              <span className="truncate">{factor.feature}</span>
                            </span>
                            <span
                              className={`font-mono text-[11px] font-semibold ${
                                factor.impact >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                              }`}
                            >
                              {factor.impact >= 0 ? '+' : ''}
                              {factor.impact.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Institutional Risk Gauge */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="material-symbols-outlined text-[14px] text-[#c2c6d6]">shield</span>
                      <span className="text-[#c2c6d6] text-[11px]">Risk Assessment:</span>
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          stock.riskScore < 35
                            ? 'text-[#4edea3]'
                            : stock.riskScore < 55
                            ? 'text-[#adc6ff]'
                            : 'text-[#ffb4ab]'
                        }`}
                      >
                        {stock.riskCategory} RISK ({stock.riskScore}/100)
                      </span>
                    </div>
                    <div className="w-16 h-1.5 bg-[#1c2b3c] rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full ${
                          stock.riskScore < 35
                            ? 'bg-[#4edea3]'
                            : stock.riskScore < 55
                            ? 'bg-[#4d8eff]'
                            : 'bg-[#ffb4ab]'
                        }`}
                        style={{ width: `${stock.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleSelect(stock)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] font-semibold text-[13px] flex items-center justify-center space-x-1 shadow active:scale-[0.99] transition-all"
                  >
                    <span>Analyze Stock</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => onToggleWatchlist(stock.ticker)}
                    className={`py-2 px-3 rounded-lg text-[13px] font-medium flex items-center space-x-1 transition-all ${
                      isWatchlisted
                        ? 'bg-[#00a572] text-[#00311f]'
                        : 'bg-[#1c2b3c] text-[#c2c6d6] hover:text-[#d4e4fa]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isWatchlisted ? 'check' : 'bookmark_add'}
                    </span>
                    <span>{isWatchlisted ? 'Watchlisted' : '+ Watchlist'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compliance & Academic Model Disclaimer */}
        <section className="bg-[#010f1f] p-3 rounded-lg flex items-start space-x-2 mt-3 text-[#8c909f] border border-[#1c2b3c]">
          <span className="material-symbols-outlined text-[18px] text-[#adc6ff] flex-shrink-0 mt-0.5">
            info
          </span>
          <p className="text-[11px] leading-relaxed">
            <strong className="text-[#c2c6d6]">Academic Modeling Disclaimer:</strong> StockSense search returns verified NSE/BSE listed equities for quantitative simulation and backtesting purposes. Predictions represent non-advisory statistical inferences generated through ensemble machine learning models.
          </p>
        </section>
      </main>
    </div>
  );
};
