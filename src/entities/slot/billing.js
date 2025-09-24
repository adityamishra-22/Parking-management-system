/**
 * Billing calculation logic for parking management
 */

/**
 * Calculates the parking duration in seconds
 * @param {Date} entryTime - When the car entered
 * @param {Date} exitTime - When the car exited
 * @returns {number} Duration in seconds
 */
export const calculateDuration = (entryTime, exitTime) => {
  const diffMs = exitTime.getTime() - entryTime.getTime();
  return Math.ceil(diffMs / 1000); // Convert to seconds and round up
};

/**
 * Calculates the parking amount based on duration
 * Pricing: $5 for initial 30 seconds, $1 for every additional 10 seconds
 * @param {number} durationSeconds - Duration in seconds
 * @returns {number} Amount to be charged in dollars
 */
export const calculateAmount = (durationSeconds) => {
  if (durationSeconds <= 0) return 0;
  
  // Initial 30 seconds: $5
  if (durationSeconds <= 30) {
    return 5;
  }
  
  // Additional intervals: $1 for every 10 seconds (or part thereof)
  const additionalSeconds = durationSeconds - 30;
  const additionalIntervals = Math.ceil(additionalSeconds / 10);
  return 5 + additionalIntervals;
};

/**
 * Computes complete billing information for a parking session
 * @param {Date} entryTime - When the car entered
 * @param {Date} exitTime - When the car exited (defaults to now)
 * @returns {{duration: number, amount: number}} Billing details
 */
export const computeBilling = (entryTime, exitTime = new Date()) => {
  const duration = calculateDuration(entryTime, exitTime);
  const amount = calculateAmount(duration);
  
  return {
    duration,
    amount,
  };
};

/**
 * Formats duration in a human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "1h 30m 45s", "2m 15s", "45s")
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  let result = `${hours}h`;
  if (remainingMinutes > 0) result += ` ${remainingMinutes}m`;
  if (remainingSeconds > 0) result += ` ${remainingSeconds}s`;
  
  return result;
};

/**
 * Formats currency amount
 * @param {number} amount - Amount in dollars
 * @returns {string} Formatted amount (e.g., "$150.00")
 */
export const formatAmount = (amount) => {
  return `$${amount.toFixed(2)}`;
};
