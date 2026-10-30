import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  ShieldCheck,
  Zap,
  LogIn
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
  onLoginSuccess: (name: string, email: string, isGuest?: boolean) => void;
  onSkipToGuest?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgot,
  onLoginSuccess,
  onSkipToGuest
}) => {
  const [email, setEmail] = useState('poojabhagwat2525@gmail.com');
  const [password, setPassword] = useState('Investor@2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginFeedback('Login successful! Redirecting...');
      setTimeout(() => {
        onLoginSuccess('Pooja Bhagwat', email, false);
        onClose();
      }, 600);
    }, 800);
  };

  const handleSkipAsGuest = () => {
    if (onSkipToGuest) {
      onSkipToGuest();
    } else {
      onLoginSuccess('Guest Investor', 'guest@stocksense.in', true);
    }
    onClose();
  };

  const handleQuickDemoFill = () => {
    setEmail('poojabhagwat2525@gmail.com');
    setPassword('Investor@2025');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Top Skip as Guest Banner */}
        <div className="bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-cyan-500/15 px-5 py-3 border-b border-teal-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
              New to StockSense?
            </span>
          </div>
          <button
            type="button"
            onClick={handleSkipAsGuest}
            className="text-xs font-extrabold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-100 flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>Skip Login (Guest)</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 flex flex-col gap-5">
          {/* Brand & Greeting */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome to StockSense
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Simple AI market insights, stock prices, and virtual trading for Indian retail investors.
            </p>
          </div>

          {/* Feedback Toast */}
          {loginFeedback && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{loginFeedback}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email / Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address or Mobile Number
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onSwitchToForgot}
                  className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span>Remember me on this browser</span>
              </label>

              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] text-slate-500 hover:text-teal-600 font-medium"
              >
                Auto-fill demo
              </button>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-70"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In to StockSense</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="bg-white dark:bg-[#121c2d] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
              or explore freely
            </span>
          </div>

          {/* Prominent Skip Button */}
          <button
            type="button"
            onClick={handleSkipAsGuest}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Continue as Guest (No Password Required)</span>
          </button>

          {/* Switch to Register */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Don't have an account yet? </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
