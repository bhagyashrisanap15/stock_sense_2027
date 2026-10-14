import React, { useState } from 'react';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA } from '../data/stocks';
import { MarketNews } from '../components/MarketNews';
import { MarketSentiment } from '../components/MarketSentiment';
import { MarketSentimentGauge } from '../components/MarketSentimentGauge';

interface NewsSentimentScreenProps {
  currentStock: StockData;
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export const NewsSentimentScreen: React.FC<NewsSentimentScreenProps> = ({
  currentStock,
  onSelectStock,
  onNavigate
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(currentStock.ticker);
  const tickers = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATASTEEL'];

  const handleTickerChange = (ticker: string) => {
    setSelectedTicker(ticker);
    if (STOCKS_DATA[ticker]) {
      onSelectStock(STOCKS_DATA[ticker]);
    }
  };

  const targetStock = STOCKS_DATA[selectedTicker] || currentStock;

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1c2b3c] border border-[#273647] flex items-center justify-center text-cyan-400 shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-white tracking-tight">
                News & Institutional Sentiment
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold">
                NLP Sentiment v3.2
              </span>
            </div>
            <p className="text-[13px] text-[#94a3b8] mt-0.5">
              FinBERT real-time headline classification, market fear/greed polarity, and company-specific regulatory filings.
            </p>
          </div>
        </div>

        {/* Stock Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0a1424] rounded-xl border border-[#1c2b3c]">
          {tickers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTickerChange(t)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-mono font-bold transition-all ${
                selectedTicker === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-[#64748b] hover:text-white hover:bg-[#132238]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Sentiment Gauge & Systemic Fear/Greed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <MarketSentimentGauge initialScore={68} onNavigate={onNavigate} />
        </div>
        <div className="lg:col-span-2">
          <MarketSentiment onNavigate={onNavigate} />
        </div>
      </div>

      {/* Company News Stream for Selected Stock */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-white tracking-tight">
              News Stream for {targetStock.ticker} ({targetStock.name})
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('ai-predict')}
              className="text-[12px] text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 ml-2 transition-colors"
            >
              <span>View Explainable AI Attribution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <MarketNews ticker={targetStock.ticker} stockName={targetStock.name} />
      </div>
    </div>
  );
};
