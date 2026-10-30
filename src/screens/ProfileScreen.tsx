import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Settings,
  Bell,
  Lock,
  Smartphone,
  CreditCard,
  Building,
  Edit3,
  Save,
  RotateCcw,
  LogOut,
  LogIn,
  Download,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  Award,
  Clock,
  HelpCircle
} from 'lucide-react';
import { UserProfile, ScreenTab } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetPortfolio: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  onNavigate: (tab: ScreenTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  watchlistCount?: number;
  onExportCSV?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onResetPortfolio,
  onLogout,
  onOpenAuth,
  onNavigate,
  theme,
  toggleTheme,
  watchlistCount = 8,
  onExportCSV
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPan, setShowPan] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form edit states
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [city, setCity] = useState(userProfile.city || 'Mumbai, Maharashtra');
  const [occupation, setOccupation] = useState(userProfile.occupation || 'Private Sector / Tech');
  const [experience, setExperience] = useState(userProfile.tradingExperience);
  const [riskProfile, setRiskProfile] = useState(userProfile.riskProfile);
  const [chartStyle, setChartStyle] = useState(userProfile.chartDefaultStyle);
  const [exchange, setExchange] = useState(userProfile.preferredExchange);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateProfile({
      name,
      email,
      phone,
      city,
      occupation,
      tradingExperience: experience,
      riskProfile,
      chartDefaultStyle: chartStyle,
      preferredExchange: exchange
    });
    setIsEditing(false);
    triggerToast('Profile and preferences updated successfully!');
  };

  const virtualFunds = userProfile.virtualCapital ?? userProfile.virtualCash ?? 1000000;
  const panStr = userProfile.panNumber || userProfile.panMasked || 'ABCDE1234F';

  const handleAddVirtualCash = () => {
    const updatedFunds = virtualFunds + 100000;
    onUpdateProfile({ virtualCapital: updatedFunds, virtualCash: updatedFunds });
    triggerToast('Added ₹1,00,000 practice funds to your Demat balance.');
  };

  const handleResetFunds = () => {
    if (window.confirm('Reset virtual practice balance to ₹10,00,000?')) {
      onResetPortfolio();
      onUpdateProfile({ virtualCapital: 1000000, virtualCash: 1000000 });
      triggerToast('Portfolio reset to initial ₹10,00,000 balance.');
    }
  };

  const maskedPan = showPan
    ? panStr
    : panStr.length > 5
    ? `${panStr.slice(0, 3)}••••${panStr.slice(-2)}`
    : panStr;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Guest Mode Alert Banner */}
      {userProfile.isGuest && (
        <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                You are currently exploring as a Guest
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                You have full access to ₹10,00,000 practice trading and AI predictions. Sign in to sync across devices.
              </span>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Create Account</span>
          </button>
        </div>
      )}

      {/* 1. Profile Header Card */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar with status indicator */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-md border-2 border-white dark:border-[#121c2d]">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#121c2d] flex items-center justify-center text-[10px] text-white ${
                userProfile.isGuest ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              title={userProfile.isGuest ? 'Guest Session' : 'Active Account'}
            >
              ✓
            </span>
          </div>

          {/* User Details */}
          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {userProfile.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 border ${
                  userProfile.kycStatus === 'Verified'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                }`}
              >
                {userProfile.kycStatus === 'Verified' ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5" />
                )}
                <span>KYC {userProfile.kycStatus}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800">
                {userProfile.isGuest ? 'Sandbox Guest' : 'Pro Investor Tier'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>{userProfile.email}</span>
              <span>•</span>
              <span>{userProfile.phone}</span>
              <span>•</span>
              <span>Joined {userProfile.joinDate}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                CDSL BO: {userProfile.dematAccount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-teal-600" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          {userProfile.isGuest ? (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Virtual Capital & Demat Holdings Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Virtual Funds */}
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Practice Funds Balance
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹{virtualFunds.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              Demo capital for zero-risk practice
            </span>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleAddVirtualCash}
              className="flex-1 py-1.5 px-2 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-[11px] font-semibold text-center transition-colors cursor-pointer"
            >
              + Add ₹1 Lakh
            </button>
            <button
              onClick={handleResetFunds}
              title="Reset to ₹10,00,000"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Total Trades & Experience */}
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Paper Trading Activity
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {userProfile.totalTrades} Orders
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Win rate: <strong className="text-emerald-600">{userProfile.winRate}%</strong> across NSE
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('paper-trading')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>View Trade Book</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Watchlist & Portfolio */}
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Saved Stocks Watchlist
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {watchlistCount} Tickers
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Live tracking NIFTY 50 leaders
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('watchlist')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Open Watchlist</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Risk Tolerance Profile */}
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Risk Profile & Style
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {userProfile.riskProfile}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {userProfile.tradingExperience} Level • {userProfile.chartDefaultStyle === 'line' ? 'Line Chart' : 'Candlestick'}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('risk-radar')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Check Risk Radar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Edit Form vs View Mode */}
      {isEditing ? (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-[#121c2d] border border-teal-500/40 rounded-2xl p-6 shadow-md flex flex-col gap-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Personal & Investment Profile
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Changes are saved to your local session
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mobile Number (+91)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Trading Experience Level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Stock Market Experience
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Beginner">Beginner (Learning the basics)</option>
                <option value="Intermediate">Intermediate (1-3 years of investing)</option>
                <option value="Advanced">Advanced (Experienced active trader)</option>
              </select>
            </div>

            {/* Risk Profile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Risk Tolerance
              </label>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Conservative">Conservative (Prioritize capital safety, lower volatility)</option>
                <option value="Balanced">Balanced (Steady long-term growth with moderate risk)</option>
                <option value="Aggressive">Aggressive (High growth focus, comfortable with market swings)</option>
              </select>
            </div>

            {/* Default Chart View */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Default Chart Display
              </label>
              <select
                value={chartStyle}
                onChange={(e) => setChartStyle(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
              >
                <option value="line">Line / Area Chart (Simple & beginner-friendly)</option>
                <option value="candlestick">Candlestick Chart (Open, High, Low, Close)</option>
              </select>
            </div>

            {/* Preferred Exchange */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primary Indian Exchange
              </label>
              <select
                value={exchange}
                onChange={(e) => setExchange(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition-colors"
              >
                <option value="NSE">NSE (National Stock Exchange of India)</option>
                <option value="BSE">BSE (Bombay Stock Exchange)</option>
                <option value="BOTH">Both (NSE & BSE)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* View Details Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Demat & Regulatory Details */}
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Demat & Regulatory Information
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                SEBI Compliant
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">CDSL Demat BO ID</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {userProfile.dematAccount}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Clearing Broker</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {userProfile.broker}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">PAN Card</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-semibold text-slate-900 dark:text-white">{maskedPan}</span>
                  <button
                    type="button"
                    onClick={() => setShowPan(!showPan)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                    title={showPan ? 'Hide PAN' : 'Show PAN'}
                  >
                    {showPan ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Primary Bank Mandate</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {userProfile.bankAccount}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Registered City</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {userProfile.city}
                </span>
              </div>
            </div>

            <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Your virtual portfolio operates in an isolated regulatory sandbox. Simulated orders do not execute real money trades on NSE/BSE.
              </span>
            </div>
          </div>

          {/* Right Column: Preferences & Security Controls */}
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  App Preferences & Security
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Instant Sync</span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    App Theme Mode
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Currently in {theme === 'light' ? 'Clean White Light' : 'Deep Space Dark'} mode
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-teal-600" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              {/* Price Alerts Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Stock Price Alerts
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Get notified when tracked stocks cross breakout levels
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.priceAlertsEnabled}
                    onChange={(e) => {
                      onUpdateProfile({ priceAlertsEnabled: e.target.checked });
                      triggerToast(e.target.checked ? 'Price alerts enabled' : 'Price alerts paused');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* 2FA Security Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Two-Factor Authentication (2FA)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Require OTP / Auth App confirmation for portfolio transactions
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.twoFactorEnabled}
                    onChange={(e) => {
                      onUpdateProfile({ twoFactorEnabled: e.target.checked });
                      triggerToast(e.target.checked ? 'Two-Factor Auth activated' : '2FA disabled');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Biometric / Quick Pin */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    App Biometrics & PIN
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Unlock with fingerprint, Face ID or 4-digit PIN
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.biometricLogin}
                    onChange={(e) => {
                      onUpdateProfile({ biometricLogin: e.target.checked });
                      triggerToast(e.target.checked ? 'Biometric security activated' : 'Biometrics turned off');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Data Export Button */}
              {onExportCSV && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={onExportCSV}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-teal-600" />
                    <span>Export Trading Statement & Watchlist (CSV)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Beginner Learning & Support Links */}
      <div className="bg-slate-50 dark:bg-[#0c1524] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Need help understanding Indian Stock Market terms?
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Check our Beginner's Academy for simple explanations of P/E ratios, RSI, AI predictions, and risk management.
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('learn')}
          className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open Learn Screen</span>
          <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
        </button>
      </div>
    </div>
  );
};
