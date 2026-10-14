import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector
} from 'recharts';
import { PieChart as PieChartIcon, Layers, Info } from 'lucide-react';

interface SectorSlice {
  sector: string;
  value: number;
  pct: number;
  stocks: string[];
  color: string;
}

interface PortfolioSectorChartProps {
  holdingRows: Array<{
    stock: {
      ticker: string;
      sector: string;
      price: number;
    };
    currentValue: number;
  }>;
  totalValue: number;
}

// Institutional color palette for sectors
const SECTOR_PALETTE = [
  '#4d8eff', // Cobalt / Blue
  '#00ff9d', // Emerald / Mint
  '#ffb77c', // Amber / Coral
  '#c0c1ff', // Lavender / Indigo
  '#38bdf8', // Sky Blue
  '#ff5449', // Crimson / Red
  '#a78bfa', // Violet
  '#f59e0b', // Golden Amber
  '#34d399', // Teal Green
  '#ec4899'  // Pink
];

// Active sector shape renderer for interactive hover
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value
  } = props;

  return (
    <g>
      {/* Outer highlighted segment */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 8px ${fill}66)` }}
      />
      {/* Inner glow ring */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 5}
        outerRadius={innerRadius - 3}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Center Label Text */}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#d4e4fa"
        className="text-[14px] font-bold font-mono"
      >
        ₹{(value >= 100000 ? `${(value / 100000).toFixed(1)}L` : `${(value / 1000).toFixed(0)}k`)}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="#8c909f"
        className="text-[11px] font-medium"
      >
        {payload.pct.toFixed(1)}%
      </text>
      <text
        x={cx}
        y={cy + 25}
        textAnchor="middle"
        fill={fill}
        className="text-[10px] font-bold uppercase tracking-wider"
      >
        {payload.sector.length > 14 ? `${payload.sector.slice(0, 12)}…` : payload.sector}
      </text>
    </g>
  );
};

export const PortfolioSectorChart: React.FC<PortfolioSectorChartProps> = ({
  holdingRows,
  totalValue
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [displayMode, setDisplayMode] = useState<'donut' | 'grid'>('donut');

  // Aggregate holdings into sectors with stock lists
  const sectorData: SectorSlice[] = React.useMemo(() => {
    if (!holdingRows || holdingRows.length === 0 || totalValue <= 0) return [];

    const map: Record<string, { value: number; stocks: Set<string> }> = {};

    holdingRows.forEach((h) => {
      const sec = h.stock.sector || 'Diversified';
      if (!map[sec]) {
        map[sec] = { value: 0, stocks: new Set() };
      }
      map[sec].value += h.currentValue;
      map[sec].stocks.add(h.stock.ticker);
    });

    const entries = Object.entries(map).map(([sector, data], idx) => ({
      sector,
      value: Math.round(data.value),
      pct: (data.value / totalValue) * 100,
      stocks: Array.from(data.stocks),
      color: SECTOR_PALETTE[idx % SECTOR_PALETTE.length]
    }));

    // Sort descending by allocation value
    return entries.sort((a, b) => b.value - a.value);
  }, [holdingRows, totalValue]);

  if (sectorData.length === 0) return null;

  const activeSector = sectorData[activeIndex] || sectorData[0];

  return (
    <div className="bg-[#122131] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#1c2b3c] flex flex-col gap-4 relative overflow-hidden transition-colors">
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1c2b3c] text-[#c0c1ff] flex items-center justify-center border border-[#273647]">
            <PieChartIcon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[15px] sm:text-[16px] text-[#d4e4fa] tracking-tight">
                Sectoral Breakdown & Industry Weightings
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#c0c1ff]/15 text-[#c0c1ff] text-[10px] font-bold font-mono border border-[#c0c1ff]/30">
                {sectorData.length} Sectors
              </span>
            </div>
            <p className="text-[11px] text-[#8c909f]">
              Asset allocation distribution across commercial industry verticals
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-[#0d1c2d] p-0.5 rounded-xl border border-[#1c2b3c]">
          <button
            onClick={() => setDisplayMode('donut')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              displayMode === 'donut'
                ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            <PieChartIcon size={13} />
            <span>Interactive Pie</span>
          </button>
          <button
            onClick={() => setDisplayMode('grid')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              displayMode === 'grid'
                ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                : 'text-[#8c909f] hover:text-[#d4e4fa]'
            }`}
          >
            <Layers size={13} />
            <span>Weighting Bars</span>
          </button>
        </div>
      </div>

      {displayMode === 'donut' ? (
        /* Donut Pie Chart + Side Legend Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center pt-1">
          {/* Donut Chart Canvas */}
          <div className="lg:col-span-6 flex items-center justify-center h-64 sm:h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload as SectorSlice;
                    return (
                      <div className="bg-[#0d1c2d] p-3 rounded-xl shadow-2xl border border-[#273647] text-[11px] flex flex-col gap-1 min-w-[200px] backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-[#1c2b3c] pb-1">
                          <span className="font-bold text-[#d4e4fa] flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            {data.sector}
                          </span>
                          <span className="font-mono text-[#adc6ff] font-bold">
                            {data.pct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#c2c6d6]">
                          <span>Portfolio Value:</span>
                          <span className="font-mono font-bold text-[#d4e4fa]">
                            ₹{data.value.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#8c909f] pt-0.5">
                          <span>Holdings:</span>
                          <span className="font-mono text-[#4edea3]">
                            {data.stocks.join(', ')}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Pie
                  {...({
                    activeIndex,
                    activeShape: renderActiveShape,
                    data: sectorData,
                    cx: "50%",
                    cy: "50%",
                    innerRadius: 68,
                    outerRadius: 96,
                    paddingAngle: 3,
                    dataKey: "value",
                    onMouseEnter: (_: any, index: number) => setActiveIndex(index),
                    animationDuration: 800
                  } as any)}
                >
                  {sectorData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#051424"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Legend with Allocation Chips */}
          <div className="lg:col-span-6 flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#1c2b3c] text-[11px] text-[#8c909f]">
              <span>Industry Sector</span>
              <div className="flex items-center gap-3">
                <span>Allocation</span>
                <span>Valuation</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto no-scrollbar pr-1">
              {sectorData.map((sec, idx) => {
                const isSelected = activeIndex === idx;

                return (
                  <div
                    key={sec.sector}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1c2b3c] border-[#4d8eff]/50 shadow-md translate-x-0.5'
                        : 'bg-[#0d1c2d] hover:bg-[#152335] border-[#1c2b3c]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: sec.color }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[13px] text-[#d4e4fa] truncate">
                          {sec.sector}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-[#8c909f]">
                          <span>{sec.stocks.length} equities:</span>
                          <span className="font-mono text-[#adc6ff]">
                            {sec.stocks.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="font-mono text-[13px] font-bold text-[#d4e4fa]">
                        ₹{sec.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      <span
                        className="font-mono text-[11px] font-bold"
                        style={{ color: sec.color }}
                      >
                        {sec.pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Progress Bar Weightings View */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {sectorData.map((sec) => (
            <div
              key={sec.sector}
              className="bg-[#0d1c2d] p-3 rounded-xl border border-[#1c2b3c] flex flex-col gap-2 hover:border-[#273647] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: sec.color }}
                  />
                  <span className="font-semibold text-[13px] text-[#d4e4fa]">
                    {sec.sector}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="font-bold text-[13px] text-[#d4e4fa]">
                    ₹{sec.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[11px] font-bold" style={{ color: sec.color }}>
                    ({sec.pct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#1c2b3c] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${sec.pct}%`, backgroundColor: sec.color }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#8c909f] pt-0.5">
                <span>Holdings: {sec.stocks.join(', ')}</span>
                <span className="font-mono">{sec.stocks.length} assets</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Diversification Health Indicator */}
      <div className="flex items-center justify-between text-[11px] text-[#8c909f] border-t border-[#1c2b3c] pt-2 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Info size={14} className="text-[#adc6ff] shrink-0" />
          <span>
            Dominant Industry Concentration:{' '}
            <strong className="text-[#d4e4fa]">
              {activeSector.sector} ({activeSector.pct.toFixed(1)}%)
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="text-[#4edea3]">
            {sectorData.length >= 4 ? 'Well Diversified (≥4 Sectors)' : 'Moderate Sector Concentration'}
          </span>
        </div>
      </div>
    </div>
  );
};
