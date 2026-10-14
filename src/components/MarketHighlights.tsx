import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService, MarketHighlightItem } from '../services/api';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA } from '../data/stocks';

interface MarketHighlightsProps {
  onSelectStock?: (stock: StockData) => void;
  onNavigate?: (tab: ScreenTab) => void;
}

export const MarketHighlights: React.FC<MarketHighlightsProps> = ({
  onSelectStock,
  onNavigate
}) => {
  const [headlines, setHeadlines] = useState<MarketHighlightItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSentiment, setActiveSentiment] = useState<'all' | 'BULLISH' | 'NEUTRAL' | 'BEARISH'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('hl-1');

  const categories = [
    { id: 'all', label: 'All Highlights' },
    { id: 'breaking', label: '⚡ Breaking' },
    { id: 'macro', label: 'Macro & RBI' },
    { id: 'tech & ai', label: 'Tech & AI' },
    { id: 'banking', label: 'Banking' },
    { id: 'energy', label: 'Energy' },
    { id: 'regulatory', label: 'SEBI / Regulatory' }
  ];

  const fetchHighlights = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await apiService.getMarketHighlights({
        category: activeCategory,
        sentiment: activeSentiment !== 'all' ? activeSentiment : undefined,
        query: searchQuery
      });
      setHeadlines(data);
      const now = new Date();
      setLastRefreshed(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    } catch (err) {
      console.error('Failed to fetch market highlights:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [activeCategory, activeSentiment, searchQuery]);

  // Initial and reactive fetch
  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  // Periodic simulated auto-poll every 45s if autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchHighlights(true);
    }, 45000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchHighlights]);

  // Filtered view counts
  const counts = useMemo(() => {
    const bullish = headlines.filter((h) => h.sentiment === 'BULLISH').length;
    const neutral = headlines.filter((h) => h.sentiment === 'NEUTRAL').length;
    const bearish = headlines.filter((h) => h.sentiment === 'BEARISH').length;
    return { all: headlines.length, bullish, neutral, bearish };
  }, [headlines]);

  // Helper for category badge styling
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Breaking':
        return 'bg-[#ff5449]/20 text-[#ff897d] border-[#ff5449]/40';
      case 'Macro':
        return 'bg-[#4d8eff]/15 text-[#adc6ff] border-[#4d8eff]/30';
      case 'Tech & AI':
        return 'bg-[#00e5ff]/15 text-[#7dd3fc] border-[#00e5ff]/30';
      case 'Banking':
        return 'bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/30';
      case 'Energy':
        return 'bg-[#e5a000]/20 text-[#ffd279] border-[#e5a000]/40';
      case 'Regulatory':
        return 'bg-[#c0c1ff]/20 text-[#c0c1ff] border-[#c0c1ff]/30';
      default:
        return 'bg-[#1c2b3c] text-[#c2c6d6] border-[#273647]';
    }
  };

  const getSentimentBadge = (sentiment: string, score: number) => {
    if (sentiment === 'BULLISH') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/35">
          <span className="material-symbols-outlined text-[12px]">trending_up</span>
          BULLISH +{Math.round(score * 100)}%
        </span>
      );
    }
    if (sentiment === 'BEARISH') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#93000a]/30 text-[#ffb4ab] border border-[#93000a]/50">
          <span className="material-symbols-outlined text-[12px]">trending_down</span>
          BEARISH {Math.round(score * 100)}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#1c2b3c] text-[#adc6ff] border border-[#273647]">
        <span className="material-symbols-outlined text-[12px]">horizontal_rule</span>
        NEUTRAL
      </span>
    );
  };

  const handleStockClick = (ticker: string) => {
    const cleanTicker = ticker.split(' ')[0].toUpperCase();
    if (STOCKS_DATA[cleanTicker] && onSelectStock) {
      onSelectStock(STOCKS_DATA[cleanTicker]);
      if (onNavigate) {
        onNavigate('markets');
      }
    }
  };

  return (
    <article className="bg-[#122131] rounded-2xl p-4 sm:p-5 shadow-sm border border-[#1c2b3c] flex flex-col gap-4 relative overflow-hidden transition-all">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-[#4d8eff]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Title, Live Status Indicator & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c2b3c] relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center shrink-0 border border-[#4d8eff]/30 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">newspaper</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[16px] font-bold text-[#d4e4fa] tracking-tight">
                Market Highlights
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00a572]/15 text-[#4edea3] text-[10px] font-mono font-semibold border border-[#00a572]/30 gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                Simulated Wire
              </span>
            </div>
            <p className="text-[11px] text-[#8c909f] truncate">
              Real-time institutional newsfeed & algorithmic impact attributions
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {/* Last Refreshed Time */}
          <span className="text-[11px] font-mono text-[#8c909f] hidden md:inline">
            Refreshed: {lastRefreshed}
          </span>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh((prev) => !prev)}
            title={autoRefresh ? 'Auto-refresh active (45s)' : 'Auto-refresh paused'}
            className={`h-8 px-2.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all border ${
              autoRefresh
                ? 'bg-[#00a572]/15 text-[#4edea3] border-[#00a572]/30'
                : 'bg-[#0d1c2d] text-[#8c909f] border-[#1c2b3c] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {autoRefresh ? 'sync' : 'sync_disabled'}
            </span>
            <span className="hidden sm:inline">Auto 45s</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchHighlights(true)}
            disabled={isRefreshing || loading}
            aria-label="Refresh headlines"
            className="h-8 px-2.5 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] hover:text-white text-[11px] font-semibold flex items-center gap-1.5 border border-[#273647] shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[15px] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Navigate to full sentiment analysis workspace */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('news-sentiment')}
              className="h-8 px-2.5 rounded-lg bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#002e6a] text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <span>Sentiment Hub</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Controls Bar: Category Chips, Sentiment Filters, & Search Bar */}
      <div className="flex flex-col gap-2.5 relative z-10">
        {/* Search & Sentiment Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Quick Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c909f] text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news by ticker or keyword (e.g. NIFTY, RBI, AI, Jamnagar)..."
              className="w-full h-8 pl-8 pr-7 bg-[#0d1c2d] text-[#d4e4fa] placeholder:text-[#8c909f] text-[12px] rounded-lg border border-[#1c2b3c] focus:outline-none focus:ring-1 focus:ring-[#4d8eff] transition-colors"
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

          {/* Sentiment Filter Pills */}
          <div className="flex items-center gap-1 bg-[#0d1c2d] p-1 rounded-lg border border-[#1c2b3c] shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveSentiment('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                activeSentiment === 'all'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setActiveSentiment('BULLISH')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                activeSentiment === 'BULLISH'
                  ? 'bg-[#00a572]/20 text-[#4edea3] shadow-sm'
                  : 'text-[#8c909f] hover:text-[#4edea3]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              Bullish ({counts.bullish})
            </button>
            <button
              onClick={() => setActiveSentiment('NEUTRAL')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                activeSentiment === 'NEUTRAL'
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm'
                  : 'text-[#8c909f] hover:text-[#adc6ff]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]"></span>
              Neutral ({counts.neutral})
            </button>
            <button
              onClick={() => setActiveSentiment('BEARISH')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                activeSentiment === 'BEARISH'
                  ? 'bg-[#93000a]/30 text-[#ffb4ab] shadow-sm'
                  : 'text-[#8c909f] hover:text-[#ffb4ab]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
              Bearish ({counts.bearish})
            </button>
          </div>
        </div>

        {/* Horizontal Category Scroll Track */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#adc6ff] text-[#002e6a] font-bold shadow-sm'
                    : 'bg-[#0d1c2d] text-[#c2c6d6] hover:text-[#d4e4fa] border border-[#1c2b3c]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Headlines List Area */}
      <div className="flex flex-col gap-2.5 relative z-10">
        {loading ? (
          // Skeleton Loader
          <div className="flex flex-col gap-2.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-[#0d1c2d] rounded-xl p-3.5 border border-[#1c2b3c] animate-pulse flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-16 h-5 rounded bg-[#1c2b3c]" />
                  <div className="w-24 h-5 rounded bg-[#1c2b3c]" />
                  <div className="w-16 h-5 rounded bg-[#1c2b3c] ml-auto" />
                </div>
                <div className="w-3/4 h-5 rounded bg-[#1c2b3c] mt-1" />
                <div className="w-full h-4 rounded bg-[#1c2b3c]/60" />
              </div>
            ))}
          </div>
        ) : headlines.length === 0 ? (
          // Empty State
          <div className="bg-[#0d1c2d] rounded-xl p-8 border border-[#1c2b3c] text-center flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-[#8c909f]">search_off</span>
            <span className="text-[14px] font-semibold text-[#d4e4fa]">
              No headlines match your current filters
            </span>
            <p className="text-[12px] text-[#8c909f] max-w-sm">
              Try resetting the search keyword or selecting "All Highlights" to see the full market wire.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setActiveSentiment('all');
              }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] text-[12px] font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          headlines.map((item) => {
            const isExpanded = expandedId === item.id;
            const hasStock = !!STOCKS_DATA[item.ticker.split(' ')[0]];

            return (
              <article
                key={item.id}
                className={`bg-[#0d1c2d] hover:bg-[#142336] rounded-xl p-3.5 border transition-all duration-200 flex flex-col gap-2 cursor-pointer ${
                  isExpanded
                    ? 'border-[#4d8eff]/50 shadow-md ring-1 ring-[#4d8eff]/20'
                    : 'border-[#1c2b3c] hover:border-[#273647]'
                }`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                {/* Meta Row: Ticker, Category, Sentiment, Impact & Time */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Ticker / Entity Pill */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStockClick(item.ticker);
                      }}
                      title={hasStock ? `Click to inspect ${item.ticker} in terminal` : item.companyOrTopic}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider border transition-all ${
                        hasStock
                          ? 'bg-[#1c2b3c] text-[#adc6ff] hover:bg-[#4d8eff] hover:text-[#00285d] border-[#273647]'
                          : 'bg-[#1c2b3c]/60 text-[#c2c6d6] border-[#273647]/50'
                      }`}
                    >
                      {item.ticker}
                    </button>

                    {/* Category Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>

                    {/* AI Impact Level */}
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                        item.aiImpactRating === 'HIGH'
                          ? 'bg-[#ff5449]/15 text-[#ff897d] border border-[#ff5449]/30'
                          : 'bg-[#1c2b3c] text-[#8c909f]'
                      }`}
                    >
                      {item.aiImpactRating} IMPACT
                    </span>
                  </div>

                  {/* Sentiment Badge & Time */}
                  <div className="flex items-center gap-2 ml-auto">
                    {getSentimentBadge(item.sentiment, item.sentimentScore)}
                    <span className="text-[11px] font-mono text-[#8c909f] shrink-0">
                      {item.publishedAt}
                    </span>
                  </div>
                </div>

                {/* Headline Title */}
                <h3 className="text-[13px] sm:text-[14px] font-bold text-[#d4e4fa] leading-snug group-hover:text-[#adc6ff] transition-colors">
                  {item.title}
                </h3>

                {/* Summary Snippet */}
                <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
                  {item.summary}
                </p>

                {/* Source & Toggle indicator */}
                <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c]/60 text-[11px] text-[#8c909f]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#adc6ff]">{item.source}</span>
                    <span>•</span>
                    <span>{item.readTime}</span>
                  </div>

                  <span className="flex items-center gap-0.5 text-[#8c909f] hover:text-[#adc6ff] transition-colors">
                    <span>{isExpanded ? 'Hide Impact Analysis' : 'Expand AI Impact'}</span>
                    <span
                      className={`material-symbols-outlined text-[15px] transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </span>
                </div>

                {/* Expanded AI Intelligence & Quant Impact Drawer */}
                {isExpanded && (
                  <div
                    className="mt-2 p-3 rounded-lg bg-[#081320] border border-[#1c2b3c] flex flex-col gap-2.5 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#4edea3] text-[18px] shrink-0 mt-0.5">
                        psychology
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-[#d4e4fa] uppercase tracking-wide">
                          Model Quant Attribution & Factor Impact
                        </span>
                        <p className="text-[12px] text-[#4edea3] mt-0.5 font-medium leading-snug">
                          {item.impactRationale}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1c2b3c] flex-wrap gap-2">
                      <span className="text-[11px] text-[#8c909f]">
                        Topic: <strong className="text-[#c2c6d6] font-semibold">{item.companyOrTopic}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {hasStock && onSelectStock && (
                          <button
                            onClick={() => handleStockClick(item.ticker)}
                            className="h-7 px-2.5 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] text-[11px] font-semibold flex items-center gap-1 transition-all"
                          >
                            <span>Inspect {item.ticker}</span>
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          </button>
                        )}
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('news-sentiment')}
                            className="h-7 px-2.5 rounded bg-[#4d8eff]/20 hover:bg-[#4d8eff]/30 text-[#adc6ff] text-[11px] font-semibold flex items-center gap-1 transition-all"
                          >
                            <span>News Sentiment</span>
                            <span className="material-symbols-outlined text-[13px]">insights</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Footer Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#1c2b3c] text-[11px] text-[#8c909f] relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
          <span>Showing {headlines.length} curated headlines • Calibrated with TreeSHAP Sentiment Weights</span>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('news-sentiment')}
            className="text-[#adc6ff] hover:underline font-semibold flex items-center gap-0.5"
          >
            <span>Open Full Sentiment Screener</span>
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
          </button>
        )}
      </div>
    </article>
  );
};
