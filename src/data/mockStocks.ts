import { Stock, MarketIndex, NewsItem, ChartTimeframe, HistoricalDataPoint } from '../types/stock';

// Realistic Monte Carlo Simulation Generator for 2027 horizon
export function generateMonteCarloPaths(currentPrice: number, base2027: number, volatility: number = 0.28, pathCount: number = 20, steps: number = 24): number[][] {
  const paths: number[][] = [];
  const monthlyDrift = Math.log(base2027 / currentPrice) / steps;
  const monthlyVol = volatility / Math.sqrt(12);

  for (let p = 0; p < pathCount; p++) {
    const path: number[] = [currentPrice];
    let price = currentPrice;
    for (let s = 1; s <= steps; s++) {
      // Box-Muller normal random
      const u1 = Math.random() || 0.0001;
      const u2 = Math.random() || 0.0001;
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      const changePercent = monthlyDrift + monthlyVol * z;
      price = Math.max(5, price * Math.exp(changePercent));
      path.push(parseFloat(price.toFixed(2)));
    }
    paths.push(path);
  }
  return paths;
}

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Semiconductors',
    price: 138.45,
    change: 4.82,
    changePercent: 3.61,
    previousClose: 133.63,
    open: 134.50,
    high: 139.20,
    low: 134.10,
    volume: 52400000,
    avgVolume: 48000000,
    marketCap: 3380, // $3.38T
    peRatio: 52.4,
    forwardPe: 34.2,
    eps: 2.64,
    beta: 1.68,
    dividendYield: 0.03,
    fiftyTwoWeekHigh: 140.76,
    fiftyTwoWeekLow: 45.20,
    sentimentScore: 84,
    sentimentLabel: 'Very Bullish',
    socialMentions24h: 184500,
    institutionalOwnership: 68.4,
    shortInterestPercent: 1.2,
    analystConsensus: 'Strong Buy',
    targetPriceAvg: 165.0,
    description: 'NVIDIA pioneers GPU-accelerated computing and modern enterprise AI infrastructure, powering hyperscale data centers, Blackwell architectures, and autonomous vehicles.',
    forecast2027: {
      bearPrice: 110.0,
      basePrice: 210.0,
      bullPrice: 285.0,
      currentPrice: 138.45,
      impliedCagrBase: 23.4,
      confidenceScore: 88,
      keyCatalysts: [
        'Blackwell GB200 & Ultra multi-gigawatt sovereign AI superclusters',
        'Enterprise AI agent platform software licensing revenue ramp',
        'Robotics & autonomous physical AI software ecosystem'
      ],
      keyRisks: [
        'Geopolitical chip export restrictions and Taiwan supply chain concentration',
        'Custom ASIC chips from Google, Amazon, and Microsoft internal workloads'
      ],
      monteCarloPaths: generateMonteCarloPaths(138.45, 210.0, 0.32),
      modelAssumptions: {
        revenueGrowthRate: '28% 3-Yr CAGR',
        operatingMargin2027: '61.5%',
        terminalPeMultiple: 32,
        discountRate: '9.2%'
      }
    }
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    price: 232.15,
    change: -1.20,
    changePercent: -0.51,
    previousClose: 233.35,
    open: 233.80,
    high: 234.90,
    low: 231.50,
    volume: 38200000,
    avgVolume: 42000000,
    marketCap: 3510,
    peRatio: 34.8,
    forwardPe: 29.5,
    eps: 6.67,
    beta: 1.05,
    dividendYield: 0.43,
    fiftyTwoWeekHigh: 237.23,
    fiftyTwoWeekLow: 164.08,
    sentimentScore: 62,
    sentimentLabel: 'Bullish',
    socialMentions24h: 122000,
    institutionalOwnership: 61.2,
    shortInterestPercent: 0.8,
    analystConsensus: 'Buy',
    targetPriceAvg: 255.0,
    description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, along with high-margin recurring ecosystem services.',
    forecast2027: {
      bearPrice: 195.0,
      basePrice: 295.0,
      bullPrice: 345.0,
      currentPrice: 232.15,
      impliedCagrBase: 12.8,
      confidenceScore: 82,
      keyCatalysts: [
        'Apple Intelligence iPhone upgrade supercycle',
        'High-margin Services division surpassing 30% of total company revenue',
        'Next-gen Vision headset and spatial computing consumer penetration'
      ],
      keyRisks: [
        'Regulatory scrutiny in EU and US over App Store fees and default search agreements',
        'Competition in greater China domestic smartphone tier'
      ],
      monteCarloPaths: generateMonteCarloPaths(232.15, 295.0, 0.20),
      modelAssumptions: {
        revenueGrowthRate: '8.5% 3-Yr CAGR',
        operatingMargin2027: '33.0%',
        terminalPeMultiple: 28,
        discountRate: '7.8%'
      }
    }
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    price: 436.50,
    change: 5.40,
    changePercent: 1.25,
    previousClose: 431.10,
    open: 432.00,
    high: 438.25,
    low: 430.80,
    volume: 18900000,
    avgVolume: 21500000,
    marketCap: 3240,
    peRatio: 36.2,
    forwardPe: 30.1,
    eps: 12.05,
    beta: 1.15,
    dividendYield: 0.73,
    fiftyTwoWeekHigh: 468.35,
    fiftyTwoWeekLow: 326.93,
    sentimentScore: 71,
    sentimentLabel: 'Bullish',
    socialMentions24h: 89000,
    institutionalOwnership: 73.8,
    shortInterestPercent: 0.7,
    analystConsensus: 'Strong Buy',
    targetPriceAvg: 495.0,
    description: 'Microsoft develops and supports software, services, devices, and enterprise cloud solutions, including Azure, Microsoft 365 Copilot, and LinkedIn.',
    forecast2027: {
      bearPrice: 380.0,
      basePrice: 560.0,
      bullPrice: 650.0,
      currentPrice: 436.50,
      impliedCagrBase: 13.5,
      confidenceScore: 85,
      keyCatalysts: [
        'Azure AI enterprise compute acceleration and market share gains vs AWS',
        'Copilot Seat conversion across 400M+ commercial Office users',
        'Gaming division synergies post-Activision Blizzard integration'
      ],
      keyRisks: [
        'High capital expenditure depreciation drag before software monetization matures',
        'Enterprise IT budget compression during macro slowdowns'
      ],
      monteCarloPaths: generateMonteCarloPaths(436.50, 560.0, 0.22),
      modelAssumptions: {
        revenueGrowthRate: '14.2% 3-Yr CAGR',
        operatingMargin2027: '44.5%',
        terminalPeMultiple: 30,
        discountRate: '8.0%'
      }
    }
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    price: 248.80,
    change: 11.20,
    changePercent: 4.71,
    previousClose: 237.60,
    open: 239.50,
    high: 252.10,
    low: 238.20,
    volume: 64100000,
    avgVolume: 72000000,
    marketCap: 795,
    peRatio: 68.5,
    forwardPe: 54.0,
    eps: 3.63,
    beta: 2.35,
    dividendYield: 0.0,
    fiftyTwoWeekHigh: 271.00,
    fiftyTwoWeekLow: 138.80,
    sentimentScore: 54,
    sentimentLabel: 'Bullish',
    socialMentions24h: 310000,
    institutionalOwnership: 44.5,
    shortInterestPercent: 3.4,
    analystConsensus: 'Hold',
    targetPriceAvg: 260.0,
    description: 'Tesla designs, manufactures, and sells electric vehicles, energy generation and storage systems, and develops Full Self-Driving (FSD) and humanoid robotics (Optimus).',
    forecast2027: {
      bearPrice: 160.0,
      basePrice: 380.0,
      bullPrice: 550.0,
      currentPrice: 248.80,
      impliedCagrBase: 23.6,
      confidenceScore: 68,
      keyCatalysts: [
        'Cybercab Robotaxi commercial testing approvals and ride-hailing network launch',
        'Tesla Energy Megapack stationary storage revenue reaching 25%+ of top-line',
        'Next-generation sub-$30k mass-market vehicle ramp'
      ],
      keyRisks: [
        'Automotive price wars with Chinese EV giants (BYD, Geely)',
        'FSD regulatory delays and safety investigation hurdles'
      ],
      monteCarloPaths: generateMonteCarloPaths(248.80, 380.0, 0.42),
      modelAssumptions: {
        revenueGrowthRate: '21.0% 3-Yr CAGR',
        operatingMargin2027: '14.8%',
        terminalPeMultiple: 40,
        discountRate: '11.5%'
      }
    }
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    price: 182.40,
    change: 2.10,
    changePercent: 1.16,
    previousClose: 180.30,
    open: 181.00,
    high: 183.90,
    low: 180.20,
    volume: 24800000,
    avgVolume: 28000000,
    marketCap: 2260,
    peRatio: 24.8,
    forwardPe: 20.3,
    eps: 7.35,
    beta: 1.08,
    dividendYield: 0.44,
    fiftyTwoWeekHigh: 191.75,
    fiftyTwoWeekLow: 129.40,
    sentimentScore: 66,
    sentimentLabel: 'Bullish',
    socialMentions24h: 76000,
    institutionalOwnership: 65.1,
    shortInterestPercent: 0.6,
    analystConsensus: 'Strong Buy',
    targetPriceAvg: 205.0,
    description: 'Alphabet offers Google Search, YouTube, Android, Google Cloud, and AI innovation through Google DeepMind, while incubating Other Bets like Waymo.',
    forecast2027: {
      bearPrice: 155.0,
      basePrice: 250.0,
      bullPrice: 310.0,
      currentPrice: 182.40,
      impliedCagrBase: 17.1,
      confidenceScore: 84,
      keyCatalysts: [
        'Google Cloud profit margin expansion and AI infrastructure workloads',
        'Waymo commercial robotaxi driverless passenger miles expansion in top 20 cities',
        'AI Overviews driving higher ad click conversion and advertiser ROI'
      ],
      keyRisks: [
        'DOJ antitrust remedies targeting search distribution agreements and Android bundling',
        'Perplexity and generative answer competition for direct queries'
      ],
      monteCarloPaths: generateMonteCarloPaths(182.40, 250.0, 0.24),
      modelAssumptions: {
        revenueGrowthRate: '12.4% 3-Yr CAGR',
        operatingMargin2027: '32.0%',
        terminalPeMultiple: 22,
        discountRate: '8.5%'
      }
    }
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    price: 198.60,
    change: 3.25,
    changePercent: 1.66,
    previousClose: 195.35,
    open: 196.10,
    high: 199.40,
    low: 195.80,
    volume: 31200000,
    avgVolume: 35000000,
    marketCap: 2070,
    peRatio: 43.1,
    forwardPe: 31.8,
    eps: 4.61,
    beta: 1.18,
    dividendYield: 0.0,
    fiftyTwoWeekHigh: 201.20,
    fiftyTwoWeekLow: 118.35,
    sentimentScore: 78,
    sentimentLabel: 'Very Bullish',
    socialMentions24h: 94000,
    institutionalOwnership: 64.9,
    shortInterestPercent: 0.7,
    analystConsensus: 'Strong Buy',
    targetPriceAvg: 225.0,
    description: 'Amazon leads global e-commerce, cloud computing (AWS), digital streaming, and high-margin retail media advertising networks.',
    forecast2027: {
      bearPrice: 165.0,
      basePrice: 275.0,
      bullPrice: 330.0,
      currentPrice: 198.60,
      impliedCagrBase: 17.4,
      confidenceScore: 86,
      keyCatalysts: [
        'AWS enterprise cloud migration re-acceleration and Bedrock AI adoption',
        'Fulfillment network regionalization driving record operating margins',
        'Digital advertising growth outpacing broader market'
      ],
      keyRisks: [
        'Temu and Shein competing aggressively in low-ASP consumer goods',
        'Capital expenditure requirements for data center power and custom silicon'
      ],
      monteCarloPaths: generateMonteCarloPaths(198.60, 275.0, 0.23),
      modelAssumptions: {
        revenueGrowthRate: '11.8% 3-Yr CAGR',
        operatingMargin2027: '12.5%',
        terminalPeMultiple: 27,
        discountRate: '8.4%'
      }
    }
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    exchange: 'NYSE',
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    price: 44.80,
    change: 2.30,
    changePercent: 5.41,
    previousClose: 42.50,
    open: 43.10,
    high: 45.25,
    low: 42.80,
    volume: 68400000,
    avgVolume: 55000000,
    marketCap: 101,
    peRatio: 118.0,
    forwardPe: 78.4,
    eps: 0.38,
    beta: 2.65,
    dividendYield: 0.0,
    fiftyTwoWeekHigh: 45.75,
    fiftyTwoWeekLow: 14.48,
    sentimentScore: 89,
    sentimentLabel: 'Very Bullish',
    socialMentions24h: 215000,
    institutionalOwnership: 47.8,
    shortInterestPercent: 4.1,
    analystConsensus: 'Buy',
    targetPriceAvg: 48.0,
    description: 'Palantir builds AI-driven operating systems (AIP, Foundry, Gotham) for commercial enterprises and government defense intelligence agencies.',
    forecast2027: {
      bearPrice: 30.0,
      basePrice: 78.0,
      bullPrice: 110.0,
      currentPrice: 44.80,
      impliedCagrBase: 31.8,
      confidenceScore: 76,
      keyCatalysts: [
        'AIP Bootcamps driving explosive commercial enterprise customer growth',
        'Department of Defense and NATO autonomous defense contract expansions',
        'Operating leverage driving accelerating free cash flow conversion'
      ],
      keyRisks: [
        'Premium valuation leaves little room for earnings or guidance misses',
        'Lengthened commercial sales cycles during corporate budget reviews'
      ],
      monteCarloPaths: generateMonteCarloPaths(44.80, 78.0, 0.44),
      modelAssumptions: {
        revenueGrowthRate: '32% 3-Yr CAGR',
        operatingMargin2027: '38.0%',
        terminalPeMultiple: 55,
        discountRate: '10.8%'
      }
    }
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Semiconductors',
    price: 156.30,
    change: -2.40,
    changePercent: -1.51,
    previousClose: 158.70,
    open: 159.00,
    high: 160.20,
    low: 154.90,
    volume: 34100000,
    avgVolume: 42000000,
    marketCap: 253,
    peRatio: 122.0,
    forwardPe: 28.5,
    eps: 1.28,
    beta: 1.72,
    dividendYield: 0.0,
    fiftyTwoWeekHigh: 227.30,
    fiftyTwoWeekLow: 94.04,
    sentimentScore: 48,
    sentimentLabel: 'Neutral',
    socialMentions24h: 58000,
    institutionalOwnership: 72.3,
    shortInterestPercent: 2.1,
    analystConsensus: 'Buy',
    targetPriceAvg: 185.0,
    description: 'AMD produces high-performance computing, graphics, and visualization technologies including Instinct MI300/MI325 accelerators and EPYC server CPUs.',
    forecast2027: {
      bearPrice: 120.0,
      basePrice: 240.0,
      bullPrice: 310.0,
      currentPrice: 156.30,
      impliedCagrBase: 23.9,
      confidenceScore: 74,
      keyCatalysts: [
        'Instinct MI350/MI400 series capturing 10-15% of AI accelerator market share',
        'Server EPYC processors maintaining lead over Intel in enterprise data centers',
        'AI PC client chip adoption cycles'
      ],
      keyRisks: [
        'NVIDIA CUDA software moats and relentless annual hardware release cadence',
        'Cyclical slowdown in embedded and gaming GPU segments'
      ],
      monteCarloPaths: generateMonteCarloPaths(156.30, 240.0, 0.35),
      modelAssumptions: {
        revenueGrowthRate: '24% 3-Yr CAGR',
        operatingMargin2027: '31.0%',
        terminalPeMultiple: 28,
        discountRate: '9.6%'
      }
    }
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    price: 588.20,
    change: 8.90,
    changePercent: 1.54,
    previousClose: 579.30,
    open: 582.00,
    high: 592.50,
    low: 580.10,
    volume: 12400000,
    avgVolume: 15200000,
    marketCap: 1490,
    peRatio: 28.6,
    forwardPe: 23.4,
    eps: 20.57,
    beta: 1.25,
    dividendYield: 0.34,
    fiftyTwoWeekHigh: 602.95,
    fiftyTwoWeekLow: 279.40,
    sentimentScore: 76,
    sentimentLabel: 'Very Bullish',
    socialMentions24h: 88000,
    institutionalOwnership: 66.5,
    shortInterestPercent: 1.1,
    analystConsensus: 'Strong Buy',
    targetPriceAvg: 640.0,
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses (Instagram, WhatsApp, Facebook, Quest VR, and open source Llama models).',
    forecast2027: {
      bearPrice: 470.0,
      basePrice: 790.0,
      bullPrice: 940.0,
      currentPrice: 588.20,
      impliedCagrBase: 15.5,
      confidenceScore: 83,
      keyCatalysts: [
        'Meta AI and Llama ecosystem powering automated creative ad generation',
        'Ray-Ban Meta smart glasses emerging as mass-market AI wearable device',
        'WhatsApp business messaging monetization inflection in emerging markets'
      ],
      keyRisks: [
        'Reality Labs metaverse division continuing multi-billion annual operating losses',
        'Global privacy regulations and age verification legal headwinds'
      ],
      monteCarloPaths: generateMonteCarloPaths(588.20, 790.0, 0.26),
      modelAssumptions: {
        revenueGrowthRate: '15.5% 3-Yr CAGR',
        operatingMargin2027: '39.5%',
        terminalPeMultiple: 24,
        discountRate: '8.8%'
      }
    }
  },
  {
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    exchange: 'NASDAQ',
    sector: 'Financial',
    industry: 'Financial Data & Stock Exchanges',
    price: 215.40,
    change: 9.80,
    changePercent: 4.77,
    previousClose: 205.60,
    open: 208.50,
    high: 219.00,
    low: 207.10,
    volume: 9800000,
    avgVolume: 11500000,
    marketCap: 53.2,
    peRatio: 38.2,
    forwardPe: 28.0,
    eps: 5.64,
    beta: 3.12,
    dividendYield: 0.0,
    fiftyTwoWeekHigh: 283.48,
    fiftyTwoWeekLow: 69.63,
    sentimentScore: 72,
    sentimentLabel: 'Bullish',
    socialMentions24h: 145000,
    institutionalOwnership: 52.8,
    shortInterestPercent: 6.8,
    analystConsensus: 'Buy',
    targetPriceAvg: 250.0,
    description: 'Coinbase operates the premier regulated crypto financial platform, Base Layer 2 network, institutional custody for spot ETFs, and stablecoin revenue sharing with Circle.',
    forecast2027: {
      bearPrice: 110.0,
      basePrice: 340.0,
      bullPrice: 510.0,
      currentPrice: 215.40,
      impliedCagrBase: 26.5,
      confidenceScore: 65,
      keyCatalysts: [
        'Base Layer-2 blockchain ecosystem fee generation and dapp transaction scale',
        'US regulatory clarity for digital assets and bipartisan market structure legislation',
        'Institutional custody fees and USDC interest income stability'
      ],
      keyRisks: [
        'Crypto market cycle volatility and spot trading fee compression',
        'Ongoing SEC enforcement actions and regulatory delays'
      ],
      monteCarloPaths: generateMonteCarloPaths(215.40, 340.0, 0.55),
      modelAssumptions: {
        revenueGrowthRate: '22% 3-Yr CAGR',
        operatingMargin2027: '35.0%',
        terminalPeMultiple: 28,
        discountRate: '12.5%'
      }
    }
  }
];

