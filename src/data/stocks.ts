import { StockData, IndexData } from '../types';
import { NSE500_SECTORS_DATA } from './nse500';

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
    sma20: 153.00,
    sma50: 151.20,
    sma200: 158.50,
    bollinger: {
      upper: 164.00,
      middle: 157.00,
      lower: 150.00,
      pb: 0.17
    },
    volume24h: '38.2M shares',
    volumeSurge: '+28.0% Heavy Outflow',
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
  },

  ICICIBANK: {
    ticker: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    exchange: 'NSE',
    sector: 'Banking & Finance',
    marketCap: '₹9.02 Lakh Cr',
    price: 1285.30,
    change: 18.35,
    changePercent: 1.45,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 86,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '79.8% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Superior asset quality metrics, market-leading domestic NIM expansion, and robust retail credit growth support upward trajectory.',
    riskScore: 32,
    riskCategory: 'LOW',
    annVolatility: 15.8,
    volBenchmark: 14.2,
    maxDrawdown: -10.4,
    drawdownPeak: 1334,
    var95: -2.8,
    sharpeRatio: 2.05,
    beta: 1.05,
    drawdownFloor: 1210,
    uncertaintyEntropy: 0.14,
    rsi: 62.8,
    macd: {
      macdLine: 16.40,
      signalLine: 10.80,
      histogram: 5.60
    },
    sma20: 1260.00,
    sma50: 1230.00,
    sma200: 1140.00,
    bollinger: {
      upper: 1315.00,
      middle: 1260.00,
      lower: 1205.00,
      pb: 0.73
    },
    volume24h: '14.2M shares',
    volumeSurge: '+21.5% Surge',
    vol20dAvg: '11.7M',
    shapFactors: [
      { feature: 'NIM Expansion (4.36%)', impact: 0.26, isBullish: true },
      { feature: 'RSI Momentum (62.8)', impact: 0.21, isBullish: true },
      { feature: 'Asset Quality / Low GNPA', impact: 0.16, isBullish: true },
      { feature: 'Foreign Institutional Inflow', impact: 0.12, isBullish: true },
      { feature: 'Deposit Growth Cost Creep', impact: -0.06, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'Price > 50D SMA & RSI > 60',
        explanation: 'Strong persistent momentum with high institutional participation',
        shift: '+25%',
        positive: true
      }
    ],
    ensembleModels: [
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'UP', confidence: 86, isPrimary: true },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 82 },
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'UP', confidence: 74 }
    ]
  },

  SBIN: {
    ticker: 'SBIN',
    name: 'State Bank of India',
    exchange: 'NSE',
    sector: 'Banking & Finance',
    marketCap: '₹7.28 Lakh Cr',
    price: 815.40,
    change: 15.60,
    changePercent: 1.95,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 82,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '77.5% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Highest ROA trajectory in over a decade, pristine corporate credit book, and attractive valuation multiple under 1.4x P/BV.',
    riskScore: 36,
    riskCategory: 'LOW',
    annVolatility: 17.4,
    volBenchmark: 14.2,
    maxDrawdown: -11.8,
    drawdownPeak: 912,
    var95: -3.1,
    sharpeRatio: 1.92,
    beta: 1.18,
    drawdownFloor: 760,
    uncertaintyEntropy: 0.17,
    rsi: 58.6,
    macd: {
      macdLine: 8.90,
      signalLine: 5.20,
      histogram: 3.70
    },
    sma20: 798.00,
    sma50: 785.00,
    sma200: 720.00,
    bollinger: {
      upper: 835.00,
      middle: 798.00,
      lower: 761.00,
      pb: 0.74
    },
    volume24h: '22.8M shares',
    volumeSurge: '+28.4% Surge',
    vol20dAvg: '17.7M',
    shapFactors: [
      { feature: 'Corporate Loan Growth (+18% YoY)', impact: 0.28, isBullish: true },
      { feature: 'P/BV Valuation Support (<1.4x)', impact: 0.22, isBullish: true },
      { feature: 'RSI Bull Cross > 55', impact: 0.14, isBullish: true },
      { feature: 'Sovereign Yield Volatility', impact: -0.08, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'Close > 20D SMA & P/BV < Industry Avg',
        explanation: 'Deep value plus momentum confirmation',
        shift: '+22%',
        positive: true
      }
    ],
    ensembleModels: [
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'UP', confidence: 82, isPrimary: true },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 79 },
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'UP', confidence: 70 }
    ]
  },

  BAJFINANCE: {
    ticker: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd.',
    exchange: 'NSE',
    sector: 'Banking & Finance',
    marketCap: '₹4.58 Lakh Cr',
    price: 7420.00,
    change: 152.60,
    changePercent: 2.10,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 84,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '78.2% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Omnichannel customer additions surpassing 4M per quarter and secured loan diversification maintain compounding engine.',
    riskScore: 45,
    riskCategory: 'MODERATE',
    annVolatility: 19.8,
    volBenchmark: 14.2,
    maxDrawdown: -16.2,
    drawdownPeak: 8192,
    var95: -3.8,
    sharpeRatio: 1.76,
    beta: 1.25,
    drawdownFloor: 6850,
    uncertaintyEntropy: 0.19,
    rsi: 61.2,
    macd: {
      macdLine: 78.40,
      signalLine: 45.20,
      histogram: 33.20
    },
    sma20: 7250.00,
    sma50: 7110.00,
    sma200: 6890.00,
    bollinger: {
      upper: 7600.00,
      middle: 7250.00,
      lower: 6900.00,
      pb: 0.74
    },
    volume24h: '3.2M shares',
    volumeSurge: '+19.2% Surge',
    vol20dAvg: '2.68M',
    shapFactors: [
      { feature: 'AUM Growth (+28% YoY)', impact: 0.27, isBullish: true },
      { feature: 'New Loans Booked Velocity', impact: 0.20, isBullish: true },
      { feature: 'MACD Bullish Histogram Expansion', impact: 0.15, isBullish: true },
      { feature: 'Unsecured Credit Cost Scrutiny', impact: -0.10, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'RSI > 60 & Close > SMA 20',
        explanation: 'Accelerating retail asset velocity with structural momentum',
        shift: '+24%',
        positive: true
      }
    ],
    ensembleModels: [
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'UP', confidence: 84, isPrimary: true },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 80 },
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'UP', confidence: 73 }
    ]
  },

  ITC: {
    ticker: 'ITC',
    name: 'ITC Limited',
    exchange: 'NSE',
    sector: 'FMCG & Consumer',
    marketCap: '₹6.14 Lakh Cr',
    price: 492.30,
    change: 3.65,
    changePercent: 0.75,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 78,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '80.5% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Defensive cash-cow profile with steady cigarette volume stability and non-cigarette FMCG margin expansion towards double digits.',
    riskScore: 21,
    riskCategory: 'LOW',
    annVolatility: 11.8,
    volBenchmark: 14.2,
    maxDrawdown: -6.4,
    drawdownPeak: 512,
    var95: -1.9,
    sharpeRatio: 2.24,
    beta: 0.68,
    drawdownFloor: 472,
    uncertaintyEntropy: 0.11,
    rsi: 55.4,
    macd: {
      macdLine: 4.20,
      signalLine: 2.90,
      histogram: 1.30
    },
    sma20: 486.00,
    sma50: 480.00,
    sma200: 462.00,
    bollinger: {
      upper: 504.00,
      middle: 486.00,
      lower: 468.00,
      pb: 0.68
    },
    volume24h: '16.5M shares',
    volumeSurge: '+8.4% Normal',
    vol20dAvg: '15.2M',
    shapFactors: [
      { feature: 'FMCG Margin Expansion', impact: 0.22, isBullish: true },
      { feature: 'Dividend Yield Security (3.2%)', impact: 0.18, isBullish: true },
      { feature: 'Low Beta Defense (0.68)', impact: 0.14, isBullish: true },
      { feature: 'Agri-Commodity Softness', impact: -0.05, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'Beta < 0.75 & Dividend > 3.0%',
        explanation: 'Institutional safe haven during market volatility',
        shift: '+19%',
        positive: true
      }
    ],
    ensembleModels: [
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'UP', confidence: 78, isPrimary: true },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 75 },
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'UP', confidence: 66 }
    ]
  },

  TATAMOTORS: {
    ticker: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    exchange: 'NSE',
    sector: 'Automobile & EV',
    marketCap: '₹3.62 Lakh Cr',
    price: 985.40,
    change: 17.90,
    changePercent: 1.85,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 85,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '78.9% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'JLR order book resiliency in North America and domestic EV market share leadership exceeding 68% drive operational leverage.',
    riskScore: 50,
    riskCategory: 'MODERATE',
    annVolatility: 22.4,
    volBenchmark: 14.2,
    maxDrawdown: -17.8,
    drawdownPeak: 1065,
    var95: -4.2,
    sharpeRatio: 1.78,
    beta: 1.34,
    drawdownFloor: 910,
    uncertaintyEntropy: 0.21,
    rsi: 64.2,
    macd: {
      macdLine: 12.80,
      signalLine: 7.60,
      histogram: 5.20
    },
    sma20: 962.00,
    sma50: 940.00,
    sma200: 890.00,
    bollinger: {
      upper: 1015.00,
      middle: 962.00,
      lower: 909.00,
      pb: 0.72
    },
    volume24h: '12.4M shares',
    volumeSurge: '+24.1% Surge',
    vol20dAvg: '9.98M',
    shapFactors: [
      { feature: 'JLR Free Cash Flow Beat', impact: 0.28, isBullish: true },
      { feature: 'Domestic EV Market Share (68%)', impact: 0.21, isBullish: true },
      { feature: 'RSI Trend Acceleration (64.2)', impact: 0.17, isBullish: true },
      { feature: 'EU Industrial Slowdown Risk', impact: -0.11, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'Close > 50D SMA & EV Bookings Rise',
        explanation: 'Structural auto transition winner with strong order books',
        shift: '+27%',
        positive: true
      }
    ],
    ensembleModels: [
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'UP', confidence: 85, isPrimary: true },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 81 },
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'UP', confidence: 72 }
    ]
  },

  BHARTIARTL: {
    ticker: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    exchange: 'NSE',
    sector: 'IT & Telecom',
    marketCap: '₹9.85 Lakh Cr',
    price: 1645.00,
    change: 19.50,
    changePercent: 1.20,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 87,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '82.1% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Industry-leading ARPU expansion towards ₹225 and rapid postpaid subscriber monetization with 5G rollout completion.',
    riskScore: 28,
    riskCategory: 'LOW',
    annVolatility: 13.9,
    volBenchmark: 14.2,
    maxDrawdown: -9.2,
    drawdownPeak: 1690,
    var95: -2.5,
    sharpeRatio: 2.18,
    beta: 0.78,
    drawdownFloor: 1540,
    uncertaintyEntropy: 0.13,
    rsi: 63.5,
    macd: {
      macdLine: 18.20,
      signalLine: 11.40,
      histogram: 6.80
    },
    sma20: 1612.00,
    sma50: 1580.00,
    sma200: 1490.00,
    bollinger: {
      upper: 1680.00,
      middle: 1612.00,
      lower: 1544.00,
      pb: 0.74
    },
    volume24h: '5.8M shares',
    volumeSurge: '+18.6% Surge',
    vol20dAvg: '4.89M',
    shapFactors: [
      { feature: 'ARPU Growth Trajectory (₹225)', impact: 0.31, isBullish: true },
      { feature: '5G Enterprise Private Network Deals', impact: 0.20, isBullish: true },
      { feature: 'Africa Currency Devaluation Stabilization', impact: 0.12, isBullish: true },
      { feature: 'Spectrum Regulatory Payments', impact: -0.07, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'ARPU > Industry + RSI in Bull Range',
        explanation: 'Organic pricing power translating to free cash flow',
        shift: '+28%',
        positive: true
      }
    ],
    ensembleModels: [
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'UP', confidence: 87, isPrimary: true },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 83 },
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'UP', confidence: 76 }
    ]
  },

  LT: {
    ticker: 'LT',
    name: 'Larsen & Toubro Ltd.',
    exchange: 'NSE',
    sector: 'Infrastructure & Capital Goods',
    marketCap: '₹4.98 Lakh Cr',
    price: 3620.00,
    change: 39.40,
    changePercent: 1.10,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 81,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '78.0% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Unprecedented order book exceeding ₹4.8 Lakh Crore backed by Middle East energy transition and domestic capex cycle.',
    riskScore: 35,
    riskCategory: 'LOW',
    annVolatility: 16.2,
    volBenchmark: 14.2,
    maxDrawdown: -11.2,
    drawdownPeak: 3820,
    var95: -2.9,
    sharpeRatio: 1.95,
    beta: 1.02,
    drawdownFloor: 3420,
    uncertaintyEntropy: 0.16,
    rsi: 59.8,
    macd: {
      macdLine: 24.50,
      signalLine: 16.20,
      histogram: 8.30
    },
    sma20: 3560.00,
    sma50: 3510.00,
    sma200: 3380.00,
    bollinger: {
      upper: 3710.00,
      middle: 3560.00,
      lower: 3410.00,
      pb: 0.70
    },
    volume24h: '2.45M shares',
    volumeSurge: '+15.2% Surge',
    vol20dAvg: '2.13M',
    shapFactors: [
      { feature: 'Order Book Depth (₹4.8L Cr)', impact: 0.29, isBullish: true },
      { feature: 'Middle East Capex Execution', impact: 0.19, isBullish: true },
      { feature: 'Working Capital Cycle Improvement', impact: 0.13, isBullish: true },
      { feature: 'Supply Chain Component Inflation', impact: -0.08, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'Order Inflow YoY > 15% & Trend Above 200 SMA',
        explanation: 'Multi-year capex visibility supports structural re-rating',
        shift: '+23%',
        positive: true
      }
    ],
    ensembleModels: [
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'UP', confidence: 81, isPrimary: true },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 78 },
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'UP', confidence: 71 }
    ]
  },

  SUNPHARMA: {
    ticker: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries',
    exchange: 'NSE',
    sector: 'Healthcare & Pharma',
    marketCap: '₹4.41 Lakh Cr',
    price: 1840.00,
    change: 24.50,
    changePercent: 1.35,
    direction: 'UP',
    directionLabel: 'UP (Bullish)',
    confidence: 83,
    activeModel: 'XGBoost Classifier (v2.4)',
    winRate: '80.1% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Global specialty portfolio (Ilumya, Cequa, Winlevi) cross $1B revenue threshold with sustained domestic formulation outperformance.',
    riskScore: 29,
    riskCategory: 'LOW',
    annVolatility: 14.1,
    volBenchmark: 14.2,
    maxDrawdown: -9.5,
    drawdownPeak: 1910,
    var95: -2.6,
    sharpeRatio: 2.12,
    beta: 0.72,
    drawdownFloor: 1720,
    uncertaintyEntropy: 0.14,
    rsi: 60.5,
    macd: {
      macdLine: 15.20,
      signalLine: 9.80,
      histogram: 5.40
    },
    sma20: 1810.00,
    sma50: 1780.00,
    sma200: 1640.00,
    bollinger: {
      upper: 1880.00,
      middle: 1810.00,
      lower: 1740.00,
      pb: 0.71
    },
    volume24h: '2.1M shares',
    volumeSurge: '+14.0% Surge',
    vol20dAvg: '1.84M',
    shapFactors: [
      { feature: 'Specialty Pharma Ramps ($1B+ ARR)', impact: 0.28, isBullish: true },
      { feature: 'Domestic Chronic Therapies Growth', impact: 0.18, isBullish: true },
      { feature: 'Low Beta Defense (0.72)', impact: 0.12, isBullish: true },
      { feature: 'US FDA Regulatory Compliance Costs', impact: -0.07, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'Specialty Rev > 18% of Total & Margin > 28%',
        explanation: 'De-commoditization of generic drug business model',
        shift: '+21%',
        positive: true
      }
    ],
    ensembleModels: [
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'UP', confidence: 83, isPrimary: true },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 79 },
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'UP', confidence: 69 }
    ]
  },

  WIPRO: {
    ticker: 'WIPRO',
    name: 'Wipro Limited',
    exchange: 'NSE',
    sector: 'IT Services',
    marketCap: '₹2.81 Lakh Cr',
    price: 538.50,
    change: -2.15,
    changePercent: -0.40,
    direction: 'NEUTRAL',
    directionLabel: 'NEUTRAL / HOLD',
    confidence: 72,
    activeModel: 'LSTM Ensemble (v3.1)',
    winRate: '71.5% Precision',
    snapshotTime: '09:30 AM IST Snapshot',
    synthesisNote: 'Consulting business (Capco) showing stabilization signs while large deal pipeline execution remains in transition phase.',
    riskScore: 39,
    riskCategory: 'MODERATE',
    annVolatility: 16.8,
    volBenchmark: 14.2,
    maxDrawdown: -14.8,
    drawdownPeak: 564,
    var95: -3.3,
    sharpeRatio: 1.41,
    beta: 0.85,
    drawdownFloor: 512,
    uncertaintyEntropy: 0.24,
    rsi: 48.0,
    macd: {
      macdLine: -0.80,
      signalLine: 0.40,
      histogram: -1.20
    },
    sma20: 542.00,
    sma50: 535.00,
    sma200: 510.00,
    bollinger: {
      upper: 558.00,
      middle: 542.00,
      lower: 526.00,
      pb: 0.39
    },
    volume24h: '4.5M shares',
    volumeSurge: '-2.5% Normal',
    vol20dAvg: '4.62M',
    shapFactors: [
      { feature: 'Capco Consulting Turnaround', impact: 0.12, isBullish: true },
      { feature: 'AI360 Deal Pipeline', impact: 0.09, isBullish: true },
      { feature: 'BFSI Discretionary Spending Pause', impact: -0.14, isBullish: false },
      { feature: 'Sub-par Revenue Growth Relative to Tier 1', impact: -0.10, isBullish: false }
    ],
    limeRules: [
      {
        rule: 'RSI in 45-55 & MACD Histogram Negative',
        explanation: 'Lack of directional catalyst; rangebound consolidation',
        shift: '-14%',
        positive: false
      }
    ],
    ensembleModels: [
      { name: 'LSTM Network', architecture: 'Recurrent Sequential Attention', direction: 'NEUTRAL', confidence: 72, isPrimary: true },
      { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: 'NEUTRAL', confidence: 68 },
      { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: 'UP', confidence: 58 }
    ]
  }
};

