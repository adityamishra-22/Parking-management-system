/**
 * Dialog for viewing occupied slot details
 */

import React, { useState, useEffect } from 'react';
import { Car, Clock, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui/dialog.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import { Badge } from '../../../shared/ui/badge.jsx';
import { Separator } from '../../../shared/ui/separator.jsx';
import { 
  computeBilling, 
  formatDuration, 
  formatAmount 
} from '../../../entities/slot/index.js';

/**
 * Slot details dialog component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether dialog is open
 * @param {Function} props.onOpenChange - Handler for dialog open/close
 * @param {import('../../../entities/slot/types.js').Slot|null} props.slot - Selected slot
 */
export const SlotDetailsDialog = ({ open, onOpenChange, slot }) => {
  const [currentBilling, setCurrentBilling] = useState({ duration: 0, amount: 0 });

  // Update billing information every minute
  useEffect(() => {
    if (!slot || slot.status === 'available' || !slot.entryTime) {
      return;
    }

    const updateBilling = () => {
      const billing = computeBilling(slot.entryTime);
      setCurrentBilling(billing);
    };

    // Update immediately
    updateBilling();

    // Update every minute
    const interval = setInterval(updateBilling, 60000);

    return () => clearInterval(interval);
  }, [slot]);



  if (!slot || slot.status === 'available') return null;

  const entryTime = slot.entryTime ? new Date(slot.entryTime) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5" />
            <span>Slot {slot.id} Details</span>
          </DialogTitle>
          <DialogDescription>
            Vehicle information and current billing details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Vehicle info */}
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-700">Vehicle</span>
              <Badge variant="destructive">Occupied</Badge>
            </div>
            <div className="text-lg font-bold text-red-900">
              {slot.carNumber}
            </div>
          </div>

          <Separator />

          {/* Timing information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Entry Time</span>
            </div>
            <div className="text-sm text-muted-foreground ml-6">
              {entryTime ? entryTime.toLocaleString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }) : 'Unknown'}
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <div className="text-sm text-muted-foreground ml-6">
              {formatDuration(currentBilling.duration)}
            </div>
          </div>

          <Separator />

          {/* Billing information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Current Charges</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {formatAmount(currentBilling.amount)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              ₹10 for first hour, ₹20 for each additional hour
            </div>
          </div>

          {/* Warning for long stays */}
          {currentBilling.duration > 480 && ( // 8 hours
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  Long Stay Alert
                </span>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                This vehicle has been parked for over 8 hours
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
