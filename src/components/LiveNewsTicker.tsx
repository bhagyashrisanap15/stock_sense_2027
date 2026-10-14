import React, { useState, useEffect, useRef } from 'react';
import { NewsArticle, StockData, ScreenTab } from '../types';
import { fetchAllMarketHeadlines } from '../data/news';
import { STOCKS_DATA } from '../data/stocks';

interface LiveNewsTickerProps {
  onSelectStock?: (stock: StockData) => void;
  onNavigate?: (tab: ScreenTab) => void;
}

export const LiveNewsTicker: React.FC<LiveNewsTickerProps> = ({
  onSelectStock,
  onNavigate
}) => {
  const [headlines, setHeadlines] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [filter, setFilter] = useState<'all' | 'bullish' | 'earnings'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const loadNews = async () => {
      try {
        const data = await fetchAllMarketHeadlines();
        if (mounted) {
          setHeadlines(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch headlines:', err);
        if (mounted) setLoading(false);
      }
    };

    loadNews();
    const interval = setInterval(loadNews, 45000); // 45s refresh
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredHeadlines = headlines.filter((item) => {
    if (filter === 'bullish') return item.sentiment === 'BULLISH';
    if (filter === 'earnings') return item.category === 'Earnings';
    return true;
  });

  // Manual scroll buttons
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const handleGoToStock = (ticker: string) => {
    const stock = STOCKS_DATA[ticker];
    if (stock && onSelectStock) {
      onSelectStock(stock);
      if (onNavigate) onNavigate('markets');
    }
    setSelectedArticle(null);
  };

  if (loading && headlines.length === 0) {
    return (
      <div className="w-full bg-[#091827] border-y border-[#1c2b3c] py-2 px-3 flex items-center gap-2 text-[11px] text-[#8c909f] font-mono">
        <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
        <span>Connecting to live NSE financial wire...</span>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full bg-[#081728]/95 backdrop-blur-md border-y border-[#1c2b3c] relative flex items-center h-10 select-none overflow-hidden group shadow-sm z-30"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Live Badge Pill */}
        <div className="flex items-center gap-2 px-3 h-full bg-[#0d1c2d] border-r border-[#1c2b3c] shrink-0 z-20 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5449] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5449]"></span>
            </span>
            <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#d4e4fa]">
              LIVE WIRE
            </span>
          </div>

          <span className="hidden sm:inline-block w-1 h-3 bg-[#1c2b3c] rounded" />

          {/* Quick Filter toggle */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-[#1c2b3c] text-[#adc6ff]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilter('bullish')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors ${
                filter === 'bullish'
                  ? 'bg-[#00a572]/20 text-[#4edea3]'
                  : 'text-[#8c909f] hover:text-[#4edea3]'
              }`}
            >
              BULLISH
            </button>
            <button
              onClick={() => setFilter('earnings')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors ${
                filter === 'earnings'
                  ? 'bg-[#c0c1ff]/20 text-[#c0c1ff]'
                  : 'text-[#8c909f] hover:text-[#c0c1ff]'
              }`}
            >
              EARNINGS
            </button>
          </div>
        </div>

        {/* Marquee Scrolling Content Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap h-full flex items-center relative"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div
            className={`flex items-center gap-6 px-4 ${
              isPaused ? '' : 'animate-marquee'
            }`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              animationDuration: `${Math.max(35, filteredHeadlines.length * 5)}s`
            }}
          >
            {/* Render 2 sets for seamless continuous looping marquee */}
            {[...filteredHeadlines, ...filteredHeadlines].map((article, idx) => {
              const isBullish = article.sentiment === 'BULLISH';
              const isBearish = article.sentiment === 'BEARISH';

              return (
                <div
                  key={`${article.id}-${idx}`}
                  onClick={() => handleArticleClick(article)}
                  className="inline-flex items-center gap-2 text-[11px] cursor-pointer hover:bg-[#122131] py-1 px-2 rounded-lg transition-colors border border-transparent hover:border-[#1c2b3c] shrink-0 group/item"
                >
                  {/* Ticker Symbol Pill */}
                  <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#adc6ff] border border-[#273647]">
                    {article.ticker}
                  </span>

                  {/* Sentiment icon / indicator */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isBullish
                        ? 'bg-[#4edea3]'
                        : isBearish
                        ? 'bg-[#ffb4ab]'
                        : 'bg-[#c0c1ff]'
                    }`}
                  />

                  {/* Headline Title */}
                  <span className="text-[#d4e4fa] font-medium group-hover/item:text-[#adc6ff] group-hover/item:underline transition-colors max-w-sm sm:max-w-md truncate">
                    {article.title}
                  </span>

                  {/* Category Pill */}
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-[#0d1c2d] text-[#8c909f] font-mono">
                    {article.category}
                  </span>

                  {/* Timestamp */}
                  <span className="text-[10px] text-[#8c909f] font-mono">
                    {article.publishedAt}
                  </span>

                  {/* Bullet divider */}
                  <span className="text-[#1c2b3c] ml-2">•</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Controls: Pause/Play & Next/Prev */}
        <div className="flex items-center gap-1 px-2 h-full bg-[#0d1c2d] border-l border-[#1c2b3c] shrink-0 z-20">
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            className="w-6 h-6 rounded flex items-center justify-center text-[#8c909f] hover:text-[#d4e4fa] hover:bg-[#1c2b3c] transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
          </button>

          <button
            onClick={() => handleScroll('left')}
            title="Scroll previous"
            className="w-6 h-6 rounded flex items-center justify-center text-[#8c909f] hover:text-[#d4e4fa] hover:bg-[#1c2b3c] transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">chevron_left</span>
          </button>

          <button
            onClick={() => handleScroll('right')}
            title="Scroll next"
            className="w-6 h-6 rounded flex items-center justify-center text-[#8c909f] hover:text-[#d4e4fa] hover:bg-[#1c2b3c] transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Quick Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#122131] w-full max-w-lg rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col">
            <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[12px] px-2 py-0.5 rounded bg-[#0d1c2d] text-[#adc6ff] border border-[#1c2b3c]">
                  {selectedArticle.ticker}
                </span>
                <span className="text-[12px] text-[#8c909f] font-mono">
                  {selectedArticle.source} • {selectedArticle.publishedAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-7 h-7 rounded-lg text-[#8c909f] hover:text-[#d4e4fa] hover:bg-[#273647] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    selectedArticle.sentiment === 'BULLISH'
                      ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/30'
                      : selectedArticle.sentiment === 'BEARISH'
                      ? 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#93000a]/30'
                      : 'bg-[#1c2b3c] text-[#c2c6d6] border border-[#273647]'
                  }`}
                >
                  {selectedArticle.sentiment} (Score: {selectedArticle.sentimentScore > 0 ? '+' : ''}
                  {selectedArticle.sentimentScore})
                </span>
                <span className="text-[11px] text-[#8c909f] font-mono">
                  Category: {selectedArticle.category}
                </span>
              </div>

              <h3 className="text-[16px] font-bold text-[#d4e4fa] leading-snug">
                {selectedArticle.title}
              </h3>

              <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] text-[13px] text-[#c2c6d6] leading-relaxed">
                {selectedArticle.summary}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8c909f] font-mono pt-1">
                <span>Reading Time: {selectedArticle.readTime}</span>
                <span>FinBERT NLP Model Verification</span>
              </div>
            </div>

            <div className="p-3 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-3 py-1.5 rounded-lg bg-[#1c2b3c] text-[#c2c6d6] hover:text-[#d4e4fa] text-[12px] font-semibold transition-colors"
              >
                Close
              </button>

              {STOCKS_DATA[selectedArticle.ticker] && (
                <button
                  onClick={() => handleGoToStock(selectedArticle.ticker)}
                  className="px-4 py-1.5 rounded-lg bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>View {selectedArticle.ticker} Analysis</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Marquee CSS Keyframes */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee linear infinite;
        }
      `}</style>
    </>
  );
};
