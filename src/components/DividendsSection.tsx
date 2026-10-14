import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';
import { StockData } from '../types';
import { getDividendInfo, MONTH_NAMES, StockDividendInfo } from '../data/dividends';

interface HoldingPosition {
  ticker: string;
  shares: number;
  avgBuyPrice: number;
  purchaseDate: string;
}

interface DividendsSectionProps {
  positions: Record<string, HoldingPosition>;
  stocks: Record<string, StockData>;
  onSelectStock?: (stock: StockData) => void;
  onEditPosition?: (position: HoldingPosition) => void;
}

export const DividendsSection: React.FC<DividendsSectionProps> = ({
  positions,
  stocks,
  onSelectStock,
  onEditPosition
}) => {
  const [dripEnabled, setDripEnabled] = useState(true);
  const [horizonYears, setHorizonYears] = useState<number>(5);
  const [selectedStockTicker, setSelectedStockTicker] = useState<string | null>(null);

  // Compute calculated values for each position with dividend info
  const items = Object.keys(positions)
    .map((ticker) => {
      const pos = positions[ticker];
      const stock = stocks[ticker];
      if (!pos || !stock) return null;

      const divInfo = getDividendInfo(ticker, stock.price);
      const totalAnnualIncome = pos.shares * divInfo.annualDividend;
      const currentValue = pos.shares * stock.price;
      const investedCapital = pos.shares * pos.avgBuyPrice;
      const yieldOnCost = investedCapital > 0 ? (totalAnnualIncome / investedCapital) * 100 : 0;
      const currentYield = currentValue > 0 ? (totalAnnualIncome / currentValue) * 100 : 0;

      return {
        ticker,
        stock,
        pos,
        divInfo,
        totalAnnualIncome,
        currentValue,
        investedCapital,
        yieldOnCost,
        currentYield
      };
    })
    .filter(Boolean) as Array<{
      ticker: string;
      stock: StockData;
      pos: HoldingPosition;
      divInfo: StockDividendInfo;
      totalAnnualIncome: number;
      currentValue: number;
      investedCapital: number;
      yieldOnCost: number;
      currentYield: number;
    }>;

  // Aggregate Portfolio Totals
  const totalAnnualDividendIncome = items.reduce((acc, it) => acc + it.totalAnnualIncome, 0);
  const totalPortfolioValue = items.reduce((acc, it) => acc + it.currentValue, 0);
  const totalInvestedCapital = items.reduce((acc, it) => acc + it.investedCapital, 0);

  const portfolioCurrentYield =
    totalPortfolioValue > 0 ? (totalAnnualDividendIncome / totalPortfolioValue) * 100 : 0;
  const portfolioYieldOnCost =
    totalInvestedCapital > 0 ? (totalAnnualDividendIncome / totalInvestedCapital) * 100 : 0;

  const monthlyAverage = totalAnnualDividendIncome / 12;
  const dailyAverage = totalAnnualDividendIncome / 365;

  // Monthly Cash Flow Distribution for Jan - Dec (Months 1 to 12)
  const monthlyCashflowData = MONTH_NAMES.map((name, idx) => {
    const monthNum = idx + 1; // 1 = Jan, 12 = Dec
    let monthTotal = 0;
    const contributingTickers: string[] = [];

    items.forEach((item) => {
      if (item.divInfo.payoutMonths.includes(monthNum)) {
        // Divide annual dividend equally across its payout months
        const perPayoutAmount = item.totalAnnualIncome / item.divInfo.payoutMonths.length;
        monthTotal += perPayoutAmount;
        contributingTickers.push(`${item.ticker} (₹${perPayoutAmount.toFixed(0)})`);
      }
    });

    return {
      month: name,
      monthNum,
      amount: Math.round(monthTotal),
      contributions: contributingTickers
    };
  });

  // Calculate highest dividend payer
  const topPayer = [...items].sort((a, b) => b.totalAnnualIncome - a.totalAnnualIncome)[0];

  // Compound growth simulation (DRIP vs Cash)
  // Assumes average dividend growth of 11.5% and share appreciation of 8%
  const simulationYears = Array.from({ length: horizonYears }, (_, i) => i + 1);
  const avgDivCagr = 0.115;
  const priceAppreciation = 0.08;

  let compValueDRIP = totalPortfolioValue;
  let compIncomeDRIP = totalAnnualDividendIncome;
  let compIncomeCash = totalAnnualDividendIncome;
  let cumulativeCashPayout = 0;
  let cumulativeDripReinvested = 0;

  for (let yr = 1; yr <= horizonYears; yr++) {
    // Cash model: income grows with CAGR, paid out
    compIncomeCash = compIncomeCash * (1 + avgDivCagr);
    cumulativeCashPayout += compIncomeCash;

    // DRIP model: income buys more shares, so income grows by CAGR + reinvested dividend %
    const reinvestedDividend = compIncomeDRIP;
    cumulativeDripReinvested += reinvestedDividend;
    compValueDRIP = (compValueDRIP + reinvestedDividend) * (1 + priceAppreciation);
    compIncomeDRIP = compIncomeDRIP * (1 + avgDivCagr) + reinvestedDividend * (portfolioCurrentYield / 100);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Hero Dividends Summary Card */}
      <div className="bg-[#122131] rounded-2xl p-4 shadow-xl border border-[#1c2b3c] relative overflow-hidden flex flex-col gap-3">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4edea3] via-[#adc6ff] to-[#c0c1ff]" />

        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#c2c6d6] font-semibold">
                Projected Annual Dividend Income
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono border border-[#00a572]/30">
                Passive Cash Flow
              </span>
            </div>
            <span className="text-[32px] font-bold font-mono text-[#d4e4fa] tracking-tight leading-none mt-1">
              ₹{totalAnnualDividendIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-[14px] font-sans font-normal text-[#8c909f] ml-1">/ year</span>
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] text-[#c2c6d6] font-medium">Portfolio Dividend Yield</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold font-mono mt-1 bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/30">
              <span className="material-symbols-outlined text-[16px]">payments</span>
              <span>{portfolioCurrentYield.toFixed(2)}% Current Yield</span>
            </div>
          </div>
        </div>

        {/* 4-Stat Secondary Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Avg. Monthly Income</span>
            <span className="text-[14px] font-bold font-mono text-[#d4e4fa] mt-0.5">
              ₹{monthlyAverage.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              <span className="text-[10px] font-normal text-[#8c909f]">/mo</span>
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Daily Passive Cash</span>
            <span className="text-[14px] font-bold font-mono text-[#4edea3] mt-0.5">
              ₹{dailyAverage.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              <span className="text-[10px] font-normal text-[#8c909f]">/day</span>
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Yield On Cost (YoC)</span>
            <span className="text-[14px] font-bold font-mono text-[#adc6ff] mt-0.5">
              {portfolioYieldOnCost.toFixed(2)}%
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Top Dividend Asset</span>
            <span className="text-[14px] font-bold font-mono text-[#d4e4fa] mt-0.5 truncate max-w-full">
              {topPayer ? `${topPayer.ticker} (₹${Math.round(topPayer.totalAnnualIncome)})` : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Cash Flow Distribution Bar Chart */}
      <div className="bg-[#122131] rounded-2xl p-4 shadow-sm border border-[#1c2b3c] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[18px]">calendar_month</span>
            <h3 className="text-[14px] font-bold text-[#d4e4fa]">
              Projected Monthly Cash Flow Schedule
            </h3>
          </div>
          <span className="text-[11px] text-[#8c909f] font-mono">12-Month Distribution</span>
        </div>

        <p className="text-[12px] text-[#c2c6d6] leading-snug">
          Estimated dividend payouts mapped across Indian equity quarterly, interim, and annual payout cycles:
        </p>

        <div className="h-44 w-full mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCashflowData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2b3c" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#8c909f"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#1c2b3c' }}
              />
              <YAxis
                stroke="#8c909f"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#1c2b3c' }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as {
                      month: string;
                      amount: number;
                      contributions: string[];
                    };
                    return (
                      <div className="bg-[#0d1c2d] border border-[#273647] p-2.5 rounded-lg shadow-xl text-[11px]">
                        <p className="font-bold text-[#d4e4fa] mb-1">{data.month} Projected Payout</p>
                        <p className="font-mono text-[#4edea3] font-bold text-[13px]">
                          ₹{data.amount.toLocaleString('en-IN')}
                        </p>
                        {data.contributions.length > 0 ? (
                          <div className="mt-1 pt-1 border-t border-[#1c2b3c] flex flex-col gap-0.5">
                            <span className="text-[10px] text-[#8c909f]">Contributing Equities:</span>
                            {data.contributions.map((c: string, idx: number) => (
                              <span key={idx} className="text-[#adc6ff] font-mono text-[10px]">
                                • {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-[#8c909f] mt-0.5">No dividend distributions scheduled</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {monthlyCashflowData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.amount > 0 ? '#4edea3' : '#1c2b3c'}
                    fillOpacity={entry.amount > 0 ? 0.85 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DRIP Compounding Simulator */}
      <div className="bg-[#122131] rounded-2xl p-4 shadow-sm border border-[#1c2b3c] flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">trending_up</span>
            <div>
              <h3 className="text-[14px] font-bold text-[#d4e4fa] leading-none">
                Dividend Reinvestment (DRIP) Compounding Simulator
              </h3>
              <p className="text-[11px] text-[#c2c6d6] mt-0.5">
                Simulate wealth creation by reinvesting cash dividends automatically
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Horizon Selector */}
            <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
              {[3, 5, 10].map((yrs) => (
                <button
                  key={yrs}
                  onClick={() => setHorizonYears(yrs)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    horizonYears === yrs
                      ? 'bg-[#1c2b3c] text-[#adc6ff] border border-[#273647]'
                      : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  {yrs}Y
                </button>
              ))}
            </div>

            {/* DRIP Toggle */}
            <button
              onClick={() => setDripEnabled(!dripEnabled)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
                dripEnabled
                  ? 'bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/30'
                  : 'bg-[#1c2b3c] text-[#c2c6d6] border-[#273647]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {dripEnabled ? 'check_circle' : 'cancel'}
              </span>
              <span>DRIP {dripEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Projection Comparison Box */}
        <div className="grid grid-cols-2 gap-2 bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">
              Projected Annual Dividend in Year {horizonYears}
            </span>
            <span className="font-mono text-[16px] font-bold text-[#4edea3]">
              ₹
              {Math.round(dripEnabled ? compIncomeDRIP : compIncomeCash).toLocaleString('en-IN')}
              <span className="text-[11px] font-sans font-normal text-[#8c909f] ml-1">/yr</span>
            </span>
            <span className="text-[10px] text-[#8c909f]">
              {dripEnabled ? 'Compounded with automatic share additions' : 'Base growth with cash withdrawals'}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 border-l border-[#1c2b3c] pl-3">
            <span className="text-[10px] text-[#8c909f] uppercase font-semibold">
              Cumulative Passive Return ({horizonYears}Y)
            </span>
            <span className="font-mono text-[16px] font-bold text-[#adc6ff]">
              ₹
              {Math.round(
                dripEnabled ? cumulativeDripReinvested : cumulativeCashPayout
              ).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#4edea3]">
              +{(((dripEnabled ? cumulativeDripReinvested : cumulativeCashPayout) / totalInvestedCapital) * 100).toFixed(1)}% of initial capital
            </span>
          </div>
        </div>
      </div>

      {/* Holdings Dividend Detail Table */}
      <div className="bg-[#122131] rounded-2xl p-4 shadow-sm border border-[#1c2b3c] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">table_chart</span>
            <h3 className="text-[14px] font-bold text-[#d4e4fa]">
              Holdings Dividend Breakdown ({items.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#8c909f] font-mono">Sorted by Annual Yield</span>
        </div>

        <div className="flex flex-col gap-2">
          {items
            .sort((a, b) => b.totalAnnualIncome - a.totalAnnualIncome)
            .map((item) => {
              return (
                <div
                  key={item.ticker}
                  className="bg-[#0d1c2d] hover:bg-[#1c2b3c]/60 p-3 rounded-xl border border-[#1c2b3c] transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#273647] flex items-center justify-center font-mono font-bold text-[#adc6ff] text-[12px] border border-[#1c2b3c]">
                        {item.ticker.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[14px] text-[#d4e4fa] font-mono">
                            {item.ticker}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-[#1c2b3c] text-[#8c909f] text-[10px]">
                            {item.divInfo.payoutFrequency}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              item.divInfo.safetyRating === 'VERY SAFE'
                                ? 'bg-[#00a572]/20 text-[#4edea3]'
                                : 'bg-[#4d8eff]/20 text-[#adc6ff]'
                            }`}
                          >
                            {item.divInfo.safetyScore}/100 {item.divInfo.safetyRating}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#c2c6d6] truncate max-w-[180px]">
                          {item.stock.name} • {item.pos.shares} Shares Held
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[14px] font-bold text-[#4edea3]">
                        ₹{item.totalAnnualIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-[10px] font-sans font-normal text-[#8c909f]">/yr</span>
                      </span>
                      <span className="font-mono text-[11px] text-[#adc6ff] font-medium">
                        {item.currentYield.toFixed(2)}% Yield (YoC: {item.yieldOnCost.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {/* Dividend Specs Bento */}
                  <div className="grid grid-cols-4 gap-1.5 bg-[#010f1f]/80 p-2 rounded-lg border border-[#1c2b3c] text-[10px] font-mono">
                    <div className="flex flex-col">
                      <span className="text-[#8c909f]">DPS (Annual)</span>
                      <span className="text-[#d4e4fa] font-bold">₹{item.divInfo.annualDividend.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#8c909f]">Payout Ratio</span>
                      <span className="text-[#adc6ff]">{item.divInfo.payoutRatio}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#8c909f]">3Y Div CAGR</span>
                      <span className="text-[#4edea3]">+{item.divInfo.threeYearCagr}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#8c909f]">Next Ex-Date</span>
                      <span className="text-[#d4e4fa]">{item.divInfo.nextEstimatedExDate}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-[10px] text-[#8c909f]">
                      Payout Months: {item.divInfo.payoutMonths.map((m) => MONTH_NAMES[m - 1]).join(', ')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {onEditPosition && (
                        <button
                          onClick={() => onEditPosition(item.pos)}
                          className="px-2 py-0.5 rounded bg-[#1c2b3c] text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647] text-[10px] transition-colors"
                        >
                          Edit Shares
                        </button>
                      )}
                      {onSelectStock && (
                        <button
                          onClick={() => onSelectStock(item.stock)}
                          className="px-2 py-0.5 rounded bg-[#4d8eff]/20 text-[#adc6ff] hover:bg-[#4d8eff]/30 text-[10px] font-semibold transition-colors"
                        >
                          View Equity
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
