import React, { useState, useEffect } from 'react';
import { StockData, ScreenTab } from '../types';
import { STOCKS_DATA, DEFAULT_MOCK_PORTFOLIO, getStockData } from '../data/stocks';
import { MarketCorrelation } from './MarketCorrelation';
import { DividendsSection } from './DividendsSection';
import { getDividendInfo } from '../data/dividends';
import { PaperTrading } from './PaperTrading';
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart';
import { PortfolioSectorChart } from './PortfolioSectorChart';

interface PortfolioProps {
  watchlist: string[];
  onSelectStock: (stock: StockData) => void;
  onNavigate: (tab: ScreenTab) => void;
  onOpenSearch: () => void;
}

interface PositionData {
  ticker: string;
  shares: number;
  avgBuyPrice: number;
  purchaseDate: string;
}

const STORAGE_KEY = 'stocksense_portfolio_positions_v2';

export const Portfolio: React.FC<PortfolioProps> = ({
  watchlist,
  onSelectStock,
  onNavigate,
  onOpenSearch
}) => {
  // Positions state, initializing with persistent localStorage or default data
  const [positions, setPositions] = useState<Record<string, PositionData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read portfolio positions from storage:', e);
    }

    const initial: Record<string, PositionData> = {};
    watchlist.forEach((ticker) => {
      if (DEFAULT_MOCK_PORTFOLIO[ticker]) {
        initial[ticker] = { ...DEFAULT_MOCK_PORTFOLIO[ticker], ticker };
      } else {
        const stock = getStockData(ticker);
        const basePrice = stock ? stock.price * 0.95 : 1000;
        initial[ticker] = {
          ticker,
          shares: 50,
          avgBuyPrice: Math.round(basePrice * 100) / 100,
          purchaseDate: '2024-05-15'
        };
      }
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch (e) {
      // ignore
    }
  }, [positions]);

  const [filterMode, setFilterMode] = useState<'all' | 'gainers' | 'losers' | 'bullish'>('all');
  const [viewMode, setViewMode] = useState<'performance' | 'paper' | 'dividends' | 'correlation'>('performance');
  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [editShares, setEditShares] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Compute calculated values for all items in watchlist that have positions
  const holdingRows = watchlist
    .map((ticker) => {
      const stock = getStockData(ticker);
      if (!stock) return null;
      const pos = positions[ticker] || {
        ticker,
        shares: 50,
        avgBuyPrice: stock.price * 0.94,
        purchaseDate: '2024-04-10'
      };

      const invested = pos.shares * pos.avgBuyPrice;
      const currentValue = pos.shares * stock.price;
      const unrealizedPnL = currentValue - invested;
      const unrealizedPnLPercent = invested > 0 ? (unrealizedPnL / invested) * 100 : 0;
      const todayPnL = pos.shares * stock.change;
      const todayPnLPercent = stock.changePercent;

      return {
        stock,
        position: pos,
        invested,
        currentValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        todayPnL,
        todayPnLPercent
      };
    })
    .filter(Boolean) as Array<{
      stock: StockData;
      position: PositionData;
      invested: number;
      currentValue: number;
      unrealizedPnL: number;
      unrealizedPnLPercent: number;
      todayPnL: number;
      todayPnLPercent: number;
    }>;

  // Aggregate Portfolio Totals
  const totalInvested = holdingRows.reduce((acc, h) => acc + h.invested, 0);
  const totalValue = holdingRows.reduce((acc, h) => acc + h.currentValue, 0);
  const totalUnrealizedPnL = totalValue - totalInvested;
  const totalUnrealizedPnLPercent = totalInvested > 0 ? (totalUnrealizedPnL / totalInvested) * 100 : 0;
  const totalTodayPnL = holdingRows.reduce((acc, h) => acc + h.todayPnL, 0);
  const totalTodayPnLPercent = totalValue > 0 ? (totalTodayPnL / (totalValue - totalTodayPnL)) * 100 : 0;

  // Projected Annual Dividend Income Aggregate
  const totalProjectedAnnualDividend = holdingRows.reduce((acc, h) => {
    const div = getDividendInfo(h.stock.ticker, h.stock.price);
    return acc + (h.position.shares * div.annualDividend);
  }, 0);
  const portfolioDividendYield = totalValue > 0 ? (totalProjectedAnnualDividend / totalValue) * 100 : 0;

  // Weighted metrics
  const weightedRiskScore = totalValue > 0
    ? Math.round(holdingRows.reduce((acc, h) => acc + (h.currentValue / totalValue) * h.stock.riskScore, 0))
    : 0;

  const weightedBeta = totalValue > 0
    ? (holdingRows.reduce((acc, h) => acc + (h.currentValue / totalValue) * h.stock.beta, 0)).toFixed(2)
    : '1.00';

  // Capital by AI Direction Signal
  const bullishValue = holdingRows.filter((h) => h.stock.direction === 'UP').reduce((acc, h) => acc + h.currentValue, 0);
  const neutralValue = holdingRows.filter((h) => h.stock.direction === 'NEUTRAL').reduce((acc, h) => acc + h.currentValue, 0);
  const bearishValue = holdingRows.filter((h) => h.stock.direction === 'DOWN').reduce((acc, h) => acc + h.currentValue, 0);

  const bullishPercent = totalValue > 0 ? (bullishValue / totalValue) * 100 : 0;
  const neutralPercent = totalValue > 0 ? (neutralValue / totalValue) * 100 : 0;
  const bearishPercent = totalValue > 0 ? (bearishValue / totalValue) * 100 : 0;

  // Sector breakdown
  const sectorMap: Record<string, number> = {};
  holdingRows.forEach((h) => {
    sectorMap[h.stock.sector] = (sectorMap[h.stock.sector] || 0) + h.currentValue;
  });

  const sectorDistribution = Object.entries(sectorMap).map(([sector, val]) => ({
    sector,
    value: val,
    pct: totalValue > 0 ? (val / totalValue) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  // Filtered rows
  const displayedHoldings = holdingRows.filter((h) => {
    if (filterMode === 'gainers') return h.unrealizedPnL > 0;
    if (filterMode === 'losers') return h.unrealizedPnL < 0;
    if (filterMode === 'bullish') return h.stock.direction === 'UP';
    return true;
  });

  const handleStartEdit = (pos: PositionData) => {
    setEditingTicker(pos.ticker);
    setEditShares(pos.shares);
    setEditPrice(pos.avgBuyPrice);
  };

  const handleSaveEdit = (ticker: string) => {
    setPositions((prev) => ({
      ...prev,
      [ticker]: {
        ...prev[ticker],
        shares: Number(editShares) || 1,
        avgBuyPrice: Number(editPrice) || 100
      }
    }));
    setEditingTicker(null);
    setToastMsg(`Position updated for ${ticker}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'full' | 'raw'>('full');

  const generateAndDownloadCSV = (format: 'full' | 'raw' = 'full') => {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    let csvContent = '';

    if (format === 'full') {
      // Institutional Quant Audit Report with executive summary and multi-section tables
      csvContent += `# ==========================================================================\n`;
      csvContent += `# STOCKSENSE QUANTITATIVE PLATFORM - WATCHLIST PORTFOLIO PERFORMANCE REPORT\n`;
      csvContent += `# Generated: ${formattedDate} (${timestamp})\n`;
      csvContent += `# Workspace: Dr. K. Sharma (dr.sharma@stocksense.ai) • Fast-API Engine v4.2\n`;
      csvContent += `# ==========================================================================\n\n`;

      csvContent += `[1. EXECUTIVE PORTFOLIO SUMMARY METRICS]\n`;
      csvContent += `Metric,Value\n`;
      csvContent += `"Total Portfolio Value (INR)","${totalValue.toFixed(2)}"\n`;
      csvContent += `"Total Invested Capital (INR)","${totalInvested.toFixed(2)}"\n`;
      csvContent += `"Unrealized All-Time P&L (INR)","${totalUnrealizedPnL.toFixed(2)}"\n`;
      csvContent += `"Unrealized All-Time Return (%)","${totalUnrealizedPnLPercent.toFixed(2)}%"\n`;
      csvContent += `"Today's Intraday Gain/Loss (INR)","${totalTodayPnL.toFixed(2)}"\n`;
      csvContent += `"Today's Return (%)","${totalTodayPnLPercent.toFixed(2)}%"\n`;
      csvContent += `"Portfolio Weighted Beta","${weightedBeta}"\n`;
      csvContent += `"Systemic Risk Score (0-100)","${weightedRiskScore}"\n`;
      csvContent += `"Projected Annual Dividend Income (INR)","${totalProjectedAnnualDividend.toFixed(2)}"\n`;
      csvContent += `"Portfolio Dividend Yield (%)","${portfolioDividendYield.toFixed(2)}%"\n`;
      csvContent += `"AI Bullish Capital Exposure (%)","${bullishPercent.toFixed(2)}%"\n`;
      csvContent += `"AI Neutral Capital Exposure (%)","${neutralPercent.toFixed(2)}%"\n`;
      csvContent += `"AI Bearish Capital Exposure (%)","${bearishPercent.toFixed(2)}%"\n`;
      csvContent += `"Total Active Positions","${holdingRows.length}"\n\n`;

      csvContent += `[2. SECTOR ALLOCATION BREAKDOWN]\n`;
      csvContent += `Sector,Total Value (INR),Allocation (%)\n`;
      sectorDistribution.forEach((s) => {
        csvContent += `"${s.sector}","${s.value.toFixed(2)}","${s.pct.toFixed(2)}%"\n`;
      });
      csvContent += `\n`;

      csvContent += `[3. DETAILED HOLDINGS PERFORMANCE TABLE]\n`;
    }

    // Tabular Holdings Header
    csvContent += `Ticker,Company Name,Exchange,Sector,Shares Held,Avg Buy Price (INR),Current Price (INR),Invested Capital (INR),Current Value (INR),Unrealized P&L (INR),Return (%),Today's P&L (INR),Today Change (%),Portfolio Weight (%),Annual Dividend/Share (INR),Projected Annual Dividend (INR),Dividend Yield (%),AI Model Direction,Confidence (%),Beta,Risk Score\n`;

    holdingRows.forEach((h) => {
      const weight = totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0;
      const div = getDividendInfo(h.stock.ticker, h.stock.price);
      const annDivIncome = h.position.shares * div.annualDividend;
      csvContent += `"${h.stock.ticker}",`;
      csvContent += `"${h.stock.name}",`;
      csvContent += `"${h.stock.exchange}",`;
      csvContent += `"${h.stock.sector}",`;
      csvContent += `${h.position.shares},`;
      csvContent += `${h.position.avgBuyPrice.toFixed(2)},`;
      csvContent += `${h.stock.price.toFixed(2)},`;
      csvContent += `${h.invested.toFixed(2)},`;
      csvContent += `${h.currentValue.toFixed(2)},`;
      csvContent += `${h.unrealizedPnL.toFixed(2)},`;
      csvContent += `"${h.unrealizedPnLPercent.toFixed(2)}%",`;
      csvContent += `${h.todayPnL.toFixed(2)},`;
      csvContent += `"${h.todayPnLPercent.toFixed(2)}%",`;
      csvContent += `"${weight.toFixed(2)}%",`;
      csvContent += `${div.annualDividend.toFixed(2)},`;
      csvContent += `${annDivIncome.toFixed(2)},`;
      csvContent += `"${div.dividendYield.toFixed(2)}%",`;
      csvContent += `"${h.stock.directionLabel}",`;
      csvContent += `${h.stock.confidence},`;
      csvContent += `${h.stock.beta},`;
      csvContent += `${h.stock.riskScore}\n`;
    });

    const filename = `StockSense_Portfolio_Performance_${format === 'full' ? 'Report' : 'Data'}_${Date.now().toString().slice(-4)}.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    setIsExportModalOpen(false);
    setToastMsg(`CSV report exported successfully (${filename})`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-8">
      {/* Portfolio Title & Real-Time Sync Indicator */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#d4e4fa] tracking-tight">
              My Portfolio & Holdings
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#00a572]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              Live Value
            </span>
          </div>
          <p className="text-[12px] text-[#c2c6d6] mt-0.5">
            Real-time value and daily profit & loss of your monitored Indian stocks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="h-9 px-3 bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 border border-[#273647]"
            title="Download your portfolio report"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Data</span>
          </button>
          <button
            onClick={onOpenSearch}
            className="h-9 px-3 bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* Portfolio View Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-[#0d1c2d] rounded-xl border border-[#1c2b3c] gap-1">
        <button
          onClick={() => setViewMode('performance')}
          className={`py-2 px-2 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'performance'
              ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
              : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
          <span>My Stocks ({holdingRows.length})</span>
        </button>
        <button
          onClick={() => setViewMode('paper')}
          className={`py-2 px-2 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'paper'
              ? 'bg-[#1c2b3c] text-[#00ff9d] shadow-sm border border-[#00a572]/40'
              : 'text-[#c2c6d6] hover:text-[#00ff9d]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-[#00ff9d]">candlestick_chart</span>
          <span>Practice Trading</span>
        </button>
        <button
          onClick={() => setViewMode('dividends')}
          className={`py-2 px-2 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'dividends'
              ? 'bg-[#1c2b3c] text-[#4edea3] shadow-sm border border-[#00a572]/40'
              : 'text-[#c2c6d6] hover:text-[#4edea3]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-[#4edea3]">payments</span>
          <span>Dividend Income</span>
        </button>
        <button
          onClick={() => setViewMode('correlation')}
          className={`py-2 px-2 rounded-lg text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'correlation'
              ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
              : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">hub</span>
          <span>Diversification</span>
        </button>
      </div>

      {viewMode === 'paper' ? (
        <PaperTrading
          currentStock={holdingRows[0]?.stock || STOCKS_DATA.RELIANCE}
          onSelectStock={onSelectStock}
          onNavigate={onNavigate}
        />
      ) : viewMode === 'correlation' ? (
        <MarketCorrelation
          watchlist={watchlist}
          currentStock={holdingRows[0]?.stock || STOCKS_DATA.RELIANCE}
          onSelectStock={onSelectStock}
        />
      ) : viewMode === 'dividends' ? (
        <DividendsSection
          positions={positions}
          stocks={STOCKS_DATA}
          onSelectStock={onSelectStock}
          onEditPosition={(pos) => handleStartEdit(pos)}
        />
      ) : (
        <>
          {/* Hero Performance Card */}
          <div className="bg-[#122131] rounded-xl p-4 shadow-xl border border-[#1c2b3c] relative overflow-hidden flex flex-col gap-3">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#adc6ff] via-[#4edea3] to-[#c0c1ff]" />

        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-[#c2c6d6] font-semibold">
              Total Portfolio Value
            </span>
            <span className="text-[30px] font-bold font-mono text-[#d4e4fa] tracking-tight leading-none mt-1">
              ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] text-[#c2c6d6] font-medium">All-Time Returns</span>
            <div
              className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[12px] font-bold font-mono mt-1 ${
                totalUnrealizedPnL >= 0
                  ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/30'
                  : 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#93000a]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {totalUnrealizedPnL >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
              <span>
                {totalUnrealizedPnL >= 0 ? '+' : ''}₹{Math.abs(totalUnrealizedPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalUnrealizedPnL >= 0 ? '+' : ''}{totalUnrealizedPnLPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Stats Bento */}
        <div className="grid grid-cols-3 gap-2 bg-[#0d1c2d] p-3 rounded-lg border border-[#1c2b3c] text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">Invested Capital</span>
            <span className="text-[13px] font-bold font-mono text-[#d4e4fa] mt-0.5">
              ₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-[#1c2b3c] px-1">
            <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">Today's P&L</span>
            <span
              className={`text-[13px] font-bold font-mono mt-0.5 flex items-center gap-0.5 ${
                totalTodayPnL >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
              }`}
            >
              {totalTodayPnL >= 0 ? '+' : ''}₹{Math.abs(totalTodayPnL).toFixed(0)} ({totalTodayPnLPercent >= 0 ? '+' : ''}{totalTodayPnLPercent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">Weighted Beta</span>
            <span className="text-[13px] font-bold font-mono text-[#adc6ff] mt-0.5">
              β {weightedBeta}
            </span>
          </div>
        </div>

        {/* AI Alpha Exposure & Risk Score Meter */}
        <div className="flex flex-col gap-2 bg-[#010f1f]/80 p-3 rounded-lg border border-[#1c2b3c]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#c2c6d6] flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-[#adc6ff]">psychology</span>
              AI Alpha Capital Exposure
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[#4edea3] font-medium">{bullishPercent.toFixed(0)}% Bull</span>
              <span className="text-[#adc6ff] font-medium">{neutralPercent.toFixed(0)}% Neut</span>
              <span className="text-[#ffb4ab] font-medium">{bearishPercent.toFixed(0)}% Bear</span>
            </div>
          </div>

          {/* Segmented Exposure Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#1c2b3c]">
            <div className="h-full bg-[#4edea3]" style={{ width: `${bullishPercent}%` }} title="Bullish" />
            <div className="h-full bg-[#3131c0]" style={{ width: `${neutralPercent}%` }} title="Neutral" />
            <div className="h-full bg-[#ffb4ab]" style={{ width: `${bearishPercent}%` }} title="Bearish" />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c] text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#adc6ff]">shield</span>
              <span className="text-[#c2c6d6]">Portfolio Systemic Risk:</span>
              <span
                className={`font-mono font-bold ${
                  weightedRiskScore < 35
                    ? 'text-[#4edea3]'
                    : weightedRiskScore < 55
                    ? 'text-[#adc6ff]'
                    : 'text-[#ffb4ab]'
                }`}
              >
                {weightedRiskScore}/100 ({weightedRiskScore < 35 ? 'LOW' : weightedRiskScore < 55 ? 'MODERATE' : 'ELEVATED'})
              </span>
            </div>
            <span className="text-[#8c909f] font-mono">{holdingRows.length} Active Positions</span>
          </div>
        </div>
      </div>

      {/* Portfolio Historical NAV Performance Growth Chart (Recharts) */}
      <PortfolioPerformanceChart
        currentNav={totalValue}
        investedCapital={totalInvested}
        allTimePnL={totalUnrealizedPnL}
        allTimePnLPct={totalUnrealizedPnLPercent}
        weightedBeta={weightedBeta}
        holdingsCount={holdingRows.length}
      />

      {/* Dividends Spotlight Quick Access Card */}
      <div
        onClick={() => setViewMode('dividends')}
        className="bg-gradient-to-r from-[#0c2e22]/80 via-[#122131] to-[#0d1c2d] p-3.5 rounded-xl border border-[#00a572]/40 hover:border-[#4edea3] cursor-pointer transition-all flex items-center justify-between group shadow-sm active:scale-[0.99]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center border border-[#00a572]/30 group-hover:scale-105 transition-transform shrink-0">
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[13px] font-bold text-[#d4e4fa]">
                Projected Annual Dividend Income
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono border border-[#00a572]/30">
                {portfolioDividendYield.toFixed(2)}% Yield
              </span>
            </div>
            <span className="text-[11px] text-[#c2c6d6] truncate">
              ₹{totalProjectedAnnualDividend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/yr estimated passive income across {holdingRows.length} holdings
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#4edea3] text-[12px] font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
          <span className="hidden sm:inline">View Schedule</span>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </div>
      </div>

      {/* Sector Allocation Breakdown */}
      {sectorDistribution.length > 0 && (
        <div className="bg-[#122131] rounded-xl p-3.5 shadow-sm border border-[#1c2b3c] flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">pie_chart</span>
              <span className="text-[13px] font-semibold text-[#d4e4fa]">Sector Diversification</span>
            </div>
            <span className="text-[11px] text-[#8c909f] font-mono">By Asset Allocation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {sectorDistribution.map((sec, i) => (
              <div key={sec.sector} className="bg-[#0d1c2d] p-2 rounded-lg border border-[#1c2b3c] flex flex-col gap-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#d4e4fa] font-medium truncate max-w-[130px]">{sec.sector}</span>
                  <span className="font-mono text-[#adc6ff] font-bold">{sec.pct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1c2b3c] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0 ? 'bg-[#4d8eff]' : i === 1 ? 'bg-[#4edea3]' : i === 2 ? 'bg-[#c0c1ff]' : 'bg-[#e1e0ff]'
                    }`}
                    style={{ width: `${sec.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs for Holdings */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 bg-[#0d1c2d] p-1 rounded-xl border border-[#1c2b3c]">
          {[
            { id: 'all', label: `All (${holdingRows.length})` },
            { id: 'gainers', label: 'In Profit' },
            { id: 'losers', label: 'In Loss' },
            { id: 'bullish', label: 'AI Bullish' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterMode === tab.id
                  ? 'bg-[#273647] text-[#adc6ff] shadow-sm'
                  : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="h-8 px-2.5 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] text-[11px] font-semibold flex items-center gap-1 border border-[#273647] shrink-0 active:scale-95 transition-all"
          title="Export Data Report"
        >
          <span className="material-symbols-outlined text-[15px]">file_download</span>
          <span>Export Data</span>
        </button>
      </div>

      {/* Holdings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {displayedHoldings.length === 0 ? (
          <div className="bg-[#122131] rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2.5 border border-[#1c2b3c]">
            <span className="material-symbols-outlined text-[32px] text-[#8c909f]">search_off</span>
            <p className="text-[13px] text-[#c2c6d6]">No holdings matched the selected filter.</p>
            <button
              onClick={() => setFilterMode('all')}
              className="px-3 py-1 bg-[#1c2b3c] text-[#adc6ff] text-[12px] font-semibold rounded-lg hover:bg-[#273647]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedHoldings.map((h) => {
            const isEditing = editingTicker === h.stock.ticker;
            const isGain = h.unrealizedPnL >= 0;

            return (
              <div
                key={h.stock.ticker}
                className="bg-[#122131] rounded-xl p-3.5 shadow-sm border border-[#1c2b3c] flex flex-col gap-2.5 hover:border-[#273647] transition-all"
              >
                {/* Top Row: Symbol, Shares, Prices, P&L */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#1c2b3c] flex items-center justify-center font-bold text-[#adc6ff] text-[16px] shrink-0 border border-[#273647]">
                      {h.stock.ticker.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[15px] text-[#d4e4fa]">
                          {h.stock.ticker}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0d1c2d] text-[#c2c6d6] border border-[#1c2b3c]">
                          {h.position.shares} shares
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8c909f] truncate">
                        Avg: ₹{h.position.avgBuyPrice.toFixed(2)} • CMP: ₹{h.stock.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[15px] font-bold text-[#d4e4fa]">
                      ₹{h.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-semibold flex items-center gap-0.5 ${
                        isGain ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {isGain ? 'arrow_drop_up' : 'arrow_drop_down'}
                      </span>
                      {isGain ? '+' : ''}₹{Math.abs(h.unrealizedPnL).toFixed(2)} ({isGain ? '+' : ''}{h.unrealizedPnLPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Inline Position Editor Modal / Expansion */}
                {isEditing ? (
                  <div className="bg-[#051424] p-3 rounded-lg border border-[#4d8eff] flex flex-col gap-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-[12px] font-semibold text-[#adc6ff]">
                      <span>Edit Mock Position for {h.stock.ticker}</span>
                      <button
                        onClick={() => setEditingTicker(null)}
                        className="text-[#8c909f] hover:text-[#d4e4fa]"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-[#c2c6d6]">Shares Held</label>
                        <input
                          type="number"
                          value={editShares}
                          onChange={(e) => setEditShares(parseFloat(e.target.value) || 0)}
                          className="bg-[#122131] text-[#d4e4fa] text-[12px] font-mono p-1.5 rounded border border-[#1c2b3c] outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-[#c2c6d6]">Cost Basis Price (₹)</label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                          className="bg-[#122131] text-[#d4e4fa] text-[12px] font-mono p-1.5 rounded border border-[#1c2b3c] outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => setEditingTicker(null)}
                        className="px-2.5 py-1 text-[11px] rounded text-[#c2c6d6] hover:bg-[#1c2b3c]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(h.stock.ticker)}
                        className="px-3 py-1 text-[11px] rounded bg-[#4d8eff] text-[#00285d] font-semibold shadow-sm"
                      >
                        Save Position
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Sub Bar: AI Signal, Risk, and Quick Actions */}
                <div className="flex items-center justify-between bg-[#0d1c2d] p-2 rounded-lg border border-[#1c2b3c] text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold text-[10px] flex items-center gap-0.5 ${
                        h.stock.direction === 'UP'
                          ? 'bg-[#00a572]/20 text-[#4edea3]'
                          : h.stock.direction === 'DOWN'
                          ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                          : 'bg-[#3131c0]/30 text-[#b0b2ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {h.stock.direction === 'UP' ? 'north' : h.stock.direction === 'DOWN' ? 'south' : 'horizontal_rule'}
                      </span>
                      {h.stock.direction} ({h.stock.confidence}%)
                    </span>
                    <span className="text-[#8c909f] font-mono">
                      Day: {h.todayPnL >= 0 ? '+' : ''}₹{h.todayPnL.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEdit(h.position)}
                      className="text-[#8c909f] hover:text-[#adc6ff] p-1 rounded hover:bg-[#1c2b3c] transition-colors"
                      title="Edit shares or purchase price"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectStock(h.stock);
                        onNavigate('ai-predict');
                      }}
                      className="px-2 py-0.5 rounded bg-[#1c2b3c] text-[#adc6ff] hover:bg-[#273647] font-semibold text-[10px] transition-colors"
                    >
                      SHAP
                    </button>
                    <button
                      onClick={() => {
                        onSelectStock(h.stock);
                        onNavigate('technical-analysis');
                      }}
                      className="px-2 py-0.5 rounded bg-[#4d8eff]/20 text-[#adc6ff] hover:bg-[#4d8eff]/30 font-semibold text-[10px] transition-colors"
                    >
                      Technical
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
        </>
      )}

      {/* Compliance / Sandbox Note */}
      <div className="bg-[#010f1f] p-3 rounded-lg flex items-start gap-2 text-[#8c909f] text-[11px] border border-[#1c2b3c] mt-2">
        <span className="material-symbols-outlined text-[#adc6ff] text-[16px] shrink-0 mt-0.5">
          info
        </span>
        <p className="leading-relaxed">
          <strong className="text-[#c2c6d6]">Real-Time Simulation Sandbox:</strong> Portfolio returns are modeled based on your monitored watchlist assets and simulated purchase lots. Live price feeds and XGBoost/LSTM confidence metrics recompute continuously.
        </p>
      </div>

      {/* Export Data Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#122131] w-full max-w-md rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4d8eff]/20 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#d4e4fa] leading-none">
                    Export Portfolio Performance
                  </h3>
                  <span className="text-[11px] text-[#c2c6d6] mt-0.5 block font-mono">
                    CSV Quantitative Dossier • {holdingRows.length} Holdings
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Snapshot Metrics Preview */}
              <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] space-y-2">
                <span className="text-[10px] text-[#8c909f] uppercase tracking-wider font-semibold block">
                  Report Summary Preview
                </span>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="flex flex-col">
                    <span className="text-[#8c909f] text-[11px]">Total Portfolio Value</span>
                    <span className="font-mono font-bold text-[#d4e4fa]">
                      ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#8c909f] text-[11px]">All-Time Unrealized P&L</span>
                    <span
                      className={`font-mono font-bold ${
                        totalUnrealizedPnL >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {totalUnrealizedPnL >= 0 ? '+' : ''}₹{totalUnrealizedPnL.toFixed(2)} ({totalUnrealizedPnLPercent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#8c909f] text-[11px]">Weighted Beta</span>
                    <span className="font-mono text-[#adc6ff] font-semibold">β {weightedBeta}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#8c909f] text-[11px]">Systemic Risk Score</span>
                    <span className="font-mono text-[#4edea3] font-semibold">{weightedRiskScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <span className="text-[11px] text-[#c2c6d6] font-semibold uppercase tracking-wider block">
                  Select CSV Report Structure
                </span>

                <div className="space-y-2">
                  <label
                    onClick={() => setExportFormat('full')}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      exportFormat === 'full'
                        ? 'bg-[#1c2b3c] border-[#4d8eff] shadow-sm'
                        : 'bg-[#0d1c2d] border-[#1c2b3c] hover:bg-[#1c2b3c]/50'
                    }`}
                  >
                    <div className="pt-0.5">
                      <input
                        type="radio"
                        name="exportFormat"
                        checked={exportFormat === 'full'}
                        onChange={() => setExportFormat('full')}
                        className="w-4 h-4 text-[#4d8eff] accent-[#4d8eff]"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-[#d4e4fa]">
                          Comprehensive Quant Audit Report
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-[#00a572]/20 text-[#4edea3] text-[9px] font-mono font-bold">
                          RECOMMENDED
                        </span>
                      </div>
                      <span className="text-[11px] text-[#c2c6d6] mt-0.5 leading-snug">
                        Includes institutional metadata header, executive portfolio metrics summary, sector allocation breakdown, and complete holdings telemetry.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setExportFormat('raw')}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      exportFormat === 'raw'
                        ? 'bg-[#1c2b3c] border-[#4d8eff] shadow-sm'
                        : 'bg-[#0d1c2d] border-[#1c2b3c] hover:bg-[#1c2b3c]/50'
                    }`}
                  >
                    <div className="pt-0.5">
                      <input
                        type="radio"
                        name="exportFormat"
                        checked={exportFormat === 'raw'}
                        onChange={() => setExportFormat('raw')}
                        className="w-4 h-4 text-[#4d8eff] accent-[#4d8eff]"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-[#d4e4fa]">
                        Clean Tabular Raw Holdings Data
                      </span>
                      <span className="text-[11px] text-[#c2c6d6] mt-0.5 leading-snug">
                        Row-by-row flat CSV formatted directly for Python (Pandas), Excel, Google Sheets, or R quantitative backtests.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data fields included note */}
              <div className="p-2.5 rounded-lg bg-[#010f1f] border border-[#1c2b3c] text-[11px] text-[#8c909f] font-mono">
                Included fields: Ticker, Name, Exchange, Sector, Shares, Avg Buy Price, CMP, Invested, Current Value, P&L, Return %, Day P&L, Weight %, AI Prediction, Confidence, Beta, Risk Score.
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="flex-1 h-10 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#d4e4fa] text-[12px] font-semibold transition-colors border border-[#273647]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => generateAndDownloadCSV(exportFormat)}
                className="flex-1 h-10 rounded-lg bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#00a572] text-[#00311f] font-semibold text-[12px] rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
