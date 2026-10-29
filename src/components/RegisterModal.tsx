import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess: (name: string, email: string) => void;
  onSkipRegister?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegisterSuccess,
  onSkipRegister
}) => {
  const [fullName, setFullName] = useState('Pooja Bhagwat');
  const [email, setEmail] = useState('pooja.investor@example.com');
  const [role, setRole] = useState<'Investor (Pro)' | 'Retail Trader' | 'Institutional'>('Investor (Pro)');
  const [password, setPassword] = useState('AlphaStock#2026');
  const [confirmPassword, setConfirmPassword] = useState('AlphaStock#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and email.');
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms of Service.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess(fullName.trim(), email.trim());
      onClose();
    }, 800);
  };

  const handleSkip = () => {
    if (onSkipRegister) {
      onSkipRegister();
    } else {
      onRegisterSuccess('Guest Explorer', 'guest@stocksense.ai');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-5 text-slate-800 dark:text-slate-100">
        
        {/* Top Header with Skip Button and Close */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 transition-colors cursor-pointer"
            title="Skip registration and browse immediately"
          >
            <span>Skip for Now →</span>
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
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Join 45,000+ Indian investors making AI-guided market decisions
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-3.5 text-xs">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Pooja Bhagwat"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-xs"
                required
              />
            </div>
          </div>

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
                placeholder="pooja@example.com"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-xs"
                required
              />
            </div>
          </div>

          {/* Account Profile Role */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Investor Profile Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Investor (Pro)', 'Retail Trader', 'Institutional'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer text-center ${
                    role === r
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all text-xs"
                required
              />
            </div>
            {password && confirmPassword && (
              <span className={`text-[11px] ${passwordsMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
              </span>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600"
            />
            <label htmlFor="terms" className="cursor-pointer select-none">
              I agree to the <span className="text-teal-600 underline">Terms of Service</span> and{' '}
              <span className="text-teal-600 underline">SEBI Risk Disclosures</span>.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !passwordsMatch || !termsAccepted}
            className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50 mt-1"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create StockSense Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Skip button at bottom */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Skip & Explore with ₹10L Virtual Money</span>
          </button>
        </div>

        {/* Switch to Login */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Log in here
          </button>
        </div>

      </div>
    </div>
  );
};
