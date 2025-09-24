/**
 * Billing calculation logic for parking management
 */

/**
 * Calculates the parking duration in seconds
 * @param {Date} entryTime - When the car entered
 * @param {Date} exitTime - When the car exited
 * @returns {number} Duration in seconds
 */
export const calculateDuration = (entryTime, exitTime = new Date()) => {
  if (!entryTime) return 0;

  const start = new Date(entryTime); // normalize
  const end = new Date(exitTime); // normalize

  const durationMs = end.getTime() - start.getTime();
  return Math.floor(durationMs / 1000); // in seconds
};

/**
 * Computes complete billing information for a parking session
 * Pricing: $5 for initial 30 seconds, $1 for every additional 10 seconds
 * @param {Date} entryTime - When the car entered
 * @param {Date} exitTime - When the car exited (defaults to now)
 * @returns {{
 *   duration: number,
 *   amount: number,
 *   initialCharge: number,
 *   additionalIntervals: number,
 *   additionalCharge: number
 * }} Billing details
 */
export const computeBilling = (entryTime, exitTime = new Date()) => {
  const duration = calculateDuration(entryTime, exitTime);

  let amount = 0;
  let initialCharge = 0;
  let additionalIntervals = 0;
  let additionalCharge = 0;

  if (duration > 0) {
    // Always charge initial 30s as $5
    initialCharge = 5;
    amount = initialCharge;

    if (duration > 30) {
      const extra = duration - 30;
      additionalIntervals = Math.ceil(extra / 10); // 10s intervals
      additionalCharge = additionalIntervals * 1;
      amount += additionalCharge;
    }
  }

  return {
    duration,
    amount,
    initialCharge,
    additionalIntervals,
    additionalCharge,
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
    return remainingSeconds === 0
      ? `${minutes}m`
      : `${minutes}m ${remainingSeconds}s`;
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
