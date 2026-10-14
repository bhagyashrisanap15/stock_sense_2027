import React, { useState } from 'react';
import { StockData } from '../types';

interface JsonDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStock: StockData;
}

export const JsonDossierModal: React.FC<JsonDossierModalProps> = ({
  isOpen,
  onClose,
  currentStock
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const payload = {
    meta: {
      api_version: "4.2.0-xai",
      timestamp: new Date().toISOString(),
      endpoint: `/api/v1/xai/explain/${currentStock.ticker}`,
      runtime_ms: 18.4,
      engine: "FastAPI + SHAP TreeExplainer v0.44"
    },
    equity: {
      ticker: currentStock.ticker,
      name: currentStock.name,
      exchange: currentStock.exchange,
      sector: currentStock.sector,
      market_cap_inr_cr: currentStock.marketCap,
      last_price: currentStock.price,
      change_pct: currentStock.changePercent
    },
    prediction: {
      direction: currentStock.direction,
      confidence_probability: currentStock.confidence / 100,
      active_model: currentStock.activeModel,
      backtest_precision: currentStock.winRate,
      baseline_expected_value: 0.50,
      net_shap_shift: 0.32
    },
    shap_attribution: currentStock.shapFactors.map(f => ({
      feature: f.feature,
      shap_value: f.impact,
      direction: f.impact >= 0 ? "BULLISH_PULL" : "BEARISH_DRAG"
    })),
    lime_local_rules: currentStock.limeRules.map(r => ({
      rule_predicate: r.rule,
      heuristic: r.explanation,
      marginal_probability_shift: r.shift
    })),
    risk_vector: {
      systemic_risk_score: currentStock.riskScore,
      category: currentStock.riskCategory,
      annualized_volatility: currentStock.annVolatility,
      max_drawdown_6m: currentStock.maxDrawdown,
      var_95_1day: currentStock.var95,
      sharpe_ratio: currentStock.sharpeRatio,
      beta_to_nifty: currentStock.beta,
      model_entropy: currentStock.uncertaintyEntropy
    }
  };

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#122131] w-full max-w-lg rounded-2xl shadow-2xl border border-[#1c2b3c] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#1c2b3c]/60 border-b border-[#1c2b3c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[22px]">code</span>
            <div>
              <h2 className="text-[16px] font-bold text-[#d4e4fa] leading-none">
                REST API JSON Dossier
              </h2>
              <span className="text-[11px] text-[#c2c6d6] mt-0.5 block font-mono">
                GET /api/v1/xai/explain/{currentStock.ticker}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#c2c6d6] hover:text-[#d4e4fa] hover:bg-[#273647] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-[#051424]">
          <pre className="font-mono text-[11px] text-[#adc6ff] leading-relaxed select-all">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#1c2b3c]/40 border-t border-[#1c2b3c] flex items-center justify-between">
          <span className="text-[11px] text-[#c2c6d6] font-mono">
            Content-Type: application/json; charset=utf-8
          </span>
          <button
            onClick={handleCopy}
            className="h-9 px-3 rounded-lg bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d] text-[12px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied Payload!' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
