import { StockData, IndexData } from '../types';

export const INDICES_DATA: IndexData[] = [
  {
    name: 'NIFTY 50',
    value: '24,835.10',
    change: '+0.64%',
    changePercent: 0.64,
    isPositive: true,
    history: [24680, 24710, 24740, 24790, 24820, 24835.1]
  },
  {
    name: 'SENSEX',
    value: '81,422.30',
    change: '+0.58%',
    changePercent: 0.58,
    isPositive: true,
    history: [80900, 81050, 81180, 81320, 81390, 81422.3]
  },
  {
    name: 'BANK NIFTY',
    value: '51,210.85',
    change: '-0.22%',
    changePercent: -0.22,
    isPositive: false,
    history: [51320, 51300, 51260, 51240, 51220, 51210.85]
  },
  {
    name: 'INDIA VIX',
    value: '12.84',
    change: '-3.45%',
    changePercent: -3.45,
    isPositive: true, // Lower VIX is bullish for market
    history: [13.4, 13.2, 13.1, 12.95, 12.88, 12.84]
  },
  {
    name: 'NIFTY IT',
    value: '42,150.20',
    change: '+1.18%',
    changePercent: 1.18,
    isPositive: true,
    history: [41650, 41780, 41890, 42020, 42110, 42150.2]
  },
  {
    name: 'NIFTY AUTO',
    value: '25,640.40',
    change: '+0.82%',
    changePercent: 0.82,
    isPositive: true,
    history: [25420, 25480, 25550, 25610, 25630, 25640.4]
  }
];

