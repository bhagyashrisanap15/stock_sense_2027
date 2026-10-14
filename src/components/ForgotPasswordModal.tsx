import React, { useState } from 'react';
import { HOTLINKED_ASSETS } from '../data/stocks';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const [recoveryEmail, setRecoveryEmail] = useState('analyst@mit.edu');
  const [otpSent, setOtpSent] = useState(true);
  const [timer, setTimer] = useState('04:32');
  const [newPassword, setNewPassword] = useState('Qk!93xAlpha_Vault');
  const [confirmPassword, setConfirmPassword] = useState('Qk!93xAlpha_Vault');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);

  if (!isOpen) return null;

  const handleSendOTP = () => {
    setOtpSent(true);
    setTimer('05:00');
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setUpdateComplete(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);
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
        {/* Top Branding */}
        <div className="flex flex-col items-center justify-center pt-1 pb-4">
          <div className="relative flex items-center justify-center mb-2.5">
            <div className="w-16 h-16 rounded-xl bg-[#1c2b3c] flex items-center justify-center shadow-lg p-2.5 border border-[#273647]">
              <img
                src={HOTLINKED_ASSETS.logo}
                alt="StockSense Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#122131] flex items-center justify-center shadow-md border border-[#273647]">
              <span
                className="material-symbols-outlined text-[#4edea3] text-[12px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_lock
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c2b3c] text-[#c2c6d6] text-[10px] tracking-wider uppercase font-semibold border border-[#273647]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4d8eff]"></span>
            QUANT AUTH RECOVERY • SHA-256 TOKEN
          </div>
        </div>

        <div className="px-1 mb-4 text-center">
          <h1 className="text-[22px] font-bold text-[#d4e4fa] tracking-tight leading-snug">
            Recover Access
          </h1>
          <p className="mt-1 text-[12px] text-[#c2c6d6] max-w-xs mx-auto leading-relaxed">
            Enter your registered academic or institutional email to receive a secure time-limited password reset link and 6-digit OTP verification code.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* STEP 1 CARD */}
          <section className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-3 border border-[#1c2b3c]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#adc6ff] text-[#002e6a] text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="font-semibold text-[14px] text-[#d4e4fa] tracking-tight">
                  Identify Institutional Account
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#1c2b3c] text-[#4edea3] text-[11px] font-mono flex items-center gap-1 border border-[#00a572]/30">
                <span className="w-1 h-1 rounded-full bg-[#4edea3]"></span>LIVE
              </span>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#c2c6d6] mb-1" htmlFor="recovery-email">
                Institutional or Student Email *
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[16px] pointer-events-none">
                  alternate_email
                </span>
                <input
                  id="recovery-email"
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="analyst@university.edu"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-[#051424] text-[#d4e4fa] text-[13px] placeholder:text-[#8c909f] outline-none border border-[#1c2b3c] focus:border-[#4d8eff]"
                />
              </div>
              <p className="text-[11px] text-[#8c909f] mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#adc6ff]">schedule</span>
                We will send a 15-minute recovery token to this address.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full h-10 rounded-lg bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#002e6a] text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-all"
            >
              <span>{otpSent ? 'Resend Recovery OTP & Link' : 'Send Recovery OTP & Link'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <div className="flex items-center justify-between font-mono text-[10px] text-[#8c909f] pt-0.5">
              <span>POST /api/auth/forgot-password</span>
              <span className="text-[#4edea3] font-semibold">Rate-limited (3/hr)</span>
            </div>
          </section>

          {/* STEP 2 CARD */}
          <section className="bg-[#122131] rounded-xl p-4 shadow-md flex flex-col gap-3.5 border border-[#1c2b3c]">
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#1c2b3c] text-[#adc6ff] text-[11px] font-bold flex items-center justify-center border border-[#273647]">
                  2
                </span>
                <span className="font-semibold text-[14px] text-[#d4e4fa] tracking-tight">
                  Verify Code & Set New Key
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#010f1f] text-[#c2c6d6] font-mono text-[11px] border border-[#1c2b3c]">
                <span className="material-symbols-outlined text-[12px] text-[#adc6ff] animate-pulse">timer</span>
                <span>{timer}</span>
              </div>
            </div>

            {/* 6-Digit OTP */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium text-[#c2c6d6]">
                  Enter 6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setTimer('05:00')}
                  className="text-[11px] text-[#adc6ff] hover:underline"
                >
                  Resend OTP
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {['4', '8', '2', '9'].map((digit, i) => (
                  <div
                    key={i}
                    className="h-11 rounded-lg bg-[#0d1c2d] flex items-center justify-center text-[18px] text-[#d4e4fa] font-bold font-mono border border-[#1c2b3c]"
                  >
                    {digit}
                  </div>
                ))}
                <div className="h-11 rounded-lg bg-[#010f1f] flex items-center justify-center text-[#adc6ff] border border-[#1c2b3c]">
                  <span className="w-2 h-2 rounded-full bg-[#adc6ff] animate-ping" />
                </div>
                <div className="h-11 rounded-lg bg-[#010f1f] flex items-center justify-center text-[#8c909f] border border-[#1c2b3c]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#424754]" />
                </div>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[12px] font-medium text-[#c2c6d6] mb-1" htmlFor="new-pass">
                New Quant Password *
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[16px] pointer-events-none">
                  lock
                </span>
                <input
                  id="new-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-10 rounded-lg bg-[#051424] text-[#d4e4fa] text-[13px] outline-none border border-[#1c2b3c] focus:border-[#4d8eff]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 text-[#8c909f] hover:text-[#d4e4fa] p-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Entropy Meter */}
              <div className="mt-2 bg-[#010f1f] p-2 rounded-lg flex flex-col gap-1 border border-[#1c2b3c]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#c2c6d6]">Calculated Entropy:</span>
                  <span className="text-[#4edea3] font-semibold flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                    Strong (3/4)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1.5 w-full">
                  <div className="rounded-full bg-[#4edea3]" />
                  <div className="rounded-full bg-[#4edea3]" />
                  <div className="rounded-full bg-[#4edea3]" />
                  <div className="rounded-full bg-[#273647]" />
                </div>
                <div className="grid grid-cols-3 gap-1 pt-0.5 text-[11px]">
                  <span className="flex items-center gap-0.5 text-[#4edea3]">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> 8+ chars
                  </span>
                  <span className="flex items-center gap-0.5 text-[#4edea3]">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> Special #
                  </span>
                  <span className="flex items-center gap-0.5 text-[#8c909f]">
                    <span className="material-symbols-outlined text-[12px]">radio_button_unchecked</span> Salted ID
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[12px] font-medium text-[#c2c6d6]" htmlFor="confirm-pass">
                  Confirm New Password *
                </label>
                <span className="inline-flex items-center gap-1 text-[#4edea3] text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check
                  </span>{' '}
                  Passwords match
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#8c909f] text-[16px] pointer-events-none">
                  lock_reset
                </span>
                <input
                  id="confirm-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-10 rounded-lg bg-[#051424] text-[#d4e4fa] text-[13px] outline-none border border-[#1c2b3c] focus:border-[#4d8eff]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={isUpdating}
              className={`w-full h-11 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] mt-0.5 ${
                updateComplete
                  ? 'bg-[#00a572] text-[#00311f]'
                  : 'bg-[#4d8eff] hover:bg-[#adc6ff] text-[#00285d]'
              }`}
            >
              {isUpdating ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#00285d] border-t-transparent rounded-full animate-spin" />
                  <span>Synchronizing Credentials...</span>
                </>
              ) : updateComplete ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Password Updated • Redirecting...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  <span>Update Password & Re-authenticate</span>
                </>
              )}
            </button>
            <div className="text-center font-mono text-[10px] text-[#8c909f]">
              POST /api/auth/reset-password
            </div>
          </section>

          {/* Policy Notice */}
          <div className="bg-[#0d1c2d] rounded-xl p-3.5 shadow-sm flex items-start gap-2.5 border border-[#1c2b3c]">
            <div className="w-8 h-8 rounded-lg bg-[#1c2b3c] flex items-center justify-center shrink-0 text-[#c0c1ff] border border-[#273647]">
              <span className="material-symbols-outlined text-[18px]">domain_verification</span>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-[13px] text-[#d4e4fa] leading-tight">
                SSO & Federation Policy
              </span>
              <p className="text-[11px] text-[#c2c6d6] leading-relaxed">
                If your institutional domain uses custom SSO, Shibboleth, or hardware 2FA, contact your department administrator or quant sandbox supervisor for manual token invalidation.
              </p>
            </div>
          </div>

          {/* Node telemetry */}
          <div className="bg-[#010f1f] rounded-xl p-2.5 flex items-center justify-between text-[#c2c6d6] font-mono text-[11px] border border-[#1c2b3c]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="text-[#d4e4fa] truncate">NODE: auth-gateway-ny4.stocksense.internal</span>
            </div>
            <span className="text-[#8c909f] uppercase text-[10px]">TLS 1.3</span>
          </div>

          <div className="pt-2 text-center flex flex-col items-center gap-1.5">
            <p className="text-[13px] text-[#c2c6d6]">
              Remember your credentials?
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#adc6ff] font-semibold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
            <span className="font-mono text-[10px] text-[#8c909f] tracking-wide select-all mt-1">
              PUB_KEY: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
