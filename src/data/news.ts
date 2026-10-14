import { NewsArticle } from '../types';

export const STOCK_HEADLINES_DATABASE: Record<string, NewsArticle[]> = {
  RELIANCE: [
    {
      id: 'rel-news-1',
      ticker: 'RELIANCE',
      title: 'Reliance Retail & Jio Drive 18.2% Quarterly Operating Profit Expansion',
      source: 'Reuters Financial',
      publishedAt: '24m ago',
      summary: 'Robust subscriber additions across 5G telecom services and accelerated retail footprint expansion lifted consolidated EBITDA to record highs.',
      sentiment: 'BULLISH',
      sentimentScore: 0.82,
      category: 'Earnings',
      readTime: '3 min read'
    },
    {
      id: 'rel-news-2',
      ticker: 'RELIANCE',
      title: 'Green Hydrogen & Solar Giga-Factory Phase 1 in Jamnagar Nears Operational Readiness',
      source: 'Bloomberg Markets',
      publishedAt: '2h ago',
      summary: 'New energy division is on schedule to commence captive generation by Q3, establishing long-term margin hedges against fossil feedstock volatility.',
      sentiment: 'BULLISH',
      sentimentScore: 0.74,
      category: 'Product',
      readTime: '4 min read'
    },
    {
      id: 'rel-news-3',
      ticker: 'RELIANCE',
      title: 'Global Refining Capacity Additions Introduce Short-Term Crack Spread Softness',
      source: 'The Economic Times',
      publishedAt: '5h ago',
      summary: 'Gross refining margins compressed slightly to $11.4/bbl due to higher regional product inventories, partially offset by petrochem demand.',
      sentiment: 'NEUTRAL',
      sentimentScore: -0.08,
      category: 'Macro',
      readTime: '2 min read'
    },
    {
      id: 'rel-news-4',
      ticker: 'RELIANCE',
      title: 'Morgan Stanley Reaffirms Overweight on RIL with Target Price Raised to ₹3,150',
      source: 'CNBC-TV18',
      publishedAt: '8h ago',
      summary: 'Brokerage highlights strong free-cash-flow turnaround inflection and monetization prospects for consumer-facing verticals.',
      sentiment: 'BULLISH',
      sentimentScore: 0.88,
      category: 'Regulatory',
      readTime: '2 min read'
    }
  ],

  TCS: [
    {
      id: 'tcs-news-1',
      ticker: 'TCS',
      title: 'TCS Bags $1.2B Multi-Year Cloud Modernization & GenAI Mandate from European Consortium',
      source: 'Mint Tech',
      publishedAt: '18m ago',
      summary: 'The landmark deal involves migrating legacy enterprise core applications onto hybrid cloud with custom domain-specific LLM copilots.',
      sentiment: 'BULLISH',
      sentimentScore: 0.86,
      category: 'Product',
      readTime: '3 min read'
    },
    {
      id: 'tcs-news-2',
      ticker: 'TCS',
      title: 'Enterprise AI Adoption Accelerates: TCS Crosses 300 Global Production Deployments',
      source: 'The Economic Times',
      publishedAt: '3h ago',
      summary: 'Cognitive Business Operations and AI-first cyber resilience solutions recorded a 32% year-on-year pipeline growth.',
      sentiment: 'BULLISH',
      sentimentScore: 0.78,
      category: 'Industry',
      readTime: '4 min read'
    },
    {
      id: 'tcs-news-3',
      ticker: 'TCS',
      title: 'European Banking Sector Shows Prudent Discretionary Spending Patterns in Q2',
      source: 'Reuters',
      publishedAt: '6h ago',
      summary: 'Clients prioritize cost takeout and vendor consolidation over experimental consulting engagements amid interest rate outlook.',
      sentiment: 'NEUTRAL',
      sentimentScore: -0.12,
      category: 'Macro',
      readTime: '3 min read'
    }
  ],

  INFY: [
    {
      id: 'infy-news-1',
      ticker: 'INFY',
      title: 'Infosys Expands Enterprise Generative AI Suite "Topaz" with 25 Industry-Specific Blueprints',
      source: 'The Economic Times',
      publishedAt: '42m ago',
      summary: 'New microservices target supply chain automation, fraud anomaly detection, and synthetic data generation for life sciences.',
      sentiment: 'BULLISH',
      sentimentScore: 0.72,
      category: 'Product',
      readTime: '3 min read'
    },
    {
      id: 'infy-news-2',
      ticker: 'INFY',
      title: 'Foreign Institutional Outflows Recorded in Indian IT Names Amid Dollar Index Strength',
      source: 'Bloomberg Markets',
      publishedAt: '2h ago',
      summary: 'Portfolio rebalancing towards domestic cyclicals triggered brief downward pressure across Tier-1 tech bellwethers.',
      sentiment: 'BEARISH',
      sentimentScore: -0.65,
      category: 'Macro',
      readTime: '4 min read'
    },
    {
      id: 'infy-news-3',
      ticker: 'INFY',
      title: 'Infosys Attrition Trajectory Stabilizes at 12.9%; Utilization Rises to 82.4%',
      source: 'CNBC-TV18',
      publishedAt: '7h ago',
      summary: 'Internal cost optimization initiatives and offshore bench rationalization support stable operating margin floor.',
      sentiment: 'NEUTRAL',
      sentimentScore: 0.14,
      category: 'Earnings',
      readTime: '2 min read'
    }
  ],

  HDFCBANK: [
    {
      id: 'hdfc-news-1',
      ticker: 'HDFCBANK',
      title: 'HDFC Bank Deposit Mobilization Surges 16.4% YoY Supported by Retail Branch Network Expansion',
      source: 'Mint Banking',
      publishedAt: '35m ago',
      summary: 'Aggressive semi-urban deposit mobilization campaigns successfully lowered wholesale funding reliance post-merger integration.',
      sentiment: 'BULLISH',
      sentimentScore: 0.81,
      category: 'Earnings',
      readTime: '3 min read'
    },
    {
      id: 'hdfc-news-2',
      ticker: 'HDFCBANK',
      title: 'Gross Non-Performing Assets Hold Steady at 1.24%; Credit Costs at Multi-Quarter Lows',
      source: 'Reuters',
      publishedAt: '4h ago',
      summary: 'Asset quality across mortgage and commercial vehicle portfolios remained pristine with provision coverage exceeding 74%.',
      sentiment: 'BULLISH',
      sentimentScore: 0.76,
      category: 'Regulatory',
      readTime: '3 min read'
    },
    {
      id: 'hdfc-news-3',
      ticker: 'HDFCBANK',
      title: 'RBI Regulatory Focus on Credit-to-Deposit Ratios Moderates Unsecured Loan Trajectory',
      source: 'The Economic Times',
      publishedAt: '9h ago',
      summary: 'Management guides for balanced loan-to-deposit ratio glide path over the next 4 to 6 quarters to protect liquidity buffers.',
      sentiment: 'NEUTRAL',
      sentimentScore: -0.10,
      category: 'Regulatory',
      readTime: '4 min read'
    }
  ],

  TATASTEEL: [
    {
      id: 'tata-news-1',
      ticker: 'TATASTEEL',
      title: 'European Steel Mill Margins Face Pressure from Subdued Automotive & Industrial Orders',
      source: 'Financial Times',
      publishedAt: '1h ago',
      summary: 'High energy prices in the UK and Netherlands alongside elevated scrap input costs squeezed overseas operating margins.',
      sentiment: 'BEARISH',
      sentimentScore: -0.72,
      category: 'Industry',
      readTime: '3 min read'
    },
    {
      id: 'tata-news-2',
      ticker: 'TATASTEEL',
      title: 'Domestic India Shipments Hit Record High on Strong Highway & Infrastructure Execution',
      source: 'The Economic Times',
      publishedAt: '4h ago',
      summary: 'Kalinganagar phase-2 capacity expansion of 5 MTPA ramps up commercial production, offsetting external weakness.',
      sentiment: 'BULLISH',
      sentimentScore: 0.68,
      category: 'Earnings',
      readTime: '3 min read'
    },
    {
      id: 'tata-news-3',
      ticker: 'TATASTEEL',
      title: 'Port Talbot Electric Arc Furnace Transition Receives Final Environmental Approvals',
      source: 'Bloomberg',
      publishedAt: '8h ago',
      summary: 'De-carbonization restructuring package is set to lower structural fixed costs by 2027.',
      sentiment: 'NEUTRAL',
      sentimentScore: 0.18,
      category: 'Regulatory',
      readTime: '4 min read'
    }
  ],

  TECHM: [
    {
      id: 'techm-news-1',
      ticker: 'TECHM',
      title: 'Tech Mahindra "Project Fortius" Turnaround Targets 15% Operating Margin by FY27',
      source: 'CNBC-TV18',
      publishedAt: '28m ago',
      summary: 'Comprehensive restructuring focuses on key accounts expansion, pyramid rationalization, and scaling enterprise 5G services.',
      sentiment: 'BULLISH',
      sentimentScore: 0.79,
      category: 'Earnings',
      readTime: '3 min read'
    },
    {
      id: 'techm-news-2',
      ticker: 'TECHM',
      title: 'Telecom Enterprise Private 5G Deal Wins Accelerate across Manufacturing and Healthcare',
      source: 'Reuters',
      publishedAt: '3h ago',
      summary: 'Partnerships with major telecom carriers in North America and Europe yield 4 consecutive large enterprise multi-year wins.',
      sentiment: 'BULLISH',
      sentimentScore: 0.71,
      category: 'Product',
      readTime: '3 min read'
    }
  ]
};

