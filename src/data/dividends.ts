export interface HistoricalPayout {
  year: number;
  amount: number;
  splitOrSpecial?: string;
}

export interface StockDividendInfo {
  ticker: string;
  name: string;
  annualDividend: number; // in INR per share
  dividendYield: number; // % annual yield at current price
  payoutFrequency: 'Quarterly' | 'Semi-Annual' | 'Annual';
  payoutMonths: number[]; // 1 to 12
  payoutRatio: number; // % of net profit
  threeYearCagr: number; // % historical dividend growth rate
  lastExDate: string;
  nextEstimatedExDate: string;
  safetyScore: number; // 0-100
  safetyRating: 'VERY SAFE' | 'SAFE' | 'BORDERLINE' | 'AT RISK';
  historicalPayouts: HistoricalPayout[];
}

export const MOCK_DIVIDENDS_DATA: Record<string, StockDividendInfo> = {
  RELIANCE: {
    ticker: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    annualDividend: 10.00,
    dividendYield: 0.35,
    payoutFrequency: 'Annual',
    payoutMonths: [8],
    payoutRatio: 14.8,
    threeYearCagr: 8.5,
    lastExDate: '2024-08-19',
    nextEstimatedExDate: '2025-08-20',
    safetyScore: 92,
    safetyRating: 'VERY SAFE',
    historicalPayouts: [
      { year: 2021, amount: 7.00 },
      { year: 2022, amount: 8.00 },
      { year: 2023, amount: 9.00 },
      { year: 2024, amount: 10.00 }
    ]
  },
  TCS: {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    annualDividend: 73.00,
    dividendYield: 1.85,
    payoutFrequency: 'Quarterly',
    payoutMonths: [1, 5, 7, 10],
    payoutRatio: 64.2,
    threeYearCagr: 16.4,
    lastExDate: '2024-10-18',
    nextEstimatedExDate: '2025-01-17',
    safetyScore: 96,
    safetyRating: 'VERY SAFE',
    historicalPayouts: [
      { year: 2021, amount: 38.00 },
      { year: 2022, amount: 48.00 },
      { year: 2023, amount: 62.00, splitOrSpecial: '₹67 Special' },
      { year: 2024, amount: 73.00 }
    ]
  },
  INFY: {
    ticker: 'INFY',
    name: 'Infosys Limited',
    annualDividend: 46.00,
    dividendYield: 2.37,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [6, 11],
    payoutRatio: 61.5,
    threeYearCagr: 12.8,
    lastExDate: '2024-10-25',
    nextEstimatedExDate: '2025-05-30',
    safetyScore: 94,
    safetyRating: 'VERY SAFE',
    historicalPayouts: [
      { year: 2021, amount: 30.00 },
      { year: 2022, amount: 34.00 },
      { year: 2023, amount: 38.00 },
      { year: 2024, amount: 46.00 }
    ]
  },
  HDFCBANK: {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    annualDividend: 19.50,
    dividendYield: 1.20,
    payoutFrequency: 'Annual',
    payoutMonths: [5],
    payoutRatio: 22.4,
    threeYearCagr: 18.2,
    lastExDate: '2024-05-10',
    nextEstimatedExDate: '2025-05-15',
    safetyScore: 90,
    safetyRating: 'VERY SAFE',
    historicalPayouts: [
      { year: 2021, amount: 6.50 },
      { year: 2022, amount: 15.50 },
      { year: 2023, amount: 19.00 },
      { year: 2024, amount: 19.50 }
    ]
  },
  TATASTEEL: {
    ticker: 'TATASTEEL',
    name: 'Tata Steel Ltd.',
    annualDividend: 3.60,
    dividendYield: 2.21,
    payoutFrequency: 'Annual',
    payoutMonths: [6],
    payoutRatio: 36.5,
    threeYearCagr: 6.2,
    lastExDate: '2024-06-21',
    nextEstimatedExDate: '2025-06-20',
    safetyScore: 78,
    safetyRating: 'SAFE',
    historicalPayouts: [
      { year: 2021, amount: 2.50 },
      { year: 2022, amount: 5.10 },
      { year: 2023, amount: 3.60 },
      { year: 2024, amount: 3.60 }
    ]
  },
  TECHM: {
    ticker: 'TECHM',
    name: 'Tech Mahindra Ltd.',
    annualDividend: 45.00,
    dividendYield: 2.92,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [7, 11],
    payoutRatio: 78.0,
    threeYearCagr: 9.4,
    lastExDate: '2024-07-24',
    nextEstimatedExDate: '2024-11-06',
    safetyScore: 82,
    safetyRating: 'SAFE',
    historicalPayouts: [
      { year: 2021, amount: 30.00 },
      { year: 2022, amount: 45.00 },
      { year: 2023, amount: 48.00 },
      { year: 2024, amount: 45.00 }
    ]
  }
};

export const getDividendInfo = (ticker: string, currentPrice?: number): StockDividendInfo => {
  if (MOCK_DIVIDENDS_DATA[ticker]) {
    const data = { ...MOCK_DIVIDENDS_DATA[ticker] };
    if (currentPrice && currentPrice > 0) {
      data.dividendYield = Number(((data.annualDividend / currentPrice) * 100).toFixed(2));
    }
    return data;
  }

  // Graceful fallback for any custom or additional ticker
  const price = currentPrice || 1000;
  const mockYield = 1.75;
  const annualDiv = Math.round(price * (mockYield / 100) * 10) / 10;
  return {
    ticker,
    name: `${ticker} Equity`,
    annualDividend: annualDiv,
    dividendYield: mockYield,
    payoutFrequency: 'Semi-Annual',
    payoutMonths: [3, 9],
    payoutRatio: 42.0,
    threeYearCagr: 10.0,
    lastExDate: '2024-06-15',
    nextEstimatedExDate: '2025-06-15',
    safetyScore: 85,
    safetyRating: 'SAFE',
    historicalPayouts: [
      { year: 2021, amount: Math.round(annualDiv * 0.75 * 10) / 10 },
      { year: 2022, amount: Math.round(annualDiv * 0.85 * 10) / 10 },
      { year: 2023, amount: Math.round(annualDiv * 0.92 * 10) / 10 },
      { year: 2024, amount: annualDiv }
    ]
  };
};

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
