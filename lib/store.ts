import { BusinessProfile, ComplianceItem, SmartAlert, ChatMessage, Notification } from './types';

const PROFILE_KEY = 'msme_business_profile';
const CHAT_KEY = 'msme_chat_history';
const AUTH_KEY = 'msme_auth_user';
const NOTIF_KEY = 'msme_notifications';

// Auth
export const saveAuth = (user: { name: string; email: string }) => {
  if (typeof window !== 'undefined') localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};
export const getAuth = (): { name: string; email: string } | null => {
  if (typeof window === 'undefined') return null;
  const d = localStorage.getItem(AUTH_KEY);
  return d ? JSON.parse(d) : null;
};
export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(CHAT_KEY);
  }
};

// Business Profile
export const saveProfile = (profile: BusinessProfile) => {
  if (typeof window !== 'undefined') localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};
export const getProfile = (): BusinessProfile | null => {
  if (typeof window === 'undefined') return null;
  const d = localStorage.getItem(PROFILE_KEY);
  return d ? JSON.parse(d) : null;
};

// Chat History
export const getChatHistory = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  const d = localStorage.getItem(CHAT_KEY);
  return d ? JSON.parse(d) : [];
};
export const saveChatHistory = (messages: ChatMessage[]) => {
  if (typeof window !== 'undefined') localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-50)));
};

// Notifications
export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  const d = localStorage.getItem(NOTIF_KEY);
  return d ? JSON.parse(d) : [];
};
export const saveNotifications = (notifs: Notification[]) => {
  if (typeof window !== 'undefined') localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
};
