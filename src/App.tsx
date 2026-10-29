import React, { useState, useEffect } from 'react';
import { ScreenTab, AuthScreen, StockData } from './types';
import { STOCKS_DATA } from './data/stocks';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { BacktestModal } from './components/BacktestModal';
import { JsonDossierModal } from './components/JsonDossierModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { LiveNewsTicker } from './components/LiveNewsTicker';

import { AIPredictScreen } from './screens/AIPredictScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { MarketsScreen } from './screens/MarketsScreen';
import { RiskRadarScreen } from './screens/RiskRadarScreen';
import { WatchlistScreen } from './screens/WatchlistScreen';
import { OverviewScreen } from './screens/OverviewScreen';
import { Portfolio } from './components/Portfolio';
import { MarketHeatmap } from './components/MarketHeatmap';
import { PaperTrading } from './components/PaperTrading';
import { ScreenerScreen } from './screens/ScreenerScreen';
import { NewsSentimentScreen } from './screens/NewsSentimentScreen';
import { TechnicalAnalysisScreen } from './screens/TechnicalAnalysisScreen';
import { BacktestScreen } from './screens/BacktestScreen';
import { LearnScreen } from './screens/LearnScreen';
import { Navigation } from './components/Navigation';
import { exportCurrentViewFinancialData } from './utils/csvExport';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

