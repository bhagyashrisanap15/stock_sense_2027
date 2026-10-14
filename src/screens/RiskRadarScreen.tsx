import React, { useState } from 'react';
import { StockData } from '../types';

interface RiskRadarScreenProps {
  currentStock: StockData;
}

export const RiskRadarScreen: React.FC<RiskRadarScreenProps> = ({ currentStock }) => {
  const [shockValue, setShockValue] = useState<number>(-5.0);

  // Dynamic calculations based on beta
  const calculatedShockImpact = (shockValue * currentStock.beta).toFixed(2);

  // Gauge calculations
  // Angle for 0 to 100 score: 180 degrees total
  // Radius = 80, Circumference of half circle = pi * 80 = 251.3
  const dashoffset = 251.2 - (251.2 * (currentStock.riskScore / 100));

  // Needle angle in radians: from -pi (left) to 0 (right)
  const angleRad = Math.PI - (Math.PI * (currentStock.riskScore / 100));
  const needleLength = 60;
  const needleX = 100 - needleLength * Math.cos(angleRad);
  const needleY = 98 - needleLength * Math.sin(angleRad);

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1600px] xl:max-w-[1720px] mx-auto pb-8">
      {/* Stock Anchor Context Header */}
      <div className="flex items-center justify-between bg-[#0d1c2d] p-4 rounded-xl shadow-sm border border-[#1c2b3c]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#1c2b3c] flex items-center justify-center text-[#adc6ff] font-bold text-[16px] shrink-0 border border-[#273647]">
            {currentStock.ticker.slice(0, 2)}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[16px] text-[#d4e4fa] tracking-tight truncate">
                {currentStock.ticker}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#273647] text-[#c2c6d6] text-[11px] font-semibold">
                {currentStock.exchange}
              </span>
            </div>
            <span className="text-[12px] text-[#c2c6d6] truncate">
              {currentStock.name}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-[18px] font-bold font-mono text-[#d4e4fa] tracking-tight">
            ₹{currentStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span
            className={`text-[12px] font-mono flex items-center gap-0.5 font-medium ${
              currentStock.changePercent >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {currentStock.changePercent >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
            {currentStock.changePercent >= 0 ? '+' : ''}{currentStock.changePercent}% today
          </span>
        </div>
      </div>

      {/* Laptop Dual-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Risk Dial & Quantitative Metrics */}
        <div className="lg:col-span-5 flex flex-col gap-5">

      {/* Hero Risk Dial Gauge Panel */}
      <div className="relative overflow-hidden bg-[#122131] rounded-xl p-4 shadow-md flex flex-col items-center border border-[#1c2b3c]">
        <div className="w-full flex items-center justify-between pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">security</span>
            <span className="text-[11px] font-semibold text-[#d4e4fa] tracking-wider uppercase">
              Systemic Risk Score
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#1c2b3c] text-[#c2c6d6] font-mono text-[11px] border border-[#273647]">
            v3.4-XAI
          </span>
        </div>

        {/* Semicircular SVG Gauge */}
        <div className="relative w-64 h-32 mt-2 flex items-end justify-center">
          <svg className="w-64 h-32 overflow-visible" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#4edea3" />
                <stop offset="50%" stopColor="#adc6ff" />
                <stop offset="100%" stopColor="#ffb4ab" />
              </linearGradient>
            </defs>
            {/* Background Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1c2b3c"
              strokeLinecap="round"
              strokeWidth="14"
            />
            {/* Score Fill */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeDasharray="251.2"
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              strokeWidth="14"
              className="transition-all duration-700 ease-out"
            />
            {/* Marker Needle */}
            <circle cx="100" cy="98" r="4" fill="#adc6ff" />
            <line
              x1="100"
              y1="98"
              x2={needleX}
              y2={needleY}
              stroke="#adc6ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Display Value */}
          <div className="absolute bottom-0 flex flex-col items-center">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[36px] text-[#d4e4fa] leading-none font-bold font-mono">
                {currentStock.riskScore}
              </span>
              <span className="text-[12px] text-[#c2c6d6] font-mono">/100</span>
            </div>
            <span
              className={`text-[11px] uppercase tracking-widest mt-0.5 font-bold ${
                currentStock.riskScore < 35
                  ? 'text-[#4edea3]'
                  : currentStock.riskScore < 55
                  ? 'text-[#adc6ff]'
                  : 'text-[#ffb4ab]'
              }`}
            >
              {currentStock.riskCategory}
            </span>
          </div>
        </div>

        {/* Gauge Legend Ticks */}
        <div className="w-64 flex justify-between px-2 pt-2 text-[11px] text-[#8c909f] font-semibold">
          <span>LOW</span>
          <span className="text-[#adc6ff] font-medium font-mono">
            {currentStock.riskCategory} ({currentStock.riskScore})
          </span>
          <span>HIGH</span>
        </div>

        {/* Status Pill */}
        <div className="mt-4 w-full bg-[#1c2b3c] rounded-lg p-2.5 flex items-center gap-2 border border-[#273647]">
          <div className="w-2 h-2 rounded-full bg-[#adc6ff] shrink-0 animate-pulse" ></div>
          <p className="text-[12px] text-[#d4e4fa] tracking-tight">
            <strong className="font-semibold text-[#adc6ff]">
              {currentStock.riskCategory} RISK
            </strong>{' '}
            — Volatility within acceptable historical bands
          </p>
        </div>
      </div>

      {/* Key Quantitative Metrics 2x2 Bento Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Annualized Volatility */}
        <div className="bg-[#122131] rounded-xl p-3.5 shadow-sm flex flex-col justify-between border border-[#1c2b3c]">
          <div className="flex items-center justify-between text-[#c2c6d6] mb-2">
            <span className="text-[11px] font-semibold tracking-wide uppercase">Ann. Volatility</span>
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">ssid_chart</span>
          </div>
          <div>
            <span className="text-[20px] font-bold font-mono text-[#d4e4fa] tracking-tight">
              {currentStock.annVolatility}%
            </span>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#c2c6d6]">
              <span>Benchmark:</span>
              <span className="font-mono text-[#d4e4fa]">{currentStock.volBenchmark}%</span>
            </div>
          </div>
          <div className="w-full bg-[#1c2b3c] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#4d8eff] h-full rounded-full"
              style={{ width: `${Math.min(100, (currentStock.annVolatility / 30) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Max Drawdown */}
        <div className="bg-[#122131] rounded-xl p-3.5 shadow-sm flex flex-col justify-between border border-[#1c2b3c]">
          <div className="flex items-center justify-between text-[#c2c6d6] mb-2">
            <span className="text-[11px] font-semibold tracking-wide uppercase">Max Drawdown (6M)</span>
            <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">waterfall_chart</span>
          </div>
          <div>
            <span className="text-[20px] font-bold font-mono text-[#ffb4ab] tracking-tight">
              {currentStock.maxDrawdown}%
            </span>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#c2c6d6]">
              <span>Peak:</span>
              <span className="font-mono text-[#d4e4fa]">₹{currentStock.drawdownPeak}</span>
            </div>
          </div>
          <div className="w-full bg-[#1c2b3c] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#ffb4ab] h-full rounded-full"
              style={{ width: `${Math.min(100, Math.abs(currentStock.maxDrawdown) * 3)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Value at Risk */}
        <div className="bg-[#122131] rounded-xl p-3.5 shadow-sm flex flex-col justify-between border border-[#1c2b3c]">
          <div className="flex items-center justify-between text-[#c2c6d6] mb-2">
            <span className="text-[11px] font-semibold tracking-wide uppercase">VaR (95%, 1-Day)</span>
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">analytics</span>
          </div>
          <div>
            <span className="text-[20px] font-bold font-mono text-[#d4e4fa] tracking-tight">
              {currentStock.var95}%
            </span>
            <div className="mt-1 text-[11px] text-[#c2c6d6] truncate">
              Simulated tail loss
            </div>
          </div>
          <div className="w-full bg-[#1c2b3c] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#4edea3] h-full rounded-full"
              style={{ width: `${Math.min(100, Math.abs(currentStock.var95) * 15)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 4: Sharpe Ratio */}
        <div className="bg-[#122131] rounded-xl p-3.5 shadow-sm flex flex-col justify-between border border-[#1c2b3c]">
          <div className="flex items-center justify-between text-[#c2c6d6] mb-2">
            <span className="text-[11px] font-semibold tracking-wide uppercase">Sharpe Ratio</span>
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">balance</span>
          </div>
          <div>
            <span className="text-[20px] font-bold font-mono text-[#4edea3] tracking-tight">
              {currentStock.sharpeRatio}
            </span>
            <div className="mt-1 text-[11px] text-[#c2c6d6] truncate">
              Healthy risk-return
            </div>
          </div>
          <div className="w-full bg-[#1c2b3c] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#4edea3] h-full rounded-full"
              style={{ width: `${Math.min(100, (currentStock.sharpeRatio / 2.5) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Mandatory Compliance Disclaimer Panel */}
        <div className="bg-[#010f1f] rounded-xl p-3.5 shadow-inner flex gap-3 items-start border border-[#1c2b3c]">
          <span className="material-symbols-outlined text-[#adc6ff] text-[20px] shrink-0 mt-0.5">
            verified_user
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#adc6ff] uppercase tracking-wide font-semibold">
              Regulatory & Mathematical Compliance
            </span>
            <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
              Risk metrics are analytical estimates calculated using historical price distributions and Monte Carlo simulations. They are for academic demonstration and not personalized financial or investment advice.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column (7 cols): Stress Test Simulation & Factor Risk Attributions */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        {/* Stress Test Simulation Matrix */}
        <div className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-3 border border-[#1c2b3c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">tune</span>
              <span className="font-semibold text-[15px] text-[#d4e4fa]">Stress Test Simulation</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#4d8eff]/10 text-[#adc6ff] text-[11px] font-semibold border border-[#4d8eff]/20">
              Monte Carlo 10k
            </span>
          </div>

          {/* Dynamic Interactive Slider Controls */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[#d4e4fa]">
              <label className="text-[12px] text-[#c2c6d6]" htmlFor="shockSlider">
                Macro Index Shock Scenario
              </label>
              <span className="font-mono text-[13px] text-[#ffb4ab] font-bold">
                {shockValue.toFixed(1)}%
              </span>
            </div>
            <input
              id="shockSlider"
              type="range"
              min="-15"
              max="0"
              step="0.5"
              value={shockValue}
              onChange={(e) => setShockValue(parseFloat(e.target.value))}
              className="w-full accent-[#adc6ff] h-2 bg-[#1c2b3c] rounded-lg cursor-pointer transition-all"
            />
            <div className="flex justify-between text-[11px] text-[#8c909f] pt-0.5 font-mono">
              <span>-15% (Extreme Crash)</span>
              <span>0% (Neutral)</span>
            </div>
          </div>

          {/* Preset Scenario Impact Badges */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Scenario 1 */}
            <div className="bg-[#0d1c2d] rounded-lg p-2.5 flex items-center justify-between border border-[#1c2b3c]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#1c2b3c] flex items-center justify-center text-[#ffb4ab] border border-[#273647]">
                  <span className="material-symbols-outlined text-[18px]">trending_down</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#d4e4fa] font-medium">
                    Market Shock ({shockValue.toFixed(1)}%)
                  </span>
                  <span className="text-[11px] text-[#c2c6d6]">Systemic Nifty sell-off</span>
                </div>
              </div>
              <span className="font-mono text-[13px] text-[#ffb4ab] font-bold">
                {calculatedShockImpact}%
              </span>
            </div>

            {/* Scenario 2 */}
            <div className="bg-[#0d1c2d] rounded-lg p-2.5 flex items-center justify-between border border-[#1c2b3c]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#1c2b3c] flex items-center justify-center text-[#c2c6d6] border border-[#273647]">
                  <span className="material-symbols-outlined text-[18px]">percent</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#d4e4fa] font-medium">
                    Interest Rate Hike (+25bps)
                  </span>
                  <span className="text-[11px] text-[#c2c6d6]">RBI Monetary tightening</span>
                </div>
              </div>
              <span className="font-mono text-[13px] text-[#ffb4ab] font-bold">
                -1.20%
              </span>
            </div>

            {/* Scenario 3 */}
            <div className="bg-[#0d1c2d] rounded-lg p-2.5 flex items-center justify-between border border-[#1c2b3c]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#1c2b3c] flex items-center justify-center text-[#ffb4ab] border border-[#273647]">
                  <span className="material-symbols-outlined text-[18px]">report_problem</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#d4e4fa] font-medium">
                    Quarterly Earnings Miss
                  </span>
                  <span className="text-[11px] text-[#c2c6d6]">O2C margin compression</span>
                </div>
              </div>
              <span className="font-mono text-[13px] text-[#ffb4ab] font-bold">
                -4.20%
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Factor Risk Decomposition SHAP Cards */}
        <div className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-2.5 border border-[#1c2b3c]">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">insights</span>
              <span className="font-semibold text-[15px] text-[#d4e4fa]">Factor Breakdown</span>
            </div>
            <span className="text-[11px] text-[#c2c6d6]">SHAP Attribution</span>
          </div>

          {/* Factor 1: Market Risk */}
          <div className="bg-[#0d1c2d] rounded-lg p-2.5 flex flex-col gap-1.5 border border-[#1c2b3c]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                <span className="text-[13px] text-[#d4e4fa] font-medium">Market Beta Sensitivity</span>
              </div>
              <span className="font-mono text-[12px] text-[#ffb4ab] font-bold">
                β {currentStock.beta}
              </span>
            </div>
            <p className="text-[12px] text-[#c2c6d6] pl-3.5 leading-snug">
              High correlation with benchmark index movements. Amplifies broader market fluctuations.
            </p>
            <div className="w-full bg-[#1c2b3c] h-1 rounded-full overflow-hidden ml-3.5 mr-2">
              <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '78%' }} ></div>
            </div>
          </div>

          {/* Factor 2: Volatility Risk */}
          <div className="bg-[#0d1c2d] rounded-lg p-2.5 flex flex-col gap-1.5 border border-[#1c2b3c]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]"></span>
                <span className="text-[13px] text-[#d4e4fa] font-medium">Volatility (30D vs Implied)</span>
              </div>
              <span className="text-[11px] text-[#adc6ff] uppercase font-bold">Moderate</span>
            </div>
            <p className="text-[12px] text-[#c2c6d6] pl-3.5 leading-snug">
              Realized 30-day volatility aligns closely with forward options implied skew.
            </p>
            <div className="w-full bg-[#1c2b3c] h-1 rounded-full overflow-hidden ml-3.5 mr-2">
              <div className="bg-[#4d8eff] h-full rounded-full" style={{ width: '52%' }} ></div>
            </div>
          </div>

          {/* Factor 3: Drawdown Risk */}
          <div className="bg-[#0d1c2d] rounded-lg p-2.5 flex flex-col gap-1.5 border border-[#1c2b3c]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                <span className="text-[13px] text-[#d4e4fa] font-medium">Drawdown Support Floor</span>
              </div>
              <span className="font-mono text-[12px] text-[#4edea3] font-bold">
                ₹{currentStock.drawdownFloor.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[12px] text-[#c2c6d6] pl-3.5 leading-snug">
              Robust multi-month volume shelf presents controlled downside limit.
            </p>
            <div className="w-full bg-[#1c2b3c] h-1 rounded-full overflow-hidden ml-3.5 mr-2">
              <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '35%' }} ></div>
            </div>
          </div>

          {/* Factor 4: Model Prediction Uncertainty */}
          <div className="bg-[#0d1c2d] rounded-lg p-2.5 flex flex-col gap-1.5 border border-[#1c2b3c]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                <span className="text-[13px] text-[#d4e4fa] font-medium">Model Prediction Uncertainty</span>
              </div>
              <span className="font-mono text-[12px] text-[#4edea3] font-bold">
                Entropy {currentStock.uncertaintyEntropy}
              </span>
            </div>
            <p className="text-[12px] text-[#c2c6d6] pl-3.5 leading-snug">
              Low variance across 100 bootstrap runs confirms stable model agreement.
            </p>
            <div className="w-full bg-[#1c2b3c] h-1 rounded-full overflow-hidden ml-3.5 mr-2">
              <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '18%' }} ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
);
};