export type DirectionSignal = 'UP' | 'DOWN' | 'NEUTRAL';
export type RiskLevel = 'LOW RISK' | 'MED RISK' | 'HIGH RISK';

export interface ShapFactor {
  feature: string;
  impact: number; // positive = bull, negative = bear
  isBullish: boolean;
}

export interface LimeRule {
  rule: string;
  explanation: string;
  shift: string;
  positive: boolean;
}

export interface ModelAgreement {
  name: string;
  architecture: string;
  direction: DirectionSignal;
  confidence: number;
  isPrimary?: boolean;
}

export interface StockData {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  marketCap: string;
  price: number;
  change: number;
  changePercent: number;
  direction: DirectionSignal;
  directionLabel: string;
  confidence: number;
  activeModel: string;
  winRate: string;
  snapshotTime: string;
  synthesisNote: string;
  
  // Risk metrics
  riskScore: number;
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH';
  annVolatility: number;
  volBenchmark: number;
  maxDrawdown: number;
  drawdownPeak: number;
  var95: number;
  sharpeRatio: number;
  beta: number;
  drawdownFloor: number;
  uncertaintyEntropy: number;
  
  // Technicals
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  sma20: number;
  sma50: number;
  sma200: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
    pb: number;
  };
  volume24h: string;
  volumeSurge: string;
  vol20dAvg: string;
  
  // XAI
  shapFactors: ShapFactor[];
  limeRules: LimeRule[];
  ensembleModels: ModelAgreement[];
}

export interface IndexData {
  name: string;
  value: string;
  change: string;
  changePercent: number;
  isPositive: boolean;
  history: number[];
}

export interface PortfolioPosition {
  ticker: string;
  shares: number;
  avgBuyPrice: number;
  purchaseDate: string;
}

export interface PriceAlert {
  id: string;
  ticker: string;
  condition: 'ABOVE' | 'BELOW';
  targetPrice: number;
  createdPrice: number;
  createdAt: string;
  isActive: boolean;
  triggeredAt?: string;
  note?: string;
}

export interface NewsArticle {
  id: string;
  ticker: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  sentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  sentimentScore: number;
  category: 'Earnings' | 'Regulatory' | 'Industry' | 'Macro' | 'Product';
  url?: string;
  readTime: string;
}

export interface PaperTradeOrder {
  id: string;
  ticker: string;
  companyName: string;
  side: 'BUY' | 'SELL';
  shares: number;
  price: number;
  totalValue: number;
  timestamp: string;
  realizedPnL?: number;
  realizedPnLPct?: number;
}

export interface PaperTradePosition {
  ticker: string;
  companyName: string;
  shares: number;
  avgBuyPrice: number;
  firstPurchased: string;
}

export type ScreenTab =
  | 'overview'
  | 'dashboard'
  | 'markets'
  | 'ai-predict'
  | 'risk-radar'
  | 'watchlist'
  | 'portfolio'
  | 'heatmap'
  | 'paper-trading'
  | 'backtesting'
  | 'screener'
  | 'news-sentiment'
  | 'technical-analysis'
  | 'learn'
  | 'profile';

export type AuthScreen = 'none' | 'login' | 'register' | 'forgot';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  avatarInitials?: string;
  accountType?: string;
  isGuest: boolean;
  avatarUrl?: string;
  memberSince?: string;
  panNumber?: string;
  panMasked?: string;
  kycStatus: 'Verified' | 'Pending' | 'Not Started' | 'VERIFIED' | 'NOT_STARTED';
  dematAccount: string;
  broker?: string;
  bankAccount?: string;
  city?: string;
  occupation?: string;
  riskTolerance?: string;
  investmentHorizon?: string;
  tradingExperience: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner (<1 yr)' | 'Intermediate (1-3 yrs)' | 'Advanced (3+ yrs)';
  riskProfile?: 'Conservative' | 'Balanced' | 'Aggressive' | string;
  virtualCapital?: number;
  virtualCash?: number;
  totalTrades?: number;
  winRate?: number;
  preferredExchange: 'NSE' | 'BSE' | 'BOTH';
  chartDefaultStyle?: 'line' | 'candlestick';
  notificationsEnabled?: boolean;
  priceAlertsEnabled?: boolean;
  emailAlerts?: boolean;
  whatsappAlerts?: boolean;
  themePreference?: 'light' | 'dark';
  biometricLogin?: boolean;
  twoFactorEnabled?: boolean;
  joinDate?: string;
}
