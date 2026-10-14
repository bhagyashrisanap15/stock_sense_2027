import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ScreenTab } from '../types';

interface MarketSentimentGaugeProps {
  onNavigate?: (tab: ScreenTab) => void;
  initialScore?: number;
}

export const MarketSentimentGauge: React.FC<MarketSentimentGaugeProps> = ({
  onNavigate,
  initialScore = 68
}) => {
  const [score, setScore] = useState<number>(initialScore);
  const [activePreset, setActivePreset] = useState<'current' | 'fear' | 'panic' | 'greed' | 'custom'>('current');
  const [showDriverBreakdown, setShowDriverBreakdown] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Preset sentiment levels
  const presets = {
    current: {
      score: 68,
      status: 'GREED',
      yesterday: 64,
      lastWeek: 58,
      lastMonth: 44,
      summary: 'Bullish risk appetite led by institutional inflows and tame India VIX (12.84).'
    },
    greed: {
      score: 84,
      status: 'EXTREME GREED',
      yesterday: 80,
      lastWeek: 76,
      lastMonth: 65,
      summary: 'Euphoric momentum with broad mid-cap call buying and record 52-week highs.'
    },
    fear: {
      score: 34,
      status: 'FEAR',
      yesterday: 42,
      lastWeek: 52,
      lastMonth: 60,
      summary: 'Caution driven by global bond yield fluctuations and tech valuation compression.'
    },
    panic: {
      score: 16,
      status: 'EXTREME FEAR',
      yesterday: 22,
      lastWeek: 38,
      lastMonth: 55,
      summary: 'Sharply elevated hedging demand with India VIX surging above 22.0.'
    },
    custom: {
      score,
      status: score < 25 ? 'EXTREME FEAR' : score < 45 ? 'FEAR' : score < 56 ? 'NEUTRAL' : score < 76 ? 'GREED' : 'EXTREME GREED',
      yesterday: 64,
      lastWeek: 58,
      lastMonth: 44,
      summary: 'Interactive simulation of market sentiment score and quantitative factors.'
    }
  };

  const currentPreset = presets[activePreset];

  // Helper for status and colors
  const getScoreMeta = (val: number) => {
    if (val < 25) {
      return {
        label: 'EXTREME FEAR',
        color: '#ff5449',
        bg: 'bg-[#93000a]/30',
        border: 'border-[#ff5449]/40',
        text: 'text-[#ff5449]'
      };
    }
    if (val < 45) {
      return {
        label: 'FEAR',
        color: '#ffb77c',
        bg: 'bg-[#ffb77c]/20',
        border: 'border-[#ffb77c]/30',
        text: 'text-[#ffb77c]'
      };
    }
    if (val < 56) {
      return {
        label: 'NEUTRAL',
        color: '#c0c1ff',
        bg: 'bg-[#c0c1ff]/15',
        border: 'border-[#c0c1ff]/30',
        text: 'text-[#c0c1ff]'
      };
    }
    if (val < 76) {
      return {
        label: 'GREED',
        color: '#4edea3',
        bg: 'bg-[#00a572]/20',
        border: 'border-[#00a572]/30',
        text: 'text-[#4edea3]'
      };
    }
    return {
      label: 'EXTREME GREED',
      color: '#00ff9d',
      bg: 'bg-[#00a572]/35',
      border: 'border-[#00ff9d]/50',
      text: 'text-[#00ff9d]'
    };
  };

  const meta = getScoreMeta(score);

  // Set preset
  const handleSelectPreset = (presetKey: 'current' | 'fear' | 'panic' | 'greed') => {
    setActivePreset(presetKey);
    setScore(presets[presetKey].score);
  };

  // D3-Based Semi-Circle Radial Gauge Renderer
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 320;
    const height = 180;
    const margin = { top: 15, right: 20, bottom: 20, left: 20 };
    const radius = 110;
    const arcWidth = 18;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height - 25})`);

    // D3 Scale to map 0-100 to semi-circle angles: -π/2 to π/2
    const angleScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([-Math.PI / 2, Math.PI / 2]);

    // D3 Scale for needle rotation degrees: -90 to +90
    const degreeScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([-90, 90]);

    // Background track arc
    const backgroundArc = d3
      .arc()
      .innerRadius(radius - arcWidth)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)
      .cornerRadius(4);

    g.append('path')
      .attr('d', backgroundArc as any)
      .attr('fill', '#0d1c2d')
      .attr('stroke', '#1c2b3c')
      .attr('stroke-width', 1);

    // 5 Sentiment Segments
    const segments = [
      { start: 0, end: 24.5, color: '#ff5449', label: 'EXTREME FEAR' },
      { start: 25, end: 44.5, color: '#ffb77c', label: 'FEAR' },
      { start: 45, end: 55.5, color: '#c0c1ff', label: 'NEUTRAL' },
      { start: 56, end: 75.5, color: '#4edea3', label: 'GREED' },
      { start: 76, end: 100, color: '#00ff9d', label: 'EXTREME GREED' }
    ];

    const arcGenerator = d3
      .arc()
      .innerRadius(radius - arcWidth)
      .outerRadius(radius)
      .cornerRadius(3);

    // Render segments
    segments.forEach((seg) => {
      g.append('path')
        .attr('d', arcGenerator({
          startAngle: angleScale(seg.start),
          endAngle: angleScale(seg.end)
        } as any))
        .attr('fill', seg.color)
        .attr('opacity', 0.88);
    });

    // Radial Ticks and Scale Labels (0, 25, 50, 75, 100)
    const ticks = [0, 25, 50, 75, 100];
    ticks.forEach((tickVal) => {
      const angle = angleScale(tickVal);
      const innerTickR = radius + 4;
      const outerTickR = radius + 9;
      const labelR = radius + 18;

      const x1 = innerTickR * Math.sin(angle);
      const y1 = -innerTickR * Math.cos(angle);
      const x2 = outerTickR * Math.sin(angle);
      const y2 = -outerTickR * Math.cos(angle);

      // Tick line
      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#8c909f')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.6);

      // Tick text label
      const lx = labelR * Math.sin(angle);
      const ly = -labelR * Math.cos(angle);

      g.append('text')
        .attr('x', lx)
        .attr('y', ly + 3)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', '600')
        .attr('fill', tickVal === 0 ? '#ff5449' : tickVal === 100 ? '#00ff9d' : '#8c909f')
        .text(tickVal);
    });

    // Qualitative Zone Indicators inside arc
    const qualitativeZones = [
      { text: 'FEAR', angle: angleScale(20), color: '#ffb77c' },
      { text: 'NEUTRAL', angle: angleScale(50), color: '#c0c1ff' },
      { text: 'GREED', angle: angleScale(80), color: '#4edea3' }
    ];

    qualitativeZones.forEach((zone) => {
      const zR = radius - arcWidth - 14;
      const zx = zR * Math.sin(zone.angle);
      const zy = -zR * Math.cos(zone.angle);

      g.append('text')
        .attr('x', zx)
        .attr('y', zy + 3)
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .attr('font-weight', 'bold')
        .attr('letter-spacing', '0.5px')
        .attr('fill', '#8c909f')
        .attr('opacity', 0.75)
        .text(zone.text);
    });

    // D3 Needle Group with Animated Pivot
    const needleGroup = g.append('g').attr('class', 'd3-needle-group');

    // Needle arm path (tapered pointer)
    const needleLength = radius - 15;
    needleGroup
      .append('path')
      .attr('d', `M -3.5 0 L 0 ${-needleLength} L 3.5 0 Z`)
      .attr('fill', meta.color)
      .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))');

    // Needle pivot circle cap
    needleGroup
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 12)
      .attr('fill', '#0d1c2d')
      .attr('stroke', '#273647')
      .attr('stroke-width', 2);

    needleGroup
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', meta.color);

    // Initial needle position
    const targetDegrees = degreeScale(score);

    // Smooth D3 transition
    needleGroup
      .attr('transform', 'rotate(-90)')
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('transform', `rotate(${targetDegrees})`);

  }, [score, meta.color]);

  // 6 Core Drivers of Indian Stock Market Sentiment
  const sentimentDrivers = [
    {
      name: 'Market Momentum',
      metric: 'Nifty 50 vs 125-DMA',
      val: '+2.8%',
      score: 74,
      status: 'Greed',
      color: '#4edea3'
    },
    {
      name: 'Price Strength',
      metric: '52-Week Highs vs Lows',
      val: '78 Highs : 12 Lows',
      score: 82,
      status: 'Extreme Greed',
      color: '#00ff9d'
    },
    {
      name: 'Volatility (India VIX)',
      metric: 'India VIX Index',
      val: '12.84 (-4.2%)',
      score: 72,
      status: 'Greed',
      color: '#4edea3'
    },
    {
      name: 'Put / Call Ratio (PCR)',
      metric: 'Nifty Options PCR',
      val: '1.22 (Bullish bias)',
      score: 68,
      status: 'Greed',
      color: '#4edea3'
    },
    {
      name: 'Safe Haven Demand',
      metric: 'Equities vs 10Y G-Sec',
      val: '+3.4% Outperformance',
      score: 65,
      status: 'Greed',
      color: '#4edea3'
    },
    {
      name: 'Junk Bond Spreads',
      metric: 'AAA vs BBB Spread',
      val: '44 bps (Tight)',
      score: 70,
      status: 'Greed',
      color: '#4edea3'
    }
  ];

  return (
    <section className="bg-[#122131] rounded-2xl p-4 shadow-xl border border-[#1c2b3c] flex flex-col gap-3 relative overflow-hidden">
      {/* Decorative ambient backdrop glow */}
      <div
        className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: meta.color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/15 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30 shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">speed</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-[#d4e4fa] tracking-tight leading-none">
                Market Sentiment Gauge
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold font-mono border border-[#00a572]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                D3.js Radial Gauge
              </span>
            </div>
            <p className="text-[11px] text-[#c2c6d6] mt-0.5">
              Daily Fear & Greed index score calculated from 6 institutional sentiment factors
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex bg-[#0d1c2d] p-0.5 rounded-lg border border-[#1c2b3c]">
          {(['current', 'fear', 'panic', 'greed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleSelectPreset(mode)}
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

      {/* Center D3 Gauge Container */}
      <div className="flex flex-col items-center justify-center pt-1 relative z-10">
        <div className="relative w-full max-w-[340px] flex items-center justify-center">
          <svg
            ref={svgRef}
            className="w-full h-auto overflow-visible select-none"
            role="img"
            aria-label={`D3 Fear and Greed Radial Gauge measuring ${score}`}
          />

          {/* Central Score Numerical Readout */}
          <div className="absolute bottom-2 flex flex-col items-center pointer-events-none">
            <span
              className={`font-mono text-[36px] font-bold tracking-tight leading-none ${meta.text}`}
            >
              {score}
            </span>
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 border ${meta.bg} ${meta.text} ${meta.border}`}
            >
              {meta.label}
            </span>
          </div>
        </div>

        {/* Narrative Summary */}
        <p className="text-[12px] text-[#c2c6d6] text-center max-w-md mt-2 leading-relaxed">
          {currentPreset.summary}
        </p>

        {/* Interactive Scrub Slider for Custom Testing */}
        <div className="w-full max-w-xs mt-2 px-3 py-1.5 bg-[#0d1c2d] rounded-xl border border-[#1c2b3c] flex items-center gap-2.5">
          <span className="text-[10px] text-[#8c909f] font-mono">0</span>
          <input
            type="range"
            min="0"
            max="100"
            value={score}
            onChange={(e) => {
              setActivePreset('custom');
              setScore(Number(e.target.value));
            }}
            className="flex-1 h-1.5 bg-[#1c2b3c] rounded-lg appearance-none cursor-pointer accent-[#4d8eff]"
          />
          <span className="text-[10px] text-[#8c909f] font-mono">100</span>
          <span className="font-mono text-[11px] font-bold text-[#adc6ff] min-w-[28px] text-right">
            {score}
          </span>
        </div>
      </div>

      {/* Historical Sentiment Benchmarks Bento */}
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
          <span className="text-[9px] text-[#4edea3] font-mono">Greed</span>
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

      {/* Accordion Toggle for 6 Underlying Drivers */}
      <div className="relative z-10 pt-1">
        <button
          onClick={() => setShowDriverBreakdown(!showDriverBreakdown)}
          className="w-full py-2 px-3 rounded-xl bg-[#0d1c2d] hover:bg-[#1c2b3c] border border-[#1c2b3c] flex items-center justify-between text-[12px] font-semibold text-[#adc6ff] transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>6 Key Institutional Drivers & Sub-Factors</span>
          </div>
          <span className="material-symbols-outlined text-[18px]">
            {showDriverBreakdown ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showDriverBreakdown && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 animate-in fade-in duration-200">
            {sentimentDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="bg-[#0d1c2d] p-2.5 rounded-xl border border-[#1c2b3c] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[12px] text-[#d4e4fa]">{driver.name}</span>
                  <span
                    className="px-1.5 py-0.2 rounded text-[10px] font-bold font-mono border bg-[#1c2b3c]"
                    style={{ color: driver.color, borderColor: `${driver.color}40` }}
                  >
                    {driver.score}/100 {driver.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#c2c6d6]">
                  <span>{driver.metric}</span>
                  <span className="text-[#adc6ff] font-semibold">{driver.val}</span>
                </div>

                {/* Progress track */}
                <div className="w-full h-1.5 bg-[#1c2b3c] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${driver.score}%`,
                      backgroundColor: driver.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer link to Risk Radar */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1c2b3c] text-[11px] text-[#8c909f] relative z-10">
        <span className="flex items-center gap-1 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
          Synchronized with NSE cash & index derivatives flow
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