export const DEFAULT_MOCK_PORTFOLIO: Record<string, { shares: number; avgBuyPrice: number; purchaseDate: string }> = {
  RELIANCE: { shares: 80, avgBuyPrice: 2620.00, purchaseDate: '2024-03-12' },
  TCS: { shares: 35, avgBuyPrice: 3880.00, purchaseDate: '2024-04-05' },
  INFY: { shares: 60, avgBuyPrice: 1940.00, purchaseDate: '2024-02-18' },
  HDFCBANK: { shares: 75, avgBuyPrice: 1550.00, purchaseDate: '2024-05-22' },
  ICICIBANK: { shares: 65, avgBuyPrice: 1180.00, purchaseDate: '2024-06-15' },
  SBIN: { shares: 100, avgBuyPrice: 740.00, purchaseDate: '2024-04-20' },
  ITC: { shares: 150, avgBuyPrice: 440.00, purchaseDate: '2024-01-15' },
  TATAMOTORS: { shares: 70, avgBuyPrice: 890.00, purchaseDate: '2024-05-02' },
  TATASTEEL: { shares: 400, avgBuyPrice: 164.00, purchaseDate: '2024-06-10' },
  TECHM: { shares: 50, avgBuyPrice: 1520.00, purchaseDate: '2024-01-30' },
};

