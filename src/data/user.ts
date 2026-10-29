import { UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_8921a4f0',
  name: 'Pooja Bhagwat',
  email: 'poojabhagwat2525@gmail.com',
  phone: '+91 98234 56789',
  avatarInitials: 'P',
  accountType: 'Investor (Pro)',
  isGuest: false,
  memberSince: 'March 2024',
  kycStatus: 'VERIFIED',
  panMasked: 'ABCDE****F',
  dematAccount: '1208160089234512',
  riskTolerance: 'Moderate',
  investmentHorizon: 'Long-Term (3-5+ yrs)',
  tradingExperience: 'Intermediate (1-3 yrs)',
  preferredExchange: 'NSE',
  virtualCash: 1000000,
  twoFactorEnabled: true,
  emailAlerts: true,
  whatsappAlerts: false,
  themePreference: 'light'
};

export const GUEST_USER_PROFILE: UserProfile = {
  id: 'usr_guest_demo',
  name: 'Guest Explorer',
  email: 'guest@stocksense.ai',
  phone: '',
  avatarInitials: 'G',
  accountType: 'Guest Explorer',
  isGuest: true,
  memberSince: 'October 2026',
  kycStatus: 'NOT_STARTED',
  panMasked: 'Not linked',
  dematAccount: 'Demo Account (₹10L Sandbox)',
  riskTolerance: 'Moderate',
  investmentHorizon: 'Medium-Term (1-3 yrs)',
  tradingExperience: 'Beginner (<1 yr)',
  preferredExchange: 'NSE',
  virtualCash: 1000000,
  twoFactorEnabled: false,
  emailAlerts: false,
  whatsappAlerts: false,
  themePreference: 'light'
};

const STORAGE_KEY = 'stocksense_active_user_v2';

export function getStoredUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not read user profile from storage', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveStoredUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Could not save user profile to storage', e);
  }
}