// Simulated async API call to fetch stock news
export async function fetchStockNews(ticker: string): Promise<NewsArticle[]> {
  // Simulate network latency (250ms - 450ms)
  await new Promise((resolve) => setTimeout(resolve, 320));

  const items = STOCK_HEADLINES_DATABASE[ticker];
  if (items && items.length > 0) {
    return items;
  }

  // Fallback realistic news for any other stock
  return [
    {
      id: `${ticker.toLowerCase()}-news-gen-1`,
      ticker,
      title: `${ticker} Institutional Holdings Show Steady Accumulation in Derivatives Segment`,
      source: 'Financial Express',
      publishedAt: '45m ago',
      summary: `Open interest buildup in ${ticker} futures indicates constructive directional positioning with elevated delivery volume.`,
      sentiment: 'BULLISH',
      sentimentScore: 0.65,
      category: 'Industry',
      readTime: '2 min read'
    },
    {
      id: `${ticker.toLowerCase()}-news-gen-2`,
      ticker,
      title: `Quarterly Earnings Preview: Key Margin Drivers & Capacity Utilization for ${ticker}`,
      source: 'Bloomberg Markets',
      publishedAt: '3h ago',
      summary: `Analysts anticipate steady operational execution amidst input price stability across regional supply chains.`,
      sentiment: 'NEUTRAL',
      sentimentScore: 0.05,
      category: 'Earnings',
      readTime: '3 min read'
    }
  ];
}

