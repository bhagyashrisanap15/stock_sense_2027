import React, { useState, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  BarChart2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Bell,
  BellRing,
  Mail,
  Check,
  X
} from 'lucide-react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA, getStockData } from '../data/stocks';
import { RsiStrategyCalculator, RsiMomentumLineChart, get14PeriodRsiData } from '../components/RsiStrategyCalculator';

interface TechnicalAnalysisScreenProps {
  currentStock: StockData;
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export const TechnicalAnalysisScreen: React.FC<TechnicalAnalysisScreenProps> = ({
  currentStock,
  onSelectStock,
  onNavigate
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(currentStock.ticker);

  // Sync state if currentStock changes externally (e.g. from global search or watchlist)
  React.useEffect(() => {
    setSelectedTicker(currentStock.ticker);
  }, [currentStock.ticker]);

  const baseTickers = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'ITC', 'TATAMOTORS', 'BHARTIARTL', 'LT'];
  const tickers = baseTickers.includes(currentStock.ticker) ? baseTickers : [currentStock.ticker, ...baseTickers];

  const handleTickerChange = (ticker: string) => {
    setSelectedTicker(ticker);
    onSelectStock(getStockData(ticker));
  };

  const stock = getStockData(selectedTicker);

  // Technical calculations
  const priceVsSma20 = (((stock.price - stock.sma20) / stock.sma20) * 100).toFixed(2);
  const priceVsSma50 = (((stock.price - stock.sma50) / stock.sma50) * 100).toFixed(2);
  const priceVsSma200 = (((stock.price - stock.sma200) / stock.sma200) * 100).toFixed(2);

  // Trend Strength (50-Day vs 200-Day SMA Crossover)
  const isSma50Above200 = stock.sma50 >= stock.sma200;
  const trendStrengthLabel: 'Bullish' | 'Bearish' = isSma50Above200 ? 'Bullish' : 'Bearish';
  const smaSpread = Number((stock.sma50 - stock.sma200).toFixed(2));
  const smaSpreadPct = Math.abs(Number(((smaSpread / stock.sma200) * 100).toFixed(2)));

  // User Notification Preferences for SMA Crossover (persisted)
  const defaultEmail = 'poojabhagwat2525@gmail.com';

  const [toastAlertEnabled, setToastAlertEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`stocksense_sma_toast_${stock.ticker}`);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [emailAlertEnabled, setEmailAlertEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`stocksense_sma_email_${stock.ticker}`);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [emailAddress, setEmailAddress] = useState<string>(() => {
    try {
      return localStorage.getItem('stocksense_crossover_email') || defaultEmail;
    } catch {
      return defaultEmail;
    }
  });

  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [tempEmail, setTempEmail] = useState<string>(emailAddress);

  const [crossoverToast, setCrossoverToast] = useState<{
    id: string;
    type: 'toast' | 'email' | 'both' | 'info';
    title: string;
    message: string;
    detail?: string;
    timestamp: string;
  } | null>(null);

  // Auto-dismiss toast notification after 5 seconds
  useEffect(() => {
    if (!crossoverToast) return;
    const timer = setTimeout(() => {
      setCrossoverToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [crossoverToast]);

  // Toggle handlers with persistence
  const handleToggleToast = (enabled: boolean) => {
    setToastAlertEnabled(enabled);
    try {
      localStorage.setItem(`stocksense_sma_toast_${stock.ticker}`, JSON.stringify(enabled));
    } catch {}
    setCrossoverToast({
      id: Date.now().toString(),
      type: 'info',
      title: enabled ? 'In-App Toast Alerts Active' : 'In-App Toast Alerts Muted',
      message: enabled
        ? `Real-time toast notifications will pop up whenever ${stock.ticker} crosses 50/200 SMA.`
        : `Toast alerts muted for ${stock.ticker} moving average crossovers.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleToggleEmail = (enabled: boolean) => {
    setEmailAlertEnabled(enabled);
    try {
      localStorage.setItem(`stocksense_sma_email_${stock.ticker}`, JSON.stringify(enabled));
    } catch {}
    setCrossoverToast({
      id: Date.now().toString(),
      type: 'info',
      title: enabled ? 'Email Notifications Active' : 'Email Notifications Muted',
      message: enabled
        ? `Crossover alerts will be emailed to ${emailAddress} when ${stock.ticker} undergoes Golden/Death Cross.`
        : `Email crossover alerts muted for ${stock.ticker}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleSaveEmail = () => {
    if (tempEmail && tempEmail.includes('@')) {
      setEmailAddress(tempEmail);
      setIsEditingEmail(false);
      try {
        localStorage.setItem('stocksense_crossover_email', tempEmail);
      } catch {}
      setCrossoverToast({
        id: Date.now().toString(),
        type: 'info',
        title: 'Alert Email Updated',
        message: `SMA crossover notifications destination updated to ${tempEmail}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  // Test simulation trigger
  const handleTestAlert = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const crossoverType = isSma50Above200 ? 'Golden Cross' : 'Death Cross';

    if (!toastAlertEnabled && !emailAlertEnabled) {
      setCrossoverToast({
        id: Date.now().toString(),
        type: 'info',
        title: 'All Alert Channels Muted',
        message: 'Please toggle ON either Toast or Email notifications to receive crossover alerts.',
        timestamp: timeStr
      });
      return;
    }

    if (toastAlertEnabled && emailAlertEnabled) {
      setCrossoverToast({
        id: Date.now().toString(),
        type: 'both',
        title: `🚨 ${crossoverType} Crossover Alert (${stock.ticker})`,
        message: `50-Day SMA (₹${stock.sma50.toFixed(2)}) ${isSma50Above200 ? 'surpassed' : 'fell below'} 200-Day SMA (₹${stock.sma200.toFixed(2)}).`,
        detail: `Regime: ${trendStrengthLabel} • Dispatched via Toast & Email to ${emailAddress}`,
        timestamp: timeStr
      });
    } else if (toastAlertEnabled) {
      setCrossoverToast({
        id: Date.now().toString(),
        type: 'toast',
        title: `🔔 In-App Toast: ${crossoverType} (${stock.ticker})`,
        message: `50-Day SMA (₹${stock.sma50.toFixed(2)}) ${isSma50Above200 ? 'surpassed' : 'fell below'} 200-Day SMA (₹${stock.sma200.toFixed(2)}).`,
        detail: `Regime: ${trendStrengthLabel} • SMA Spread: ${isSma50Above200 ? '+' : '-'}${smaSpreadPct}%`,
        timestamp: timeStr
      });
    } else {
      setCrossoverToast({
        id: Date.now().toString(),
        type: 'email',
        title: `✉️ Email Alert Dispatched to ${emailAddress}`,
        message: `Crossover alert queued for ${stock.ticker} ${crossoverType}. Spread: ${isSma50Above200 ? '+' : '-'}${smaSpreadPct}%.`,
        detail: `50-Day SMA: ₹${stock.sma50.toFixed(2)} | 200-Day SMA: ₹${stock.sma200.toFixed(2)}`,
        timestamp: timeStr
      });
    }
  };

  // Technical confluence score
  const isRsiBullish = stock.rsi >= 50 && stock.rsi <= 70;
  const isMacdBullish = (stock.macd?.histogram ?? 0) > 0;
  const isSma20Bullish = stock.price > stock.sma20;
  const isSma50Bullish = stock.price > stock.sma50;
  const isSma200Bullish = stock.price > stock.sma200;
  const isBollingerBullish = (stock.bollinger?.pb ?? 0.5) > 0.5;

  const bullishIndicators = [isRsiBullish, isMacdBullish, isSma20Bullish, isSma50Bullish, isSma200Bullish, isBollingerBullish].filter(Boolean).length;
  const totalIndicators = 6;
  const confluencePct = Math.round((bullishIndicators / totalIndicators) * 100);

  const rsi14Data = get14PeriodRsiData(stock.ticker, stock.rsi);

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-12 relative">
      {/* Floating In-App Toast Alert for Crossovers */}
      {crossoverToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full px-4 sm:px-0 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 ${
            crossoverToast.type === 'both' || crossoverToast.type === 'toast'
              ? isSma50Above200
                ? 'bg-[#0a201b]/95 border-emerald-500/50 shadow-[0_10px_35px_rgba(16,185,129,0.25)] text-white'
                : 'bg-[#290e16]/95 border-rose-500/50 shadow-[0_10px_35px_rgba(244,63,94,0.25)] text-white'
              : crossoverToast.type === 'email'
              ? 'bg-[#0c1a2e]/95 border-blue-500/50 shadow-[0_10px_35px_rgba(59,130,246,0.25)] text-white'
              : 'bg-[#0f1d30]/95 border-cyan-500/40 text-white shadow-[0_10px_30px_rgba(6,182,212,0.2)]'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                crossoverToast.type === 'email'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : isSma50Above200
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {crossoverToast.type === 'email' ? (
                  <Mail className="w-4 h-4" />
                ) : (
                  <BellRing className="w-4 h-4 animate-bounce" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[13px]">{crossoverToast.title}</h4>
                  <span className="text-[10px] font-mono text-[#8c909f]">{crossoverToast.timestamp}</span>
                </div>
                <p className="text-[12px] text-[#cbd5e1] leading-relaxed">
                  {crossoverToast.message}
                </p>
                {crossoverToast.detail && (
                  <span className="text-[10.5px] font-mono text-cyan-300 font-semibold">
                    {crossoverToast.detail}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCrossoverToast(null)}
              className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1c2b3c] border border-[#273647] flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-white tracking-tight">
                Price Trends & Technical Charts
              </h1>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-mono font-bold">
                Beginner Friendly
              </span>
            </div>
            <p className="text-[13px] text-[#94a3b8] mt-0.5">
              Clear price charts, moving averages, and momentum indicators explained simply for new investors.
            </p>
          </div>
        </div>

        {/* Quick Ticker Switcher */}
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

      {/* Stock Overview Bar */}
      <div className="bg-[#122131] rounded-2xl p-4 border border-[#1c2b3c] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider block">Selected Stock</span>
            <span className="text-[18px] font-bold text-white">{stock.ticker}</span>
            <span className="text-[12px] text-[#94a3b8] ml-2 font-normal">({stock.name})</span>
          </div>

          <div className="h-8 w-[1px] bg-[#1c2b3c] hidden sm:block" />

          <div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider block">Current Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-mono font-bold text-white">
                ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-[12px] font-mono font-semibold ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-[#1c2b3c] hidden md:block" />

          {/* Trend Strength Summary */}
          <div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider block">Trend Strength</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2.5 py-0.5 rounded text-[11.5px] font-mono font-bold flex items-center gap-1 ${
                isSma50Above200
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {isSma50Above200 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{trendStrengthLabel}</span>
              </span>
              <span className="text-[11px] font-mono text-[#8c909f] hidden xl:inline">
                ({isSma50Above200 ? '50-day average is above 200-day average' : '50-day average is below 200-day average'})
              </span>
            </div>
          </div>
        </div>

        {/* Confluence Rating */}
        <div className="flex items-center gap-3 bg-[#0a1424] px-4 py-2 rounded-xl border border-[#1c2b3c]">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-mono text-[#64748b]">Indicator Consensus</span>
            <span className="text-[14px] font-mono font-bold text-cyan-400">
              {bullishIndicators} of {totalIndicators} Indicators are Bullish ({confluencePct}%)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('ai-predict')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[12px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Why AI Predicts Up / Down</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Featured: RSI Strategy Calculator & Overbought/Oversold Signal Identification */}
      <RsiStrategyCalculator stock={stock} />

      {/* Grid: Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* RSI 14 Card with 14-period momentum visualization below current RSI value */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">RSI Momentum (14 Days)</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                stock.rsi > 70 ? 'bg-amber-500/20 text-amber-400' : stock.rsi < 30 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {stock.rsi > 70 ? 'OVERBOUGHT (>70)' : stock.rsi < 30 ? 'OVERSOLD (<30)' : 'HEALTHY ZONE (30-70)'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[28px] font-mono font-extrabold text-white">{stock.rsi.toFixed(1)}</span>
              <span className="text-[12px] text-[#94a3b8]">/ 100 Meter</span>
            </div>

            {/* Interactive Gauge Bar with Overbought/Oversold Zone Markers */}
            <div className="my-3">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-[#8c909f] mb-1">
                <span className="flex items-center gap-1 text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Cheap / Bargain &lt;30
                </span>
                <span className="text-[#64748b]">50 Middle</span>
                <span className="flex items-center gap-1 text-amber-400">
                  Pricey &gt;70
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </span>
              </div>

              <div className="relative w-full h-3.5 bg-[#0a1424] rounded-full overflow-hidden border border-[#1c2b3c]">
                {/* Gradient Fill */}
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, stock.rsi))}%` }}
                />
                {/* Neutral zone markers */}
                <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-white/40 shadow-sm" />
                <div className="absolute top-0 bottom-0 left-[70%] w-[1px] bg-white/40 shadow-sm" />
              </div>
            </div>

            {/* 14-Period RSI Momentum Line Chart Visualization with Interactive Zones */}
            <div className="my-3">
              <div className="flex items-center justify-between mb-1.5 text-[11px] font-mono">
                <span className="text-[#94a3b8]">14-Day RSI Momentum History:</span>
                <span className="text-cyan-300 font-semibold">14 Days Ago → Today</span>
              </div>
              <RsiMomentumLineChart
                data={rsi14Data}
                currentRsi={stock.rsi}
                overboughtThreshold={70}
                oversoldThreshold={30}
                height={85}
                ticker={stock.ticker}
                stockPrice={stock.price}
              />
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed mt-2">
              {stock.rsi >= 70
                ? 'What this means: The stock has climbed rapidly and is above 70 (Overbought). Buyers may take a break or take profit soon.'
                : stock.rsi <= 30
                ? 'What this means: The stock is below 30 (Oversold). It has been heavily sold down and is now at a level where bargain buyers frequently step in.'
                : 'What this means: RSI is in a healthy, steady range between 30 and 70, showing orderly price movement without extreme fever.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b] flex justify-between">
            <span>Oversold: Under 30</span>
            <span>Balanced: 50</span>
            <span>Overbought: Over 70</span>
          </div>
        </div>

        {/* MACD Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">MACD Trend Speed</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                (stock.macd?.histogram ?? 0) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {(stock.macd?.histogram ?? 0) >= 0 ? 'BULLISH (UPWARD SPEED)' : 'BEARISH (SLOWING DOWN)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 mb-3 bg-[#0a1424] p-3 rounded-xl border border-[#1a293b]">
              <div>
                <span className="text-[10px] font-mono text-[#64748b] block">Fast Line</span>
                <span className="text-[14px] font-mono font-bold text-cyan-300">{stock.macd?.macdLine?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64748b] block">Signal Line</span>
                <span className="text-[14px] font-mono font-bold text-[#94a3b8]">{stock.macd?.signalLine?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64748b] block">Momentum Bar</span>
                <span className={`text-[14px] font-mono font-bold ${
                  (stock.macd?.histogram ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {stock.macd?.histogram ? (stock.macd.histogram >= 0 ? '+' : '') + stock.macd.histogram.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              {(stock.macd?.histogram ?? 0) >= 0
                ? 'What this means: The fast trend line is above the signal line. Short-term buying speed is accelerating upwards.'
                : 'What this means: The momentum bar is below zero. Short-term price speed is cooling off compared to recent weeks.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b]">
            Signal: Comparing 12-day vs 26-day price speed
          </div>
        </div>

        {/* Trend Strength Indicator Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Trend Strength</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0a1424] text-[#8c909f] border border-[#1a293b]">
                  SMA 50 / 200
                </span>
              </div>
              {/* Simple 'Bullish' or 'Bearish' label based on current crossover state */}
              <span
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                  isSma50Above200
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(78,222,163,0.15)]'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                }`}
              >
                {isSma50Above200 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{trendStrengthLabel}</span>
              </span>
            </div>

            {/* Moving Average Values: 50-Day & 200-Day SMAs */}
            <div className="grid grid-cols-2 gap-2.5 mb-3 bg-[#0a1424] p-3 rounded-xl border border-[#1a293b]">
              {/* 50-Day SMA */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    50-Day SMA
                  </span>
                  <span className={`text-[9.5px] font-mono ${Number(priceVsSma50) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(priceVsSma50) >= 0 ? '+' : ''}{priceVsSma50}%
                  </span>
                </div>
                <span className="text-[16px] font-mono font-bold text-white mt-0.5">
                  ₹{stock.sma50.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9.5px] font-mono text-[#8c909f]">
                  Medium-Term Trend (50 Days)
                </span>
              </div>

              {/* 200-Day SMA */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    200-Day SMA
                  </span>
                  <span className={`text-[9.5px] font-mono ${Number(priceVsSma200) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(priceVsSma200) >= 0 ? '+' : ''}{priceVsSma200}%
                  </span>
                </div>
                <span className="text-[16px] font-mono font-bold text-white mt-0.5">
                  ₹{stock.sma200.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9.5px] font-mono text-[#8c909f]">
                  Long-Term Benchmark (200 Days)
                </span>
              </div>
            </div>

            {/* Crossover State & Spread Telemetry */}
            <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between text-[11px] font-mono ${
              isSma50Above200
                ? 'bg-emerald-500/10 border-emerald-500/20 text-[#d4e4fa]'
                : 'bg-rose-500/10 border-rose-500/20 text-[#d4e4fa]'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${isSma50Above200 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span className="font-semibold text-white">
                  {isSma50Above200 ? 'Golden Cross Active (Bullish Trend)' : 'Death Cross Active (Bearish Trend)'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#8c909f]">Difference:</span>
                <span className={`font-bold ${isSma50Above200 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isSma50Above200 ? '+' : '-'}₹{Math.abs(smaSpread).toFixed(2)} ({isSma50Above200 ? '+' : '-'}{smaSpreadPct}%)
                </span>
              </div>
            </div>

            {/* Contextual Trend Explanation */}
            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              {isSma50Above200
                ? `What this means: The 50-day average is higher than the 200-day average by ${smaSpreadPct}%. This is known as a 'Golden Cross' and signals a strong, sustained upward trend.`
                : `What this means: The 50-day average has dipped below the 200-day average by ${smaSpreadPct}%. This is known as a 'Death Cross' and signals long-term downward pressure.`}
            </p>

            {/* Short-term 20-Day SMA sub-note */}
            <div className="mt-2.5 pt-2 border-t border-[#1a293b]/70 flex items-center justify-between text-[10.5px] font-mono text-[#8c909f]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>20-Day Average: ₹{stock.sma20.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </span>
              <span className={Number(priceVsSma20) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                Current Price vs 20-SMA: {Number(priceVsSma20) >= 0 ? '+' : ''}{priceVsSma20}%
              </span>
            </div>

            {/* Crossover Notification Channel Settings */}
            <div className="mt-3 pt-3 border-t border-[#1a293b] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trend Shift Alerts (50 / 200 SMA)</span>
                </span>
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-[#0a1424] text-cyan-300 border border-[#1a293b]">
                  {toastAlertEnabled && emailAlertEnabled ? 'Pop-up & Email On' : toastAlertEnabled ? 'Pop-up On' : emailAlertEnabled ? 'Email On' : 'Alerts Muted'}
                </span>
              </div>

              {/* Notification Toggle Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* In-App Toast Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleToast(!toastAlertEnabled)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-left ${
                    toastAlertEnabled
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-sm'
                      : 'bg-[#0a1424] border-[#1a293b] text-[#64748b] hover:border-[#273d57]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      toastAlertEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#122131] text-[#64748b]'
                    }`}>
                      <BellRing className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold">Pop-up Alerts</span>
                      <span className="text-[9.5px] text-[#94a3b8]">Banner when trend flips</span>
                    </div>
                  </div>
                  <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${
                    toastAlertEnabled ? 'bg-cyan-500' : 'bg-[#1c2b3c]'
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${
                      toastAlertEnabled ? 'left-4.5' : 'left-0.5'
                    }`} />
                  </div>
                </button>

                {/* Email Notification Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleEmail(!emailAlertEnabled)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-left ${
                    emailAlertEnabled
                      ? 'bg-blue-500/10 border-blue-500/40 text-white shadow-sm'
                      : 'bg-[#0a1424] border-[#1a293b] text-[#64748b] hover:border-[#273d57]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      emailAlertEnabled ? 'bg-blue-500/20 text-blue-300' : 'bg-[#122131] text-[#64748b]'
                    }`}>
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold">Email Alerts</span>
                      <span className="text-[9.5px] text-[#94a3b8]">Direct to your inbox</span>
                    </div>
                  </div>
                  <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${
                    emailAlertEnabled ? 'bg-blue-500' : 'bg-[#1c2b3c]'
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${
                      emailAlertEnabled ? 'left-4.5' : 'left-0.5'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Email Address Editor (Visible when Email is enabled) */}
              {emailAlertEnabled && (
                <div className="p-2 rounded-xl bg-[#0a1424] border border-[#1a293b] flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 truncate mr-2">
                    <span className="text-[#64748b]">Recipient:</span>
                    {isEditingEmail ? (
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="bg-[#122131] px-2 py-0.5 rounded border border-cyan-500/50 text-white font-mono text-[11px] focus:outline-none"
                        placeholder="your-email@example.com"
                        autoFocus
                      />
                    ) : (
                      <span className="text-blue-300 font-semibold truncate">{emailAddress}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isEditingEmail ? (
                      <button
                        type="button"
                        onClick={handleSaveEmail}
                        className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[10px] font-bold"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setTempEmail(emailAddress);
                          setIsEditingEmail(true);
                        }}
                        className="text-[10px] text-[#64748b] hover:text-white underline"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Action Bar: Test Trigger */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-[#64748b]">
                  Triggers on Golden Cross & Death Cross
                </span>
                <button
                  type="button"
                  onClick={handleTestAlert}
                  className="px-2.5 py-1 rounded-lg bg-[#0a1424] hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-[10.5px] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Test crossover notification dispatch"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Send Test Alert</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b] flex justify-between items-center">
            <span>Indicator: 50-Day vs 200-Day Moving Average</span>
            <span className={`font-semibold ${isSma50Above200 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Trend: {trendStrengthLabel}
            </span>
          </div>
        </div>

        {/* Bollinger Bands Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Bollinger Bands (Price Channels)</span>
              <span className="text-[11px] font-mono text-cyan-300 font-bold">
                Position: {stock.bollinger?.pb?.toFixed(2) ?? '0.70'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-[#0a1424] border border-[#1a293b] mb-3 text-[11px] font-mono">
              <div>
                <span className="text-[#64748b] block">Lower Floor</span>
                <span className="text-white font-bold">₹{stock.bollinger?.lower?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-cyan-400 block">Middle Average</span>
                <span className="text-white font-bold">₹{stock.bollinger?.middle?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#64748b] block">Upper Ceiling</span>
                <span className="text-white font-bold">₹{stock.bollinger?.upper?.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              What this means: Bollinger Bands show normal expected price ranges. Right now, price is trading near the upper channel, indicating strong buying momentum.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b]">
            Normal range: Between Lower Floor & Upper Ceiling
          </div>
        </div>

        {/* Volume & Liquidity Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Trading Volume & Big Buyer Flow</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {stock.volumeSurge}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#94a3b8]">Today's Volume</span>
                <span className="font-mono font-bold text-white">{stock.volume24h}</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#94a3b8]">20-Day Average Volume</span>
                <span className="font-mono font-bold text-[#94a3b8]">{stock.vol20dAvg}</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#94a3b8]">Large Investor Flow</span>
                <span className="font-mono font-bold text-cyan-400">Net Buying (Accumulation)</span>
              </div>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              What this means: Higher trading volume confirms real investor participation. When price rises with heavy volume, it shows genuine institutional backing.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b]">
            Volume surge: Over 10% above recent 20-day average
          </div>
        </div>

        {/* Volatility & ATR Card */}
        <div className="bg-[#122131] rounded-2xl p-5 border border-[#1c2b3c] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono font-semibold text-[#64748b] uppercase">Annual Volatility (Price Swings)</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                stock.annVolatility > 20 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {stock.annVolatility > 20 ? 'HIGH SWINGS' : 'CALM & STEADY'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[28px] font-mono font-extrabold text-white">{stock.annVolatility}%</span>
              <span className="text-[12px] text-[#94a3b8]">vs {stock.volBenchmark}% Market Average</span>
            </div>

            <p className="text-[12px] text-[#94a3b8] leading-relaxed">
              What this means: Volatility measures how dramatically the stock's price jumps up and down. Lower volatility stocks provide a smoother, less stressful ride for beginners.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a293b] text-[11px] font-mono text-[#64748b] flex justify-between">
            <span>Worst Past Drop: {stock.maxDrawdown}%</span>
            <span>Market Sensitivity (Beta): {stock.beta}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
