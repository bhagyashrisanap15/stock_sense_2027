import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { fetchStockNews } from '../data/news';

interface MarketNewsProps {
  ticker: string;
  stockName: string;
}

export const MarketNews: React.FC<MarketNewsProps> = ({ ticker, stockName }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish' | 'earnings'>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadNews = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchStockNews(ticker);
      setArticles(data);
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [ticker]);

  // Aggregate Sentiment Calculation
  const totalArticles = articles.length;
  const bullishCount = articles.filter((a) => a.sentiment === 'BULLISH').length;
  const bearishCount = articles.filter((a) => a.sentiment === 'BEARISH').length;
  const neutralCount = articles.filter((a) => a.sentiment === 'NEUTRAL').length;

  const bullishPct = totalArticles > 0 ? (bullishCount / totalArticles) * 100 : 0;
  const neutralPct = totalArticles > 0 ? (neutralCount / totalArticles) * 100 : 0;
  const bearishPct = totalArticles > 0 ? (bearishCount / totalArticles) * 100 : 0;

  const avgSentimentScore = totalArticles > 0
    ? (articles.reduce((acc, a) => acc + a.sentimentScore, 0) / totalArticles).toFixed(2)
    : '0.00';

  const filteredArticles = articles.filter((a) => {
    if (filter === 'bullish') return a.sentiment === 'BULLISH';
    if (filter === 'bearish') return a.sentiment === 'BEARISH';
    if (filter === 'earnings') return a.category === 'Earnings';
    return true;
  });

  return (
    <section className="bg-[#122131] rounded-xl p-4 shadow-sm border border-[#1c2b3c] flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
            <span className="material-symbols-outlined text-[18px]">newspaper</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-bold text-[#d4e4fa] leading-none">
                Market Intelligence & News
              </h3>
              <span className="px-1.5 py-0.2 rounded bg-[#0d1c2d] text-[#adc6ff] text-[10px] font-mono border border-[#1c2b3c]">
                {ticker}
              </span>
            </div>
            <span className="text-[11px] text-[#8c909f] mt-0.5 block">
              FinBERT Sentiment NLP • Last sync: {lastUpdated}
            </span>
          </div>
        </div>

        <button
          onClick={() => loadNews(true)}
          disabled={loading || isRefreshing}
          className="h-8 px-2.5 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] text-[11px] font-semibold flex items-center gap-1 transition-all border border-[#273647] active:scale-95 disabled:opacity-50"
          title="Refresh real-time headlines"
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
      </div>

      {/* Aggregate NLP Sentiment Bar */}
      <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#4edea3]">psychology</span>
            <span className="text-[#d4e4fa] font-semibold">Overall Media Sentiment</span>
          </div>
          <span
            className={`font-mono font-bold ${
              parseFloat(avgSentimentScore) > 0.2
                ? 'text-[#4edea3]'
                : parseFloat(avgSentimentScore) < -0.2
                ? 'text-[#ffb4ab]'
                : 'text-[#adc6ff]'
            }`}
          >
            Score: {parseFloat(avgSentimentScore) > 0 ? '+' : ''}{avgSentimentScore} (
            {parseFloat(avgSentimentScore) > 0.2 ? 'Bullish Drift' : parseFloat(avgSentimentScore) < -0.2 ? 'Bearish Drag' : 'Balanced'}
            )
          </span>
        </div>

        {/* Tranche distribution track */}
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#1c2b3c]">
          <div
            className="h-full bg-[#4edea3] transition-all duration-500"
            style={{ width: `${bullishPct}%` }}
            title={`Bullish: ${bullishPct.toFixed(0)}%`}
          />
          <div
            className="h-full bg-[#3131c0] transition-all duration-500"
            style={{ width: `${neutralPct}%` }}
            title={`Neutral: ${neutralPct.toFixed(0)}%`}
          />
          <div
            className="h-full bg-[#ffb4ab] transition-all duration-500"
            style={{ width: `${bearishPct}%` }}
            title={`Bearish: ${bearishPct.toFixed(0)}%`}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#8c909f] font-mono">
          <span className="text-[#4edea3]">{bullishCount} Bullish</span>
          <span className="text-[#adc6ff]">{neutralCount} Neutral</span>
          <span className="text-[#ffb4ab]">{bearishCount} Bearish</span>
          <span className="text-[#8c909f]">NLP Vector Feed: Active</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: `All News (${articles.length})` },
          { id: 'bullish', label: 'Bullish Catalysts' },
          { id: 'bearish', label: 'Bearish Headwinds' },
          { id: 'earnings', label: 'Quarterly Earnings' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
              filter === f.id
                ? 'bg-[#273647] text-[#adc6ff] shadow-sm'
                : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Articles Stream */}
      {loading ? (
        <div className="flex flex-col gap-2.5 py-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-2 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 bg-[#1c2b3c] rounded" />
                <div className="h-3 w-16 bg-[#1c2b3c] rounded" />
              </div>
              <div className="h-4 w-4/5 bg-[#273647] rounded" />
              <div className="h-3 w-full bg-[#1c2b3c] rounded" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-[#0d1c2d] p-6 rounded-xl border border-[#1c2b3c] text-center text-[#8c909f] text-[12px] flex flex-col items-center gap-1">
          <span className="material-symbols-outlined text-[24px]">newspaper</span>
          <span>No headlines matched the selected sentiment filter.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredArticles.map((article) => {
            const isBull = article.sentiment === 'BULLISH';
            const isBear = article.sentiment === 'BEARISH';

            return (
              <article
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-[#0d1c2d] hover:bg-[#1c2b3c]/60 p-3 rounded-xl border border-[#1c2b3c] hover:border-[#273647] transition-all flex flex-col gap-2 cursor-pointer group"
              >
                {/* Meta Row: Source, Time, Sentiment Pill */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#8c909f] font-mono">
                    <span className="text-[#adc6ff] font-medium">{article.source}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                  </div>

                  {/* Sentiment Badge */}
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono flex items-center gap-1 ${
                      isBull
                        ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/30'
                        : isBear
                        ? 'bg-[#93000a]/25 text-[#ffb4ab] border border-[#93000a]/40'
                        : 'bg-[#3131c0]/25 text-[#adc6ff] border border-[#3131c0]/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isBull ? 'bg-[#4edea3]' : isBear ? 'bg-[#ffb4ab]' : 'bg-[#adc6ff]'
                      }`}
                    />
                    <span>{article.sentiment}</span>
                    <span>({article.sentimentScore > 0 ? '+' : ''}{article.sentimentScore.toFixed(2)})</span>
                  </div>
                </div>

                {/* Headline Title */}
                <h4 className="text-[13px] font-bold text-[#d4e4fa] group-hover:text-[#adc6ff] transition-colors leading-snug">
                  {article.title}
                </h4>

                {/* Excerpt Snippet */}
                <p className="text-[12px] text-[#c2c6d6] leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c]/60 text-[10px] text-[#8c909f]">
                  <span className="px-1.5 py-0.2 rounded bg-[#122131] text-[#c2c6d6] border border-[#1c2b3c]">
                    Category: {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#adc6ff] font-medium">
                    <span>{article.readTime}</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#122131] w-full max-w-lg rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#4d8eff]/20 text-[#adc6ff] font-semibold border border-[#4d8eff]/30">
                  {selectedArticle.source}
                </span>
                <span className="text-[11px] text-[#8c909f] font-mono">
                  {selectedArticle.publishedAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-3.5 overflow-y-auto">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                    selectedArticle.sentiment === 'BULLISH'
                      ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/30'
                      : selectedArticle.sentiment === 'BEARISH'
                      ? 'bg-[#93000a]/25 text-[#ffb4ab] border border-[#93000a]/40'
                      : 'bg-[#3131c0]/25 text-[#adc6ff] border border-[#3131c0]/40'
                  }`}
                >
                  FinBERT: {selectedArticle.sentiment} ({selectedArticle.sentimentScore > 0 ? '+' : ''}{selectedArticle.sentimentScore.toFixed(2)})
                </span>
                <span className="text-[11px] text-[#8c909f] font-mono">{selectedArticle.readTime}</span>
              </div>

              <h3 className="text-[16px] font-bold text-[#d4e4fa] leading-snug">
                {selectedArticle.title}
              </h3>

              <div className="p-3 rounded-lg bg-[#0d1c2d] border border-[#1c2b3c] text-[12px] text-[#d4e4fa] leading-relaxed">
                {selectedArticle.summary}
              </div>

              <div className="space-y-1.5 text-[12px] text-[#c2c6d6] leading-relaxed">
                <p>
                  Institutional analysts highlight that the development carries quantitative weight across forward earnings projections and order book volatility models.
                </p>
                <p>
                  The FinBERT natural language transformer automatically converts this textual release into positive momentum attribution vectors inside the XGBoost daily prediction ensemble.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#010f1f] border border-[#1c2b3c] text-[11px] text-[#8c909f] font-mono flex items-center justify-between">
                <span>Model Feature Vector: #14 (FinBERT_NLP)</span>
                <span className="text-[#4edea3]">Confidence: 94.2%</span>
              </div>
            </div>

            <div className="p-3 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] font-semibold text-[12px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
