/**
 * Receipt entity - exports all receipt-related functionality
 */

// Types and factories
export {
  generateReceiptId,
  createExtendedReceipt,
} from './types.js';

// Utility functions
export {
  formatReceiptDate,
  formatReceiptTime,
  generateReceiptText,
  validateReceipt,
} from './utils.js';
