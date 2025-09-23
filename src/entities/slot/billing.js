/**
 * Billing calculation logic for parking management
 */

/**
 * Calculates the parking duration in minutes
 * @param {Date} entryTime - When the car entered
 * @param {Date} exitTime - When the car exited
 * @returns {number} Duration in minutes
 */
export const calculateDuration = (entryTime, exitTime) => {
  const diffMs = exitTime.getTime() - entryTime.getTime();
  return Math.ceil(diffMs / (1000 * 60)); // Convert to minutes and round up
};

/**
 * Calculates the parking amount based on duration
 * Pricing: ₹10 for first hour, ₹20 for each additional hour
 * @param {number} durationMinutes - Duration in minutes
 * @returns {number} Amount to be charged
 */
export const calculateAmount = (durationMinutes) => {
  if (durationMinutes <= 0) return 0;
  
  // First hour (up to 60 minutes): ₹10
  if (durationMinutes <= 60) {
    return 10;
  }
  
  // Additional hours: ₹20 per hour (or part thereof)
  const additionalHours = Math.ceil((durationMinutes - 60) / 60);
  return 10 + (additionalHours * 20);
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
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "1h 30m", "45m")
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Formats currency amount
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted amount (e.g., "₹150")
 */
export const formatAmount = (amount) => {
  return `₹${amount}`;
};