export const STOCKS_DATA: Record<string, StockData> = {
  RELIANCE: {
    ticker: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    exchange: 'NSE',
    sector: 'Energy & Petrochem',
    marketCap: '₹19.28 Lakh Cr',
    price: 2850.40,
    change: 39.80,
    changePercent: 1.42,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 82,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '78.4% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'The ensemble model identifies strong momentum confirmation across oscillating indicators (RSI & MACD), partially offset by elevated 30-day volatility.',
    
    // Risk metrics
    riskScore: 46,
    riskCategory: 'MODERATE',
    annVolatility: 18.4,
    volBenchmark: 14.2,
    maxDrawdown: -12.6,
    drawdownPeak: 3120,
    var95: -3.8,
    sharpeRatio: 1.82,
    beta: 1.15,
    drawdownFloor: 2680,
    uncertaintyEntropy: 0.18,
    
    // Technicals
    rsi: 62.4,
    macd: {
      macdLine: 14.20,
      signalLine: 8.50,
      histogram: 5.70
    },
    sma20: 2810.00,
    sma50: 2760.50,
    sma200: 2580.00,
    bollinger: {
      upper: 2920.00,
      middle: 2810.00,
      lower: 2700.00,
      pb: 0.78
    },
    volume24h: '8.42M shares',
    volumeSurge: '+18.0% Surge',
    vol20dAvg: '7.13M',
    
    shapFactors: [
      { feature: 'RSI (14-day: 62.4)', impact: 0.32, isBullish: true },
      { feature: 'MACD Histogram (+12.8)', impact: 0.25, isBullish: true },
      { feature: '20-Day SMA Bull Cross', impact: 0.18, isBullish: true },
      { feature: '50-Day EMA Momentum', impact: 0.14, isBullish: true },
      { feature: 'On-Balance Volume (OBV)', impact: 0.12, isBullish: true },
      { feature: 'Bollinger Bands %B (0.78)', impact: 0.05, isBullish: true },
      { feature: 'Hist. Volatility (18.4%)', impact: -0.08, isBullish: false },
      { feature: 'Foreign Inst. Outflow (FII)', impact: -0.11, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'RSI > 60.0',
        explanation: 'Momentum threshold crossed (Current: 62.4)',
        shift: '+24%',
        positive: true
      },
      {
        rule: 'MACD > Signal Line',
        explanation: 'Histogram positive divergence (+12.8)',
        shift: '+19%',
        positive: true
      },
      {
        rule: 'Volume > 20D Avg',
        explanation: 'Breakout institutional confirmation',
        shift: '+11%',
        positive: true
      }
    ],
    ensembleModels: [
      {
        name: 'XGBoost Classifier',
        architecture: 'Gradient Boosted Decision Trees',
        direction: 'UP',
        confidence: 82,
        isPrimary: true
      },
      {
        name: 'Random Forest',
        architecture: 'Bagging Ensemble (500 Trees)',
        direction: 'UP',
        confidence: 76
      },
      {
        name: 'LSTM Network',
        architecture: 'Recurrent Sequential Attention',
        direction: 'NEUTRAL',
        confidence: 58
      }
    ]
  },

  TCS: {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    sector: 'IT Services',
    marketCap: '₹14.9 Lakh Cr',
    price: 4120.15,
    change: 34.75,
    changePercent: 0.85,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 88,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '81.2% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Sustained institutional accumulation with clean breakout above 50-day moving average and strong free cash flow yield.',
    
    riskScore: 24,
    riskCategory: 'LOW',
    annVolatility: 13.2,
    volBenchmark: 14.2,
    maxDrawdown: -8.4,
    drawdownPeak: 4280,
    var95: -2.4,
    sharpeRatio: 2.15,
    beta: 0.84,
    drawdownFloor: 3950,
    uncertaintyEntropy: 0.12,
    
    rsi: 65.8,
    macd: {
      macdLine: 28.40,
      signalLine: 18.20,
      histogram: 10.20
    },
    sma20: 4050.00,
    sma50: 3980.00,
    sma200: 3820.00,
    bollinger: {
      upper: 4190.00,
      middle: 4050.00,
      lower: 3910.00,
      pb: 0.82
    },
    volume24h: '3.15M shares',
    volumeSurge: '+22.4% Surge',
    vol20dAvg: '2.57M',
    
    shapFactors: [
      { feature: 'RSI Momentum (14-day: 65.8)', impact: 0.28, isBullish: true },
      { feature: 'Volume Surge (+22.4%)', impact: 0.19, isBullish: true },
      { feature: '50-Day EMA Alignment', impact: 0.16, isBullish: true },
      { feature: 'Operating Margin Expansion', impact: 0.12, isBullish: true },
      { feature: 'Foreign Inst. Inflow (FII)', impact: 0.09, isBullish: true },
      { feature: 'Global IT Spending Caution', impact: -0.06, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'Close > SMA 50',
        explanation: 'Long-term trend continuation validated',
        shift: '+26%',
        positive: true
      },
      {
        rule: 'RSI in [60, 70]',
        explanation: 'Strong bullish momentum without overbought stretch',
        shift: '+18%',
        positive: true
      }
    ],
    ensembleModels: [
      {
        name: 'XGBoost Classifier',
        architecture: 'Gradient Boosted Decision Trees',
        direction: 'UP',
        confidence: 88,
        isPrimary: true
      },
      {
        name: 'Random Forest',
        architecture: 'Bagging Ensemble (500 Trees)',
        direction: 'UP',
        confidence: 84
      },
      {
        name: 'LSTM Network',
        architecture: 'Recurrent Sequential Attention',
        direction: 'UP',
        confidence: 72
      }
    ]
  },

  INFY: {
    ticker: 'INFY',
    name: 'Infosys Ltd.',
    exchange: 'NSE',
    sector: 'IT Services & Consulting',
    marketCap: '₹7.85 Lakh Cr',
    price: 1890.30,
    change: -8.55,
    changePercent: -0.45,
    direction: 'NEUTRAL',
    directionLabel: 'NEUTRAL / HOLD',
    confidence: 64,
    activeModel: 'LSTM Ensemble (v3.1)',
    winRate: '72.8% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Mixed oscillating indicators with short-term consolidation around the 20-day mean. Awaiting forward quarterly guidance triggers.',
    
    riskScore: 38,
    riskCategory: 'MODERATE',
    annVolatility: 16.5,
    volBenchmark: 14.2,
    maxDrawdown: -14.1,
    drawdownPeak: 1980,
    var95: -3.2,
    sharpeRatio: 1.45,
    beta: 0.98,
    drawdownFloor: 1810,
    uncertaintyEntropy: 0.28,
    
    rsi: 51.2,
    macd: {
      macdLine: 3.10,
      signalLine: 4.80,
      histogram: -1.70
    },
    sma20: 1895.00,
    sma50: 1860.00,
    sma200: 1740.00,
    bollinger: {
      upper: 1940.00,
      middle: 1895.00,
      lower: 1850.00,
      pb: 0.48
    },
    volume24h: '5.20M shares',
    volumeSurge: '-4.2% Normal',
    vol20dAvg: '5.43M',
    
    shapFactors: [
      { feature: '50-Day EMA Alignment', impact: 0.14, isBullish: true },
      { feature: 'Digital Deal TCV Pipeline', impact: 0.08, isBullish: true },
      { feature: 'Foreign Inst. Outflow', impact: -0.11, isBullish: false },
      { feature: 'MACD Histogram Bear Cross', impact: -0.09, isBullish: false },
      { feature: 'Subcontractor Cost Creep', impact: -0.05, isBullish: false }
    ],
    limeRules: [
      {
        rule: '45 <= RSI <= 55',
        explanation: 'Equilibrium momentum bracket indicating consolidation',
        shift: '-12%',
        positive: false
      },
      {
        rule: 'Volume < 20D Avg',
        explanation: 'Absence of institutional conviction',
        shift: '-8%',
        positive: false
      }
    ],
    ensembleModels: [
      {
        name: 'LSTM Network',
        architecture: 'Recurrent Sequential Attention',
        direction: 'NEUTRAL',
        confidence: 64,
        isPrimary: true
      },
      {
        name: 'XGBoost Classifier',
        architecture: 'Gradient Boosted Decision Trees',
        direction: 'NEUTRAL',
        confidence: 61
      },
      {
        name: 'Random Forest',
        architecture: 'Bagging Ensemble (500 Trees)',
        direction: 'UP',
        confidence: 54
      }
    ]
  },

  HDFCBANK: {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    exchange: 'NSE',
    sector: 'Banking & Finance',
    marketCap: '₹12.5 Lakh Cr',
    price: 1640.20,
    change: 17.80,
    changePercent: 1.10,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 79,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '76.9% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Credit growth trajectory and stable NIM expansion support directional upside. Low deposit beta mitigates margin pressure.',
    
    riskScore: 44,
    riskCategory: 'MODERATE',
    annVolatility: 17.2,
    volBenchmark: 14.2,
    maxDrawdown: -15.2,
    drawdownPeak: 1750,
    var95: -3.5,
    sharpeRatio: 1.68,
    beta: 1.10,
    drawdownFloor: 1540,
    uncertaintyEntropy: 0.20,
    
    rsi: 58.6,
    macd: {
      macdLine: 9.80,
      signalLine: 6.20,
      histogram: 3.60
    },
    sma20: 1618.00,
    sma50: 1590.00,
    sma200: 1560.00,
    bollinger: {
      upper: 1670.00,
      middle: 1618.00,
      lower: 1566.00,
      pb: 0.72
    },
    volume24h: '11.8M shares',
    volumeSurge: '+14.5% Surge',
    vol20dAvg: '10.3M',
    
    shapFactors: [
      { feature: 'Credit Growth (16.8% YoY)', impact: 0.24, isBullish: true },
      { feature: 'RSI Bullish Crossover', impact: 0.17, isBullish: true },
      { feature: '20-Day SMA Support Bounce', impact: 0.13, isBullish: true },
      { feature: 'Net Interest Margin Expansion', impact: 0.10, isBullish: true },
      { feature: 'LDR Ratio Normalization', impact: -0.07, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'Price > 20D SMA (+1.37%)',
        explanation: 'Short-term support holds firm with rising volumes',
        shift: '+21%',
        positive: true
      }
    ],
    ensembleModels: [
      {
        name: 'XGBoost Classifier',
        architecture: 'Gradient Boosted Decision Trees',
        direction: 'UP',
        confidence: 79,
        isPrimary: true
      },
      {
        name: 'Random Forest',
        architecture: 'Bagging Ensemble (500 Trees)',
        direction: 'UP',
        confidence: 74
      },
      {
        name: 'LSTM Network',
        architecture: 'Recurrent Sequential Attention',
        direction: 'UP',
        confidence: 68
      }
    ]
  },

  TATASTEEL: {
    ticker: 'TATASTEEL',
    name: 'Tata Steel Ltd.',
    exchange: 'NSE',
    sector: 'Metals & Mining',
    marketCap: '₹1.90 Lakh Cr',
    price: 152.40,
    change: -2.79,
    changePercent: -1.80,
    direction: 'DOWN',
    directionLabel: 'DOWN (Bearish)',
    confidence: 71,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '74.2% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Global commodity softening and European blast furnace transition costs create short-term margin compression.',
    
    riskScore: 68,
    riskCategory: 'HIGH',
    annVolatility: 24.6,
    volBenchmark: 14.2,
    maxDrawdown: -22.4,
    drawdownPeak: 184,
    var95: -5.4,
    sharpeRatio: 0.92,
    beta: 1.42,
    drawdownFloor: 138,
    uncertaintyEntropy: 0.32,
    
    rsi: 38.4,
    macd: {
      macdLine: -2.40,
      signalLine: -1.10,
      histogram: -1.30
    },
    sma20: 157.00,
    sma50: 161.00,
    sma200: 154.00,
    bollinger: {
      upper: 164.00,
      middle: 157.00,
      lower: 150.00,
      pb: 0.17
    },
    volume24h: '38.2M shares',
    volumeSurge: '+28.0% Heavy Sell',
    vol20dAvg: '29.8M',
    
    shapFactors: [
      { feature: 'China Steel Export Squeeze', impact: -0.29, isBullish: false },
      { feature: 'RSI Breakdown < 40', impact: -0.22, isBullish: false },
      { feature: 'High Beta Sensitvity (1.42)', impact: -0.16, isBullish: false },
      { feature: 'Domestic Auto Demand Strength', impact: 0.11, isBullish: true }
    ],
    limeRules: [
      {
        rule: 'RSI < 40.0',
        explanation: 'Bearish momentum acceleration trigger reached',
        shift: '-23%',
        positive: false
      }
    ],
    ensembleModels: [
      {
        name: 'XGBoost Classifier',
        architecture: 'Gradient Boosted Decision Trees',
        direction: 'DOWN',
        confidence: 71,
        isPrimary: true
      },
      {
        name: 'Random Forest',
        architecture: 'Bagging Ensemble (500 Trees)',
        direction: 'DOWN',
        confidence: 68
      },
      {
        name: 'LSTM Network',
        architecture: 'Recurrent Sequential Attention',
        direction: 'DOWN',
        confidence: 62
      }
    ]
  },

  TECHM: {
    ticker: 'TECHM',
    name: 'Tech Mahindra Ltd.',
    exchange: 'NSE',
    sector: 'IT & Telecom',
    marketCap: '₹1.52 Lakh Cr',
    price: 1648.50,
    change: 31.50,
    changePercent: 1.95,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 76,
    activeModel: 'Random Forest (v4.2)',
    winRate: '75.4% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Telecom 5G enterprise deal ramps and turnaround strategy execution drive margin expansion projections.',
    
    riskScore: 42,
    riskCategory: 'MODERATE',
    annVolatility: 17.8,
    volBenchmark: 14.2,
    maxDrawdown: -13.5,
    drawdownPeak: 1720,
    var95: -3.4,
    sharpeRatio: 1.74,
    beta: 1.05,
    drawdownFloor: 1520,
    uncertaintyEntropy: 0.22,
    
    rsi: 61.5,
    macd: {
      macdLine: 11.20,
      signalLine: 7.40,
      histogram: 3.80
    },
    sma20: 1610.00,
    sma50: 1575.00,
    sma200: 1480.00,
    bollinger: {
      upper: 1685.00,
      middle: 1610.00,
      lower: 1535.00,
      pb: 0.75
    },
    volume24h: '2.84M shares',
    volumeSurge: '+16.2% Surge',
    vol20dAvg: '2.44M',
    
    shapFactors: [
      { feature: 'Turnaround Margin Trajectory', impact: 0.22, isBullish: true },
      { feature: 'RSI Breakout > 60', impact: 0.18, isBullish: true },
      { feature: 'Enterprise 5G Pipeline', impact: 0.14, isBullish: true },
      { feature: 'Telecom Sector Capex Slowdown', impact: -0.09, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'RSI > 60.0 & Volume > Avg',
        explanation: 'Confirmed high-probability trend initiation',
        shift: '+20%',
        positive: true
      }
    ],
    ensembleModels: [
      {
        name: 'Random Forest',
        architecture: 'Bagging Ensemble (500 Trees)',
        direction: 'UP',
        confidence: 76,
        isPrimary: true
      },
      {
        name: 'XGBoost Classifier',
        architecture: 'Gradient Boosted Decision Trees',
        direction: 'UP',
        confidence: 74
      },
      {
        name: 'LSTM Network',
        architecture: 'Recurrent Sequential Attention',
        direction: 'UP',
        confidence: 65
      }
    ]
  }
};

