import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ScreenTab } from '../types';

interface LearnScreenProps {
  onNavigate: (tab: ScreenTab) => void;
}

interface Term {
  term: string;
  hindiTerm?: string;
  category: 'Basics' | 'AI & Tech' | 'Risk & Safety';
  explanation: string;
  example: string;
}

const GLOSSARY_TERMS: Term[] = [
  {
    term: 'Bullish (तेज़ी)',
    hindiTerm: 'Tezi',
    category: 'Basics',
    explanation: 'When prices are rising or expected to go up. Think of a bull charging forward with its horns thrusting upward.',
    example: 'If Reliance has a Bullish AI outlook, models expect the price to rise over the next few days.'
  },
  {
    term: 'Bearish (मंदी)',
    hindiTerm: 'Mandi',
    category: 'Basics',
    explanation: 'When prices are falling or expected to decline. Think of a bear swiping its paws downward.',
    example: 'If a stock is Bearish, sellers currently outnumber buyers and prices may soften.'
  },
  {
    term: 'NIFTY 50',
    hindiTerm: 'Nifty',
    category: 'Basics',
    explanation: 'The flagship index of the National Stock Exchange of India (NSE), tracking the 50 largest Indian companies like Reliance, TCS, and HDFC Bank.',
    example: 'When Nifty is up 1%, India’s top 50 companies on average gained value today.'
  },
  {
    term: 'SENSEX',
    hindiTerm: 'Sensex',
    category: 'Basics',
    explanation: 'The oldest benchmark index in India, tracking 30 financially sound and well-established companies listed on the Bombay Stock Exchange (BSE).',
    example: 'If Sensex crosses 82,000, it reflects strong overall investor sentiment in India.'
  },
  {
    term: 'RSI (Relative Strength Index)',
    category: 'AI & Tech',
    explanation: 'A momentum gauge from 0 to 100 measuring how fast people are buying or selling a stock. Above 70 means "expensive/overbought", below 30 means "cheap/oversold".',
    example: 'An RSI of 55 means healthy, steady buying without being dangerously overheated.'
  },
  {
    term: 'Moving Average (SMA / EMA)',
    category: 'AI & Tech',
    explanation: 'The average closing price of a stock over a set time (like 20, 50, or 200 days). It smoothes out daily random noise to show the true direction.',
    example: 'If a stock’s current price is ₹2,850 and its 20-day average is ₹2,780, it is in a healthy uptrend.'
  },
  {
    term: 'AI Ensemble Forecast',
    category: 'AI & Tech',
    explanation: 'Instead of relying on a single computer model, StockSense combines three proven algorithms (XGBoost, Random Forest, and LSTM) and takes a consensus vote.',
    example: 'When 2 or 3 models agree on an UP signal, the confidence score is higher.'
  },
  {
    term: 'Risk Level (Low, Medium, High)',
    category: 'Risk & Safety',
    explanation: 'A measure of how wildly a stock’s price bounces up and down. High risk means big price swings; low risk means steadier, calmer moves.',
    example: 'Large companies like TCS usually have Lower Risk than newly listed or volatile mid-cap stocks.'
  },
  {
    term: 'Stop Loss',
    category: 'Risk & Safety',
    explanation: 'A predetermined price level where you exit an investment to prevent small losses from turning into large ones.',
    example: 'If you buy at ₹100, setting a stop loss at ₹95 limits your maximum loss to ₹5 per share.'
  },
  {
    term: '52-Week High / Low',
    category: 'Basics',
    explanation: 'The highest and lowest price at which a stock traded during the past 12 months (52 weeks).',
    example: 'A stock trading near its 52-week high indicates strong sustained investor demand over the year.'
  }
];

export const LearnScreen: React.FC<LearnScreenProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Basics' | 'AI & Tech' | 'Risk & Safety'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesQuery =
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const faqs = [
    {
      q: 'How does StockSense AI predict stock trends?',
      a: 'StockSense analyzes rolling market data — including 20-day and 50-day price trends, trading volumes, and momentum indicators like RSI and MACD. Three distinct algorithms (XGBoost, Random Forest, and neural networks) evaluate these patterns against thousands of historical market setups to forecast whether the stock is more likely to go UP, stay NEUTRAL, or go DOWN over the next 5 trading days.'
    },
    {
      q: 'Are AI predictions 100% guaranteed?',
      a: 'No. Stock market prices are inherently uncertain and influenced by real-world news, geopolitical events, company earnings, and broader economic shifts. StockSense provides probabilistic forecasts to help you make informed decisions, but you should never invest money you cannot afford to lose.'
    },
    {
      q: 'How should a beginner use this app?',
      a: 'Start with the Home Dashboard to check overall market health (NIFTY & SENSEX). Search for familiar companies you use in daily life (like Reliance, Infosys, Tata Motors). Check their AI Outlook and read the 3 plain-English reasons why the model reached that conclusion. Then test your ideas risk-free using the Practice Trading simulator!'
    },
    {
      q: 'What is the difference between Paper Trading and Real Trading?',
      a: 'Paper Trading (or Practice Trading) gives you ₹10,00,000 in virtual money. You can practice buying and selling Indian stocks at real-time market prices without risking any real money. It is the best way for beginners to build confidence.'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-8 text-slate-800 dark:text-slate-100">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold w-fit border border-teal-200/60 dark:border-teal-800/60">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Beginner’s Investing Academy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learn Stock Market Investing — Simply
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            No confusing financial jargon or complicated math. Master the essentials of stock prices, AI predictions, and smart risk management at your own pace.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={() => onNavigate('paper-trading')}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span>Try Practice Trading (₹10L Virtual)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* 3 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">1. Trend is Your Friend</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Stocks usually move in directional waves. Buying strong companies that are in an uptrend (trading above their 20-day moving average) historically gives better odds than guessing bottoms.
          </p>
        </div>

        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">2. AI Looks at Multiple Clues</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Never rely on just one indicator. Our AI looks at price history, trading volume, volatility, and news sentiment together to build an unbiased consensus.
          </p>
        </div>

        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">3. Protect Your Capital First</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Successful investors focus on risk management before profit. Always diversify across different sectors (IT, Banking, Energy) and avoid putting all savings into a single stock.
          </p>
        </div>
      </div>

      {/* Jargon Buster / Financial Terms Dictionary */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>Jargon Buster (Stock Market Dictionary)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Everyday financial words explained like you are five.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search a term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['All', 'Basics', 'AI & Tech', 'Risk & Safety'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTerms.map((t) => (
            <div
              key={t.term}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col gap-2 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  {t.term}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.explanation}
              </p>
              <div className="mt-1 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-teal-700 dark:text-teal-300 flex items-start gap-1.5">
                <span className="font-semibold">Example:</span>
                <span>{t.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <span>Frequently Asked Questions for Beginners</span>
        </h2>

        <div className="flex flex-col gap-2.5">
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-[#121c2d] text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