export const HOTLINKED_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9tE507nO46Hx5D-XK7B4R7qDjtNEE-LGgu7DwjCydVdgcZvRLSS_XAEbMNKSbwM95a648Rr5IJCUVUQ2qoi-VcKRvCLNB89Sc_mCiL-_7YH9nNCJOxFsLN8-tvoynvlFm88toNd08OFakq5Zso1lKkHnvAiyPUNNiZWi0dkms3EcrKvV3HbX3IyeJu35RGdvgTiN4Hxz8nKRyhtXo6JuY30ziQzIrG3-eA08E0P5iDL-l4DPNOZpi',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBobQEJWoTupDZEVi4Q2DmtIRObeNUI_-YOKmJfZSI3olWNhBsJuViC3Z9MobvW4gEeJU7GFxOhpF-x-tzZKG3dJmD1N3K5sKRFDKfLBP0gTn7eotZJ29yHIrtGxfq0-DAcDVAVo3xuUqXuhn8FpBj6zpwqhGLCYJiD3ZZPCPkRQhrjlyITW-uzu54jQct-IFjQSs1c8XuJjCFe5o1ruIZl107Qv1RZP1dzjD9JsxfRG-yNK1fKKYxX',
  researchBanner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUn-taEGgEx29QvssUEE3X3Bq4nMkX21wcmhSnKvYDuLOTKWpU3m0ncQdxQ6rbo8jsWxPSbB9CMLemYVFDgLHhS1_V0bThbbqVe5I0SGNU6kPLDXAnSFOsghPHccwMH-pmbjm6kIHQdCu5Veqj6Tr1hV4MaY2ChicqxZZtsOKHJXYBwI2WmBoH2xaLXVYPmvu0HJqsFfwzo4bhgcLiVnDfiRIPlgtuE6yYDN16RUTU_t5b3oBJZOaF'
};