export const DEFAULT_MOCK_PORTFOLIO: Record<string, { shares: number; avgBuyPrice: number; purchaseDate: string }> = {
  RELIANCE: { shares: 80, avgBuyPrice: 2620.00, purchaseDate: '2024-03-12' },
  TCS: { shares: 35, avgBuyPrice: 3880.00, purchaseDate: '2024-04-05' },
  INFY: { shares: 60, avgBuyPrice: 1940.00, purchaseDate: '2024-02-18' },
  HDFCBANK: { shares: 75, avgBuyPrice: 1550.00, purchaseDate: '2024-05-22' },
  TATASTEEL: { shares: 400, avgBuyPrice: 164.00, purchaseDate: '2024-06-10' },
  TECHM: { shares: 50, avgBuyPrice: 1520.00, purchaseDate: '2024-01-30' },
};

export const HOTLINKED_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9tE507nO46Hx5D-XK7B4R7qDjtNEE-LGgu7DwjCydVdgcZvRLSS_XAEbMNKSbwM95a648Rr5IJCUVUQ2qoi-VcKRvCLNB89Sc_mCiL-_7YH9nNCJOxFsLN8-tvoynvlFm88toNd08OFakq5Zso1lKkHnvAiyPUNNiZWi0dkms3EcrKvV3HbX3IyeJu35RGdvgTiN4Hxz8nKRyhtXo6JuY30ziQzIrG3-eA08E0P5iDL-l4DPNOZpi',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBobQEJWoTupDZEVi4Q2DmtIRObeNUI_-YOKmJfZSI3olWNhBsJuViC3Z9MobvW4gEeJU7GFxOhpF-x-tzZKG3dJmD1N3K5sKRFDKfLBP0gTn7eotZJ29yHIrtGxfq0-DAcDVAVo3xuUqXuhn8FpBj6zpwqhGLCYJiD3ZZPCPkRQhrjlyITW-uzu54jQct-IFjQSs1c8XuJjCFe5o1ruIZl107Qv1RZP1dzjD9JsxfRG-yNK1fKKYxX',
  researchBanner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUn-taEGgEx29QvssUEE3X3Bq4nMkX21wcmhSnKvYDuLOTKWpU3m0ncQdxQ6rbo8jsWxPSbB9CMLemYVFDgLHhS1_V0bThbbqVe5I0SGNU6kPLDXAnSFOsghPHccwMH-pmbjm6kIHQdCu5Veqj6Tr1hV4MaY2ChicqxZZtsOKHJXYBwI2WmBoH2xaLXVYPmvu0HJqsFfwzo4bhgcLiVnDfiRIPlgtuE6yYDN16RUTU_t5b3oBJZOaF'
};
