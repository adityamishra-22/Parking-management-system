/**
 * Receipt formatting and utility functions
 */

/**
 * Formats a date for receipt display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatReceiptDate = (date) => {
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/**
 * Formats a time for receipt display
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatReceiptTime = (date) => {
  return date.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/**
 * Generates receipt text content for printing/display
 * @param {import('./types.js').ExtendedReceipt} receipt - Receipt data
 * @returns {string} Formatted receipt text
 */
export const generateReceiptText = (receipt) => {
  const divider = "================================";

  return `
${divider}
       PARKING RECEIPT
${divider}


Slot Number: ${receipt.slotId}
Car Number: ${receipt.carNumber}

Entry Time: ${formatReceiptDate(receipt.entryTime)}
Exit Time:  ${formatReceiptDate(receipt.exitTime)}

Duration: ${formatDuration(receipt.duration)}
Amount: ${formatAmount(receipt.amount)}

${divider}
Generated: ${formatReceiptDate(receipt.generatedAt)}


Thank you for using our parking!
${divider}
`.trim();
};

/**
 * Imports duration and amount formatting from slot entity
 */
import { formatDuration, formatAmount } from "../slot/billing.js";

/**
 * Validates receipt data
 * @param {import('./types.js').ExtendedReceipt} receipt - Receipt to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
export const validateReceipt = (receipt) => {
  const errors = [];

  if (!receipt.id) errors.push("Receipt ID is required");
  if (!receipt.slotId || receipt.slotId < 1)
    errors.push("Valid slot ID is required");
  if (!receipt.carNumber) errors.push("Car number is required");
  if (!receipt.entryTime) errors.push("Entry time is required");
  if (!receipt.exitTime) errors.push("Exit time is required");
  if (receipt.duration < 0) errors.push("Duration cannot be negative");
  if (receipt.amount < 0) errors.push("Amount cannot be negative");

  if (
    receipt.entryTime &&
    receipt.exitTime &&
    receipt.entryTime >= receipt.exitTime
  ) {
    errors.push("Exit time must be after entry time");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
