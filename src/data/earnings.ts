export interface EarningsItem {
  ticker: string;
  companyName: string;
  sector: string;
  fiscalQuarter: string;
  reportDate: string; // e.g. 'Oct 12, 2026'
  reportDateISO: string;
  daysRemaining: number;
  timing: 'BMO' | 'AMC'; // Before Market Open | After Market Close
  consensusEPS: number; // in INR
  priorQuarterEPS: number;
  yoyEPSGrowth: number; // in %
  consensusRevenueCr: number; // in Crores
  yoyRevGrowth: number; // in %
  priorQuarterSurprise: number; // in % (e.g. +4.2% beat)
  analystRatings: {
    buy: number;
    hold: number;
    sell: number;
    total: number;
    consensusTargetPrice: number;
  };
  impliedMovePct: number; // Option straddle implied move e.g. 3.4%
  keyWatchMetrics: string[];
}

export const UPCOMING_EARNINGS_DATABASE: EarningsItem[] = [
  {
    ticker: 'TCS',
    companyName: 'Tata Consultancy Services',
    sector: 'Information Technology',
    fiscalQuarter: 'Q2 FY27',
    reportDate: 'Oct 09, 2026',
    reportDateISO: '2026-10-09',
    daysRemaining: 4,
    timing: 'AMC',
    consensusEPS: 34.80,
    priorQuarterEPS: 32.40,
    yoyEPSGrowth: 7.4,
    consensusRevenueCr: 64250,
    yoyRevGrowth: 6.8,
    priorQuarterSurprise: 2.1,
    analystRatings: {
      buy: 28,
      hold: 8,
      sell: 3,
      total: 39,
      consensusTargetPrice: 4250.00
    },
    impliedMovePct: 3.2,
    keyWatchMetrics: ['BFSI vertical recovery', 'Total Contract Value (TCV) deal wins', 'Attrition rate under 12%']
  },
  {
    ticker: 'INFY',
    companyName: 'Infosys Limited',
    sector: 'Information Technology',
    fiscalQuarter: 'Q2 FY27',
    reportDate: 'Oct 15, 2026',
    reportDateISO: '2026-10-15',
    daysRemaining: 10,
    timing: 'AMC',
    consensusEPS: 17.40,
    priorQuarterEPS: 15.90,
    yoyEPSGrowth: 9.4,
    consensusRevenueCr: 41800,
    yoyRevGrowth: 7.9,
    priorQuarterSurprise: 3.6,
    analystRatings: {
      buy: 32,
      hold: 7,
      sell: 2,
      total: 41,
      consensusTargetPrice: 2050.00
    },
    impliedMovePct: 4.1,
    keyWatchMetrics: ['FY27 constant-currency revenue guidance revision', 'GenAI Topaz enterprise ramp', 'Operating margins (21-22% band)']
  },
  {
    ticker: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd.',
    sector: 'Banking & Financials',
    fiscalQuarter: 'Q2 FY27',
    reportDate: 'Oct 18, 2026',
    reportDateISO: '2026-10-18',
    daysRemaining: 13,
    timing: 'BMO',
    consensusEPS: 24.50,
    priorQuarterEPS: 22.80,
    yoyEPSGrowth: 7.5,
    consensusRevenueCr: 88500,
    yoyRevGrowth: 11.2,
    priorQuarterSurprise: 1.8,
    analystRatings: {
      buy: 36,
      hold: 4,
      sell: 1,
      total: 41,
      consensusTargetPrice: 1850.00
    },
    impliedMovePct: 2.8,
    keyWatchMetrics: ['Net Interest Margin (NIM) trajectory post-merger', 'Deposit growth vs Loan growth ratio', 'Gross NPA ratio stability']
  },
  {
    ticker: 'RELIANCE',
    companyName: 'Reliance Industries Ltd.',
    sector: 'Energy & Conglomerate',
    fiscalQuarter: 'Q2 FY27',
    reportDate: 'Oct 23, 2026',
    reportDateISO: '2026-10-23',
    daysRemaining: 18,
    timing: 'AMC',
    consensusEPS: 31.20,
    priorQuarterEPS: 28.50,
    yoyEPSGrowth: 9.5,
    consensusRevenueCr: 242000,
    yoyRevGrowth: 8.4,
    priorQuarterSurprise: 4.8,
    analystRatings: {
      buy: 31,
      hold: 5,
      sell: 2,
      total: 38,
      consensusTargetPrice: 3200.00
    },
    impliedMovePct: 3.5,
    keyWatchMetrics: ['Oil-to-Chemicals (O2C) refining spreads', 'Reliance Retail store additions & EBITDA margin', 'Jio ARPU improvement above ₹195']
  },
  {
    ticker: 'TATASTEEL',
    companyName: 'Tata Steel Ltd.',
    sector: 'Metals & Mining',
    fiscalQuarter: 'Q2 FY27',
    reportDate: 'Nov 04, 2026',
    reportDateISO: '2026-11-04',
    daysRemaining: 30,
    timing: 'AMC',
    consensusEPS: 2.85,
    priorQuarterEPS: 2.10,
    yoyEPSGrowth: 35.7,
    consensusRevenueCr: 58900,
    yoyRevGrowth: 4.2,
    priorQuarterSurprise: -1.2,
    analystRatings: {
      buy: 21,
      hold: 9,
      sell: 4,
      total: 34,
      consensusTargetPrice: 185.00
    },
    impliedMovePct: 4.6,
    keyWatchMetrics: ['Port Talbot UK electric arc transition timeline', 'Domestic India steel realization per ton', 'Deleveraging & net debt progress']
  },
  {
    ticker: 'TECHM',
    companyName: 'Tech Mahindra Ltd.',
    sector: 'Information Technology',
    fiscalQuarter: 'Q2 FY27',
    reportDate: 'Oct 26, 2026',
    reportDateISO: '2026-10-26',
    daysRemaining: 21,
    timing: 'AMC',
    consensusEPS: 14.20,
    priorQuarterEPS: 12.10,
    yoyEPSGrowth: 17.4,
    consensusRevenueCr: 13800,
    yoyRevGrowth: 5.1,
    priorQuarterSurprise: 3.1,
    analystRatings: {
      buy: 19,
      hold: 12,
      sell: 5,
      total: 36,
      consensusTargetPrice: 1650.00
    },
    impliedMovePct: 4.9,
    keyWatchMetrics: ['Communications vertical rebound', 'Project Fortius operational margin expansion', 'Enterprise deal pipeline']
  }
];