export const MARKET_INDICES: MarketIndex[] = [
  { symbol: 'SPX', name: 'S&P 500', value: 5864.67, change: 44.15, changePercent: 0.76 },
  { symbol: 'NDX', name: 'NASDAQ 100', value: 20380.12, change: 198.40, changePercent: 0.98 },
  { symbol: 'DJI', name: 'Dow Jones 30', value: 43065.22, change: 125.80, changePercent: 0.29 },
  { symbol: 'BTC', name: 'Bitcoin (USD)', value: 67840.50, change: 2140.00, changePercent: 3.26 },
  { symbol: 'ETH', name: 'Ethereum (USD)', value: 2640.20, change: 84.50, changePercent: 3.31 },
  { symbol: 'TNX', name: '10-Yr Treasury', value: 4.07, change: -0.03, changePercent: -0.73 },
  { symbol: 'CL', name: 'Crude Oil', value: 70.85, change: -1.15, changePercent: -1.60 },
  { symbol: 'GOLD', name: 'Gold (Oz)', value: 2665.40, change: 18.20, changePercent: 0.69 },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'NVIDIA Expands AI Infrastructure Roadmaps with Next-Gen Quantum-Ready Architectures',
    source: 'Bloomberg Markets',
    publishedAt: '25m ago',
    sentiment: 'bullish',
    impact: 'high',
    relatedTickers: ['NVDA', 'AMD', 'MSFT'],
    summary: 'Cloud hyperscalers have officially expanded their forward capex commitments through 2026-2027 to deploy liquid-cooled Blackwell and successor AI superclusters at scale.'
  },
  {
    id: 'n2',
    title: 'Fed Signals Potential Soft Landing with Balanced Rate Glidepath for 2025-2026',
    source: 'Financial Times',
    publishedAt: '1h ago',
    sentiment: 'bullish',
    impact: 'high',
    relatedTickers: ['SPX', 'DJI', 'COIN'],
    summary: 'Monetary policy officials highlighted cooling inflation metrics alongside resilient labor data, sustaining strong macro tailwinds for equity asset valuations.'
  },
  {
    id: 'n3',
    title: 'Palantir Wins Multi-Year AI Decision-Intelligence Enterprise Contract with Global Energy Major',
    source: 'Reuters Tech',
    publishedAt: '2h ago',
    sentiment: 'bullish',
    impact: 'medium',
    relatedTickers: ['PLTR'],
    summary: 'AIP integration speed continues to set industry benchmarks, with production deployment scheduled across 45 countries in energy grid logistics and real-time refinery dispatch.'
  },
  {
    id: 'n4',
    title: 'Tech Giants Double Down on Custom AI Chips While Expanding Merchant Foundry Orders',
    source: 'Wall Street Journal',
    publishedAt: '3h ago',
    sentiment: 'neutral',
    impact: 'medium',
    relatedTickers: ['AAPL', 'GOOGL', 'AMZN', 'TSM'],
    summary: 'As inference workloads multiply 10x, Big Tech companies are diversifying silicon portfolios between proprietary internal ASICs and merchant accelerators.'
  },
  {
    id: 'n5',
    title: 'EV Market Dynamics Shift: Autonomous Robotaxi Testing and Solid-State Battery Milestones',
    source: 'TechCrunch Mobility',
    publishedAt: '4h ago',
    sentiment: 'bullish',
    impact: 'medium',
    relatedTickers: ['TSLA', 'GOOGL'],
    summary: 'Autonomous driving systems surpass 50 million driverless road miles with safety records outperforming human averages by a factor of four.'
  }
];

