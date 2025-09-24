/**
 * Billing Page - Main page for generating receipts and managing billing
 */

import React, { useState } from "react";
import { Badge } from "../../shared/ui/badge.jsx";
import { Button } from "../../shared/ui/button.jsx";
import { RefreshCw } from "lucide-react";
import {
  useAppState,
  useStateOperations,
} from "../../app/providers/StateProvider.jsx";
import {
  getOccupiedSlots,
  formatAmount,
  computeBilling,
  createReceipt,
} from "../../entities/slot/index.js";
import { createExtendedReceipt } from "../../entities/receipt/index.js";
import { CarSearch } from "./components/CarSearch.jsx";
import { ReceiptPreview } from "./components/ReceiptPreview.jsx";
import { BillingSummary } from "./components/BillingSummary.jsx";

/**
 * Billing Page component
 */
export const BillingPage = () => {
  const state = useAppState();
  const { releaseCar, addRevenue, incrementRegIndex } = useStateOperations();
  const occupiedSlots = getOccupiedSlots(state.slots);

  const [currentReceipt, setCurrentReceipt] = useState(null);

  // Handle car found and receipt generation (only preview)
  const handleCarFound = async (slot) => {
    try {
      const exitTime = new Date();
      const billing = computeBilling(new Date(slot.entryTime), exitTime);

      // Create basic receipt
      const basicReceipt = createReceipt(
        slot.id,
        slot.carNumber,
        slot.entryTime,
        exitTime,
        billing.duration,
        billing.amount
      );

      // Merge billing breakdown into extended receipt
      const extendedReceipt = {
        ...createExtendedReceipt(basicReceipt, state.regIndex),
        initialCharge: billing.initialCharge,
        additionalIntervals: billing.additionalIntervals,
        additionalCharge: billing.additionalCharge,
      };

      // Only set receipt for preview
      setCurrentReceipt(extendedReceipt);
    } catch (error) {
      console.error("Failed to generate receipt:", error);
      alert("Failed to generate receipt. Please try again.");
    }
  };

  // Handle explicit Close Parking action
  const handleCloseParking = (receipt) => {
    releaseCar(receipt.slotId, new Date(receipt.exitTime));
    addRevenue(receipt.amount);
    incrementRegIndex();
    setCurrentReceipt(null);
  };

  // Handle receipt download
  const handleDownloadReceipt = (receipt) => {
    const receiptText = `
PARKING RECEIPT
===============

Slot Number: ${receipt.slotId}
Car Number: ${receipt.carNumber}

Entry Time: ${new Date(receipt.entryTime).toLocaleString("en-IN")}
Exit Time:  ${new Date(receipt.exitTime).toLocaleString("en-IN")}

Duration: ${receipt.duration} seconds
Initial 30s: $${receipt.initialCharge.toFixed(2)}
Additional time (${
      receipt.additionalIntervals
    } intervals): $${receipt.additionalCharge.toFixed(2)}

Total Amount: $${receipt.amount.toFixed(2)}

Generated: ${new Date(receipt.generatedAt).toLocaleString("en-IN")}

Thank you for using our parking service!
=======================================
    `.trim();

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parking-receipt-${receipt.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle receipt print
  const handlePrintReceipt = (receipt) => {
    console.log("Print receipt:", receipt.id);
  };

  // Calculate total potential revenue
  const totalPotentialRevenue = occupiedSlots.reduce((total, slot) => {
    if (slot.entryTime) {
      const billing = computeBilling(new Date(slot.entryTime));
      return total + billing.amount;
    }
    return total;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Billing & Receipts
          </h1>
          <p className="text-muted-foreground">
            Generate receipts and manage parking payments
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {occupiedSlots.length} Active Sessions
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {formatAmount(state.totalRevenue)} Total Revenue
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-200">
            {formatAmount(totalPotentialRevenue)} Pending
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Billing summary */}
      <BillingSummary />

      {/* Main billing interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Car search and billing */}
        <CarSearch onCarFound={handleCarFound} />

        {/* Receipt preview */}
        <ReceiptPreview
          receipt={currentReceipt}
          onPrint={handlePrintReceipt}
          onDownload={handleDownloadReceipt}
          onClose={
            currentReceipt
              ? () => handleCloseParking(currentReceipt)
              : undefined
          }
        />
      </div>

      {/* Quick actions */}
      {occupiedSlots.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-muted-foreground">
            <div className="text-lg font-medium mb-2">No Active Sessions</div>
            <p className="text-sm">
              All parking slots are currently available. New receipts will
              appear here when vehicles are released.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
