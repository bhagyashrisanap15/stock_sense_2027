import React from 'react';
import { ScreenTab } from '../types';

interface OverviewScreenProps {
  onNavigate: (tab: ScreenTab) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full text-[#d4e4fa] max-w-[1600px] xl:max-w-[1720px] mx-auto pb-8 space-y-8">
      {/* Laptop Hero & Live Analytics Preview Dual-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Hero & Project Scope */}
        <section className="lg:col-span-7 relative w-full pt-2 flex flex-col gap-4 overflow-hidden">
          {/* Ambient Visual Glow */}
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-[#4d8eff]/10 blur-3xl pointer-events-none" />
          <div className="absolute top-24 -right-12 w-56 h-56 rounded-full bg-[#00a572]/10 blur-3xl pointer-events-none" />

          {/* Educational Research Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#122131] rounded-full self-start shadow-sm border border-[#1c2b3c]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="text-[11px] font-semibold text-[#4edea3] tracking-wide">
              Academic Research Sandbox • B.Tech Capstone
            </span>
          </div>

          {/* Main Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] lg:text-[36px] font-bold text-[#d4e4fa] tracking-tight leading-tight">
              Understand Stock Trends with <span className="text-[#adc6ff]">Explainable AI</span>
            </h1>
            <p className="text-[14px] text-[#c2c6d6] leading-relaxed max-w-2xl">
              Analyze real-time market data, forecast directional volatility, and dissect the exact mathematical reasoning behind every prediction via SHAP feature attributions and LIME boundaries.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center justify-center gap-2 h-11 px-6 bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] font-semibold text-[14px] rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              <span>Explore Signals</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 h-11 px-5 bg-[#122131] hover:bg-[#1c2b3c] text-[#d4e4fa] text-[13px] font-medium rounded-xl transition-colors border border-[#1c2b3c]"
            >
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              <span>How It Works</span>
            </a>
          </div>

          {/* Proof Metric Strip */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col p-3 bg-[#0d1c2d] rounded-xl shadow-sm border border-[#1c2b3c]">
              <span className="font-mono text-[16px] text-[#4edea3] font-bold">99.4%</span>
              <span className="text-[11px] text-[#c2c6d6] truncate">API Uptime</span>
            </div>
            <div className="flex flex-col p-3 bg-[#0d1c2d] rounded-xl shadow-sm border border-[#1c2b3c]">
              <span className="font-mono text-[16px] text-[#adc6ff] font-bold">3 Ensembles</span>
              <span className="text-[11px] text-[#c2c6d6] truncate">XGB • RF • LSTM</span>
            </div>
            <div className="flex flex-col p-3 bg-[#0d1c2d] rounded-xl shadow-sm border border-[#1c2b3c]">
              <span className="font-mono text-[16px] text-[#c0c1ff] font-bold">SHAP+LIME</span>
              <span className="text-[11px] text-[#c2c6d6] truncate">Dual XAI Engine</span>
            </div>
          </div>
        </section>

        {/* Right Column (5 cols): Live Mini Analytics Preview Hero Card */}
        <section className="lg:col-span-5 w-full">
          <div className="w-full bg-[#122131] rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col gap-4 border border-[#1c2b3c]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#adc6ff] via-[#4edea3] to-[#c0c1ff]"></div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#1c2b3c] flex items-center justify-center text-[#adc6ff] border border-[#273647]">
                  <span className="material-symbols-outlined text-[24px]">candlestick_chart</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[17px] text-[#d4e4fa]">RELIANCE</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#273647] text-[#c2c6d6]">
                      NSE
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[15px] font-semibold text-[#d4e4fa]">
                      ₹2,850.40
                    </span>
                    <span className="text-[12px] font-mono text-[#4edea3] flex items-center">
                      <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
                      +1.42%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="px-2.5 py-1 rounded bg-[#00a572]/20 text-[#4edea3] flex items-center gap-1 border border-[#00a572]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                  <span className="text-[11px] font-bold tracking-wide uppercase">BULLISH (UP)</span>
                </div>
                <span className="text-[11px] text-[#c2c6d6] mt-1 font-mono">82% Confidence</span>
              </div>
            </div>

            {/* Sparkline Visual */}
            <div className="w-full h-24 bg-[#010f1f] rounded-xl p-2.5 flex flex-col justify-between relative overflow-hidden border border-[#1c2b3c]">
              <div className="flex justify-between items-center px-1">
                <span className="text-[11px] text-[#8c909f]">Intraday 5m Momentum</span>
                <span className="font-mono text-[11px] text-[#4edea3] font-semibold">Vol Surge +38%</span>
              </div>
              <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 40">
                <defs>
                  <linearGradient id="sparklineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 35 L 20 32 L 45 36 L 70 28 L 95 30 L 120 22 L 150 25 L 180 18 L 210 20 L 240 10 L 270 14 L 300 4"
                  fill="none"
                  stroke="#4edea3"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 35 L 20 32 L 45 36 L 70 28 L 95 30 L 120 22 L 150 25 L 180 18 L 210 20 L 240 10 L 270 14 L 300 4 L 300 40 L 0 40 Z"
                  fill="url(#sparklineGrad)"
                />
              </svg>
            </div>

            {/* SHAP Drivers + Risk Strip */}
            <div className="flex flex-col gap-2.5 bg-[#0d1c2d] p-3.5 rounded-xl border border-[#1c2b3c]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#c2c6d6] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-[#adc6ff]">psychology</span>
                  Top Positive SHAP Impact
                </span>
                <span className="font-mono text-[#4edea3] font-semibold">+0.57 net impact</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#d4e4fa]">RSI(14)</span>
                    <span className="font-mono text-[#4edea3] font-bold">+0.32</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#273647] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4edea3] rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#d4e4fa]">MACD Cross</span>
                    <span className="font-mono text-[#4edea3] font-bold">+0.25</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#273647] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4edea3] rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-[#1c2b3c]">
                <span className="text-[#8c909f]">Systemic Risk Score</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[#d4e4fa] font-bold">46 / 100</span>
                  <span className="px-2 py-0.5 rounded bg-[#273647] text-[#adc6ff] font-semibold text-[10px]">
                    MODERATE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Editorial Section Divider / Intro */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[20px] text-[#adc6ff]">auto_awesome</span>
          <h2 className="text-[18px] font-bold text-[#d4e4fa]">Architectural Capabilities</h2>
        </div>
        <p className="text-[12px] text-[#c2c6d6] mt-0.5 leading-relaxed">
          Institutional-grade intelligence pipelines designed for transparent algorithmic interpretation.
        </p>
      </div>

      {/* 6 Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-2 hover:bg-[#1c2b3c] transition-colors border border-[#1c2b3c]">
          <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/20 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
            <span className="material-symbols-outlined text-[22px]">trending_up</span>
          </div>
          <h3 className="font-semibold text-[15px] text-[#d4e4fa]">AI Trend Prediction</h3>
          <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
            Predict UP, DOWN, or NEUTRAL market trends across multi-day horizons using ensemble modeling across XGBoost, Random Forest, and stacked PyTorch LSTM sequences.
          </p>
          <div className="flex gap-1.5 pt-1">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#adc6ff] border border-[#1c2b3c]">
              XGBoost
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#adc6ff] border border-[#1c2b3c]">
              Random Forest
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#adc6ff] border border-[#1c2b3c]">
              LSTM
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-2 hover:bg-[#1c2b3c] transition-colors border border-[#1c2b3c]">
          <div className="w-10 h-10 rounded-lg bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center border border-[#00a572]/30">
            <span className="material-symbols-outlined text-[22px]">hub</span>
          </div>
          <h3 className="font-semibold text-[15px] text-[#d4e4fa]">Explainable AI (XAI)</h3>
          <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
            Deconstruct model black-boxes. SHAP Shapley values measure each indicator's exact contribution, while LIME generates localized linear approximation rules.
          </p>
          <div className="flex gap-1.5 pt-1">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#4edea3] border border-[#1c2b3c]">
              SHAP Attribution
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#4edea3] border border-[#1c2b3c]">
              LIME Bounds
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-2 hover:bg-[#1c2b3c] transition-colors border border-[#1c2b3c]">
          <div className="w-10 h-10 rounded-lg bg-[#93000a]/30 text-[#ffb4ab] flex items-center justify-center border border-[#93000a]/40">
            <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
          </div>
          <h3 className="font-semibold text-[15px] text-[#d4e4fa]">Risk Assessment</h3>
          <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
            Quantify downside risks before taking exposure with parametric 95% 1-Day Value-at-Risk (VaR), Annualized Historical Volatility, and Maximum Drawdown estimations.
          </p>
          <div className="flex gap-1.5 pt-1">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#ffb4ab] border border-[#1c2b3c]">
              95% 1-D VaR
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#ffb4ab] border border-[#1c2b3c]">
              Max Drawdown
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-2 hover:bg-[#1c2b3c] transition-colors border border-[#1c2b3c]">
          <div className="w-10 h-10 rounded-lg bg-[#3131c0]/30 text-[#c0c1ff] flex items-center justify-center border border-[#3131c0]/50">
            <span className="material-symbols-outlined text-[22px]">stacked_line_chart</span>
          </div>
          <h3 className="font-semibold text-[15px] text-[#d4e4fa]">Technical Analysis Engine</h3>
          <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
            Automated vectorization of 28+ quantitative signals including Wilder's RSI (14), MACD Histogram, Bollinger Bands, ATR, and triple moving average crossovers (20/50/200 SMA).
          </p>
          <div className="flex gap-1.5 pt-1">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#c0c1ff] border border-[#1c2b3c]">
              RSI & MACD
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#c0c1ff] border border-[#1c2b3c]">
              Bollinger Bands
            </span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-2 hover:bg-[#1c2b3c] transition-colors border border-[#1c2b3c]">
          <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/20 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
            <span className="material-symbols-outlined text-[22px]">newspaper</span>
          </div>
          <h3 className="font-semibold text-[15px] text-[#d4e4fa]">News & Sentiment Analysis</h3>
          <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
            Leverage FinBERT transformer models fine-tuned on corporate announcements and earnings releases to inject real-time market sentiment vectors directly into ML inputs.
          </p>
          <div className="flex gap-1.5 pt-1">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#adc6ff] border border-[#1c2b3c]">
              FinBERT NLP
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#adc6ff] border border-[#1c2b3c]">
              Live Sentiment
            </span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-2 hover:bg-[#1c2b3c] transition-colors border border-[#1c2b3c]">
          <div className="w-10 h-10 rounded-lg bg-[#273647] text-[#4edea3] flex items-center justify-center border border-[#1c2b3c]">
            <span className="material-symbols-outlined text-[22px]">history_edu</span>
          </div>
          <h3 className="font-semibold text-[15px] text-[#d4e4fa]">Prediction History & Audit</h3>
          <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
            Verify historic backtest performance with auditable logs, confusion matrices, precision/recall metrics, and downloadable regulatory research dossiers.
          </p>
          <div className="flex gap-1.5 pt-1">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#4edea3] border border-[#1c2b3c]">
              Audit Dossier
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#010f1f] text-[#4edea3] border border-[#1c2b3c]">
              Backtest Log
            </span>
          </div>
        </div>
      </section>

      {/* How It Works (5-Step Visual Process) */}
      <section className="flex flex-col gap-3" id="how-it-works">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#4edea3]">polyline</span>
            <h2 className="text-[18px] font-bold text-[#d4e4fa]">Inference Pipeline</h2>
          </div>
          <p className="text-[12px] text-[#c2c6d6]">
            Step-by-step quantitative execution from ingestion to model explainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {[
            {
              num: '01',
              title: 'Select Stock Ticker',
              desc: 'Query any NSE/BSE listed equity (e.g., RELIANCE, TCS, HDFCBANK) or index derivative.'
            },
            {
              num: '02',
              title: 'Collect Market Data',
              desc: 'Ingest normalized OHLCV time-series feeds and order book volume distributions across rolling windows.'
            },
            {
              num: '03',
              title: 'Calculate Technical Indicators',
              desc: 'High-speed Pandas & NumPy compute engines extract RSI, MACD, EMAs, and Bollinger bands into a 32-feature matrix.'
            },
            {
              num: '04',
              title: 'Run AI/ML Ensembles',
              desc: 'Asynchronous FastAPI services query parallel XGBoost trees and PyTorch LSTM networks to synthesize confidence logits.'
            },
            {
              num: '05',
              title: 'Explain Prediction & Risk',
              desc: 'Compute SHAP tree attribution trees, establish local decision boundaries via LIME, and simulate 95% VaR scenarios.'
            }
          ].map((step) => (
            <div
              key={step.num}
              className="flex flex-col gap-2.5 bg-[#122131] p-4 rounded-xl shadow-sm border border-[#1c2b3c]"
            >
              <div className="w-8 h-8 rounded-full bg-[#4d8eff] text-[#00285d] font-bold text-[12px] flex items-center justify-center shrink-0">
                {step.num}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-semibold text-[14px] text-[#d4e4fa]">{step.title}</h4>
                <p className="text-[12px] text-[#c2c6d6] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack Grid (12 Items) */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#c0c1ff]">memory</span>
            <h2 className="text-[18px] font-bold text-[#d4e4fa]">Technology Stack</h2>
          </div>
          <p className="text-[12px] text-[#c2c6d6]">
            Engineered with contemporary full-stack, distributed AI, and explainability frameworks.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[
            { name: 'React.js', role: 'UI Framework', desc: 'Component reactive system', icon: 'code', color: 'text-[#adc6ff]' },
            { name: 'Tailwind CSS', role: 'Design System', desc: 'Precision dark styling', icon: 'brush', color: 'text-[#adc6ff]' },
            { name: 'Node.js', role: 'Server Runtime', desc: 'Event-driven server core', icon: 'dns', color: 'text-[#4edea3]' },
            { name: 'Express.js', role: 'REST Gateway', desc: 'High-throughput routing', icon: 'route', color: 'text-[#4edea3]' },
            { name: 'MongoDB', role: 'NoSQL Store', desc: 'Watchlist & telemetry persistence', icon: 'database', color: 'text-[#4edea3]' },
            { name: 'Python 3.11', role: 'ML Core', desc: 'Mathematical execution engine', icon: 'terminal', color: 'text-[#c0c1ff]' },
            { name: 'FastAPI', role: 'Inference API', desc: 'Low-latency async microservice', icon: 'speed', color: 'text-[#c0c1ff]' },
            { name: 'Scikit-Learn', role: 'Feature Tools', desc: 'Normalization pipelines', icon: 'calculate', color: 'text-[#c0c1ff]' },
            { name: 'XGBoost', role: 'Gradient Boost', desc: 'High-accuracy tabular ensemble', icon: 'forest', color: 'text-[#adc6ff]' },
            { name: 'LSTM Model', role: 'PyTorch Deep Net', desc: 'Sequential time-series memory', icon: 'share', color: 'text-[#adc6ff]' },
            { name: 'SHAP', role: 'Feature Impact', desc: 'Shapley Additive exPlanations', icon: 'bar_chart', color: 'text-[#4edea3]' },
            { name: 'LIME', role: 'Local Bounds', desc: 'Local surrogate explanations', icon: 'rule', color: 'text-[#4edea3]' }
          ].map((tech) => (
            <div
              key={tech.name}
              className="bg-[#122131] p-3 rounded-lg flex flex-col gap-0.5 border border-[#1c2b3c]"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[13px] text-[#d4e4fa]">{tech.name}</span>
                <span className={`material-symbols-outlined text-[16px] ${tech.color}`}>
                  {tech.icon}
                </span>
              </div>
              <span className={`text-[10px] font-semibold ${tech.color}`}>{tech.role}</span>
              <span className="text-[11px] text-[#c2c6d6] leading-tight">{tech.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance & Research Scope */}
      <section className="bg-[#0d1c2d] p-3.5 rounded-xl flex items-start gap-3 shadow-sm border border-[#1c2b3c]">
        <span className="material-symbols-outlined text-[#adc6ff] text-[20px] shrink-0 mt-0.5">
          info
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[13px] text-[#d4e4fa]">
            Compliance & Research Scope
          </span>
          <p className="text-[12px] text-[#c2c6d6] leading-relaxed">
            StockSense is an academic research and educational demonstration project developed as a final-year engineering capstone. All directional signals, SHAP attributions, and risk metrics are generated from historical distributions and do not constitute financial advice, automated trade execution, or guaranteed investment returns.
          </p>
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="bg-[#1c2b3c] rounded-xl p-5 text-center flex flex-col items-center gap-3 shadow-lg border border-[#273647]">
        <div className="w-12 h-12 rounded-full bg-[#4d8eff]/20 text-[#adc6ff] flex items-center justify-center border border-[#4d8eff]/30">
          <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-bold text-[#d4e4fa]">
            Ready to explore explainable market analytics?
          </h3>
          <p className="text-[12px] text-[#c2c6d6]">
            Experience real-time inference on the NSE/BSE testbed.
          </p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] font-semibold text-[14px] rounded-lg shadow-md transition-all active:scale-[0.98]"
        >
          <span>Launch App Sandbox</span>
          <span className="material-symbols-outlined text-[18px]">insights</span>
        </button>
        <div className="pt-1 flex flex-col items-center gap-0.5 text-[11px] text-[#8c909f]">
          <span>Final-Year B.Tech Computer Engineering Capstone</span>
          <span className="text-[#c2c6d6]">StockSense • Open Source Explainable AI Architecture</span>
        </div>
      </section>
    </div>
  );
};