// Generate deterministic historical candlestick data points for realistic charts
export function generateStockHistory(stock: Stock, timeframe: ChartTimeframe): HistoricalDataPoint[] {
  const points: HistoricalDataPoint[] = [];
  const now = Date.now();
  
  let count = 40;
  let intervalMs = 15 * 60 * 1000; // 15 min default for 1D

  switch (timeframe) {
    case '1D':
      count = 32;
      intervalMs = 12 * 60 * 1000;
      break;
    case '5D':
      count = 45;
      intervalMs = 2 * 3600 * 1000;
      break;
    case '1M':
      count = 30;
      intervalMs = 24 * 3600 * 1000;
      break;
    case '6M':
      count = 48;
      intervalMs = 3.5 * 24 * 3600 * 1000;
      break;
    case '1Y':
      count = 52;
      intervalMs = 7 * 24 * 3600 * 1000;
      break;
    case '5Y':
      count = 60;
      intervalMs = 30 * 24 * 3600 * 1000;
      break;
    case '2027':
      count = 36; // 3 years monthly forward forecast
      intervalMs = 30 * 24 * 3600 * 1000;
      break;
  }

  if (timeframe === '2027') {
    // Generate forward 2027 forecast points from now until late 2027
    const currentPrice = stock.price;
    const targetBase = stock.forecast2027.basePrice;
    const targetBull = stock.forecast2027.bullPrice;
    const targetBear = stock.forecast2027.bearPrice;

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const timestamp = now + i * intervalMs;
      const d = new Date(timestamp);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      // Trend towards base target with realistic market cyclicality
      const cycle = Math.sin(i * 0.6) * (currentPrice * 0.05);
      const price = currentPrice + (targetBase - currentPrice) * progress + cycle;
      const spread = (currentPrice * 0.02) + (targetBull - targetBear) * 0.04 * progress;

      const open = price - spread * 0.4;
      const close = price + spread * 0.3;
      const high = Math.max(open, close) + spread * 0.5;
      const low = Math.min(open, close) - spread * 0.5;

      points.push({
        timestamp,
        dateStr,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4)),
        sma20: parseFloat(price.toFixed(2)),
        upperBand: parseFloat((price + spread * 2).toFixed(2)),
        lowerBand: parseFloat((price - spread * 2).toFixed(2))
      });
    }
    return points;
  }

  // Historical data backwards from now
  const startTime = now - count * intervalMs;
  let currentPrice = stock.price * (timeframe === '5Y' ? 0.35 : timeframe === '1Y' ? 0.75 : timeframe === '6M' ? 0.88 : timeframe === '1M' ? 0.94 : 0.98);
  const targetEndPrice = stock.price;
  const stepDrift = (targetEndPrice - currentPrice) / count;

  for (let i = 0; i < count; i++) {
    const timestamp = startTime + i * intervalMs;
    const d = new Date(timestamp);
    let dateStr = '';
    if (timeframe === '1D') {
      dateStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '5D') {
      dateStr = d.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit' });
    } else if (timeframe === '1M' || timeframe === '6M') {
      dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      dateStr = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    const volatility = stock.price * (timeframe === '1D' ? 0.008 : 0.02);
    const noise = (Math.random() - 0.48) * volatility;
    const open = i === 0 ? currentPrice : points[i - 1].close;
    let close = open + stepDrift + noise;
    if (i === count - 1) {
      close = stock.price;
    }
    const high = Math.max(open, close) + Math.random() * volatility * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * 0.8;
    const volume = Math.floor(stock.volume * (0.7 + Math.random() * 0.6) / (timeframe === '1D' ? 12 : 1));

    points.push({
      timestamp,
      dateStr,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
  }

  // Calculate 20-period Simple Moving Average and RSI
  for (let i = 0; i < points.length; i++) {
    if (i >= 5) {
      const windowSlice = points.slice(Math.max(0, i - 14), i + 1);
      const avg = windowSlice.reduce((acc, p) => acc + p.close, 0) / windowSlice.length;
      points[i].sma20 = parseFloat(avg.toFixed(2));
      
      // Calculate standard deviation for Bollinger Bands
      const variance = windowSlice.reduce((acc, p) => acc + Math.pow(p.close - avg, 2), 0) / windowSlice.length;
      const stdDev = Math.sqrt(variance);
      points[i].upperBand = parseFloat((avg + 2 * stdDev).toFixed(2));
      points[i].lowerBand = parseFloat((avg - 2 * stdDev).toFixed(2));

      // Simple RSI approximation
      let gains = 0;
      let losses = 0;
      for (let j = 1; j < windowSlice.length; j++) {
        const diff = windowSlice[j].close - windowSlice[j - 1].close;
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const rs = losses === 0 ? 100 : gains / losses;
      points[i].rsi = parseFloat((100 - (100 / (1 + rs))).toFixed(1));
    }
  }

  return points;
}
