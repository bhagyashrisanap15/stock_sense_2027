import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Settings,
  Bell,
  Mail,
  Phone,
  Lock,
  LogOut,
  Edit3,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building,
  TrendingUp,
  Sliders,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Download,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Key,
  Save,
  X
} from 'lucide-react';
import { UserProfile, ScreenTab } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  onNavigate: (tab: ScreenTab) => void;
}

type ProfileTab = 'overview' | 'kyc' | 'preferences' | 'security';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showPan, setShowPan] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editRiskTolerance, setEditRiskTolerance] = useState(user.riskTolerance);
  const [editHorizon, setEditHorizon] = useState(user.investmentHorizon);
  const [editExperience, setEditExperience] = useState(user.tradingExperience);
  const [editExchange, setEditExchange] = useState(user.preferredExchange);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: editName.trim() || user.name,
      email: editEmail.trim() || user.email,
      phone: editPhone.trim(),
      avatarInitials: (editName.trim()[0] || 'U').toUpperCase(),
      riskTolerance: editRiskTolerance,
      investmentHorizon: editHorizon,
      tradingExperience: editExperience,
      preferredExchange: editExchange
    };
    onUpdateUser(updated);
    setIsEditing(false);
    showNotification('Profile information updated successfully!');
  };

  const handleToggleTwoFactor = () => {
    const updated: UserProfile = {
      ...user,
      twoFactorEnabled: !user.twoFactorEnabled
    };
    onUpdateUser(updated);
    showNotification(
      updated.twoFactorEnabled ? 'Two-Factor Authentication enabled!' : 'Two-Factor Authentication disabled.'
    );
  };

  const handleToggleEmailAlerts = () => {
    const updated: UserProfile = {
      ...user,
      emailAlerts: !user.emailAlerts
    };
    onUpdateUser(updated);
    showNotification(
      updated.emailAlerts ? 'Email price alerts turned ON.' : 'Email price alerts turned OFF.'
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 text-slate-800 dark:text-slate-100 animate-fadeIn">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-teal-600 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Guest Mode Banner */}
      {user.isGuest && (
        <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/40 dark:via-cyan-950/30 dark:to-blue-950/40 border border-teal-200/80 dark:border-teal-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                You are currently exploring as a Guest Explorer
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create an account or log in to sync custom watchlists, unlock AI portfolio backtests, and save price alerts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              Register Free
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Profile Card */}
      <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Avatar & Info */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0 border-2 border-white dark:border-slate-800">
            {user.avatarInitials}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60">
                {user.accountType}
              </span>
              {user.kycStatus === 'VERIFIED' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>KYC Verified</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>KYC Pending</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Joined {user.memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-teal-600" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          {user.isGuest ? (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Edit Profile Modal / Section */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-[#121c2d] border border-teal-300 dark:border-teal-700 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4 animate-scaleIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-teal-600" />
              <span>Edit Account Information</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Full Legal Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Phone Number (WhatsApp Alert Linked)
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Risk Tolerance
              </label>
              <select
                value={editRiskTolerance}
                onChange={(e) => setEditRiskTolerance(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
              >
                <option value="Conservative">Conservative (Preservation First)</option>
                <option value="Moderate">Moderate (Steady Growth & Quality)</option>
                <option value="Aggressive">Aggressive (High Momentum & Alpha)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Investment Horizon
              </label>
              <select
                value={editHorizon}
                onChange={(e) => setEditHorizon(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
              >
                <option value="Short-Term (< 1 yr)">Short-Term (&lt; 1 Year)</option>
                <option value="Medium-Term (1-3 yrs)">Medium-Term (1-3 Years)</option>
                <option value="Long-Term (3-5+ yrs)">Long-Term (3-5+ Years)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Preferred Exchange
              </label>
              <select
                value={editExchange}
                onChange={(e) => setEditExchange(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
              >
                <option value="NSE">NSE (National Stock Exchange)</option>
                <option value="BSE">BSE (Bombay Stock Exchange)</option>
                <option value="BOTH">Dual Exchange (NSE + BSE)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. Navigation Tabs for Profile Deep-Dive */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview' as ProfileTab, label: 'Overview & Stats', icon: TrendingUp },
          { id: 'kyc' as ProfileTab, label: 'KYC & Demat Account', icon: CreditCard },
          { id: 'preferences' as ProfileTab, label: 'Trading & AI Preferences', icon: Sliders },
          { id: 'security' as ProfileTab, label: 'Security & Access Log', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          {/* Key Account Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Virtual Sandbox Cash</span>
                <Wallet className="w-4 h-4 text-teal-600" />
              </div>
              <div className="mt-2">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  ₹{user.virtualCash.toLocaleString('en-IN')}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Available for Practice Trading</p>
              </div>
              <button
                onClick={() => onNavigate('paper-trading')}
                className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Sandbox</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Risk Profile</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2">
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {user.riskTolerance}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Balanced capital preservation</p>
              </div>
              <button
                onClick={() => onNavigate('risk-radar')}
                className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Risk Radar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Investment Horizon</span>
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {user.investmentHorizon}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Optimal for compounding</p>
              </div>
              <button
                onClick={() => onNavigate('portfolio')}
                className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Portfolio NAV</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">AI Prediction Tier</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-2">
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  XGBoost + LSTM
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Dual-Ensemble SHAP Enabled</p>
              </div>
              <button
                onClick={() => onNavigate('ai-predict')}
                className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Forecasts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts to Platform Modules */}
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Platform Features & Quick Jump
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate('watchlist')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600">
                    My Saved Watchlist
                  </span>
                  <span className="text-[11px] text-slate-400">8 Indian equities tracked</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('screener')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600">
                    NSE Stock Screener
                  </span>
                  <span className="text-[11px] text-slate-400">500+ stocks filtered</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('learn')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600">
                    Learning Academy
                  </span>
                  <span className="text-[11px] text-slate-400">Beginner to Pro Guides</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KYC & DEMAT ACCOUNT */}
      {activeTab === 'kyc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" />
                <span>Identity & Taxation Details</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">PAN Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {showPan ? 'ABCDE1234F' : user.panMasked || 'ABCDE****F'}
                  </span>
                  <button
                    onClick={() => setShowPan(!showPan)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPan ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Aadhaar Verification</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  UIDAI DigiLocker Linked
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">SEBI Investor Categorization</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Individual Resident (Indian)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" />
                <span>Linked Demat & Bank Account</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Active DP
              </span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Depository Participant</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  CDSL (Central Depository Services)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Demat Account Number</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {user.dematAccount || '1208160089234512'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Primary Bank Mandate</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  HDFC Bank (A/C ****4821)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRADING & AI PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Trading Engine & Notification Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Preferred Exchange */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Default Market Feed</span>
                <span className="text-slate-400 mt-0.5">NSE Consolidated (National Stock Exchange)</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 font-bold font-mono">
                {user.preferredExchange}
              </span>
            </div>

            {/* Email Alerts Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Real-Time Email Price Alerts</span>
                <span className="text-slate-400 mt-0.5">Send alerts when triggers are hit</span>
              </div>
              <button
                onClick={handleToggleEmailAlerts}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  user.emailAlerts ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    user.emailAlerts ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* AI Reasoning Mode */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">AI Reasoning Model</span>
                <span className="text-slate-400 mt-0.5">Dual-Ensemble SHAP + LIME Rules</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 font-bold">
                XGBoost v2.4
              </span>
            </div>

            {/* Trading Experience Level */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Trading Experience Level</span>
                <span className="text-slate-400 mt-0.5">Adapts dashboard UI complexity</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                {user.tradingExperience}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & ACCESS LOG */}
      {activeTab === 'security' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>Authentication & Security Hardening</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* 2FA Toggle */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Two-Factor Authentication (2FA)
                  </span>
                  <span className="text-slate-400 mt-0.5">
                    Requires authenticator code on new device login
                  </span>
                </div>
                <button
                  onClick={handleToggleTwoFactor}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    user.twoFactorEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      user.twoFactorEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Password update link */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-white">Account Password</span>
                  <span className="text-slate-400 mt-0.5">Last updated 42 days ago</span>
                </div>
                <button
                  onClick={() => showNotification('Password reset link sent to your registered email.')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-[#121c2d] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Active Sessions & Device Audit Log
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Current Browser (Chrome 128 / Linux x86_64)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Mumbai, Maharashtra, India • IP 103.21.***.*** • Active Now
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Current Session
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between opacity-75">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Mobile App (iOS 18 / iPhone 15 Pro)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Bengaluru, Karnataka, India • Yesterday at 4:15 PM
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">Terminated</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
