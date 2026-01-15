/**
 * Local Storage Utility
 * 
 * Provides type-safe storage operations for tokens and user data
 * Handles JSON serialization/deserialization automatically
 */

import { YatraOption } from "@/components/admin/SelectYatra";

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'adminAccessToken',
  REFRESH_TOKEN: 'yatra_refresh_token',
  USER: 'yatra_user',
} as const;

/**
 * Get item from localStorage with type safety
 */
export const getStorageItem = <T = string>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    // Try to parse as JSON, otherwise return as string
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Set item in localStorage with automatic JSON stringification
 */
export const setStorageItem = (key: string, value: any): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
};

/**
 * Clear all app-related items from localStorage
 */
export const clearStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Token Management
export const tokenStorage = {
  getAccessToken: () => getStorageItem<string>(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token: string) => setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeAccessToken: () => removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN),
  
  getRefreshToken: () => getStorageItem<string>(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token: string) => setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: () => removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN),
  
  clearTokens: () => {
    removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

// User Management
export const userStorage = {
  getUser: <T = any>() => getStorageItem<T>(STORAGE_KEYS.USER),
  setUser: (user: any) => setStorageItem(STORAGE_KEYS.USER, user),
  removeUser: () => removeStorageItem(STORAGE_KEYS.USER),
};

// Yatra Management
export const yatraStorage = {
  getSelectedYatraId: (): string | null => {
    const id = getStorageItem<string>('admin_selected_yatra_id');
    return id || null;
  },
  setSelectedYatraId: (id: string) => {
    setStorageItem('admin_selected_yatra_id', id);
    // Remove the old admin_selected_yatra key if it exists
    removeStorageItem('admin_selected_yatra');
  },
  setSelectedYatra: (yatra: YatraOption | null) => {
    if (yatra) {
      // Only store the ID (UUID string), remove the full yatra object
      setStorageItem('admin_selected_yatra_id', yatra.id);
      removeStorageItem('admin_selected_yatra'); // Clean up old key
    } else {
      removeStorageItem('admin_selected_yatra_id');
      removeStorageItem('admin_selected_yatra');
    }
  },
  removeSelectedYatraId: () => {
    removeStorageItem('admin_selected_yatra_id');
    removeStorageItem('admin_selected_yatra'); // Clean up old key
  },
};

