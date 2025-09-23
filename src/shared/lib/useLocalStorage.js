/**
 * Custom React hook for localStorage operations
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for localStorage with React state synchronization
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function, Function]} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Function to remove the value from localStorage
  const removeValue = useCallback(() => {
    try {
      // Remove from local storage
      window.localStorage.removeItem(key);
      
      // Reset state to initial value
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for managing localStorage with JSON serialization for complex objects
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value
 * @returns {[any, Function, Function, boolean]} [value, setValue, removeValue, isLoading]
 */
export const useLocalStorageState = (key, initialValue) => {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const setValueWithLoading = useCallback((newValue) => {
    setIsLoading(true);
    setValue(newValue);
    setIsLoading(false);
  }, [setValue]);

  return [value, setValueWithLoading, removeValue, isLoading];
};

/**
 * Hook for managing localStorage with automatic JSON date parsing
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value
 * @returns {[any, Function, Function]} [value, setValue, removeValue]
 */
export const useLocalStorageWithDates = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // Parse with date revival
        return JSON.parse(item, (k, v) => {
          if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
            return new Date(v);
          }
          return v;
        });
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Stringify with date serialization
      const serialized = JSON.stringify(valueToStore, (k, v) => {
        if (v instanceof Date) {
          return v.toISOString();
        }
        return v;
      });
      
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
