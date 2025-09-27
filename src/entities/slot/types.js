/**
 * Core data types for parking slot management
 */

/**
 * Represents the status of a parking slot
 * @typedef {'available' | 'occupied'} SlotStatus
 */

/**
 * Represents a parking slot in the system
 * @typedef {Object} Slot
 * @property {number} id - Unique identifier for the slot
 * @property {SlotStatus} status - Current status of the slot
 * @property {string|null} carNumber - License plate number (null if available)
 * @property {Date|null} entryTime - Time when car entered (null if available)
 */

/**
 * Represents a parking receipt
 * @typedef {Object} Receipt
 * @property {number} slotId - ID of the parking slot
 * @property {string} carNumber - License plate number
 * @property {Date} entryTime - Time when car entered
 * @property {Date} exitTime - Time when car exited
 * @property {number} duration - Duration in minutes
 * @property {number} amount - Total amount to be paid
 */

/**
 * Represents the global application state
 * @typedef {Object} AppState
 * @property {Slot[]} slots - Array of all parking slots
 * @property {number} regIndex - Current registration index counter
 * @property {number} totalRevenue - Total revenue collected
 */

/**
 * Creates a new empty parking slot
 * @param {number} id - Slot ID
 * @returns {Slot}
 */
export const createSlot = (id) => ({
  id,
  status: "available",
  carNumber: null,
  entryTime: null,
});

/**
 * Creates a new receipt
 * @param {number} slotId - Slot ID
 * @param {string} carNumber - Car license plate
 * @param {Date} entryTime - Entry timestamp
 * @param {Date} exitTime - Exit timestamp
 * @param {number} duration - Duration in minutes
 * @param {number} amount - Amount to pay
 * @returns {Receipt}
 */
export const createReceipt = (
  slotId,
  carNumber,
  entryTime,
  exitTime,
  duration,
  amount
) => ({
  slotId,
  carNumber,
  entryTime,
  exitTime,
  duration,
  amount,
});

/**
 * Creates initial application state
 * @returns {AppState}
 */
export const createInitialState = () => ({
  slots: Array.from({ length: 30 }, (_, i) => createSlot(i + 1)),
  regIndex: 1,
  totalRevenue: 0,
});
