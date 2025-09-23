/**
 * Utility functions for slot management
 */

/**
 * Finds a slot by its ID
 * @param {import('./types.js').Slot[]} slots - Array of slots
 * @param {number} slotId - ID to search for
 * @returns {import('./types.js').Slot|undefined} Found slot or undefined
 */
export const findSlotById = (slots, slotId) => {
  return slots.find(slot => slot.id === slotId);
};

/**
 * Finds a slot by car number
 * @param {import('./types.js').Slot[]} slots - Array of slots
 * @param {string} carNumber - Car number to search for
 * @returns {import('./types.js').Slot|undefined} Found slot or undefined
 */
export const findSlotByCarNumber = (slots, carNumber) => {
  return slots.find(slot => 
    slot.status === 'occupied' && 
    slot.carNumber?.toLowerCase() === carNumber.toLowerCase()
  );
};

/**
 * Gets all available slots
 * @param {import('./types.js').Slot[]} slots - Array of slots
 * @returns {import('./types.js').Slot[]} Available slots
 */
export const getAvailableSlots = (slots) => {
  return slots.filter(slot => slot.status === 'available');
};

/**
 * Gets all occupied slots
 * @param {import('./types.js').Slot[]} slots - Array of slots
 * @returns {import('./types.js').Slot[]} Occupied slots
 */
export const getOccupiedSlots = (slots) => {
  return slots.filter(slot => slot.status === 'occupied');
};

/**
 * Counts slots by status
 * @param {import('./types.js').Slot[]} slots - Array of slots
 * @returns {{available: number, occupied: number, total: number}} Slot counts
 */
export const getSlotCounts = (slots) => {
  const available = getAvailableSlots(slots).length;
  const occupied = getOccupiedSlots(slots).length;
  const total = slots.length;
  
  return { available, occupied, total };
};

/**
 * Validates a car number format
 * @param {string} carNumber - Car number to validate
 * @returns {boolean} True if valid format
 */
export const isValidCarNumber = (carNumber) => {
  if (!carNumber || typeof carNumber !== 'string') return false;
  
  // Remove spaces and convert to uppercase for validation
  const cleaned = carNumber.replace(/\s+/g, '').toUpperCase();
  
  // Basic validation: should have at least 4 characters and contain both letters and numbers
  const hasLetters = /[A-Z]/.test(cleaned);
  const hasNumbers = /[0-9]/.test(cleaned);
  const isValidLength = cleaned.length >= 4 && cleaned.length <= 10;
  
  return hasLetters && hasNumbers && isValidLength;
};

/**
 * Formats a car number for display
 * @param {string} carNumber - Raw car number
 * @returns {string} Formatted car number
 */
export const formatCarNumber = (carNumber) => {
  if (!carNumber) return '';
  return carNumber.toUpperCase().trim();
};
