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
  const [activeTab, setActiveTab] = useState<'positions' | 'analytics' | 'history'>('positions');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);



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
    showToast('Virtual portfolio reset to ₹10,00,000 cash.');
  };

  // Add 1 Lakh Funds
  const handleAddFunds = () => {
    setPaperState((prev) => ({
      ...prev,
      cash: prev.cash + 100000
    }));
    showToast('Added ₹1,00,000 virtual cash to liquid capital!');
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

        {/* Available Cash Capital */}
        <div className="flex flex-col border-l border-[#1c2b3c] pl-2 sm:pl-3">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Available Liquid Capital</span>
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
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">history</span>
            <span>Allocation Log ({paperState.orders.length})</span>
          </button>
        </div>
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
                  Your simulated portfolio is currently in cash allocation mode.
                </span>
              </div>
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

                    {/* Holding Navigation Action */}
                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <button
                        onClick={() => {
                          if (onSelectStock) onSelectStock(pos.stock);
                          if (onNavigate) onNavigate('technical-analysis');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] text-[11px] font-medium font-mono transition-colors flex items-center gap-1"
                      >
                        <span>Technical View</span>
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}



      {/* ================= VIEW 3: TRANSACTION HISTORY ================= */}
      {activeTab === 'history' && (
        <div className="space-y-2.5 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[12px] font-semibold text-[#8c909f] font-mono">
              Simulated Audit Ledger ({paperState.orders.length} entries)
            </span>

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
                          isBuy ? 'bg-[#00a572]/20 text-[#4edea3]' : 'bg-[#3131c0]/20 text-[#adc6ff]'
                        }`}
                      >
                        {isBuy ? 'LONG ALLOCATION' : 'PORTFOLIO REBALANCE'}
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
