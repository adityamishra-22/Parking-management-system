/**
 * Billing Page - Main page for generating receipts and managing billing
 */

import React, { useState } from 'react';
import { Badge } from '../../shared/ui/badge.jsx';
import { Button } from '../../shared/ui/button.jsx';
import { RefreshCw } from 'lucide-react';
import { useAppState, useStateOperations } from '../../app/providers/StateProvider.jsx';
import { getOccupiedSlots, formatAmount, computeBilling, createReceipt } from '../../entities/slot/index.js';
import { createExtendedReceipt } from '../../entities/receipt/index.js';
import { CarSearch } from './components/CarSearch.jsx';
import { ReceiptPreview } from './components/ReceiptPreview.jsx';
import { BillingSummary } from './components/BillingSummary.jsx';

/**
 * Billing Page component
 */
export const BillingPage = () => {
  const state = useAppState();
  const { releaseCar, addRevenue, incrementRegIndex } = useStateOperations();
  const occupiedSlots = getOccupiedSlots(state.slots);
  
  const [currentReceipt, setCurrentReceipt] = useState(null);

  // Handle car found and receipt generation
  const handleCarFound = async (slot, shouldGenerateReceipt = false) => {
    // If this is just a search (not receipt generation), do nothing
    if (!shouldGenerateReceipt) {
      return;
    }

    try {
      // Calculate final billing
      const exitTime = new Date();
      const billing = computeBilling(slot.entryTime, exitTime);
      
      // Create receipt
      const basicReceipt = createReceipt(
        slot.id,
        slot.carNumber,
        slot.entryTime,
        exitTime,
        billing.duration,
        billing.amount
      );
      
      // Create extended receipt with metadata
      const extendedReceipt = createExtendedReceipt(basicReceipt, state.regIndex);
      
      // Update state
      releaseCar(slot.id, exitTime);
      addRevenue(billing.amount);
      incrementRegIndex();
      
      // Set receipt for preview
      setCurrentReceipt(extendedReceipt);
      
      // Auto-clear receipt preview after 30 seconds
      setTimeout(() => {
        setCurrentReceipt(null);
      }, 30000);
      
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  // Handle receipt download
  const handleDownloadReceipt = (receipt) => {
    const receiptText = `
PARKING RECEIPT
===============

Receipt ID: ${receipt.id}
Slot Number: ${receipt.slotId}
Car Number: ${receipt.carNumber}

Entry Time: ${receipt.entryTime.toLocaleString('en-IN')}
Exit Time:  ${receipt.exitTime.toLocaleString('en-IN')}

Duration: ${receipt.duration} seconds
Amount: $${receipt.amount.toFixed(2)}

Generated: ${receipt.generatedAt.toLocaleString('en-IN')}
Reg Index: ${receipt.regIndex}

Thank you for using our parking service!
=======================================
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parking-receipt-${receipt.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle receipt print
  const handlePrintReceipt = (receipt) => {
    // This is handled by the ReceiptPreview component
    console.log('Print receipt:', receipt.id);
  };

  // Clear current receipt
  const handleClearReceipt = () => {
    setCurrentReceipt(null);
  };

  // Calculate total potential revenue
  const totalPotentialRevenue = occupiedSlots.reduce((total, slot) => {
    if (slot.entryTime) {
      const billing = computeBilling(slot.entryTime);
      return total + billing.amount;
    }
    return total;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing & Receipts</h1>
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
          onClose={currentReceipt ? handleClearReceipt : undefined}
        />
      </div>

      {/* Quick actions */}
      {occupiedSlots.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-muted-foreground">
            <div className="text-lg font-medium mb-2">No Active Sessions</div>
            <p className="text-sm">
              All parking slots are currently available. 
              New receipts will appear here when vehicles are released.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
