import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  User,
  ArrowLeft
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
  onLoginSuccess: (name: string, email: string) => void;
  onSkipLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgot,
  onLoginSuccess,
  onSkipLogin
}) => {
  const [email, setEmail] = useState('poojabhagwat2525@gmail.com');
  const [password, setPassword] = useState('StockSense#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      const displayName = email.includes('pooja') ? 'Pooja Bhagwat' : email.split('@')[0];
      onLoginSuccess(displayName, email);
      onClose();
    }, 700);
  };

  const handleFillDemoInvestor = () => {
    setEmail('poojabhagwat2525@gmail.com');
    setPassword('StockSense#2026');
    setErrorMsg(null);
  };

  const handleFillDemoQuant = () => {
    setEmail('dr.sharma@stocksense.ai');
    setPassword('XAI_Alpha_2025!');
    setErrorMsg(null);
  };

  const handleSkip = () => {
    if (onSkipLogin) {
      onSkipLogin();
    } else {
      onLoginSuccess('Guest Explorer', 'guest@stocksense.ai');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-5 text-slate-800 dark:text-slate-100">
        
        {/* Top Bar with Skip Option and Close */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 transition-colors cursor-pointer"
            title="Skip sign-in and explore as guest"
          >
            <span>Skip Login →</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome to StockSense
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explainable AI stock market intelligence & quantitative risk dashboard
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-xs"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={onSwitchToForgot}
                className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600"
              />
              <span>Remember this device for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50 mt-1"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to StockSense</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Skip / Guest Option (Prominent) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>Continue as Guest Explorer (Skip Login)</span>
          </button>

          {/* Quick Demo Credentials */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <span>Fill Demo:</span>
            <button
              type="button"
              onClick={handleFillDemoInvestor}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
            >
              Pooja (Investor)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleFillDemoQuant}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
            >
              Quant Analyst
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Create free account
          </button>
        </div>

      </div>
    </div>
  );
};
