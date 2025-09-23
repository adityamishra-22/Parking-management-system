/**
 * LocalStorage persistence utilities for parking management system
 */

const STORAGE_KEY = 'parking-management-state';

/**
 * Serializes dates in state for storage
 * @param {any} value - Value to serialize
 * @returns {any} Serialized value
 */
const serializeForStorage = (value) => {
  return JSON.stringify(value, (key, val) => {
    // Convert Date objects to ISO strings
    if (val instanceof Date) {
      return { __type: 'Date', value: val.toISOString() };
    }
    return val;
  });
};

/**
 * Deserializes dates from storage
 * @param {string} json - JSON string to deserialize
 * @returns {any} Deserialized value
 */
const deserializeFromStorage = (json) => {
  return JSON.parse(json, (key, val) => {
    // Convert ISO strings back to Date objects
    if (val && typeof val === 'object' && val.__type === 'Date') {
      return new Date(val.value);
    }
    return val;
  });
};

/**
 * Saves application state to localStorage
 * @param {import('../../entities/slot/types.js').AppState} state - State to save
 * @returns {boolean} Success status
 */
export const saveState = (state) => {
  try {
    const serialized = serializeForStorage(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
    return false;
  }
};

/**
 * Loads application state from localStorage
 * @returns {import('../../entities/slot/types.js').AppState|null} Loaded state or null
 */
export const loadState = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return deserializeFromStorage(serialized);
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
};

/**
 * Clears saved state from localStorage
 * @returns {boolean} Success status
 */
export const clearState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error);
    return false;
  }
};

/**
 * Checks if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Gets storage usage information
 * @returns {{used: number, available: boolean}} Storage info
 */
export const getStorageInfo = () => {
  if (!isStorageAvailable()) {
    return { used: 0, available: false };
  }
  
  try {
    const currentState = localStorage.getItem(STORAGE_KEY);
    const used = currentState ? new Blob([currentState]).size : 0;
    return { used, available: true };
  } catch (error) {
    return { used: 0, available: false };
  }
};
