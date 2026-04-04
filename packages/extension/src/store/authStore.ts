import { create } from 'zustand';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
  restore: () => Promise<void>;
}

const STORAGE_KEY = 'easy2fa_auth';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  isAuthenticated: false,

  login: (token: string, username: string) => {
    // Persist to chrome.storage.local
    chrome.storage.local.set({ [STORAGE_KEY]: { token, username } });
    set({ token, username, isAuthenticated: true });
  },

  logout: () => {
    chrome.storage.local.remove(STORAGE_KEY);
    set({ token: null, username: null, isAuthenticated: false });
  },

  restore: async () => {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const stored = result[STORAGE_KEY] as { token: string; username: string } | undefined;
      if (stored?.token) {
        set({ token: stored.token, username: stored.username, isAuthenticated: true });
      }
    } catch {
      // Not in extension context (e.g. dev server), skip
    }
  },
}));
