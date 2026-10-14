import { ScreenTab, StockData } from '../types';
import { STOCKS_DATA, INDICES_DATA } from '../data/stocks';
import { NSE500_SECTORS_DATA } from '../data/nse500';
import { STOCK_HEADLINES_DATABASE } from '../data/news';

/**
 * Escapes a cell value according to RFC 4180 standard.
 */
function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Converts a 2D array of rows into standard CSV text.
 */
function rowsToCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const rowLines = rows.map((row) => row.map(escapeCsvCell).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Initiates browser file download for a CSV string.
 */
export function triggerCsvDownload(filename: string, csvContent: string): void {
  // UTF-8 BOM so Excel and Google Sheets open Indian Rupee symbols (₹) and unicode perfectly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ExportResult {
  success: boolean;
  filename: string;
  rowCount: number;
  viewTitle: string;
}

/**
 * Formats current date for filenames: YYYY-MM-DD_HHmm
 */
function getTimestampString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}${mins}`;
}

/**
 * Exports financial data specific to the current active screen view.
 */
export function exportCurrentViewFinancialData(
  currentTab: ScreenTab,
  currentStock: StockData,
  watchlist: string[]
): ExportResult {
  const timestamp = getTimestampString();
  const nowIso = new Date().toISOString();

  let filename = '';
  let viewTitle = '';
  let csvText = '';
  let rowCount = 0;

  switch (currentTab) {
    case 'ai-predict': {
      viewTitle = `AI Insights & Explainability (${currentStock.ticker})`;
      filename = `StockSense_AI_Insights_${currentStock.ticker}_${timestamp}.csv`;

      // 1. Stock Overview Section
      const stockHeaders = [
        'Ticker',
        'Company Name',
        'Exchange',
        'Sector',
        'Current Price (INR)',
        'Change (INR)',
        'Change (%)',
        'Market Cap',
        'AI Direction Signal',
        'AI Direction Label',
        'Confidence (%)',
        'Active Model',
        'Win Rate (%)',
        'Risk Category',
        'Risk Score (1-100)',
        'Annualized Volatility (%)',
        'VaR 95% (%)',
        'Sharpe Ratio',
        'Beta vs NIFTY',
        'RSI (14)',
        'MACD Histogram',
        'SMA 20 (INR)',
        'SMA 50 (INR)',
        'SMA 200 (INR)',
        'Bollinger Upper (INR)',
        'Bollinger Lower (INR)',
        'Export Timestamp'
      ];

      const stockRow = [
        currentStock.ticker,
        currentStock.name,
        currentStock.exchange,
        currentStock.sector,
        currentStock.price.toFixed(2),
        currentStock.change.toFixed(2),
        currentStock.changePercent.toFixed(2),
        currentStock.marketCap,
        currentStock.direction,
        currentStock.directionLabel,
        currentStock.confidence,
        currentStock.activeModel,
        currentStock.winRate,
        currentStock.riskCategory,
        currentStock.riskScore,
        currentStock.annVolatility.toFixed(2),
        currentStock.var95.toFixed(2),
        currentStock.sharpeRatio.toFixed(2),
        currentStock.beta.toFixed(2),
        currentStock.rsi.toFixed(2),
        currentStock.macd.histogram.toFixed(2),
        currentStock.sma20.toFixed(2),
        currentStock.sma50.toFixed(2),
        currentStock.sma200.toFixed(2),
        currentStock.bollinger.upper.toFixed(2),
        currentStock.bollinger.lower.toFixed(2),
        nowIso
      ];

      // 2. SHAP Attribution Table
      const shapHeaders = ['Attribution Type', 'Feature Name', 'SHAP Impact Score', 'Directional Bias'];
      const shapRows = currentStock.shapFactors.map((f) => [
        'SHAP Tree Explainer',
        f.feature,
        f.impact.toFixed(3),
        f.isBullish ? 'BULLISH' : 'BEARISH'
      ]);

      // 3. Multi-Model Agreement
      const ensembleHeaders = ['Model Name', 'Architecture', 'Signal Direction', 'Confidence Score (%)'];
      const ensembleRows = currentStock.ensembleModels.map((m) => [
        m.name,
        m.architecture,
        m.direction,
        m.confidence
      ]);

      csvText = [
        '=== STOCKSENSE AI QUANTITATIVE DOSSIER ===',
        rowsToCsv(stockHeaders, [stockRow]),
        '',
        '=== REAL-TIME SHAP FEATURE ATTRIBUTION FACTORS ===',
        rowsToCsv(shapHeaders, shapRows),
        '',
        '=== ENSEMBLE MODEL PREDICTION CONSENSUS ===',
        rowsToCsv(ensembleHeaders, ensembleRows)
      ].join('\r\n');

      rowCount = 1 + shapRows.length + ensembleRows.length;
      break;
    }

    case 'dashboard': {
      viewTitle = 'Institutional Dashboard Financial Dataset';
      filename = `StockSense_Dashboard_Overview_${timestamp}.csv`;

      // Indices section
      const indicesHeaders = ['Index Name', 'Last Value', 'Change', 'Change (%)', 'Status'];
      const indicesRows = INDICES_DATA.map((idx) => [
        idx.name,
        idx.value,
        idx.change,
        idx.changePercent.toFixed(2),
        idx.isPositive ? 'POSITIVE' : 'NEGATIVE'
      ]);

      // All tracked key stocks
      const stocksList = Object.values(STOCKS_DATA);
      const stockHeaders = [
        'Ticker',
        'Company Name',
        'Sector',
        'Price (INR)',
        'Change (INR)',
        'Change (%)',
        'Market Cap',
        'AI Direction',
        'AI Confidence (%)',
        'Risk Level',
        'RSI (14)',
        'Beta'
      ];
      const stockRows = stocksList.map((s) => [
        s.ticker,
        s.name,
        s.sector,
        s.price.toFixed(2),
        s.change.toFixed(2),
        s.changePercent.toFixed(2),
        s.marketCap,
        s.direction,
        s.confidence,
        s.riskCategory,
        s.rsi.toFixed(2),
        s.beta.toFixed(2)
      ]);

      csvText = [
        '=== BENCHMARK INDICES TELEMETRY ===',
        rowsToCsv(indicesHeaders, indicesRows),
        '',
        '=== CORE INSTITUTIONAL EQUITIES ===',
        rowsToCsv(stockHeaders, stockRows)
      ].join('\r\n');

      rowCount = indicesRows.length + stockRows.length;
      break;
    }

    case 'markets': {
      viewTitle = 'NSE 500 & Sector Market Monitor Dataset';
      filename = `StockSense_Markets_NSE500_${timestamp}.csv`;

      const headers = [
        'Ticker',
        'Company Name',
        'Sector',
        'Sector Weight (%)',
        'Price (INR)',
        'Change (INR)',
        'Change (%)',
        'Market Cap (Trillion INR)',
        'Volume (M)',
        'P/E Ratio',
        'Beta',
        '52-Week High (INR)',
        '52-Week Low (INR)',
        'RSI (14)',
        'AI Signal',
        'AI Confidence (%)'
      ];

      const rows: (string | number)[][] = [];
      NSE500_SECTORS_DATA.forEach((sec) => {
        sec.stocks.forEach((st) => {
          rows.push([
            st.ticker,
            st.name,
            sec.name,
            sec.weightPct,
            st.price.toFixed(2),
            st.changeValue.toFixed(2),
            st.changePercent.toFixed(2),
            st.marketCapTrillion.toFixed(2),
            st.volumeMillion.toFixed(2),
            st.peRatio.toFixed(1),
            st.beta.toFixed(2),
            st.week52High.toFixed(2),
            st.week52Low.toFixed(2),
            st.rsi.toFixed(1),
            st.direction,
            st.aiConfidence
          ]);
        });
      });

      csvText = rowsToCsv(headers, rows);
      rowCount = rows.length;
      break;
    }

    case 'watchlist': {
      viewTitle = 'Priority Watchlist Financial Records';
      filename = `StockSense_Watchlist_${timestamp}.csv`;

      const headers = [
        'Ticker',
        'Company Name',
        'Sector',
        'Exchange',
        'Current Price (INR)',
        'Change (INR)',
        'Change (%)',
        'Market Cap',
        'AI Direction',
        'AI Confidence (%)',
        'Risk Category',
        'RSI (14)',
        'VaR 95% (%)',
        'Sharpe Ratio'
      ];

      const rows = watchlist.map((ticker) => {
        const stock = STOCKS_DATA[ticker] || STOCKS_DATA['RELIANCE'];
        return [
          stock.ticker,
          stock.name,
          stock.sector,
          stock.exchange,
          stock.price.toFixed(2),
          stock.change.toFixed(2),
          stock.changePercent.toFixed(2),
          stock.marketCap,
          stock.direction,
          stock.confidence,
          stock.riskCategory,
          stock.rsi.toFixed(2),
          stock.var95.toFixed(2),
          stock.sharpeRatio.toFixed(2)
        ];
      });

      csvText = rowsToCsv(headers, rows);
      rowCount = rows.length;
      break;
    }

    case 'portfolio': {
      viewTitle = 'Position & Portfolio Allocation Data';
      filename = `StockSense_Portfolio_Holdings_${timestamp}.csv`;

      // Read positions from localStorage if available
      let positions = [
        { ticker: 'RELIANCE', name: 'Reliance Industries Ltd.', shares: 150, avgPrice: 2740.00 },
        { ticker: 'TCS', name: 'Tata Consultancy Services', shares: 80, avgPrice: 3950.00 },
        { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd.', shares: 200, avgPrice: 1580.00 },
        { ticker: 'INFY', name: 'Infosys Ltd.', shares: 120, avgPrice: 1720.00 },
        { ticker: 'TATASTEEL', name: 'Tata Steel Ltd.', shares: 600, avgPrice: 142.00 }
      ];

      try {
        const saved = localStorage.getItem('stocksense_portfolio_positions');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            positions = parsed.map((p: any) => ({
              ticker: p.ticker,
              name: STOCKS_DATA[p.ticker]?.name || p.ticker,
              shares: p.shares || 100,
              avgPrice: p.avgBuyPrice || 1000
            }));
          }
        }
      } catch (e) {
        // use default
      }

      const headers = [
        'Ticker',
        'Company Name',
        'Quantity (Shares)',
        'Avg Buy Price (INR)',
        'Current Price (INR)',
        'Invested Capital (INR)',
        'Current Market Value (INR)',
        'Unrealized P&L (INR)',
        'Unrealized P&L (%)',
        'Day Change (%)'
      ];

      const rows = positions.map((p) => {
        const stock = STOCKS_DATA[p.ticker] || STOCKS_DATA['RELIANCE'];
        const currentPrice = stock.price;
        const invested = p.shares * p.avgPrice;
        const currentVal = p.shares * currentPrice;
        const pnl = currentVal - invested;
        const pnlPct = (pnl / invested) * 100;

        return [
          p.ticker,
          p.name,
          p.shares,
          p.avgPrice.toFixed(2),
          currentPrice.toFixed(2),
          invested.toFixed(2),
          currentVal.toFixed(2),
          pnl.toFixed(2),
          pnlPct.toFixed(2),
          stock.changePercent.toFixed(2)
        ];
      });

      csvText = rowsToCsv(headers, rows);
      rowCount = rows.length;
      break;
    }

    case 'paper-trading': {
      viewTitle = 'Virtual Paper Trading Orders & Open Positions';
      filename = `StockSense_Paper_Trading_${timestamp}.csv`;

      let orders: any[] = [];
      try {
        const saved = localStorage.getItem('stocksense_paper_orders');
        if (saved) orders = JSON.parse(saved);
      } catch (e) {
        // ignore
      }

      if (!orders || orders.length === 0) {
        orders = [
          {
            id: 'ord-101',
            ticker: 'RELIANCE',
            companyName: 'Reliance Industries Ltd.',
            side: 'BUY',
            shares: 50,
            price: 2845.50,
            totalValue: 142275.00,
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            id: 'ord-102',
            ticker: 'INFY',
            companyName: 'Infosys Ltd.',
            side: 'BUY',
            shares: 100,
            price: 1840.20,
            totalValue: 184020.00,
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: 'ord-103',
            ticker: 'TCS',
            companyName: 'Tata Consultancy Services',
            side: 'SELL',
            shares: 25,
            price: 4160.00,
            totalValue: 104000.00,
            timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
          }
        ];
      }

      const headers = [
        'Order ID',
        'Ticker',
        'Company Name',
        'Side (BUY/SELL)',
        'Shares',
        'Execution Price (INR)',
        'Total Order Value (INR)',
        'Timestamp'
      ];

      const rows = orders.map((o) => [
        o.id,
        o.ticker,
        o.companyName,
        o.side,
        o.shares,
        Number(o.price).toFixed(2),
        Number(o.totalValue).toFixed(2),
        o.timestamp
      ]);

      csvText = rowsToCsv(headers, rows);
      rowCount = rows.length;
      break;
    }

    case 'risk-radar': {
      viewTitle = `Risk Radar & Quantitative Volatility Profile (${currentStock.ticker})`;
      filename = `StockSense_Risk_Radar_${currentStock.ticker}_${timestamp}.csv`;

      const riskHeaders = [
        'Risk Metric Parameter',
        'Value',
        'Benchmark Target',
        'Unit / Scale',
        'Assessment'
      ];

      const riskRows = [
        ['Historical Value-at-Risk (95% 1-Day)', `${currentStock.var95.toFixed(2)}%`, '< 2.50%', 'Percent', 'Statistical Tail Loss'],
        ['Parametric Value-at-Risk (99% 1-Day)', `${(currentStock.var95 * 1.41).toFixed(2)}%`, '< 3.80%', 'Percent', 'Extreme Tail Loss'],
        ['Annualized Volatility (30-Day)', `${currentStock.annVolatility.toFixed(2)}%`, `${currentStock.volBenchmark.toFixed(2)}%`, 'Percent', 'Standard Deviation of Daily Returns'],
        ['Sharpe Ratio (Rf = 6.5%)', currentStock.sharpeRatio.toFixed(2), '> 1.00', 'Ratio', 'Excess Return per Unit Volatility'],
        ['Sortino Ratio (Downside Deviation)', (currentStock.sharpeRatio * 1.28).toFixed(2), '> 1.20', 'Ratio', 'Penalizes Only Downside Returns'],
        ['Beta vs NIFTY 50 Benchmark', currentStock.beta.toFixed(2), '1.00', 'Multiplier', 'Systematic Market Sensitivity'],
        ['Maximum Drawdown (1-Year Peak)', `${currentStock.maxDrawdown.toFixed(2)}%`, '< -15.00%', 'Percent', 'Peak-to-Trough Decline'],
        ['Uncertainty Entropy Index', currentStock.uncertaintyEntropy.toFixed(2), '< 0.50', 'Entropy (0-1)', 'Prediction Uncertainty Distribution'],
        ['Overall Composite Risk Score', `${currentStock.riskScore}/100`, '< 50', 'Score', currentStock.riskCategory]
      ];

      const scenarioHeaders = ['Stress Test Scenario', 'Market Shock (%)', 'Estimated Stock Impact (%)', 'Drawdown Severity'];
      const scenarioRows = [
        ['RBI Unexpected 50bps Rate Hike', '-2.40%', `${(-2.4 * currentStock.beta).toFixed(2)}%`, 'MODERATE'],
        ['Crude Oil Price Shock (+15%)', '-3.80%', `${(-3.8 * currentStock.beta * 0.9).toFixed(2)}%`, 'ELEVATED'],
        ['Global Liquidity Squeeze (US 10Y Yield > 4.8%)', '-4.50%', `${(-4.5 * currentStock.beta).toFixed(2)}%`, 'HIGH'],
        ['Domestic Earnings Contraction Shock', '-5.20%', `${(-5.2 * 1.1).toFixed(2)}%`, 'SEVERE']
      ];

      csvText = [
        '=== COMPREHENSIVE RISK & VOLATILITY ATTRIBUTION ===',
        rowsToCsv(riskHeaders, riskRows),
        '',
        '=== MACRO STRESS SIMULATION SCENARIOS ===',
        rowsToCsv(scenarioHeaders, scenarioRows)
      ].join('\r\n');

      rowCount = riskRows.length + scenarioRows.length;
      break;
    }

    case 'screener': {
      viewTitle = 'Quantitative Stock Screener Results';
      filename = `StockSense_Stock_Screener_${timestamp}.csv`;

      const headers = [
        'Ticker',
        'Company Name',
        'Sector',
        'Price (INR)',
        'Change (%)',
        'Market Cap (Cr INR)',
        'P/E Ratio',
        'P/B Ratio',
        'ROE (%)',
        'Dividend Yield (%)',
        'RSI (14)',
        'Volume Surge',
        'AI Direction',
        'AI Confidence (%)'
      ];

      const rows: (string | number)[][] = [];
      NSE500_SECTORS_DATA.forEach((sec) => {
        sec.stocks.forEach((st) => {
          rows.push([
            st.ticker,
            st.name,
            sec.name,
            st.price.toFixed(2),
            st.changePercent.toFixed(2),
            (st.marketCapTrillion * 100000).toFixed(0),
            st.peRatio.toFixed(1),
            (st.peRatio * 0.22).toFixed(2),
            (14.5 + Math.random() * 8).toFixed(1),
            (1.2 + Math.random() * 2).toFixed(2),
            st.rsi.toFixed(1),
            `${st.volumeMillion.toFixed(1)}M`,
            st.direction,
            st.aiConfidence
          ]);
        });
      });

      csvText = rowsToCsv(headers, rows);
      rowCount = rows.length;
      break;
    }

    case 'heatmap': {
      viewTitle = 'Sectoral Market Heatmap & Capital Distribution';
      filename = `StockSense_Heatmap_Sectors_${timestamp}.csv`;

      const headers = [
        'Sector Code',
        'Sector Name',
        'Weight in NIFTY (%)',
        'Sector 1D Change (%)',
        'Market Cap (Trillion INR)',
        'Component Stocks Count',
        'Advancing Stocks',
        'Declining Stocks'
      ];

      const rows = NSE500_SECTORS_DATA.map((sec) => [
        sec.code,
        sec.name,
        sec.weightPct.toFixed(1),
        sec.changePercent.toFixed(2),
        sec.marketCapTrillion.toFixed(2),
        sec.stocksCount,
        sec.advances,
        sec.declines
      ]);

      csvText = rowsToCsv(headers, rows);
      rowCount = rows.length;
      break;
    }

    case 'news-sentiment': {
      viewTitle = 'Institutional News & NLP Sentiment Telemetry';
      filename = `StockSense_News_Sentiment_${timestamp}.csv`;

      const headers = [
        'Article ID',
        'Impacted Ticker',
        'Headline',
        'Source',
        'Category',
        'Sentiment Classification',
        'Sentiment Score (-1.0 to +1.0)',
        'Published Date',
        'Read Time'
      ];

      const allArticles = Object.values(STOCK_HEADLINES_DATABASE).flat();
      const rows = allArticles.map((art) => [
        art.id,
        art.ticker,
        art.title,
        art.source,
        art.category,
        art.sentiment,
        art.sentimentScore.toFixed(2),
        art.publishedAt,
        art.readTime
      ]);

      csvText = rowsToCsv(headers, rows);
      rowCount = rows.length;
      break;
    }

    case 'technical-analysis': {
      viewTitle = `Technical Multi-Indicator Analysis (${currentStock.ticker})`;
      filename = `StockSense_Technical_Analysis_${currentStock.ticker}_${timestamp}.csv`;

      const headers = [
        'Indicator Name',
        'Value',
        'Signal / Bias',
        'Standard Period',
        'Interpretation'
      ];

      const rows = [
        ['Current Price', `₹${currentStock.price.toFixed(2)}`, currentStock.change >= 0 ? 'BULLISH' : 'BEARISH', 'Spot', 'Last Traded Price on NSE'],
        ['RSI (Relative Strength Index)', currentStock.rsi.toFixed(2), currentStock.rsi > 70 ? 'OVERBOUGHT' : currentStock.rsi < 30 ? 'OVERSOLD' : 'NEUTRAL', '14-Period', 'Momentum oscillator measuring speed and change of price moves'],
        ['MACD Line', currentStock.macd.macdLine.toFixed(2), currentStock.macd.macdLine > 0 ? 'BULLISH' : 'BEARISH', '12, 26, 9 EMA', 'Moving average convergence/divergence indicator'],
        ['MACD Signal Line', currentStock.macd.signalLine.toFixed(2), 'SIGNAL', '9-Period EMA', 'Trigger line for bullish/bearish crossovers'],
        ['MACD Histogram', currentStock.macd.histogram.toFixed(2), currentStock.macd.histogram > 0 ? 'EXPANDING' : 'CONTRACTING', 'MACD - Signal', 'Measures momentum velocity and divergences'],
        ['20-Day Simple Moving Average (SMA)', `₹${currentStock.sma20.toFixed(2)}`, currentStock.price > currentStock.sma20 ? 'ABOVE (Support)' : 'BELOW (Resistance)', '20-Day', 'Short-term trend direction benchmark'],
        ['50-Day Simple Moving Average (SMA)', `₹${currentStock.sma50.toFixed(2)}`, currentStock.price > currentStock.sma50 ? 'ABOVE (Support)' : 'BELOW (Resistance)', '50-Day', 'Intermediate-term institutional trend gauge'],
        ['200-Day Simple Moving Average (SMA)', `₹${currentStock.sma200.toFixed(2)}`, currentStock.price > currentStock.sma200 ? 'GOLDEN REGIME' : 'DEATH REGIME', '200-Day', 'Long-term structural bull/bear dividing line'],
        ['Bollinger Upper Band (2 Std Dev)', `₹${currentStock.bollinger.upper.toFixed(2)}`, 'RESISTANCE', '20, 2', 'Upper volatility boundary'],
        ['Bollinger Middle Band (20 SMA)', `₹${currentStock.bollinger.middle.toFixed(2)}`, 'MEAN', '20', 'Baseline central mean reversion floor'],
        ['Bollinger Lower Band (2 Std Dev)', `₹${currentStock.bollinger.lower.toFixed(2)}`, 'SUPPORT', '20, 2', 'Lower volatility boundary'],
        ['Bollinger %B', currentStock.bollinger.pb.toFixed(2), currentStock.bollinger.pb > 0.8 ? 'UPPER QUARTILE' : 'LOWER QUARTILE', 'Normalized', 'Position within standard deviation envelope']
      ];

      csvText = rowsToCsv(headers, rows);
      rowCount = rows.length;
      break;
    }

    case 'backtesting': {
      viewTitle = 'Quantitative Strategy Backtest Audit Log';
      filename = `StockSense_Backtest_Results_${timestamp}.csv`;

      const summaryHeaders = ['Strategy Metric', 'Value', 'Benchmark (NIFTY 50)', 'Outperformance Alpha'];
      const summaryRows = [
        ['Strategy Name', 'Multi-Factor TreeSHAP Momentum + Mean Reversion', 'NIFTY 50 Buy & Hold', '+14.2% Net Alpha'],
        ['Backtest Duration', '5 Years (Jan 2021 - Present)', '5 Years', '-'],
        ['Initial Capital', '₹10,00,000', '₹10,00,000', '-'],
        ['Final Portfolio Equity', '₹28,45,200', '₹18,12,400', '+₹10,32,800'],
        ['Compounded Annual Growth Rate (CAGR)', '23.4%', '12.8%', '+10.6%'],
        ['Sharpe Ratio', '1.84', '0.92', '+0.92'],
        ['Maximum Drawdown (Peak-to-Trough)', '-11.2%', '-22.4%', '+11.2% Risk Reduction'],
        ['Win Rate (% of Profitable Trades)', '68.5%', '-', '-'],
        ['Profit Factor', '2.42', '1.20', '+1.22'],
        ['Total Trades Executed', '342', '-', '-']
      ];

      const tradeHeaders = ['Trade #', 'Date', 'Ticker', 'Type', 'Entry (INR)', 'Exit (INR)', 'Return (%)', 'Cumulative P&L (INR)'];
      const tradeRows = [
        ['1', '2026-09-15', 'RELIANCE', 'LONG', '2760.00', '2890.00', '+4.71%', '₹13,000'],
        ['2', '2026-09-18', 'TCS', 'LONG', '4050.00', '4210.00', '+3.95%', '₹29,000'],
        ['3', '2026-09-22', 'HDFCBANK', 'SHORT', '1660.00', '1615.00', '+2.71%', '₹42,500'],
        ['4', '2026-09-28', 'INFY', 'LONG', '1810.00', '1785.00', '-1.38%', '₹35,000'],
        ['5', '2026-10-02', 'TATASTEEL', 'LONG', '140.00', '152.00', '+8.57%', '₹59,000']
      ];

      csvText = [
        '=== QUANTITATIVE STRATEGY PERFORMANCE AUDIT ===',
        rowsToCsv(summaryHeaders, summaryRows),
        '',
        '=== REPRESENTATIVE TRADE EXECUTION JOURNAL ===',
        rowsToCsv(tradeHeaders, tradeRows)
      ].join('\r\n');

      rowCount = summaryRows.length + tradeRows.length;
      break;
    }

    default: {
      viewTitle = `Financial Overview Data (${currentStock.ticker})`;
      filename = `StockSense_Data_${currentStock.ticker}_${timestamp}.csv`;

      const headers = ['Symbol', 'Name', 'Price (INR)', 'Change (%)', 'Sector', 'Market Cap'];
      const rows = [
        [
          currentStock.ticker,
          currentStock.name,
          currentStock.price.toFixed(2),
          currentStock.changePercent.toFixed(2),
          currentStock.sector,
          currentStock.marketCap
        ]
      ];
      csvText = rowsToCsv(headers, rows);
      rowCount = 1;
      break;
    }
  }

  // Download the file
  triggerCsvDownload(filename, csvText);

  return {
    success: true,
    filename,
    rowCount,
    viewTitle
  };
}
