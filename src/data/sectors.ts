export interface SectorData {
  id: string;
  name: string;
  indexSymbol: string;
  change1D: number; // % daily average return
  change1W: number; // % 1-week return
  change1M: number; // % 1-month return
  advances: number;
  declines: number;
  marketCapTrillion: number; // in Lakh Crore INR
  marketWeightPct: number;
  topGainer: {
    symbol: string;
    changePct: number;
  };
  topLoser: {
    symbol: string;
    changePct: number;
  };
  keyConstituents: string[];
  sentiment: 'BULLISH' | 'MODERATE' | 'BEARISH' | 'NEUTRAL';
  catalyst: string;
}

export const SECTOR_PERFORMANCE_DATA: SectorData[] = [
  {
    id: 'nifty-it',
    name: 'Information Tech',
    indexSymbol: 'NIFTY IT',
    change1D: 1.48,
    change1W: 3.20,
    change1M: 6.85,
    advances: 8,
    declines: 2,
    marketCapTrillion: 34.2,
    marketWeightPct: 14.1,
    topGainer: { symbol: 'INFY', changePct: 2.15 },
    topLoser: { symbol: 'WIPRO', changePct: -0.40 },
    keyConstituents: ['TCS', 'INFY', 'TECHM', 'WIPRO', 'HCLTECH'],
    sentiment: 'BULLISH',
    catalyst: 'US Fed rate easing expectations & GenAI enterprise deals expansion'
  },
  {
    id: 'nifty-metal',
    name: 'Metals & Mining',
    indexSymbol: 'NIFTY METAL',
    change1D: 2.34,
    change1W: 4.80,
    change1M: 8.12,
    advances: 12,
    declines: 3,
    marketCapTrillion: 12.8,
    marketWeightPct: 4.6,
    topGainer: { symbol: 'TATASTEEL', changePct: 2.85 },
    topLoser: { symbol: 'NMDC', changePct: -0.30 },
    keyConstituents: ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'VEDL', 'JINDALSTEL'],
    sentiment: 'BULLISH',
    catalyst: 'China infrastructure stimulus announcement & rising global steel spreads'
  },
  {
    id: 'nifty-energy',
    name: 'Energy & Oil',
    indexSymbol: 'NIFTY ENERGY',
    change1D: 1.18,
    change1W: 1.95,
    change1M: 4.30,
    advances: 7,
    declines: 3,
    marketCapTrillion: 26.5,
    marketWeightPct: 13.8,
    topGainer: { symbol: 'RELIANCE', changePct: 1.42 },
    topLoser: { symbol: 'BPCL', changePct: -0.65 },
    keyConstituents: ['RELIANCE', 'ONGC', 'NTPC', 'POWERGRID', 'COALINDIA'],
    sentiment: 'BULLISH',
    catalyst: 'Crude price stabilization and high domestic power generation demand'
  },
  {
    id: 'nifty-psu-bank',
    name: 'PSU Banking',
    indexSymbol: 'NIFTY PSU BANK',
    change1D: 1.65,
    change1W: 2.40,
    change1M: 5.75,
    advances: 9,
    declines: 3,
    marketCapTrillion: 16.4,
    marketWeightPct: 3.9,
    topGainer: { symbol: 'CANBK', changePct: 2.45 },
    topLoser: { symbol: 'PNB', changePct: 0.10 },
    keyConstituents: ['SBIN', 'BANKBARODA', 'CANBK', 'PNB', 'UNIONBANK'],
    sentiment: 'BULLISH',
    catalyst: 'Asset quality improvement, record low GNPA ratios, and loan book growth'
  },
  {
    id: 'nifty-auto',
    name: 'Automobiles',
    indexSymbol: 'NIFTY AUTO',
    change1D: 0.76,
    change1W: 1.15,
    change1M: -0.85,
    advances: 10,
    declines: 5,
    marketCapTrillion: 18.2,
    marketWeightPct: 7.4,
    topGainer: { symbol: 'M&M', changePct: 1.90 },
    topLoser: { symbol: 'HEROMOTOCO', changePct: -0.80 },
    keyConstituents: ['TATAMOTORS', 'MARUTI', 'M&M', 'BAJAJ-AUTO', 'EICHERMOT'],
    sentiment: 'MODERATE',
    catalyst: 'Strong festive booking velocity offset by dealer inventory normalization'
  },
  {
    id: 'nifty-fmcg',
    name: 'FMCG & Consumer',
    indexSymbol: 'NIFTY FMCG',
    change1D: 0.22,
    change1W: 0.60,
    change1M: 1.80,
    advances: 8,
    declines: 7,
    marketCapTrillion: 21.0,
    marketWeightPct: 8.6,
    topGainer: { symbol: 'ITC', changePct: 0.95 },
    topLoser: { symbol: 'HINDUNILVR', changePct: -0.75 },
    keyConstituents: ['ITC', 'HINDUNILVR', 'NESTLEIND', 'BRITANNIA', 'DABUR'],
    sentiment: 'NEUTRAL',
    catalyst: 'Rural consumption recovery following favorable monsoon distributions'
  },
  {
    id: 'nifty-pharma',
    name: 'Healthcare & Pharma',
    indexSymbol: 'NIFTY PHARMA',
    change1D: -0.15,
    change1W: 0.90,
    change1M: 3.40,
    advances: 6,
    declines: 9,
    marketCapTrillion: 15.1,
    marketWeightPct: 5.7,
    topGainer: { symbol: 'SUNPHARMA', changePct: 0.85 },
    topLoser: { symbol: 'CIPLA', changePct: -1.20 },
    keyConstituents: ['SUNPHARMA', 'CIPLA', 'DRREDDY', 'DIVISLAB', 'LUPIN'],
    sentiment: 'NEUTRAL',
    catalyst: 'US generic pricing headwinds balanced by domestic formulation expansion'
  },
  {
    id: 'nifty-bank',
    name: 'Private Banks',
    indexSymbol: 'NIFTY PVT BANK',
    change1D: -0.38,
    change1W: -0.95,
    change1M: 1.10,
    advances: 4,
    declines: 8,
    marketCapTrillion: 42.0,
    marketWeightPct: 24.6,
    topGainer: { symbol: 'ICICIBANK', changePct: 0.65 },
    topLoser: { symbol: 'KOTAKBANK', changePct: -1.45 },
    keyConstituents: ['HDFCBANK', 'ICICIBANK', 'KOTAKBANK', 'AXISBANK', 'INDUSINDBK'],
    sentiment: 'MODERATE',
    catalyst: 'Net Interest Margin (NIM) pressure due to elevated deposit costs'
  },
  {
    id: 'nifty-realty',
    name: 'Real Estate & Infra',
    indexSymbol: 'NIFTY REALTY',
    change1D: -1.25,
    change1W: -2.10,
    change1M: -3.80,
    advances: 3,
    declines: 7,
    marketCapTrillion: 5.4,
    marketWeightPct: 1.9,
    topGainer: { symbol: 'GODREJPROP', changePct: 0.40 },
    topLoser: { symbol: 'DLF', changePct: -2.10 },
    keyConstituents: ['DLF', 'GODREJPROP', 'LODHA', 'OBEROIRLTY', 'PRESTIGE'],
    sentiment: 'BEARISH',
    catalyst: 'Short-term profit booking after 52-week highs and higher mortgage yields'
  },
  {
    id: 'nifty-media',
    name: 'Media & Telecom',
    indexSymbol: 'NIFTY MEDIA',
    change1D: -1.80,
    change1W: -3.45,
    change1M: -5.10,
    advances: 2,
    declines: 8,
    marketCapTrillion: 3.2,
    marketWeightPct: 1.2,
    topGainer: { symbol: 'PVRINOX', changePct: 0.35 },
    topLoser: { symbol: 'ZEEL', changePct: -3.40 },
    keyConstituents: ['ZEEL', 'SUNTV', 'PVRINOX', 'NETWORK18', 'HATHWAY'],
    sentiment: 'BEARISH',
    catalyst: 'Ad spend softening and subscriber migration toward OTT streaming'
  }
];
