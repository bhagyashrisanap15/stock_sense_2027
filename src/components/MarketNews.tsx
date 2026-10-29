import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ChevronRight,
  X,
  ExternalLink,
  ArrowRight,
  Filter
} from 'lucide-react';
import { NewsArticle, ScreenTab } from '../types';
import { fetchStockNews, fetchAllMarketHeadlines } from '../data/news';

interface MarketNewsProps {
  ticker?: string;
  stockName?: string;
  limit?: number;
  onNavigate?: (tab: ScreenTab) => void;
  showFilters?: boolean;
  compact?: boolean;
}

export const MarketNews: React.FC<MarketNewsProps> = ({
  ticker,
  stockName,
  limit = 6,
  onNavigate,
  showFilters = true,
  compact = false
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Macro' | 'Earnings' | 'Product' | 'Regulatory'>('All');
  const [newsScope, setNewsScope] = useState<'market' | 'stock'>(ticker ? 'market' : 'market');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  const loadHeadlines = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    else setLoading(true);

    try {
      let data: NewsArticle[] = [];
      if (newsScope === 'stock' && ticker) {
        data = await fetchStockNews(ticker);
      } else {
        data = await fetchAllMarketHeadlines();
      }
      setArticles(data);
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    } catch (err) {
      console.error('Failed to load market news headlines:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadHeadlines();
  }, [ticker, newsScope]);

  // Filter by category
  const filteredArticles = articles.filter((a) => {
    if (activeCategory === 'All') return true;
    return a.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const displayedArticles = limit ? filteredArticles.slice(0, limit) : filteredArticles;

  return (
    <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/60 shrink-0">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Latest Market News & Headlines
              </h3>
              <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                NSE • BSE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>Updated {lastUpdated}</span>
              <span>•</span>
              <span>Plain-language financial updates</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {ticker && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setNewsScope('market')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  newsScope === 'market'
                    ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Market
              </button>
              <button
                onClick={() => setNewsScope('stock')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  newsScope === 'stock'
                    ? 'bg-white dark:bg-[#121c2d] text-teal-700 dark:text-teal-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {ticker}
              </button>
            </div>
          )}

          <button
            onClick={() => loadHeadlines(true)}
            disabled={loading || isRefreshing}
            className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Refresh latest headlines"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('news-sentiment')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-0.5 pl-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      {showFilters && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {(['All', 'Macro', 'Earnings', 'Product', 'Regulatory'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? `All Headlines (${articles.length})` : cat}
            </button>
          ))}
        </div>
      )}

      {/* Headlines List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 animate-pulse flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="h-4 w-5/6 bg-slate-300 dark:bg-slate-600 rounded" />
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : displayedArticles.length === 0 ? (
        <div className="p-8 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <Newspaper className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No headlines found for category "{activeCategory}"
          </p>
          <p className="text-xs text-slate-400">
            Switch back to "All Headlines" to view recent market updates.
          </p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Show All Headlines
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedArticles.map((article) => {
            const isBullish = article.sentiment === 'BULLISH';
            const isBearish = article.sentiment === 'BEARISH';

            return (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <div className="flex flex-col gap-2">
                  {/* Top Metadata: Source, Timestamp, and Sentiment Pill */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {article.source}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{article.publishedAt}</span>
                      </span>
                    </div>

                    {/* Simple, Non-intrusive Sentiment Pill */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                        isBullish
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                          : isBearish
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {isBullish ? (
                        <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
                      ) : isBearish ? (
                        <TrendingDown className="w-2.5 h-2.5 text-rose-600" />
                      ) : (
                        <Minus className="w-2.5 h-2.5 text-slate-400" />
                      )}
                      <span>{isBullish ? 'Positive' : isBearish ? 'Cautious' : 'Neutral'}</span>
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h4>

                  {/* Summary Preview */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Footer Tag & Read More Prompt */}
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                      {article.category}
                    </span>
                    {article.ticker && (
                      <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                        {article.ticker}
                      </span>
                    )}
                  </div>

                  <span className="text-teal-600 dark:text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Read summary</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Reader for Selected Headline */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#121c2d] w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800/60">
                  {selectedArticle.source}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedArticle.publishedAt}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    selectedArticle.sentiment === 'BULLISH'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                      : selectedArticle.sentiment === 'BEARISH'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60'
                  }`}
                >
                  {selectedArticle.sentiment === 'BULLISH' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : selectedArticle.sentiment === 'BEARISH' ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  <span>
                    Market Impact:{' '}
                    {selectedArticle.sentiment === 'BULLISH'
                      ? 'Positive (Bullish)'
                      : selectedArticle.sentiment === 'BEARISH'
                      ? 'Negative (Bearish)'
                      : 'Neutral'}
                  </span>
                </span>
                <span className="text-xs text-slate-400">{selectedArticle.readTime}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {selectedArticle.title}
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Plain-English Summary
                </p>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedArticle.summary}
                </p>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-2">
                <p>
                  This headline provides context on ongoing developments in the Indian stock market. Market participants track news to understand company earnings, regulatory updates from SEBI or RBI, and broader sector momentum.
                </p>
                <p>
                  Remember that single news stories can cause short-term price reactions. Always review company fundamentals and avoid making impulsive trading decisions based on breaking headlines alone.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs text-slate-400 font-mono">
                Category: {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
