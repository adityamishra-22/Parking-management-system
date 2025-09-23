/**
 * Receipt entity types and utilities
 */

/**
 * Receipt status for tracking
 * @typedef {'generated' | 'printed' | 'emailed'} ReceiptStatus
 */

/**
 * Extended receipt with additional metadata
 * @typedef {Object} ExtendedReceipt
 * @property {string} id - Unique receipt ID
 * @property {number} slotId - ID of the parking slot
 * @property {string} carNumber - License plate number
 * @property {Date} entryTime - Time when car entered
 * @property {Date} exitTime - Time when car exited
 * @property {number} duration - Duration in minutes
 * @property {number} amount - Total amount to be paid
 * @property {ReceiptStatus} status - Receipt status
 * @property {Date} generatedAt - When receipt was generated
 * @property {number} regIndex - Registration index at time of generation
 */

/**
 * Creates a unique receipt ID
 * @param {number} regIndex - Current registration index
 * @returns {string} Unique receipt ID
 */
export const generateReceiptId = (regIndex) => {
  const timestamp = Date.now().toString(36);
  const index = regIndex.toString().padStart(4, '0');
  return `PMS-${index}-${timestamp}`.toUpperCase();
};

/**
 * Creates an extended receipt with metadata
 * @param {import('../slot/types.js').Receipt} receipt - Basic receipt data
 * @param {number} regIndex - Current registration index
 * @returns {ExtendedReceipt}
 */
export const createExtendedReceipt = (receipt, regIndex) => ({
  id: generateReceiptId(regIndex),
  ...receipt,
  status: 'generated',
  generatedAt: new Date(),
  regIndex,
});
