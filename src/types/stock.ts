export type SentimentCategory = 'Very Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Very Bearish';

export interface HistoricalDataPoint {
  timestamp: number;
  dateStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  rsi?: number;
  upperBand?: number;
  lowerBand?: number;
}

export interface StockForecast2027 {
  bearPrice: number;
  basePrice: number;
  bullPrice: number;
  currentPrice: number;
  impliedCagrBase: number;
  confidenceScore: number; // 0 - 100
  keyCatalysts: string[];
  keyRisks: string[];
  monteCarloPaths: number[][]; // generated paths towards 2027
  modelAssumptions: {
    revenueGrowthRate: string;
    operatingMargin2027: string;
    terminalPeMultiple: number;
    discountRate: string;
  };
}

export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  avgVolume: number;
  marketCap: number; // in billions
  peRatio: number;
  forwardPe: number;
  eps: number;
  beta: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  sentimentScore: number; // -100 to +100
  sentimentLabel: SentimentCategory;
  socialMentions24h: number;
  institutionalOwnership: number; // percentage
  shortInterestPercent: number;
  analystConsensus: 'Strong Buy' | 'Buy' | 'Hold' | 'Underperform' | 'Sell';
  targetPriceAvg: number;
  description: string;
  forecast2027: StockForecast2027;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  relatedTickers: string[];
  summary: string;
  url?: string;
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  avgBuyPrice: number;
  totalCost: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
}

export interface TradeOrder {
  id: string;
  timestamp: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  shares: number;
  price: number;
  totalAmount: number;
  status: 'EXECUTED';
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: 'ABOVE' | 'BELOW';
  triggered: boolean;
  createdAt: number;
}

export type ChartTimeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | '2027';
export type ChartType = 'candlestick' | 'area' | 'line';
