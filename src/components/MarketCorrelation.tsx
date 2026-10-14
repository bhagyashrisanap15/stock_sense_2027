import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid
} from 'recharts';
import { StockData } from '../types';
import { STOCKS_DATA } from '../data/stocks';
import { getCorrelation, generateScatterPoints } from '../data/correlation';

interface MarketCorrelationProps {
  watchlist: string[];
  currentStock: StockData;
  onSelectStock?: (stock: StockData) => void;
}

export const MarketCorrelation: React.FC<MarketCorrelationProps> = ({
  watchlist,
  currentStock,
  onSelectStock
}) => {
  const [focalTicker, setFocalTicker] = useState<string>(currentStock.ticker);
  const [secondaryTicker, setSecondaryTicker] = useState<string>(() => {
    const candidate = watchlist.find((t) => t !== currentStock.ticker);
    return candidate || 'TCS';
  });
  const [window, setWindow] = useState<'30D' | '90D' | '1Y'>('1Y');
  const [chartMode, setChartMode] = useState<'bar' | 'scatter' | 'heatmap'>('bar');

  // Filter watchlist to existing stocks with at least 2 tickers
  const validTickers = watchlist.filter((t) => !!STOCKS_DATA[t]);
  const activeTickers = validTickers.length >= 2 ? validTickers : ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATASTEEL'];

  // Current focal ticker fallback
  const activeFocal = activeTickers.includes(focalTicker) ? focalTicker : activeTickers[0];
  const activeSecondary = activeTickers.includes(secondaryTicker) && secondaryTicker !== activeFocal
    ? secondaryTicker
    : activeTickers.find((t) => t !== activeFocal) || activeTickers[1] || 'TCS';

  // Data for Recharts BarChart: Correlation of activeFocal vs all other tickers
  const barChartData = activeTickers
    .filter((t) => t !== activeFocal)
    .map((otherTicker) => {
      const r = getCorrelation(activeFocal, otherTicker, window);
      return {
        ticker: otherTicker,
        name: STOCKS_DATA[otherTicker]?.name || otherTicker,
        correlation: r,
        sector: STOCKS_DATA[otherTicker]?.sector || '',
        relationship:
          r > 0.6
            ? 'Strong Co-movement'
            : r > 0.2
            ? 'Moderate Positive'
            : r < -0.2
            ? 'Inverse Hedge'
            : 'Uncorrelated'
      };
    })
    .sort((a, b) => b.correlation - a.correlation);

  // Data for Recharts ScatterChart: Bivariate return points between activeFocal and activeSecondary
  const pairR = getCorrelation(activeFocal, activeSecondary, window);
  const scatterPoints = generateScatterPoints(activeFocal, activeSecondary, pairR);

  // Portfolio-wide average correlation & hedging pairs
  let totalPairsCount = 0;
  let totalCorrelationSum = 0;
  let minPair = { a: activeTickers[0], b: activeTickers[1], r: 1.0 };
  let maxPair = { a: activeTickers[0], b: activeTickers[1], r: -1.0 };

  for (let i = 0; i < activeTickers.length; i++) {
    for (let j = i + 1; j < activeTickers.length; j++) {
      const a = activeTickers[i];
      const b = activeTickers[j];
      const r = getCorrelation(a, b, window);
      totalPairsCount++;
      totalCorrelationSum += r;

      if (r < minPair.r) minPair = { a, b, r };
      if (r > maxPair.r) maxPair = { a, b, r };
    }
  }

  const avgCorrelation = totalPairsCount > 0 ? (totalCorrelationSum / totalPairsCount).toFixed(2) : '0.35';
  const diversificationScore = Math.max(1, Math.min(10, Math.round((1 - parseFloat(avgCorrelation)) * 10 * 10) / 10)).toFixed(1);

  // Helper color for correlation coefficient
  const getCorrelationColor = (r: number) => {
    if (r >= 0.7) return '#4edea3'; // High positive green
    if (r >= 0.3) return '#4d8eff'; // Moderate blue
    if (r >= -0.1) return '#adc6ff'; // Mild/uncorrelated slate
    return '#ffb4ab'; // Negative / hedge red
  };

  const getCellBg = (r: number) => {
    if (r === 1.0) return 'bg-[#1c2b3c] text-[#d4e4fa] font-bold';
    if (r >= 0.7) return 'bg-[#00a572]/25 text-[#4edea3] font-bold';
    if (r >= 0.3) return 'bg-[#4d8eff]/20 text-[#adc6ff] font-medium';
    if (r >= -0.1) return 'bg-[#122131] text-[#c2c6d6]';
    return 'bg-[#93000a]/30 text-[#ffb4ab] font-bold';
  };

  return (
    <div className="bg-[#122131] rounded-xl p-4 shadow-sm border border-[#1c2b3c] flex flex-col gap-4">
      {/* Component Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
            <span className="material-symbols-outlined text-[18px]">hub</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-bold text-[#d4e4fa] leading-none">
                Market Correlation Matrix
              </h3>
              <span className="px-1.5 py-0.2 rounded bg-[#00a572]/20 text-[#4edea3] text-[10px] font-mono font-bold border border-[#00a572]/30">
                Pearson r
              </span>
            </div>
            <span className="text-[11px] text-[#8c909f] mt-0.5 block">
              Co-movement heuristics across {activeTickers.length} watchlist equities
            </span>
          </div>
        </div>

        {/* Rolling Window Selector */}
        <div className="flex items-center gap-1 bg-[#0d1c2d] p-1 rounded-lg border border-[#1c2b3c]">
          {(['30D', '90D', '1Y'] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all ${
                window === w
                  ? 'bg-[#4d8eff] text-[#00285d] shadow-sm'
                  : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Diversification Score & Insight Bento */}
      <div className="grid grid-cols-3 gap-2 bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">
            Diversification Score
          </span>
          <span className="text-[17px] font-bold font-mono text-[#4edea3] mt-0.5">
            {diversificationScore}/10
          </span>
          <span className="text-[10px] text-[#8c909f]">Portfolio Health</span>
        </div>

        <div className="flex flex-col items-center border-x border-[#1c2b3c] px-1">
          <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">
            Avg Inter-Asset (r)
          </span>
          <span className="text-[17px] font-bold font-mono text-[#adc6ff] mt-0.5">
            {avgCorrelation}
          </span>
          <span className="text-[10px] text-[#8c909f]">Low Clustering</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#c2c6d6] uppercase font-semibold">
            Top Hedging Pair
          </span>
          <span className="text-[12px] font-bold font-mono text-[#ffb4ab] mt-1 truncate max-w-[110px]">
            {minPair.a} / {minPair.b}
          </span>
          <span className="text-[10px] font-mono text-[#ffb4ab]">r = {minPair.r.toFixed(2)}</span>
        </div>
      </div>

      {/* Visual Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setChartMode('bar')}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              chartMode === 'bar'
                ? 'bg-[#273647] text-[#adc6ff] shadow-sm'
                : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">bar_chart</span>
            <span>Relative Vectors</span>
          </button>
          <button
            onClick={() => setChartMode('scatter')}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              chartMode === 'scatter'
                ? 'bg-[#273647] text-[#adc6ff] shadow-sm'
                : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">scatter_plot</span>
            <span>Bivariate Co-movement</span>
          </button>
          <button
            onClick={() => setChartMode('heatmap')}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              chartMode === 'heatmap'
                ? 'bg-[#273647] text-[#adc6ff] shadow-sm'
                : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">grid_view</span>
            <span>Full Heatmap</span>
          </button>
        </div>

        {/* Focal Asset Picker */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-[#8c909f] hidden sm:inline">Anchor:</span>
          <select
            value={activeFocal}
            onChange={(e) => setFocalTicker(e.target.value)}
            className="bg-[#0d1c2d] text-[#adc6ff] font-mono font-bold text-[11px] py-1 px-2 rounded border border-[#1c2b3c] outline-none cursor-pointer"
          >
            {activeTickers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CHART 1: RECHARTS BARCHART */}
      {chartMode === 'bar' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-[#8c909f] px-1">
            <span>
              Correlation of <strong className="text-[#adc6ff]">{activeFocal}</strong> against Watchlist ({window} Rolling)
            </span>
            <span className="font-mono">Range: [-1.00 to +1.00]</span>
          </div>

          <div className="h-56 w-full bg-[#0d1c2d] rounded-xl p-2.5 border border-[#1c2b3c]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 12, right: 12, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2b3c" vertical={false} />
                <XAxis
                  dataKey="ticker"
                  stroke="#8c909f"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="Inter"
                />
                <YAxis
                  domain={[-1, 1]}
                  ticks={[-1.0, -0.5, 0, 0.5, 1.0]}
                  stroke="#8c909f"
                  fontSize={10}
                  tickLine={false}
                  fontFamily="monospace"
                />
                <ReferenceLine y={0} stroke="#424754" strokeWidth={1.5} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      const r = item.correlation;
                      return (
                        <div className="bg-[#122131] p-2.5 rounded-lg border border-[#273647] shadow-xl text-[11px] font-mono space-y-1">
                          <div className="text-[#d4e4fa] font-bold">
                            {activeFocal} vs {item.ticker} ({item.name})
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#8c909f]">Pearson (r):</span>
                            <span
                              className={`font-bold ${
                                r >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                              }`}
                            >
                              {r >= 0 ? '+' : ''}{r.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-[#adc6ff] text-[10px]">{item.relationship}</div>
                          <div className="text-[#8c909f] text-[10px]">Sector: {item.sector}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="correlation" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCorrelationColor(entry.correlation)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-between text-[10px] text-[#8c909f] px-1 font-mono pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              High Positive (r &gt; 0.6)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4d8eff]"></span>
              Moderate (0.2 to 0.6)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
              Inverse / Hedge (&lt; -0.2)
            </span>
          </div>
        </div>
      )}

      {/* CHART 2: RECHARTS SCATTERCHART (BIVARIATE CO-MOVEMENT) */}
      {chartMode === 'scatter' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-[#8c909f] px-1">
            <div className="flex items-center gap-1.5">
              <span>Co-movement:</span>
              <strong className="text-[#adc6ff]">{activeFocal}</strong>
              <span>vs</span>
              <select
                value={activeSecondary}
                onChange={(e) => setSecondaryTicker(e.target.value)}
                className="bg-[#0d1c2d] text-[#4edea3] font-mono font-bold text-[11px] py-0.5 px-1.5 rounded border border-[#1c2b3c] outline-none"
              >
                {activeTickers
                  .filter((t) => t !== activeFocal)
                  .map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
            </div>
            <span className="font-mono text-[#4edea3] font-bold">
              r = {pairR >= 0 ? '+' : ''}{pairR.toFixed(2)}
            </span>
          </div>

          <div className="h-56 w-full bg-[#0d1c2d] rounded-xl p-2.5 border border-[#1c2b3c]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 12, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2b3c" />
                <XAxis
                  type="number"
                  dataKey="returnA"
                  name={`${activeFocal} Return`}
                  unit="%"
                  stroke="#8c909f"
                  fontSize={10}
                  fontFamily="monospace"
                />
                <YAxis
                  type="number"
                  dataKey="returnB"
                  name={`${activeSecondary} Return`}
                  unit="%"
                  stroke="#8c909f"
                  fontSize={10}
                  fontFamily="monospace"
                />
                <ReferenceLine x={0} stroke="#424754" />
                <ReferenceLine y={0} stroke="#424754" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#122131] p-2 rounded-lg border border-[#273647] shadow-xl text-[11px] font-mono">
                          <span className="text-[#adc6ff] block font-bold">{data.date}</span>
                          <span className="text-[#d4e4fa] block">{data.pairLabel}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter
                  name="Historical Daily Pairs"
                  data={scatterPoints}
                  fill={pairR >= 0 ? '#4edea3' : '#ffb4ab'}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-[#8c909f] leading-snug px-1">
            Each point represents a concurrent historical return pair. Upward clustering confirms synchronized beta exposure, while dispersion highlights diversification buffers.
          </p>
        </div>
      )}

      {/* CHART 3: FULL CORRELATION HEATMAP GRID */}
      {chartMode === 'heatmap' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-[#8c909f] px-1">
            <span>Pearson Correlation Grid (Click cell to analyze pair)</span>
            <span className="font-mono text-[#adc6ff]">{window} Lookback</span>
          </div>

          <div className="overflow-x-auto no-scrollbar rounded-xl border border-[#1c2b3c]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#0d1c2d] text-[#8c909f] text-[11px] font-mono border-b border-[#1c2b3c]">
                  <th className="p-2 text-left">Asset</th>
                  {activeTickers.map((t) => (
                    <th key={t} className="p-2">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2b3c] text-[11px] font-mono">
                {activeTickers.map((rowTicker) => (
                  <tr key={rowTicker} className="hover:bg-[#1c2b3c]/40 transition-colors">
                    <td className="p-2 text-left font-bold text-[#d4e4fa] bg-[#0d1c2d]/70">
                      {rowTicker}
                    </td>
                    {activeTickers.map((colTicker) => {
                      const r = getCorrelation(rowTicker, colTicker, window);
                      const isSelected =
                        (rowTicker === activeFocal && colTicker === activeSecondary) ||
                        (rowTicker === activeSecondary && colTicker === activeFocal);

                      return (
                        <td
                          key={colTicker}
                          onClick={() => {
                            setFocalTicker(rowTicker);
                            setSecondaryTicker(colTicker !== rowTicker ? colTicker : activeSecondary);
                          }}
                          className={`p-2 cursor-pointer transition-all ${getCellBg(r)} ${
                            isSelected ? 'ring-2 ring-[#adc6ff] z-10' : ''
                          }`}
                          title={`${rowTicker} vs ${colTicker}: r = ${r.toFixed(2)}`}
                        >
                          {r >= 0 ? '+' : ''}{r.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytical Takeaway Footer */}
      <div className="bg-[#0d1c2d] p-3 rounded-lg border border-[#1c2b3c] flex items-start gap-2.5 text-[11px]">
        <span className="material-symbols-outlined text-[#adc6ff] text-[17px] shrink-0 mt-0.5">
          insights
        </span>
        <div className="flex flex-col gap-0.5 leading-snug">
          <span className="text-[#d4e4fa] font-semibold">
            Institutional Covariance & Drift Insight:
          </span>
          <p className="text-[#c2c6d6]">
            {maxPair.a} and {maxPair.b} exhibit high sectoral clustering (r = +{maxPair.r.toFixed(2)}), while {minPair.a} and {minPair.b} provide superior portfolio variance dampening (r = {minPair.r.toFixed(2)}).
          </p>
        </div>
      </div>
    </div>
  );
};
