import React, { useState } from 'react';
import { ScreenTab } from '../types';

interface MarketSentimentProps {
  onNavigate?: (tab: ScreenTab) => void;
}

interface SentimentFactor {
  id: string;
  name: string;
  metric: string;
  value: string;
  score: number; // 0-100
  label: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  detail: string;
}

export const MarketSentiment: React.FC<MarketSentimentProps> = ({ onNavigate }) => {
  const [activePreset, setActivePreset] = useState<'current' | 'fear' | 'greed' | 'panic'>('current');
  const [showFactorBreakdown, setShowFactorBreakdown] = useState(false);

  // Sentiment values for different scenarios
  const presets = {
    current: {
      score: 68,
      status: 'GREED' as const,
      yesterday: 64,
      lastWeek: 58,
      lastMonth: 44,
      summary: 'Market momentum and low India VIX (12.8) reflect strong bullish risk appetite across retail and institutional participants.'
    },
    greed: {
      score: 84,
      status: 'EXTREME GREED' as const,
      yesterday: 80,
      lastWeek: 76,
      lastMonth: 65,
      summary: 'Extreme market euphoria with record 52-week highs and rapid speculative call option buying across midcaps.'
    },
    fear: {
      score: 34,
      status: 'FEAR' as const,
      yesterday: 42,
      lastWeek: 52,
      lastMonth: 60,
      summary: 'Caution driven by global bond yield fluctuations and selective profit-taking in high-valuation technology equities.'
    },
    panic: {
      score: 16,
      status: 'EXTREME FEAR' as const,
      yesterday: 22,
      lastWeek: 38,
      lastMonth: 55,
      summary: 'Sharp systemic de-risking triggered by elevated crude shocks and surging India VIX over 22.0.'
    }
  };

  const currentPreset = presets[activePreset];
  const score = currentPreset.score;

  // Helper to determine color based on 0-100 score
  const getScoreColor = (val: number) => {
    if (val < 25) return { stroke: '#ff5449', text: 'text-[#ff5449]', bg: 'bg-[#93000a]/25', border: 'border-[#ff5449]/40', label: 'Extreme Fear' };
    if (val < 45) return { stroke: '#ffb77c', text: 'text-[#ffb77c]', bg: 'bg-[#ffb77c]/15', border: 'border-[#ffb77c]/30', label: 'Fear' };
    if (val < 56) return { stroke: '#c0c1ff', text: 'text-[#c0c1ff]', bg: 'bg-[#c0c1ff]/15', border: 'border-[#c0c1ff]/30', label: 'Neutral' };
    if (val < 76) return { stroke: '#4edea3', text: 'text-[#4edea3]', bg: 'bg-[#00a572]/20', border: 'border-[#00a572]/30', label: 'Greed' };
    return { stroke: '#00ff9d', text: 'text-[#00ff9d]', bg: 'bg-[#00a572]/30', border: 'border-[#00ff9d]/50', label: 'Extreme Greed' };
  };

  const colorInfo = getScoreColor(score);

  // 6 Core Components of the Indian Fear & Greed Index
  const factors: SentimentFactor[] = [
    {
      id: 'momentum',
      name: 'Market Momentum',
      metric: 'Nifty 50 vs 125-DMA',
      value: '+2.8% above',
      score: 74,
      label: 'Greed',
      detail: 'NIFTY 50 trading firmly above its 125-day moving average benchmark.'
    },
    {
      id: 'breadth',
      name: 'Stock Price Strength',
      metric: '52-Week Highs vs Lows',
      value: '78 Highs / 12 Lows',
      score: 82,
      label: 'Extreme Greed',
      detail: 'Number of stocks hitting 52-week highs overwhelmingly outnumbers lows.'
    },
    {
      id: 'vix',
      name: 'Market Volatility',
      metric: 'India VIX',
      value: '12.84 (-4.2%)',
      score: 72,
      label: 'Greed',
      detail: 'India VIX remains subdued under 14.0 indicating low hedging demand.'
    },
    {
      id: 'pcr',
      name: 'Put / Call Ratio',
      metric: 'Nifty Options PCR',
      value: '1.22 (Bullish bias)',
      score: 68,
      label: 'Greed',
      detail: 'Put selling outpaces call purchases, confirming bullish support at 24,600.'
    },
    {
      id: 'safe-haven',
      name: 'Safe Haven Demand',
      metric: 'Equity vs 10Y G-Sec',
      value: '+3.4% Outperformance',
      score: 65,
      label: 'Greed',
      detail: 'Equities outperforming government bonds over trailing 20 trading sessions.'
    },
    {
      id: 'spread',
      name: 'Junk Bond Spreads',
      metric: 'Corp AAA vs BBB Spread',
      value: '44 bps (Tight)',
      score: 70,
      label: 'Greed',
      detail: 'Tight credit spreads show investors accept minimal credit risk premiums.'
    }
  ];

  // SVG Gauge Math
  // Semi-circle gauge from 180 deg (left) to 0 deg (right)
  // or a 240 deg arc from 150 deg to 390 deg (-30 deg)
  // Let's use a 180-degree semi-circle gauge:
  // Center: (150, 140), Radius = 110, Arc from Angle 180 to 0
  const cx = 150;
  const cy = 135;
  const r = 100;
  const strokeWidth = 14;

  // Calculate needle angle: score 0 => 180 deg (left), score 100 => 0 deg (right)
  const angleDeg = 180 - (score / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Needle tip
  const needleLength = 80;
  const needleX = cx + needleLength * Math.cos(angleRad);
  const needleY = cy - needleLength * Math.sin(angleRad);

  // Helper function to build SVG Arc path
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const radians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY - radius * Math.sin(radians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 1, end.x, end.y].join(' ');
  };

  // Segments for gauge:
  // Extreme Fear: 180 to 144 deg (0 to 20%)
  // Fear: 144 to 108 deg (20 to 40%)
  // Neutral: 108 to 72 deg (40 to 60%)
  // Greed: 72 to 36 deg (60 to 80%)
  // Extreme Greed: 36 to 0 deg (80 to 100%)
  const segments = [
    { start: 180, end: 144.5, color: '#ff5449', label: 'Extreme Fear' },
    { start: 143.5, end: 108.5, color: '#ffb77c', label: 'Fear' },
    { start: 107.5, end: 72.5, color: '#c0c1ff', label: 'Neutral' },
    { start: 71.5, end: 36.5, color: '#4edea3', label: 'Greed' },
    { start: 35.5, end: 0, color: '#00ff9d', label: 'Extreme Greed' }
  ];

  return (
    <section className="bg-[#122131] rounded-2xl p-4 shadow-xl border border-[#1c2b3c] flex flex-col gap-3 relative overflow-hidden">
      {/* Decorative ambient backdrop glow */}
      <div
        className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: colorInfo.stroke }}
      />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#d4e4fa] tracking-tight leading-none">
                Market Sentiment
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono border border-[#00a572]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                NSE Fear & Greed
              </span>
            </div>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">
              Multi-factor emotional composite index of market participants
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
          {(['current', 'fear', 'panic', 'greed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActivePreset(mode)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${
                activePreset === mode
                  ? 'bg-[#1c2b3c] text-[#adc6ff] shadow-sm border border-[#273647]'
                  : 'text-[#8c909f] hover:text-[#d4e4fa]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Circular SVG Gauge Visualizer */}
      <div className="flex flex-col items-center justify-center pt-1 relative z-10">
        <div className="relative w-[300px] h-[165px] flex items-center justify-center">
          <svg
            viewBox="0 0 300 160"
            className="w-full h-full overflow-visible"
            role="img"
            aria-label={`Fear and Greed Gauge reading ${score}`}
          >
            {/* Background Track Arc */}
            <path
              d={describeArc(cx, cy, r, 0, 180)}
              fill="none"
              stroke="#0d1c2d"
              strokeWidth={strokeWidth + 4}
              strokeLinecap="round"
            />

            {/* Segmented Color Bands */}
            {segments.map((seg, idx) => (
              <path
                key={idx}
                d={describeArc(cx, cy, r, seg.end, seg.start)}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={0.88}
                className="transition-all duration-300"
              />
            ))}

            {/* Scale Markings & Labels */}
            <text x="35" y="152" fill="#ff5449" fontSize="9" fontWeight="bold" fontFamily="monospace">
              0
            </text>
            <text x="75" y="65" fill="#ffb77c" fontSize="8" fontFamily="monospace">
              25
            </text>
            <text x="144" y="24" fill="#c0c1ff" fontSize="8" fontWeight="bold" fontFamily="monospace">
              50
            </text>
            <text x="215" y="65" fill="#4edea3" fontSize="8" fontFamily="monospace">
              75
            </text>
            <text x="252" y="152" fill="#00ff9d" fontSize="9" fontWeight="bold" fontFamily="monospace">
              100
            </text>

            {/* Qualitative Arc Range Labels */}
            <text x="40" y="125" fill="#8c909f" fontSize="7.5" fontWeight="600" textAnchor="middle">
              FEAR
            </text>
            <text x="150" y="44" fill="#8c909f" fontSize="7.5" fontWeight="600" textAnchor="middle">
              NEUTRAL
            </text>
            <text x="260" y="125" fill="#8c909f" fontSize="7.5" fontWeight="600" textAnchor="middle">
              GREED
            </text>

            {/* Needle Pivot Base Glow & Base Circle */}
            <circle cx={cx} cy={cy} r="14" fill="#0d1c2d" stroke="#273647" strokeWidth="2" />
            <circle cx={cx} cy={cy} r="6" fill={colorInfo.stroke} />

            {/* Needle Arm with transition */}
            <line
              x1={cx}
              y1={cy}
              x2={needleX}
              y2={needleY}
              stroke={colorInfo.stroke}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Central Score Display */}
          <div className="absolute bottom-0 flex flex-col items-center pointer-events-none">
            <span
              className={`font-mono text-[34px] font-bold tracking-tight leading-none ${colorInfo.text}`}
            >
              {score}
            </span>
            <span
              className={`text-[12px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 border ${colorInfo.bg} ${colorInfo.text} ${colorInfo.border}`}
            >
              {currentPreset.status}
            </span>
          </div>
        </div>

        {/* Narrative Summary */}
        <p className="text-[12px] text-[#c2c6d6] text-center max-w-md mt-2 leading-relaxed">
          {currentPreset.summary}
        </p>
      </div>

      {/* Historical Sentiment Comparisons Bento */}
      <div className="grid grid-cols-4 gap-2 bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] text-center text-[11px] relative z-10">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">Previous Day</span>
          <span className="font-mono text-[13px] font-bold text-[#d4e4fa] mt-0.5">
            {currentPreset.yesterday}
          </span>
          <span className="text-[9px] text-[#4edea3] font-mono">
            {score >= currentPreset.yesterday ? '+' : ''}
            {score - currentPreset.yesterday} pts
          </span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">1 Week Ago</span>
          <span className="font-mono text-[13px] font-bold text-[#d4e4fa] mt-0.5">
            {currentPreset.lastWeek}
          </span>
          <span className="text-[9px] text-[#8c909f] font-mono">Greed</span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">1 Month Ago</span>
          <span className="font-mono text-[13px] font-bold text-[#d4e4fa] mt-0.5">
            {currentPreset.lastMonth}
          </span>
          <span className="text-[9px] text-[#ffb77c] font-mono">Fear</span>
        </div>

        <div className="flex flex-col items-center border-l border-[#1c2b3c] pl-1">
          <span className="text-[10px] text-[#8c909f] uppercase font-semibold">1 Year Ago</span>
          <span className="font-mono text-[13px] font-bold text-[#d4e4fa] mt-0.5">
            71
          </span>
          <span className="text-[9px] text-[#4edea3] font-mono">Greed</span>
        </div>
      </div>

      {/* Accordion Toggle for Factor Breakdown */}
      <div className="relative z-10 pt-1">
        <button
          onClick={() => setShowFactorBreakdown(!showFactorBreakdown)}
          className="w-full py-2 px-3 rounded-xl bg-[#0d1c2d] hover:bg-[#1c2b3c] border border-[#1c2b3c] flex items-center justify-between text-[12px] font-semibold text-[#adc6ff] transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>6 Key Sentiment Drivers & Underlying Factors</span>
          </div>
          <span className="material-symbols-outlined text-[18px]">
            {showFactorBreakdown ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showFactorBreakdown && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 animate-in fade-in duration-200">
            {factors.map((f) => {
              const fColor = getScoreColor(f.score);
              return (
                <div
                  key={f.id}
                  className="bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[12px] text-[#d4e4fa]">{f.name}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono border ${fColor.bg} ${fColor.text} ${fColor.border}`}
                    >
                      {f.score}/100 {f.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#c2c6d6]">
                    <span>{f.metric}</span>
                    <span className="text-[#adc6ff] font-semibold">{f.value}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[#1c2b3c] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${f.score}%`,
                        backgroundColor: fColor.stroke
                      }}
                    />
                  </div>

                  <p className="text-[10px] text-[#8c909f] leading-snug">{f.detail}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer link to Markets or Risk Radar */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c] text-[11px] text-[#8c909f] relative z-10">
        <span className="flex items-center gap-1 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
          Refreshed every 15 minutes during market hours
        </span>

        {onNavigate && (
          <button
            onClick={() => onNavigate('risk-radar')}
            className="text-[#adc6ff] hover:text-[#d4e4fa] hover:underline flex items-center gap-0.5 font-semibold transition-colors"
          >
            <span>Risk Radar</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        )}
      </div>
    </section>
  );
};
