import React, { useState, useEffect, useMemo } from 'react';
import { StockData, ScreenTab, PaperTradeOrder, PaperTradePosition } from '../types';
import { STOCKS_DATA } from '../data/stocks';

interface PaperTradingProps {
  currentStock?: StockData;
  onSelectStock?: (stock: StockData) => void;
  onNavigate?: (tab: ScreenTab) => void;
}

const STORAGE_KEY = 'stocksense_paper_trading_v2';
const INITIAL_CASH = 1000000; // ₹10,00,000 INR

interface StoredPaperState {
  cash: number;
  positions: Record<string, PaperTradePosition>;
  orders: PaperTradeOrder[];
}

export const PaperTrading: React.FC<PaperTradingProps> = ({
  currentStock,
  onSelectStock,
  onNavigate
}) => {
  // Initialize state from localStorage or defaults
  const [paperState, setPaperState] = useState<StoredPaperState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load paper trading state:', e);
    }

    // Default starting portfolio state
    return {
      cash: 649374,
      positions: {
        RELIANCE: {
          ticker: 'RELIANCE',
          companyName: 'Reliance Industries Ltd.',
          shares: 50,
          avgBuyPrice: 2750.00,
          firstPurchased: '2026-09-15 10:30 IST'
        },
        TCS: {
          ticker: 'TCS',
          companyName: 'Tata Consultancy Services',
          shares: 30,
          avgBuyPrice: 3820.00,
          firstPurchased: '2026-09-18 11:15 IST'
        },
        INFY: {
          ticker: 'INFY',
          companyName: 'Infosys Limited',
          shares: 45,
          avgBuyPrice: 1860.00,
          firstPurchased: '2026-09-22 14:20 IST'
        }
      },
      orders: [
        {
          id: 'ord-init-1',
          ticker: 'RELIANCE',
          companyName: 'Reliance Industries Ltd.',
          side: 'BUY',
          shares: 50,
          price: 2750.00,
          totalValue: 137500.00,
          timestamp: '2026-09-15 10:30 IST'
        },
        {
          id: 'ord-init-2',
          ticker: 'TCS',
          companyName: 'Tata Consultancy Services',
          side: 'BUY',
          shares: 30,
          price: 3820.00,
          totalValue: 114600.00,
          timestamp: '2026-09-18 11:15 IST'
        },
        {
          id: 'ord-init-3',
          ticker: 'INFY',
          companyName: 'Infosys Limited',
          side: 'BUY',
          shares: 45,
          price: 1860.00,
          totalValue: 83700.00,
          timestamp: '2026-09-22 14:20 IST'
        },
        {
          id: 'ord-init-4',
          ticker: 'TATASTEEL',
          companyName: 'Tata Steel Ltd.',
          side: 'BUY',
          shares: 100,
          price: 152.00,
          totalValue: 15200.00,
          timestamp: '2026-09-25 09:45 IST'
        },
        {
          id: 'ord-init-5',
          ticker: 'TATASTEEL',
          companyName: 'Tata Steel Ltd.',
          side: 'SELL',
          shares: 100,
          price: 163.20,
          totalValue: 16320.00,
          timestamp: '2026-09-28 15:10 IST',
          realizedPnL: 1120.00,
          realizedPnLPct: 7.37
        }
      ]
    };
  });

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paperState));
    } catch (e) {
      console.error('Failed to save paper trading state:', e);
    }
  }, [paperState]);

  // UI Navigation & Filters
  const [activeTab, setActiveTab] = useState<'positions' | 'terminal' | 'history' | 'analytics'>('positions');
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedTicker, setSelectedTicker] = useState<string>(currentStock?.ticker || 'RELIANCE');
  const [quantityInput, setQuantityInput] = useState<string>('10');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPriceInput, setLimitPriceInput] = useState<string>('');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync selected ticker if prop changes
  useEffect(() => {
    if (currentStock?.ticker) {
      setSelectedTicker(currentStock.ticker);
    }
  }, [currentStock?.ticker]);

  // Selected stock object
  const activeStock = STOCKS_DATA[selectedTicker] || STOCKS_DATA.RELIANCE;
  const executionPrice = orderType === 'LIMIT' && Number(limitPriceInput) > 0 ? Number(limitPriceInput) : activeStock.price;

  // Set default limit price when switching ticker
  useEffect(() => {
    if (activeStock) {
      setLimitPriceInput(activeStock.price.toFixed(2));
    }
  }, [selectedTicker]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Position Valuations & P&L Calculations
  const positionRows = useMemo(() => {
    return Object.values(paperState.positions).map((pos) => {
      const stock = STOCKS_DATA[pos.ticker] || {
        ticker: pos.ticker,
        name: pos.companyName,
        price: pos.avgBuyPrice,
        change: 0,
        changePercent: 0
      };

      const currentVal = pos.shares * stock.price;
      const totalCost = pos.shares * pos.avgBuyPrice;
      const unrealizedPnL = currentVal - totalCost;
      const unrealizedPnLPct = totalCost > 0 ? (unrealizedPnL / totalCost) * 100 : 0;
      const dayPnL = pos.shares * (stock.change || 0);

      return {
        ...pos,
        stock,
        currentVal,
        totalCost,
        unrealizedPnL,
        unrealizedPnLPct,
        dayPnL
      };
    });
  }, [paperState.positions]);

  // Aggregated Portfolio Metrics
  const totalStockValue = useMemo(() => {
    return positionRows.reduce((acc, p) => acc + p.currentVal, 0);
  }, [positionRows]);

  const totalCostBasis = useMemo(() => {
    return positionRows.reduce((acc, p) => acc + p.totalCost, 0);
  }, [positionRows]);

  const totalUnrealizedPnL = totalStockValue - totalCostBasis;
  const totalUnrealizedPnLPct = totalCostBasis > 0 ? (totalUnrealizedPnL / totalCostBasis) * 100 : 0;
  const totalPortfolioNetWorth = paperState.cash + totalStockValue;
  const totalPortfolioPnL = totalPortfolioNetWorth - INITIAL_CASH;
  const totalPortfolioPnLPct = (totalPortfolioPnL / INITIAL_CASH) * 100;

  // Realized P&L from Closed Trades in Order History
  const totalRealizedPnL = useMemo(() => {
    return paperState.orders.reduce((acc, ord) => acc + (ord.realizedPnL || 0), 0);
  }, [paperState.orders]);

  // Win Rate Analytics
  const closedSales = paperState.orders.filter((o) => o.side === 'SELL' && o.realizedPnL !== undefined);
  const winningSales = closedSales.filter((o) => (o.realizedPnL || 0) > 0);
  const winRate = closedSales.length > 0 ? Math.round((winningSales.length / closedSales.length) * 100) : 0;

  // Position for currently selected trade ticker
  const existingPosition = paperState.positions[selectedTicker];
  const sharesOwned = existingPosition ? existingPosition.shares : 0;

  // Quantity and Cost calculations
  const parsedQuantity = Math.max(0, parseInt(quantityInput, 10) || 0);
  const estimatedOrderCost = parsedQuantity * executionPrice;
  const remainingCashAfterBuy = paperState.cash - estimatedOrderCost;

  // Quick Quantity Presets
  const handleSetMaxQuantity = () => {
    if (orderSide === 'BUY') {
      const maxShares = Math.floor(paperState.cash / executionPrice);
      setQuantityInput(String(Math.max(1, maxShares)));
    } else {
      setQuantityInput(String(sharesOwned));
    }
  };

  const handlePercentageQuantity = (pct: number) => {
    if (orderSide === 'BUY') {
      const allocatedFunds = paperState.cash * pct;
      const shares = Math.floor(allocatedFunds / executionPrice);
      setQuantityInput(String(Math.max(1, shares)));
    } else {
      const shares = Math.floor(sharesOwned * pct);
      setQuantityInput(String(Math.max(1, shares)));
    }
  };

  // Order Submission Handler
  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (parsedQuantity <= 0) {
      showToast('Please enter a valid share quantity greater than 0.');
      return;
    }

    const nowStr = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' IST';

    if (orderSide === 'BUY') {
      if (estimatedOrderCost > paperState.cash) {
        showToast(`Insufficient buying power. Required: ₹${estimatedOrderCost.toLocaleString('en-IN')} | Available: ₹${paperState.cash.toLocaleString('en-IN')}`);
        return;
      }

      // Update positions with weighted average price
      const currentPos = paperState.positions[selectedTicker];
      let updatedPos: PaperTradePosition;

      if (currentPos) {
        const totalShares = currentPos.shares + parsedQuantity;
        const totalInvested = (currentPos.shares * currentPos.avgBuyPrice) + estimatedOrderCost;
        const newAvg = totalInvested / totalShares;

        updatedPos = {
          ...currentPos,
          shares: totalShares,
          avgBuyPrice: Number(newAvg.toFixed(2))
        };
      } else {
        updatedPos = {
          ticker: selectedTicker,
          companyName: activeStock.name,
          shares: parsedQuantity,
          avgBuyPrice: executionPrice,
          firstPurchased: nowStr
        };
      }

      const newOrder: PaperTradeOrder = {
        id: `ord-${Date.now()}`,
        ticker: selectedTicker,
        companyName: activeStock.name,
        side: 'BUY',
        shares: parsedQuantity,
        price: executionPrice,
        totalValue: estimatedOrderCost,
        timestamp: nowStr
      };

      setPaperState((prev) => ({
        cash: Number((prev.cash - estimatedOrderCost).toFixed(2)),
        positions: {
          ...prev.positions,
          [selectedTicker]: updatedPos
        },
        orders: [newOrder, ...prev.orders]
      }));

      showToast(`Bought ${parsedQuantity} shares of ${selectedTicker} at ₹${executionPrice.toFixed(2)}!`);
      setActiveTab('positions');
    } else {
      // SELL ORDER
      if (sharesOwned < parsedQuantity) {
        showToast(`Cannot sell ${parsedQuantity} shares. You only own ${sharesOwned} shares of ${selectedTicker}.`);
        return;
      }

      const avgBuy = existingPosition ? existingPosition.avgBuyPrice : executionPrice;
      const realizedPnL = Number(((executionPrice - avgBuy) * parsedQuantity).toFixed(2));
      const realizedPnLPct = Number((((executionPrice - avgBuy) / avgBuy) * 100).toFixed(2));
      const proceeds = Number((parsedQuantity * executionPrice).toFixed(2));

      const newOrder: PaperTradeOrder = {
        id: `ord-${Date.now()}`,
        ticker: selectedTicker,
        companyName: activeStock.name,
        side: 'SELL',
        shares: parsedQuantity,
        price: executionPrice,
        totalValue: proceeds,
        timestamp: nowStr,
        realizedPnL,
        realizedPnLPct
      };

      const updatedPositions = { ...paperState.positions };
      if (sharesOwned === parsedQuantity) {
        delete updatedPositions[selectedTicker];
      } else {
        updatedPositions[selectedTicker] = {
          ...existingPosition,
          shares: existingPosition.shares - parsedQuantity
        };
      }

      setPaperState((prev) => ({
        cash: Number((prev.cash + proceeds).toFixed(2)),
        positions: updatedPositions,
        orders: [newOrder, ...prev.orders]
      }));

      showToast(`Sold ${parsedQuantity} shares of ${selectedTicker} for ₹${proceeds.toLocaleString('en-IN')} (P&L: ${realizedPnL >= 0 ? '+' : ''}₹${realizedPnL.toFixed(2)})!`);
      setActiveTab('positions');
    }
  };

  // Quick action from position row to pre-fill terminal
  const handleQuickTrade = (ticker: string, side: 'BUY' | 'SELL') => {
    setSelectedTicker(ticker);
    setOrderSide(side);
    if (side === 'SELL') {
      const pos = paperState.positions[ticker];
      if (pos) setQuantityInput(String(pos.shares));
    }
    setActiveTab('terminal');
  };

  // Reset virtual account
  const handleResetPortfolio = () => {
    const freshState: StoredPaperState = {
      cash: INITIAL_CASH,
      positions: {},
      orders: [
        {
          id: `ord-reset-${Date.now()}`,
          ticker: 'CASH',
          companyName: 'Virtual Account Initial Deposit',
          side: 'BUY',
          shares: 1,
          price: INITIAL_CASH,
          totalValue: INITIAL_CASH,
          timestamp: new Date().toLocaleDateString('en-IN') + ' IST'
        }
      ]
    };
    setPaperState(freshState);
    setShowResetConfirm(false);
    showToast('Virtual Paper Trading portfolio reset to ₹10,00,000 cash.');
  };

  // Add 1 Lakh Funds
  const handleAddFunds = () => {
    setPaperState((prev) => ({
      ...prev,
      cash: prev.cash + 100000
    }));
    showToast('Added ₹1,00,000 virtual cash to buying power!');
  };

  // CSV Export for trade history
  const handleExportCSV = () => {
    const headers = 'ID,Date,Ticker,Side,Shares,Price,Total Value,Realized PnL\n';
    const rows = paperState.orders
      .map(
        (o) =>
          `"${o.id}","${o.timestamp}","${o.ticker}","${o.side}",${o.shares},${o.price},${o.totalValue},"${o.realizedPnL !== undefined ? o.realizedPnL : 0}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StockSense_Paper_Trades_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Trade history exported to CSV!');
  };

  return (
    <div className="bg-[#122131] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#1c2b3c] flex flex-col gap-4 relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#00a572] text-[#00281b] px-4 py-2.5 rounded-xl shadow-2xl font-semibold text-[13px] flex items-center gap-2 animate-in slide-in-from-top-2 border border-[#4edea3]">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-80 h-40 bg-[#4d8eff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center border border-[#00a572]/30 shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[22px]">candlestick_chart</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-[#d4e4fa] tracking-tight leading-none">
                Paper Trading Simulator
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#4d8eff]/15 text-[#adc6ff] text-[10px] font-bold font-mono border border-[#4d8eff]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                Virtual NSE Execution
              </span>
            </div>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">
              Practice systematic algorithmic strategies with real-time mark-to-market valuations & zero financial risk
            </p>
          </div>
        </div>

        {/* Actions: Add Funds / Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddFunds}
            title="Deposit ₹1,00,000 Virtual Funds"
            className="px-2.5 py-1 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#4edea3] text-[11px] font-semibold border border-[#273647] flex items-center gap-1 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">add_card</span>
            <span>+₹1L Cash</span>
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Portfolio to initial state"
            className="px-2.5 py-1 rounded-lg bg-[#1c2b3c] hover:bg-[#93000a]/30 text-[#ffb4ab] text-[11px] font-semibold border border-[#273647] flex items-center gap-1 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Account Net Worth & P&L Hero Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] relative z-10">
        {/* Net Worth */}
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Total Portfolio Net Worth</span>
          <span className="font-mono text-[17px] font-bold text-[#d4e4fa] mt-0.5">
            ₹{totalPortfolioNetWorth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span
            className={`text-[10px] font-mono flex items-center gap-0.5 mt-0.5 ${
              totalPortfolioPnL >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">
              {totalPortfolioPnL >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span>
              {totalPortfolioPnL >= 0 ? '+' : ''}₹{totalPortfolioPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({totalPortfolioPnLPct.toFixed(2)}%)
            </span>
          </span>
        </div>

        {/* Available Cash Buying Power */}
        <div className="flex flex-col border-l border-[#1c2b3c] pl-2 sm:pl-3">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Available Buying Power</span>
          <span className="font-mono text-[17px] font-bold text-[#adc6ff] mt-0.5">
            ₹{paperState.cash.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-[#8c909f] font-mono mt-0.5">
            {((paperState.cash / totalPortfolioNetWorth) * 100).toFixed(0)}% in Liquid Cash
          </span>
        </div>

        {/* Unrealized P&L */}
        <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-[#1c2b3c] pt-2 sm:pt-0 sm:pl-3">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Unrealized Open P&L</span>
          <span
            className={`font-mono text-[17px] font-bold mt-0.5 ${
              totalUnrealizedPnL >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
            }`}
          >
            {totalUnrealizedPnL >= 0 ? '+' : ''}₹{totalUnrealizedPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span
            className={`text-[10px] font-mono mt-0.5 ${
              totalUnrealizedPnLPct >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
            }`}
          >
            {totalUnrealizedPnLPct >= 0 ? '+' : ''}{totalUnrealizedPnLPct.toFixed(2)}% ROI
          </span>
        </div>

        {/* Realized P&L */}
        <div className="flex flex-col border-t sm:border-t-0 border-l border-[#1c2b3c] pt-2 sm:pt-0 pl-2 sm:pl-3">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Realized Closed P&L</span>
          <span
            className={`font-mono text-[17px] font-bold mt-0.5 ${
              totalRealizedPnL >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
            }`}
          >
            {totalRealizedPnL >= 0 ? '+' : ''}₹{totalRealizedPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-[#8c909f] font-mono mt-0.5">
            {closedSales.length} closed roundtrips
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-2 relative z-10 flex-wrap gap-2">
        <div className="flex bg-[#0d1c2d] p-0.5 rounded-xl border border-[#1c2b3c]">
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'positions'
                ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">inventory_2</span>
            <span>Active Holdings ({positionRows.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'bg-[#1c2b3c] text-[#4edea3] shadow-sm border border-[#00a572]/40'
                : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">shopping_cart</span>
            <span>Trade Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">history</span>
            <span>Trade Log ({paperState.orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-[#1c2b3c] text-[#c0c1ff] shadow-sm border border-[#c0c1ff]/30'
                : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">analytics</span>
            <span>Analytics</span>
          </button>
        </div>

        {activeTab === 'positions' && (
          <button
            onClick={() => setActiveTab('terminal')}
            className="px-3 py-1 rounded-lg bg-[#00a572] hover:bg-[#4edea3] text-[#00281b] text-[12px] font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Order</span>
          </button>
        )}
      </div>

      {/* ================= VIEW 1: ACTIVE HOLDINGS ================= */}
      {activeTab === 'positions' && (
        <div className="space-y-2.5 relative z-10">
          {positionRows.length === 0 ? (
            <div className="bg-[#0d1c2d] rounded-xl p-8 border border-[#1c2b3c] text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[#8c909f] text-[36px]">work_history</span>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#d4e4fa]">No Open Paper Positions</span>
                <span className="text-[11px] text-[#8c909f] mt-0.5">
                  Your simulated portfolio is 100% in cash. Use the Trade Terminal to purchase equities.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('terminal')}
                className="mt-1 px-4 py-2 rounded-xl bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                <span>Open Trade Terminal</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {positionRows.map((pos) => {
                const isPositive = pos.unrealizedPnL >= 0;

                return (
                  <div
                    key={pos.ticker}
                    className="bg-[#0d1c2d] hover:bg-[#152335] rounded-xl p-3 border border-[#1c2b3c] flex items-center justify-between flex-wrap gap-2 transition-all group"
                  >
                    {/* Left: Ticker & Shares */}
                    <div className="flex items-center gap-2.5 min-w-[170px]">
                      <div className="w-9 h-9 rounded-xl bg-[#1c2b3c] flex items-center justify-center font-mono font-bold text-[#adc6ff] text-[13px] border border-[#273647]">
                        {pos.ticker.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[14px] text-[#d4e4fa] font-mono group-hover:text-[#adc6ff] transition-colors">
                            {pos.ticker}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#8c909f] text-[10px] font-mono">
                            {pos.shares} shs
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8c909f] truncate max-w-[150px]">
                          Avg: ₹{pos.avgBuyPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Current Price & Market Value */}
                    <div className="flex flex-col items-end min-w-[110px]">
                      <span className="font-mono text-[13px] font-bold text-[#d4e4fa]">
                        ₹{pos.currentVal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-[10px] text-[#8c909f] font-mono">
                        LTP: ₹{pos.stock.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Right: Unrealized P&L */}
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span
                        className={`font-mono text-[13px] font-bold flex items-center gap-0.5 ${
                          isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                        </span>
                        <span>
                          {isPositive ? '+' : ''}₹{pos.unrealizedPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </span>
                      <span
                        className={`font-mono text-[10px] font-semibold ${
                          isPositive ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                        }`}
                      >
                        {isPositive ? '+' : ''}{pos.unrealizedPnLPct.toFixed(2)}%
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <button
                        onClick={() => handleQuickTrade(pos.ticker, 'BUY')}
                        className="px-2.5 py-1 rounded-lg bg-[#00a572]/20 hover:bg-[#00a572]/35 text-[#4edea3] text-[11px] font-bold font-mono transition-colors"
                      >
                        Buy More
                      </button>
                      <button
                        onClick={() => handleQuickTrade(pos.ticker, 'SELL')}
                        className="px-2.5 py-1 rounded-lg bg-[#93000a]/25 hover:bg-[#93000a]/40 text-[#ffb4ab] text-[11px] font-bold font-mono transition-colors"
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2: TRADE TERMINAL ================= */}
      {activeTab === 'terminal' && (
        <form onSubmit={handleExecuteOrder} className="space-y-3.5 relative z-10">
          {/* Ticker Selector & Quote Header */}
          <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8c909f] uppercase font-semibold">Select Symbol:</span>
              <select
                value={selectedTicker}
                onChange={(e) => {
                  setSelectedTicker(e.target.value);
                  const st = STOCKS_DATA[e.target.value];
                  if (st && onSelectStock) onSelectStock(st);
                }}
                className="bg-[#1c2b3c] text-[#d4e4fa] font-mono font-bold text-[13px] px-2.5 py-1 rounded-lg border border-[#273647] focus:outline-none focus:border-[#4d8eff]"
              >
                {Object.keys(STOCKS_DATA).map((t) => (
                  <option key={t} value={t}>
                    {t} - {STOCKS_DATA[t].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Price Tag */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[16px] font-bold text-[#d4e4fa]">
                ₹{activeStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
                  activeStock.changePercent >= 0 ? 'bg-[#00a572]/20 text-[#4edea3]' : 'bg-[#93000a]/30 text-[#ffb4ab]'
                }`}
              >
                {activeStock.changePercent >= 0 ? '+' : ''}{activeStock.changePercent}%
              </span>
            </div>
          </div>

          {/* Side Selector: Buy vs Sell */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrderSide('BUY')}
              className={`py-2.5 rounded-xl font-bold text-[13px] font-mono flex items-center justify-center gap-1.5 transition-all ${
                orderSide === 'BUY'
                  ? 'bg-[#00a572] text-[#00281b] shadow-lg shadow-[#00a572]/20 ring-2 ring-[#4edea3]'
                  : 'bg-[#0d1c2d] text-[#8c909f] hover:text-[#d4e4fa] border border-[#1c2b3c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>BUY / LONG</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderSide('SELL')}
              className={`py-2.5 rounded-xl font-bold text-[13px] font-mono flex items-center justify-center gap-1.5 transition-all ${
                orderSide === 'SELL'
                  ? 'bg-[#ff5449] text-[#2c0001] shadow-lg shadow-[#ff5449]/20 ring-2 ring-[#ff897d]'
                  : 'bg-[#0d1c2d] text-[#8c909f] hover:text-[#d4e4fa] border border-[#1c2b3c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">remove_circle</span>
              <span>SELL / CLOSE ({sharesOwned} owned)</span>
            </button>
          </div>

          {/* Order Configuration Box */}
          <div className="bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c] space-y-3">
            {/* Order Type Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#8c909f] font-semibold uppercase">Execution Type:</span>
              <div className="flex bg-[#1c2b3c] p-0.5 rounded-lg border border-[#273647]">
                <button
                  type="button"
                  onClick={() => setOrderType('MARKET')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    orderType === 'MARKET' ? 'bg-[#4d8eff] text-[#00285d]' : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  Market (Live)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('LIMIT')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    orderType === 'LIMIT' ? 'bg-[#4d8eff] text-[#00285d]' : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  Limit
                </button>
              </div>
            </div>

            {/* Limit Price Input if limit order */}
            {orderType === 'LIMIT' && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#8c909f] font-semibold">Limit Price (₹):</span>
                <input
                  type="number"
                  step="0.05"
                  value={limitPriceInput}
                  onChange={(e) => setLimitPriceInput(e.target.value)}
                  className="w-32 bg-[#1c2b3c] text-[#d4e4fa] font-mono font-bold text-[13px] px-3 py-1.5 rounded-lg border border-[#273647] text-right focus:outline-none focus:border-[#4d8eff]"
                />
              </div>
            )}

            {/* Share Quantity Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#8c909f] font-semibold uppercase">Quantity (Shares):</span>
                <input
                  type="number"
                  min="1"
                  max={orderSide === 'SELL' ? sharesOwned : undefined}
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  className="w-32 bg-[#1c2b3c] text-[#d4e4fa] font-mono font-bold text-[14px] px-3 py-1.5 rounded-lg border border-[#273647] text-right focus:outline-none focus:border-[#4d8eff]"
                />
              </div>

              {/* Quick Allocation Chips */}
              <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => handlePercentageQuantity(0.25)}
                  className="px-2 py-0.5 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] transition-colors"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handlePercentageQuantity(0.5)}
                  className="px-2 py-0.5 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] transition-colors"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handlePercentageQuantity(0.75)}
                  className="px-2 py-0.5 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] transition-colors"
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={handleSetMaxQuantity}
                  className="px-2 py-0.5 rounded bg-[#4d8eff]/20 hover:bg-[#4d8eff]/35 text-[#adc6ff] font-bold border border-[#4d8eff]/30 transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Order Cost Breakdown Box */}
            <div className="bg-[#010f1f] p-2.5 rounded-lg border border-[#1c2b3c] space-y-1 text-[11px] font-mono">
              <div className="flex justify-between items-center text-[#8c909f]">
                <span>Order Execution Price</span>
                <span className="text-[#d4e4fa]">₹{executionPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#8c909f]">
                <span>Estimated Total Value</span>
                <span className="text-[#d4e4fa] font-bold text-[13px]">
                  ₹{estimatedOrderCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#8c909f]">
                <span>Brokerage & Regulatory Taxes</span>
                <span className="text-[#4edea3]">₹0.00 (Simulated Paper)</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#1c2b3c] text-[#8c909f]">
                <span>{orderSide === 'BUY' ? 'Remaining Buying Power' : 'Available Shares After'}</span>
                <span className={orderSide === 'BUY' && remainingCashAfterBuy < 0 ? 'text-[#ff5449] font-bold' : 'text-[#adc6ff]'}>
                  {orderSide === 'BUY'
                    ? `₹${Math.max(0, remainingCashAfterBuy).toLocaleString('en-IN')}`
                    : `${Math.max(0, sharesOwned - parsedQuantity)} shares`}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={orderSide === 'BUY' ? remainingCashAfterBuy < 0 : sharesOwned < parsedQuantity || sharesOwned === 0}
              className={`w-full py-3 rounded-xl font-bold font-mono text-[14px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                orderSide === 'BUY'
                  ? 'bg-[#00a572] hover:bg-[#4edea3] text-[#00281b] disabled:bg-[#1c2b3c] disabled:text-[#8c909f]'
                  : 'bg-[#ff5449] hover:bg-[#ff897d] text-[#2c0001] disabled:bg-[#1c2b3c] disabled:text-[#8c909f]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {orderSide === 'BUY' ? 'bolt' : 'receipt_long'}
              </span>
              <span>
                {orderSide === 'BUY'
                  ? `Execute Virtual BUY (${parsedQuantity} ${selectedTicker})`
                  : `Execute Virtual SELL (${parsedQuantity} ${selectedTicker})`}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* ================= VIEW 3: TRANSACTION HISTORY ================= */}
      {activeTab === 'history' && (
        <div className="space-y-2.5 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
              {(['ALL', 'BUY', 'SELL'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                    historyFilter === filter
                      ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm'
                      : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 rounded-lg bg-[#0d1c2d] hover:bg-[#1c2b3c] text-[#adc6ff] text-[11px] font-semibold border border-[#1c2b3c] flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {paperState.orders
              .filter((o) => historyFilter === 'ALL' || o.side === historyFilter)
              .map((ord) => {
                const isBuy = ord.side === 'BUY';

                return (
                  <div
                    key={ord.id}
                    className="bg-[#0d1c2d] rounded-xl p-2.5 border border-[#1c2b3c] flex items-center justify-between text-[11px] font-mono gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          isBuy ? 'bg-[#00a572]/20 text-[#4edea3]' : 'bg-[#93000a]/30 text-[#ffb4ab]'
                        }`}
                      >
                        {ord.side}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#d4e4fa] text-[12px]">{ord.ticker}</span>
                        <span className="text-[10px] text-[#8c909f]">{ord.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[#c2c6d6]">{ord.shares} shares @ ₹{ord.price.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-bold text-[#d4e4fa]">
                        ₹{ord.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      {ord.realizedPnL !== undefined && (
                        <span
                          className={`text-[10px] font-bold ${
                            ord.realizedPnL >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                          }`}
                        >
                          P&L: {ord.realizedPnL >= 0 ? '+' : ''}₹{ord.realizedPnL.toFixed(2)} ({ord.realizedPnLPct}%)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ================= VIEW 4: PERFORMANCE ANALYTICS ================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-3 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-center">
            <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
              <span className="text-[10px] text-[#8c909f] uppercase font-sans">Trading Win Rate</span>
              <span className="font-bold text-[#4edea3] text-[18px] mt-1">{winRate}%</span>
              <span className="text-[10px] text-[#8c909f]">{winningSales.length}/{closedSales.length} profitable closed trades</span>
            </div>

            <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
              <span className="text-[10px] text-[#8c909f] uppercase font-sans">Cumulative ROI</span>
              <span
                className={`font-bold text-[18px] mt-1 ${
                  totalPortfolioPnL >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                }`}
              >
                {totalPortfolioPnLPct >= 0 ? '+' : ''}{totalPortfolioPnLPct.toFixed(2)}%
              </span>
              <span className="text-[10px] text-[#8c909f]">Against ₹10,00,000 base</span>
            </div>

            <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
              <span className="text-[10px] text-[#8c909f] uppercase font-sans">Total Trades Placed</span>
              <span className="font-bold text-[#adc6ff] text-[18px] mt-1">{paperState.orders.length}</span>
              <span className="text-[10px] text-[#8c909f]">Executed on simulated book</span>
            </div>

            <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col">
              <span className="text-[10px] text-[#8c909f] uppercase font-sans">Equity / Cash Ratio</span>
              <span className="font-bold text-[#d4e4fa] text-[18px] mt-1">
                {((totalStockValue / totalPortfolioNetWorth) * 100).toFixed(0)} : {((paperState.cash / totalPortfolioNetWorth) * 100).toFixed(0)}
              </span>
              <span className="text-[10px] text-[#8c909f]">Portfolio Allocation</span>
            </div>
          </div>

          <div className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2 text-[#c2c6d6]">
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]">verified</span>
              <span>All simulated transactions are locally archived with zero execution latency.</span>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('markets')}
                className="text-[#adc6ff] hover:underline font-semibold flex items-center gap-0.5 text-[11px]"
              >
                <span>Live Candlesticks</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#122131] w-full max-w-sm rounded-2xl p-4 shadow-2xl border border-[#1c2b3c] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[22px]">warning</span>
              <h3 className="font-bold text-[15px]">Reset Virtual Portfolio?</h3>
            </div>
            <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
              This will restore your cash balance to ₹10,00,000 and clear all active open positions and order history. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1c2b3c] text-[#c2c6d6] text-[12px] font-semibold hover:bg-[#273647]"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPortfolio}
                className="px-4 py-1.5 rounded-lg bg-[#ff5449] hover:bg-[#ff897d] text-[#2c0001] text-[12px] font-bold"
              >
                Reset Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
