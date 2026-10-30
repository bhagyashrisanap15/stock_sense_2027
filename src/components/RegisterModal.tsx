import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess: (name: string, email: string, isGuest?: boolean) => void;
  onSkipToGuest?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegisterSuccess,
  onSkipToGuest
}) => {
  const [fullName, setFullName] = useState('Pooja Bhagwat');
  const [email, setEmail] = useState('poojabhagwat2525@gmail.com');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('Investor@2025');
  const [confirmPassword, setConfirmPassword] = useState('Investor@2025');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms of Service to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setTimeout(() => {
      setIsSubmitting(false);
      onRegisterSuccess(fullName, email, false);
      onClose();
    }, 900);
  };

  const handleSkipAsGuest = () => {
    if (onSkipToGuest) {
      onSkipToGuest();
    } else {
      onRegisterSuccess('Guest Investor', 'guest@stocksense.in', true);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Top Skip as Guest Banner */}
        <div className="bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-cyan-500/15 px-5 py-3 border-b border-teal-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
              Want to test the app first?
            </span>
          </div>
          <button
            type="button"
            onClick={handleSkipAsGuest}
            className="text-xs font-extrabold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-100 flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>Skip Sign Up (Guest)</span>
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

        <div className="p-6 sm:p-7 flex flex-col gap-4">
          {/* Brand & Greeting */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create Free Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Includes ₹10,00,000 virtual paper trading capital and AI prediction signals.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Pooja Bhagwat"
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-slate-500 pointer-events-none">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full h-10 pl-12 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-10 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="termsCheck"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <label htmlFor="termsCheck" className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                I agree to the Terms of Service & acknowledge that AI predictions are probabilistic and not investment advice.
              </label>
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Start Investing Practice</span>
                </>
              )}
            </button>
          </form>

          {/* Prominent Skip Button */}
          <button
            type="button"
            onClick={handleSkipAsGuest}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Skip for Now & Explore as Guest</span>
          </button>

          {/* Switch to Login */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
