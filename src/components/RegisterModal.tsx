import React, { useState } from 'react';
import { HOTLINKED_ASSETS } from '../data/stocks';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess: (name: string, email: string) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegisterSuccess
}) => {
  const [fullName, setFullName] = useState('Dr. Priya Sharma');
  const [email, setEmail] = useState('priya@iitd.ac.in');
  const [role, setRole] = useState('academic');
  const [password, setPassword] = useState('AlphaQuant2024!');
  const [confirmPassword, setConfirmPassword] = useState('AlphaQuant2024!');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !termsAccepted) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onRegisterSuccess(fullName, email);
      onClose();
    }, 1100);
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
                  Stocksense Register
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
        <div className="flex flex-col items-center text-center mt-1 mb-5">
          <div className="relative flex items-center justify-center mb-2.5">
            <div className="w-14 h-14 rounded-xl bg-[#1c2b3c] flex items-center justify-center p-2 shadow-lg border border-[#273647]">
              <img
                src={HOTLINKED_ASSETS.logo}
                alt="StockSense Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00a572] flex items-center justify-center text-[#00311f]">
              <span className="material-symbols-outlined text-[10px]">analytics</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c2b3c] mb-2 border border-[#273647]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            <span className="text-[10px] font-semibold text-[#4edea3] tracking-wide uppercase">
              Researcher Registration • Open Access Sandbox
            </span>
          </div>

          <h1 className="text-[22px] font-bold text-[#d4e4fa] tracking-tight mb-1">
            Create Your Quant Account
          </h1>
          <p className="text-[12px] text-[#c2c6d6] max-w-sm px-2 leading-relaxed">
            Join students, researchers, and data scientists exploring transparent, explainable market AI.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="w-full bg-[#0d1c2d] rounded-xl p-4 shadow-xl flex flex-col gap-3.5 border border-[#1c2b3c]"
        >
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-[#c2c6d6] flex items-center gap-1">
              <span>Full Name</span>
              <span className="text-[#ffb4ab]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[18px] pointer-events-none">
                person
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Priya Sharma"
                required
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-[#051424] text-[#d4e4fa] text-[13px] placeholder:text-[#8c909f] outline-none transition-colors border border-[#1c2b3c] focus:border-[#4d8eff]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-[#c2c6d6] flex items-center gap-1">
              <span>Email Address</span>
              <span className="text-[#ffb4ab]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[18px] pointer-events-none">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@iitd.ac.in or personal email"
                required
                className="w-full h-11 pl-10 pr-9 rounded-lg bg-[#051424] text-[#d4e4fa] text-[13px] placeholder:text-[#8c909f] outline-none transition-colors border border-[#1c2b3c] focus:border-[#4d8eff]"
              />
              <span className="material-symbols-outlined absolute right-3 text-[#4edea3] text-[18px]">
                check_circle
              </span>
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-[#c2c6d6]">Role / Institution</label>
              <span className="text-[10px] text-[#8c909f]">Optional Academic</span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[18px] pointer-events-none">
                school
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-11 pl-10 pr-9 rounded-lg bg-[#051424] text-[#d4e4fa] text-[13px] outline-none transition-colors border border-[#1c2b3c] focus:border-[#4d8eff] appearance-none cursor-pointer"
              >
                <option value="academic">Student / Academic Researcher</option>
                <option value="hobbyist">Quant Hobbyist</option>
                <option value="engineer">Data Engineer</option>
                <option value="portfolio">Portfolio Risk Officer</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 text-[#8c909f] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-[#c2c6d6] flex items-center gap-1">
              <span>Create Password</span>
              <span className="text-[#ffb4ab]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[18px] pointer-events-none">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                className="w-full h-11 pl-10 pr-10 rounded-lg bg-[#051424] text-[#d4e4fa] text-[13px] placeholder:text-[#8c909f] outline-none transition-colors border border-[#1c2b3c] focus:border-[#4d8eff]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#8c909f] hover:text-[#d4e4fa]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Strength Meter */}
            <div className="bg-[#051424] p-2.5 rounded-lg flex flex-col gap-1.5 mt-1 border border-[#1c2b3c]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#c2c6d6]">Password Strength:</span>
                <span className="text-[#4edea3] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                  Strong (Level 3/4)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 w-full">
                <div className="h-1.5 rounded-full bg-[#4edea3]" />
                <div className="h-1.5 rounded-full bg-[#4edea3]" />
                <div className="h-1.5 rounded-full bg-[#4edea3]" />
                <div className="h-1.5 rounded-full bg-[#273647]" />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-[11px] text-[#4edea3]">
                <span className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  8+ characters
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Contains numbers
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Special symbols
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-[#c2c6d6] flex items-center gap-1">
              <span>Confirm Password</span>
              <span className="text-[#ffb4ab]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[18px] pointer-events-none">
                lock_clock
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="w-full h-11 pl-10 pr-10 rounded-lg bg-[#051424] text-[#d4e4fa] text-[13px] placeholder:text-[#8c909f] outline-none transition-colors border border-[#1c2b3c] focus:border-[#4d8eff]"
              />
              {passwordsMatch && (
                <div className="absolute right-3 flex items-center text-[#4edea3]">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
              )}
            </div>
            {passwordsMatch && (
              <span className="text-[11px] text-[#4edea3] pl-1">Passwords match</span>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="p-3 bg-[#051424] rounded-lg flex flex-col gap-1.5 border border-[#1c2b3c]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 rounded bg-[#1c2b3c] text-[#adc6ff] accent-[#adc6ff] cursor-pointer mt-0.5"
              />
              <span className="text-[12px] text-[#d4e4fa] leading-tight">
                I agree to the <span className="text-[#adc6ff] hover:underline">Terms of Service</span>, <span className="text-[#adc6ff] hover:underline">Academic Usage Policy</span>, and <span className="text-[#adc6ff] hover:underline">Privacy Policy</span>.
              </span>
            </label>
            <div className="flex items-start gap-1.5 pl-6 text-[11px] text-[#c2c6d6]">
              <span className="material-symbols-outlined text-[13px] text-[#8c909f] shrink-0 mt-0.5">info</span>
              <span>StockSense is strictly an educational tool. Predictions are not financial advice.</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              type="submit"
              disabled={isSubmitting || !passwordsMatch || !termsAccepted}
              className="w-full h-12 rounded-lg bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#002e6a] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Provisioning Quant Account...</span>
              ) : (
                <>
                  <span>Create Account & Access Models</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="font-mono text-[10px] text-[#8c909f]">
                POST /api/auth/register • Generates JWT Bearer Token
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="w-full h-[1px] bg-[#1c2b3c]" />
            <span className="absolute px-3 bg-[#0d1c2d] text-[10px] text-[#8c909f] uppercase tracking-wider font-semibold">
              OR SIGN UP WITH
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setFullName('Dr. Priya Sharma');
              setEmail('priya.sharma@research.ac.in');
            }}
            className="w-full h-11 rounded-lg bg-[#122131] hover:bg-[#1c2b3c] text-[#d4e4fa] text-[13px] flex items-center justify-center gap-2.5 transition-colors border border-[#1c2b3c]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Sign up with Google Workspace</span>
          </button>
        </form>

        <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[13px]">
          <span className="text-[#c2c6d6]">Already have an account?</span>
          <button
            onClick={onSwitchToLogin}
            className="font-semibold text-[#adc6ff] hover:underline inline-flex items-center gap-0.5"
          >
            <span>Sign In</span>
            <span className="material-symbols-outlined text-[15px]">north_east</span>
          </button>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-[#010f1f] flex items-center justify-between border border-[#1c2b3c]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[16px]">lock_open</span>
            <span className="text-[11px] text-[#c2c6d6]">Public Verification Key:</span>
          </div>
          <span className="font-mono text-[11px] text-[#adc6ff]">0x4F...79BC</span>
        </div>
      </main>
    </div>
  );
};