// Simulated async API call to fetch all live market news headlines across the market
export async function fetchAllMarketHeadlines(): Promise<NewsArticle[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const allArticles: NewsArticle[] = [];
  Object.values(STOCK_HEADLINES_DATABASE).forEach((articles) => {
    allArticles.push(...articles);
  });

  // Additional macro and breaking market headlines
  const macroHeadlines: NewsArticle[] = [
    {
      id: 'macro-1',
      ticker: 'NIFTY 50',
      title: 'NIFTY 50 Consolidates Near Record Highs as FII Inflows Top ₹4,200 Cr in Cash Equities',
      source: 'CNBC-TV18',
      publishedAt: '12m ago',
      summary: 'Broad-based buying across large-cap IT and private banking indices pushed benchmark indices toward fresh milestones.',
      sentiment: 'BULLISH',
      sentimentScore: 0.84,
      category: 'Macro',
      readTime: '2 min read'
    },
    {
      id: 'macro-2',
      ticker: 'INDIA VIX',
      title: 'India VIX Drops 4.2% to 12.84 Signaling Placid Derivative Expiry Options Volatility',
      source: 'Bloomberg Markets',
      publishedAt: '35m ago',
      summary: 'Implied volatility remains well below annual median, encouraging systematic alpha-seeking strategies.',
      sentiment: 'BULLISH',
      sentimentScore: 0.72,
      category: 'Macro',
      readTime: '2 min read'
    },
    {
      id: 'macro-3',
      ticker: 'RBI / G-SEC',
      title: 'RBI Liquidity Operations Infuse ₹25,000 Cr to Keep Overnight Call Money Rates Anchored',
      source: 'The Economic Times',
      publishedAt: '1h ago',
      summary: 'Central bank conducts variable rate repo operations to smooth quarter-end advance tax liquidity outflows.',
      sentiment: 'NEUTRAL',
      sentimentScore: 0.12,
      category: 'Regulatory',
      readTime: '3 min read'
    }
  ];

  return [...macroHeadlines, ...allArticles];
}

