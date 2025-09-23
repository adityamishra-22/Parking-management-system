/**
 * Dialog for assigning a car to a parking slot
 */

import React, { useState } from 'react';
import { Car, Clock, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui/dialog.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import { Input } from '../../../shared/ui/input.jsx';
import { Label } from '../../../shared/ui/label.jsx';
import { Alert, AlertDescription } from '../../../shared/ui/alert.jsx';
import { isValidCarNumber, formatCarNumber } from '../../../entities/slot/index.js';

/**
 * Car assignment dialog component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether dialog is open
 * @param {Function} props.onOpenChange - Handler for dialog open/close
 * @param {import('../../../entities/slot/types.js').Slot|null} props.slot - Selected slot
 * @param {Function} props.onAssign - Handler for car assignment
 */
export const CarAssignmentDialog = ({ open, onOpenChange, slot, onAssign }) => {
  const [carNumber, setCarNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setCarNumber('');
      setError('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate car number
    const trimmedCarNumber = carNumber.trim();
    if (!trimmedCarNumber) {
      setError('Please enter a car number');
      return;
    }

    if (!isValidCarNumber(trimmedCarNumber)) {
      setError('Please enter a valid car number (e.g., MH12AB1234)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format and assign the car
      const formattedCarNumber = formatCarNumber(trimmedCarNumber);
      await onAssign(slot.id, formattedCarNumber);
      
      // Close dialog on success
      onOpenChange(false);
    } catch (err) {
      setError(err.message || 'Failed to assign car to slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCarNumberChange = (e) => {
    const value = e.target.value;
    setCarNumber(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError('');
    }
  };

  if (!slot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5" />
            <span>Assign Vehicle to Slot {slot.id}</span>
          </DialogTitle>
          <DialogDescription>
            Enter the vehicle's license plate number to assign it to this parking slot.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Car number input */}
          <div className="space-y-2">
            <Label htmlFor="carNumber">License Plate Number</Label>
            <Input
              id="carNumber"
              type="text"
              placeholder="e.g., MH12AB1234"
              value={carNumber}
              onChange={handleCarNumberChange}
              className="uppercase"
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Enter the vehicle's license plate number (letters and numbers)
            </p>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Entry time info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Entry Time</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              {new Date().toLocaleString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !carNumber.trim()}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
