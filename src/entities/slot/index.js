/**
 * Slot entity - exports all slot-related functionality
 */

// Types and factories
export { createSlot, createReceipt, createInitialState } from "./types.js";

// Billing calculations
export {
  calculateDuration,
  computeBilling,
  formatDuration,
  formatAmount,
} from "./billing.js";

// Utility functions
export {
  findSlotById,
  findSlotByCarNumber,
  getAvailableSlots,
  getOccupiedSlots,
  getSlotCounts,
  isValidCarNumber,
  formatCarNumber,
} from "./utils.js";
