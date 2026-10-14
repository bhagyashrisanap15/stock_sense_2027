import React, { useState } from 'react';
import { HOTLINKED_ASSETS } from '../data/stocks';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgot,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('analyst@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFillGuest = () => {
    setEmail('dr.sharma@stocksense.ai');
    setPassword('XAI_Alpha_2025!');
  };

  const handleGoogleOAuth = () => {
    setEmail('dr.sharma@academic.org');
    setPassword('OAuthGoogleAuthVerified');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess('Dr. K. Sharma', email);
        onClose();
      }, 700);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#051424] flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 pt-safe bg-[#051424]/90 backdrop-blur-xl border-b border-[#1c2b3c] shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-md mx-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-10 h-10 -ml-1 flex items-center justify-center text-[#c2c6d6] hover:text-[#d4e4fa] rounded-lg hover:bg-[#1c2b3c] transition-colors"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[15px] text-[#d4e4fa] leading-none">
                  Stocksense Login
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#4d8eff]/20 text-[#adc6ff] text-[10px] font-semibold flex items-center gap-1 leading-none border border-[#4d8eff]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]"></span>
                  SECURE
                </span>
              </div>
              <span className="text-[11px] text-[#c2c6d6] leading-tight mt-0.5">
                StockSense Institutional AI
              </span>
            </div>
          </div>
          <div className="px-2 py-1 rounded bg-[#1c2b3c] text-[#c2c6d6] text-[11px] font-mono flex items-center gap-1.5 border border-[#273647]">
            <span className="material-symbols-outlined text-[13px] text-[#4edea3]">verified_user</span>
            <span>256-bit</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 pb-12 flex flex-col">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mt-1 mb-5">
          <div className="relative flex items-center justify-center mb-2.5">
            <div className="w-16 h-16 rounded-xl bg-[#1c2b3c] flex items-center justify-center p-2.5 shadow-lg border border-[#273647]">
              <img
                src={HOTLINKED_ASSETS.logo}
                alt="StockSense Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-[#3131c0] text-[#b0b2ff] text-[10px] font-semibold tracking-wide border border-[#3131c0]/50 font-mono">
              v1.4 JWT
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <h1 className="text-[22px] font-bold text-[#d4e4fa] tracking-tight">StockSense</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#00a572]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>Sandbox
            </span>
          </div>
          <p className="text-[14px] font-semibold text-[#adc6ff] max-w-xs mb-1">
            AI-powered stock analytics with transparent predictions.
          </p>
          <p className="text-[12px] text-[#c2c6d6] max-w-sm px-2 leading-relaxed">
            Access explainable machine learning models, quantitative backtests, and real-time SHAP feature attribution.
          </p>
        </div>

        {/* Card Form */}
        <div className="w-full bg-[#0d1c2d] rounded-xl p-4 shadow-xl flex flex-col relative overflow-hidden border border-[#1c2b3c]">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#adc6ff] via-[#4edea3] to-[#c0c1ff]"></div>

          <div className="flex flex-col mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#d4e4fa]">Welcome Back</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#122131] text-[#c2c6d6] text-[11px] font-mono flex items-center gap-1 border border-[#1c2b3c]">
                <span className="material-symbols-outlined text-[12px] text-[#adc6ff]">terminal</span>
                <span>Quant Auth</span>
              </span>
            </div>
            <p className="text-[12px] text-[#c2c6d6] mt-0.5">
              Sign in to access your quant workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#d4e4fa] flex items-center justify-between">
                <span>Institutional or Student Email</span>
                <span className="text-[#4edea3] text-[11px] font-mono">Verified SSO</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#c2c6d6] text-[18px] pointer-events-none">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@university.edu"
                  required
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#273647] text-[#d4e4fa] text-[13px] placeholder:text-[#8c909f] outline-none transition-colors border border-transparent focus:border-[#4d8eff]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-medium text-[#d4e4fa]">Password</label>
                <button
                  type="button"
                  onClick={onSwitchToForgot}
                  className="text-[11px] text-[#adc6ff] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#c2c6d6] text-[18px] pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-lg bg-[#273647] text-[#d4e4fa] text-[13px] placeholder:text-[#8c909f] outline-none transition-colors border border-transparent focus:border-[#4d8eff]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 w-8 h-8 flex items-center justify-center text-[#c2c6d6] hover:text-[#d4e4fa] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#273647] text-[#adc6ff] accent-[#adc6ff] cursor-pointer"
                />
                <span className="text-[12px] text-[#c2c6d6]">
                  Remember me <span className="font-mono text-[10px] text-[#8c909f]">(JWT 7-day token session)</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-2.5 px-4 rounded-lg bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#002e6a] font-semibold text-[14px] flex flex-col items-center justify-center shadow-md active:scale-[0.99] transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 py-1">
                  <span className="w-4 h-4 border-2 border-[#002e6a] border-t-transparent rounded-full animate-spin" />
                  <span>Validating Token Credentials...</span>
                </div>
              ) : success ? (
                <div className="flex items-center gap-1.5 py-1 text-[#002e6a]">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Access Granted • Entering Sandbox</span>
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 leading-tight">
                    <span>Sign In to StockSense</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#002e6a]/80 mt-0.5">
                    POST /api/auth/login • Encrypted
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="w-full h-[1px] bg-[#1c2b3c]" />
            <span className="relative px-3 bg-[#0d1c2d] text-[10px] uppercase font-semibold tracking-wider text-[#8c909f]">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleGoogleOAuth}
              className="w-full h-10 px-3 rounded-lg bg-[#122131] hover:bg-[#1c2b3c] transition-colors flex items-center justify-center gap-2 text-[#d4e4fa] text-[13px] border border-[#1c2b3c]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Guest autofill button */}
            <button
              type="button"
              onClick={handleFillGuest}
              className="w-full py-2 px-3 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] transition-colors flex items-center justify-between text-left border border-[#273647]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px] shrink-0">
                  science
                </span>
                <div className="flex flex-col min-w-0 truncate">
                  <span className="text-[12px] font-semibold text-[#d4e4fa] truncate">
                    Fill Guest Researcher Credentials
                  </span>
                  <span className="font-mono text-[10px] text-[#8c909f] truncate">
                    dr.sharma@stocksense.ai
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#122131] text-[#4edea3] text-[10px] font-mono font-bold shrink-0 border border-[#00a572]/30">
                AUTOFILL
              </span>
            </button>
          </div>

          <div className="mt-4 pt-3 flex flex-col items-center justify-center gap-1 text-center border-t border-[#1c2b3c]">
            <span className="text-[12px] text-[#c2c6d6]">Don't have an account?</span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[13px] font-semibold text-[#4edea3] hover:text-[#6ffbbe] transition-colors flex items-center gap-1"
            >
              <span>Create Free Researcher Account</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-3 p-3 rounded-lg bg-[#122131] flex items-start gap-2.5 shadow-sm border border-[#1c2b3c]">
          <span className="material-symbols-outlined text-[#adc6ff] text-[18px] shrink-0 mt-0.5">
            info
          </span>
          <p className="text-[11px] text-[#c2c6d6] leading-relaxed">
            <strong className="text-[#d4e4fa] font-medium">Notice:</strong> StockSense is an educational research testbed. Accounts grant read-only access to academic inference models and historical data simulations.
          </p>
        </div>

        {/* Footer Hash */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[#8c909f] text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> API Status: Nominal
          </span>
          <span>•</span>
          <span>SHA-256 Non-Custodial</span>
          <span>•</span>
          <span>XAI SHAP Kernel 3.12</span>
        </div>
      </main>
    </div>
  );
};