export default function App() {
  // Make Home Dashboard the primary default page
  const [currentTab, setCurrentTab] = useState<ScreenTab>('dashboard');
  const [currentStock, setCurrentStock] = useState<StockData>(STOCKS_DATA.RELIANCE);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stocksense_watchlist_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'TATAMOTORS'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('stocksense_watchlist_v2', JSON.stringify(watchlist));
    } catch (e) {
      // ignore
    }
  }, [watchlist]);

  // Sidebar Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stocksense_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('stocksense_sidebar_collapsed', String(isSidebarCollapsed));
    } catch (e) {
      // ignore
    }
  }, [isSidebarCollapsed]);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('none');
  const [isBacktestOpen, setIsBacktestOpen] = useState(false);
  const [isJsonDossierOpen, setIsJsonDossierOpen] = useState(false);
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Dark / Light Theme Mode
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('stocksense_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('stocksense_theme', theme);
    } catch (e) {
      // ignore
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3600);
  };

  // Export current view's financial data to CSV
  const handleExportCSV = () => {
    try {
      const result = exportCurrentViewFinancialData(currentTab, currentStock, watchlist);
      showToast(`📥 Exported ${result.viewTitle} (${result.rowCount} rows) to ${result.filename}`);
    } catch (err) {
      console.error('CSV export failed:', err);
      showToast('❌ Failed to export financial data to CSV.');
    }
  };

  // Global Keyboard Shortcuts Listener: '?' helper, Cmd+K, Cmd+E, Cmd+D, Cmd+B, Cmd+P, Cmd+J, Esc, and quick 1-9 navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          (target as any).isContentEditable);

      // 1. Mod-key shortcuts (Cmd on Mac, Ctrl on Windows/Linux)
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          setIsSearchOpen((prev) => !prev);
          return;
        }
        if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          handleExportCSV();
          return;
        }
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          toggleTheme();
          return;
        }
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setIsSidebarCollapsed((prev) => !prev);
          return;
        }
        if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setIsPriceAlertOpen((prev) => !prev);
          return;
        }
        if (e.key === 'j' || e.key === 'J') {
          e.preventDefault();
          setIsJsonDossierOpen((prev) => !prev);
          return;
        }
      }

      // If user is currently typing in an input / textarea / select, skip single-key triggers
      if (isInput) return;

      // 2. Global Help Modal Trigger: '?' or 'Shift + /'
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // 3. Escape key closes any active modal or drawer
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsSearchOpen(false);
        setIsPriceAlertOpen(false);
        setIsJsonDossierOpen(false);
        setIsBacktestOpen(false);
        setAuthScreen('none');
        return;
      }

      // 4. Quick Navigation & Action commands
      switch (e.key) {
        case '1':
          setCurrentTab('ai-predict');
          showToast('Navigated to AI Insights (1)');
          break;
        case '2':
          setCurrentTab('dashboard');
          showToast('Navigated to Dashboard (2)');
          break;
        case '3':
          setCurrentTab('markets');
          showToast('Navigated to Markets (3)');
          break;
        case '4':
          setCurrentTab('watchlist');
          showToast('Navigated to Watchlist (4)');
          break;
        case '5':
          setCurrentTab('portfolio');
          showToast('Navigated to Portfolio (5)');
          break;
        case '6':
          setCurrentTab('risk-radar');
          showToast('Navigated to Risk Radar (6)');
          break;
        case '7':
          setCurrentTab('screener');
          showToast('Navigated to Stock Screener (7)');
          break;
        case '8':
          setCurrentTab('technical-analysis');
          showToast('Navigated to Technical Analysis (8)');
          break;
        case '9':
          setCurrentTab('backtesting');
          showToast('Navigated to Backtesting (9)');
          break;
        case '0':
          setCurrentTab('heatmap');
          showToast('Navigated to Sector Heatmap (0)');
          break;
        case 'n':
        case 'N':
          setCurrentTab('news-sentiment');
          showToast('Navigated to News & Sentiment (N)');
          break;
        case 'o':
        case 'O':
          setCurrentTab('overview');
          showToast('Navigated to Overview (O)');
          break;
        case 't':
        case 'T':
          toggleTheme();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, currentTab, currentStock, watchlist]);

  // Price Alerts with LocalStorage persistence
  const [priceAlerts, setPriceAlerts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('stocksense_price_alerts_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'alert-rel-1',
        ticker: 'RELIANCE',
        condition: 'ABOVE',
        targetPrice: 2880.00,
        createdPrice: 2850.40,
        createdAt: new Date().toISOString(),
        isActive: true,
        note: 'Resistance Breakout Level'
      },
      {
        id: 'alert-rel-2',
        ticker: 'RELIANCE',
        condition: 'BELOW',
        targetPrice: 2810.00,
        createdPrice: 2850.40,
        createdAt: new Date().toISOString(),
        isActive: true,
        note: '20-Day SMA Support Floor'
      },
      {
        id: 'alert-tcs-1',
        ticker: 'TCS',
        condition: 'ABOVE',
        targetPrice: 4200.00,
        createdPrice: 4120.15,
        createdAt: new Date().toISOString(),
        isActive: true,
        note: 'All-Time High Re-test'
      }
    ];
  });

  const handleAddPriceAlert = (newAlert: any) => {
    const alertItem = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setPriceAlerts((prev) => {
      const updated = [alertItem, ...prev];
      try {
        localStorage.setItem('stocksense_price_alerts_v1', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
    showToast(`🔔 Price alert set for ${newAlert.ticker} at ₹${newAlert.targetPrice.toFixed(2)}`);
  };

  const handleDeletePriceAlert = (id: string) => {
    setPriceAlerts((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('stocksense_price_alerts_v1', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
    showToast('Price alert deleted');
  };

  const handleTogglePriceAlert = (id: string) => {
    setPriceAlerts((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a));
      try {
        localStorage.setItem('stocksense_price_alerts_v1', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  // Mock Price Fluctuation Simulator & Threshold Evaluation
  const handleSimulatePriceTick = (direction: 'UP' | 'DOWN', percent: number) => {
    const multiplier = direction === 'UP' ? 1 + percent / 100 : 1 - percent / 100;
    const oldPrice = currentStock.price;
    const updatedPrice = Math.round(oldPrice * multiplier * 100) / 100;
    const priceDelta = updatedPrice - (oldPrice - currentStock.change);
    const deltaPercent = Math.round(((updatedPrice - (oldPrice - currentStock.change)) / (oldPrice - currentStock.change)) * 10000) / 100;

    const updatedStock: StockData = {
      ...currentStock,
      price: updatedPrice,
      change: Math.round(priceDelta * 100) / 100,
      changePercent: deltaPercent
    };
    setCurrentStock(updatedStock);

    // Evaluate active alerts
    const triggered = priceAlerts.filter((a) => {
      if (!a.isActive || a.ticker !== currentStock.ticker) return false;
      if (a.condition === 'ABOVE' && updatedPrice >= a.targetPrice) return true;
      if (a.condition === 'BELOW' && updatedPrice <= a.targetPrice) return true;
      return false;
    });

    if (triggered.length > 0) {
      const t = triggered[0];
      const isAbove = t.condition === 'ABOVE';
      showToast(
        `🚨 PRICE ALERT TRIGGERED: ${t.ticker} crossed ${isAbove ? 'above' : 'below'} ₹${t.targetPrice.toFixed(2)}! (Current: ₹${updatedPrice.toFixed(2)})`
      );
    } else {
      showToast(
        `Market tick simulated for ${currentStock.ticker}: ₹${updatedPrice.toFixed(2)} (${deltaPercent >= 0 ? '+' : ''}${deltaPercent}%)`
      );
    }
  };

  const handleToggleWatchlist = (ticker: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(ticker);
      if (exists) {
        showToast(`Removed ${ticker} from Watchlist`);
        return prev.filter((t) => t !== ticker);
      } else {
        showToast(`Added ${ticker} to Watchlist`);
        return [...prev, ticker];
      }
    });
  };

  const handleSelectStock = (stock: StockData) => {
    setCurrentStock(stock);
    showToast(`Switched active context to ${stock.ticker}`);
  };

  // Screen Router
  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'ai-predict':
        return (
          <AIPredictScreen
            currentStock={currentStock}
            onOpenJsonDossier={() => setIsJsonDossierOpen(true)}
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            currentStock={currentStock}
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenBacktest={() => setIsBacktestOpen(true)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        );
      case 'learn':
        return <LearnScreen onNavigate={setCurrentTab} />;
      case 'markets':
        return (
          <MarketsScreen
            currentStock={currentStock}
            onNavigate={setCurrentTab}
            isWatchlisted={watchlist.includes(currentStock.ticker)}
            onToggleWatchlist={() => handleToggleWatchlist(currentStock.ticker)}
            onShare={() => showToast(`Analysis link for ${currentStock.ticker} copied to clipboard!`)}
            onSetAlert={() => setIsPriceAlertOpen(true)}
            watchlist={watchlist}
          />
        );
      case 'risk-radar':
        return <RiskRadarScreen currentStock={currentStock} />;
      case 'watchlist':
        return (
          <WatchlistScreen
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        );
      case 'portfolio':
        return (
          <Portfolio
            watchlist={watchlist}
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        );
      case 'paper-trading':
        return (
          <div className="flex flex-col w-full gap-4 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-8 md:pb-12">
            <PaperTrading
              currentStock={currentStock}
              onSelectStock={handleSelectStock}
              onNavigate={setCurrentTab}
            />
          </div>
        );
      case 'backtesting':
        return (
          <BacktestScreen
            currentStock={currentStock}
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
          />
        );
      case 'heatmap':
        return (
          <div className="flex flex-col w-full gap-4 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-8 md:pb-12">
            <MarketHeatmap
              onSelectStock={handleSelectStock}
              onNavigate={setCurrentTab}
            />
          </div>
        );
      case 'screener':
        return (
          <ScreenerScreen
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
          />
        );
      case 'news-sentiment':
        return (
          <NewsSentimentScreen
            currentStock={currentStock}
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
          />
        );
      case 'technical-analysis':
        return (
          <TechnicalAnalysisScreen
            currentStock={currentStock}
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
          />
        );
      case 'overview':
        return (
          <OverviewScreen
            onNavigate={setCurrentTab}
            currentStock={currentStock}
            onSelectStock={handleSelectStock}
          />
        );
      default:
        return (
          <AIPredictScreen
            currentStock={currentStock}
            onOpenJsonDossier={() => setIsJsonDossierOpen(true)}
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08101e] text-slate-900 dark:text-slate-100 font-body selection:bg-teal-500/20 selection:text-teal-900 relative transition-colors duration-200 flex flex-col pb-16 md:pb-6">
      {/* 1. Clean Top Navigation Bar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setAuthScreen('login')}
        onNotificationClick={() => setIsPriceAlertOpen(true)}
        onExportCSV={handleExportCSV}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        onToggleMobileMenu={() => setIsMobileNavOpen(true)}
        currentTab={currentTab}
        currentStockTicker={currentStock.ticker}
        onSelectTab={setCurrentTab}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {renderActiveScreen()}
      </main>

      {/* 3. Mobile Bottom Navigation Bar */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenProfile={() => setAuthScreen('login')}
      />

      {/* Modals & Dialogs */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={handleSelectStock}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <LoginModal
        isOpen={authScreen === 'login'}
        onClose={() => setAuthScreen('none')}
        onSwitchToRegister={() => setAuthScreen('register')}
        onSwitchToForgot={() => setAuthScreen('forgot')}
        onLoginSuccess={(name, email) => {
          showToast(`Welcome back, ${name} (${email})!`);
        }}
      />

      <RegisterModal
        isOpen={authScreen === 'register'}
        onClose={() => setAuthScreen('none')}
        onSwitchToLogin={() => setAuthScreen('login')}
        onRegisterSuccess={(name, email) => {
          showToast(`Account registered for ${name}! Logged into Quant Sandbox.`);
        }}
      />

      <ForgotPasswordModal
        isOpen={authScreen === 'forgot'}
        onClose={() => setAuthScreen('none')}
        onSwitchToLogin={() => setAuthScreen('login')}
      />

      <BacktestModal
        isOpen={isBacktestOpen}
        onClose={() => setIsBacktestOpen(false)}
        currentStock={currentStock}
      />

      <JsonDossierModal
        isOpen={isJsonDossierOpen}
        onClose={() => setIsJsonDossierOpen(false)}
        currentStock={currentStock}
      />

      <PriceAlertModal
        isOpen={isPriceAlertOpen}
        onClose={() => setIsPriceAlertOpen(false)}
        currentStock={currentStock}
        alerts={priceAlerts}
        onAddAlert={handleAddPriceAlert}
        onDeleteAlert={handleDeletePriceAlert}
        onToggleAlert={handleTogglePriceAlert}
        onSimulateTick={handleSimulatePriceTick}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigate={setCurrentTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onExportCSV={handleExportCSV}
        toggleTheme={toggleTheme}
        theme={theme}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenPriceAlert={() => setIsPriceAlertOpen(true)}
        onOpenJsonDossier={() => setIsJsonDossierOpen(true)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#0f1d33] text-white text-[13px] font-medium shadow-2xl border border-cyan-500/30 flex items-center gap-2.5 max-w-sm animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="truncate flex-1">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#64748b] hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