/**
 * Resolves a stock ticker against STOCKS_DATA or dynamically synthesizes
 * a mathematically coherent StockData object from the Indian NSE500 sector universe.
 */
export function getStockData(ticker: string): StockData {
  if (!ticker) return STOCKS_DATA.RELIANCE;
  const upper = ticker.toUpperCase();
  if (STOCKS_DATA[upper]) {
    return STOCKS_DATA[upper];
  }

  for (const sec of NSE500_SECTORS_DATA) {
    const found = sec.stocks.find((s) => s.ticker.toUpperCase() === upper);
    if (found) {
      const isBull = found.changePercent >= 0;
      const rsi = found.rsi || (isBull ? 58.4 : 44.2);
      const sma20 = Math.round(found.price * 0.98 * 100) / 100;
      const sma50 = Math.round(found.price * 0.96 * 100) / 100;
      const sma200 = Math.round(found.price * 0.91 * 100) / 100;
      const beta = found.beta || 1.05;

      return {
        ticker: found.ticker,
        name: found.name,
        exchange: 'NSE',
        sector: sec.name,
        marketCap: `₹${found.marketCapTrillion} Lakh Cr`,
        price: found.price,
        change: found.changeValue,
        changePercent: found.changePercent,
        direction: found.direction,
        directionLabel: found.direction === 'UP' ? 'UP (Bullish)' : found.direction === 'DOWN' ? 'DOWN (Bearish)' : 'NEUTRAL / HOLD',
        confidence: found.aiConfidence || 78,
        activeModel: 'XGBoost Classifier (v2.4)',
        winRate: `${Math.round((found.aiConfidence || 78) * 0.95)}% Precision`,
        snapshotTime: '09:30 AM IST Snapshot',
        synthesisNote: `${found.name} exhibits ${isBull ? 'positive structural accumulation' : 'consolidation'} in the ${sec.name} index with beta of ${beta.toFixed(2)}.`,
        riskScore: Math.round(Math.min(95, Math.max(15, beta * 30 + (100 - (found.aiConfidence || 75)) * 0.3))),
        riskCategory: beta > 1.2 ? 'HIGH' : beta < 0.85 ? 'LOW' : 'MODERATE',
        annVolatility: Math.round(14.2 * beta * 10) / 10,
        volBenchmark: 14.2,
        maxDrawdown: -Math.round(beta * 10.5 * 10) / 10,
        drawdownPeak: found.week52High || Math.round(found.price * 1.15),
        var95: -Math.round(beta * 2.8 * 10) / 10,
        sharpeRatio: Math.round((2.4 - beta * 0.5) * 100) / 100,
        beta: beta,
        drawdownFloor: found.week52Low || Math.round(found.price * 0.82),
        uncertaintyEntropy: 0.18,
        rsi: rsi,
        macd: {
          macdLine: Math.round(found.price * 0.008 * 100) / 100,
          signalLine: Math.round(found.price * 0.005 * 100) / 100,
          histogram: Math.round(found.price * (isBull ? 0.003 : -0.003) * 100) / 100
        },
        sma20,
        sma50,
        sma200,
        bollinger: {
          upper: Math.round(found.price * 1.04 * 100) / 100,
          middle: sma20,
          lower: Math.round(found.price * 0.94 * 100) / 100,
          pb: Math.round((rsi / 100) * 100) / 100
        },
        volume24h: `${found.volumeMillion}M shares`,
        volumeSurge: `${found.changePercent >= 0 ? '+' : ''}${Math.round(found.changePercent * 6)}% Volume Delta`,
        vol20dAvg: `${(found.volumeMillion * 0.88).toFixed(1)}M`,
        shapFactors: [
          { feature: `RSI Momentum (${rsi})`, impact: isBull ? 0.24 : -0.21, isBullish: isBull },
          { feature: `${sec.code} Sector Relative Strength`, impact: isBull ? 0.18 : -0.15, isBullish: isBull },
          { feature: `Beta Factor (${beta.toFixed(2)})`, impact: beta < 1.0 ? 0.12 : -0.10, isBullish: beta < 1.0 },
          { feature: `P/E Valuation Multiple (${found.peRatio || 22.4})`, impact: 0.08, isBullish: true }
        ],
        limeRules: [
          {
            rule: `Spot Price vs 20D SMA`,
            explanation: `Trades near dynamic support band with institutional confirmation`,
            shift: `${isBull ? '+' : '-'}18%`,
            positive: isBull
          }
        ],
        ensembleModels: [
          { name: 'XGBoost Classifier', architecture: 'Gradient Boosted Trees', direction: found.direction, confidence: found.aiConfidence || 78, isPrimary: true },
          { name: 'Random Forest', architecture: 'Bagging Ensemble (500 Trees)', direction: found.direction, confidence: Math.max(50, (found.aiConfidence || 78) - 4) },
          { name: 'LSTM Network', architecture: 'Recurrent Attention', direction: found.direction, confidence: Math.max(50, (found.aiConfidence || 78) - 8) }
        ]
      };
    }
  }

  return STOCKS_DATA.RELIANCE;
}

/**
 * Returns complete list of available Indian equities spanning STOCKS_DATA
 * and the entire NSE 500 sectoral universe.
 */
export function getAllIndianStocks(): StockData[] {
  const map = new Map<string, StockData>();
  
  // Add base stocks
  Object.values(STOCKS_DATA).forEach((stock) => {
    map.set(stock.ticker.toUpperCase(), stock);
  });

  // Add all from NSE500 sectors
  NSE500_SECTORS_DATA.forEach((sec) => {
    sec.stocks.forEach((s) => {
      if (!map.has(s.ticker.toUpperCase())) {
        map.set(s.ticker.toUpperCase(), getStockData(s.ticker));
      }
    });
  });

  return Array.from(map.values());
}

