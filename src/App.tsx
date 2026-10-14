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

export default function App() {
  // Make AI Insights ('ai-predict') the primary default page
  const [currentTab, setCurrentTab] = useState<ScreenTab>('ai-predict');
  const [currentStock, setCurrentStock] = useState<StockData>(STOCKS_DATA.RELIANCE);
  const [watchlist, setWatchlist] = useState<string[]>([
    'RELIANCE',
    'TCS',
    'INFY',
    'HDFCBANK',
    'TATASTEEL'
  ]);

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
    return 'dark';
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

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3600);
  };

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
          />
        );
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
        return <OverviewScreen onNavigate={setCurrentTab} />;
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
    <div className="min-h-screen bg-[#060e1a] text-[#d4e4fa] font-body selection:bg-cyan-500/30 selection:text-white relative transition-colors duration-200">
      {/* 1. Fixed Left Vertical Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* 2. Main Scrollable Content Container (Offset by sidebar width on desktop) */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-18' : 'md:pl-64'
        }`}
      >
        {/* Top Header - Aligned with main content, does not cover sidebar */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAuth={() => setAuthScreen('login')}
          onNotificationClick={() => setIsPriceAlertOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          onToggleMobileMenu={() => setIsMobileNavOpen(true)}
          currentTab={currentTab}
          currentStockTicker={currentStock.ticker}
        />

        {/* Live Financial News Ticker Marquee */}
        <div className="w-full bg-[#0a1424] border-b border-[#14233c] shrink-0">
          <LiveNewsTicker
            onSelectStock={handleSelectStock}
            onNavigate={setCurrentTab}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 lg:px-8 py-5 flex flex-col">
          {renderActiveScreen()}
        </main>
      </div>

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
