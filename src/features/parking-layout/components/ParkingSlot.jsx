/**
 * Individual parking slot component
 */

import React from 'react';
import { Car, Clock } from 'lucide-react';
import { cn } from '../../../shared/lib/utils.js';
import { formatDuration } from '../../../entities/slot/index.js';

/**
 * Calculates how long a car has been parked
 * @param {Date} entryTime - When the car entered
 * @returns {number} Duration in minutes
 */
const calculateCurrentDuration = (entryTime) => {
  if (!entryTime) return 0;
  const now = new Date();
  return Math.floor((now.getTime() - entryTime.getTime()) / (1000 * 60));
};

/**
 * Individual parking slot component
 * @param {Object} props - Component props
 * @param {import('../../../entities/slot/types.js').Slot} props.slot - Slot data
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the slot is disabled
 */
export const ParkingSlot = ({ slot, onClick, disabled = false }) => {
  const isAvailable = slot.status === 'available';
  const currentDuration = slot.entryTime ? calculateCurrentDuration(slot.entryTime) : 0;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(slot);
    }
  };

  return (
    <div
      className={cn(
        'parking-slot aspect-square p-3 select-none',
        'flex flex-col items-center justify-center text-center',
        isAvailable ? 'available' : 'occupied',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={handleClick}
      title={
        isAvailable
          ? `Slot ${slot.id} - Available`
          : `Slot ${slot.id} - Occupied by ${slot.carNumber}`
      }
    >
      {/* Slot number */}
      <div className="absolute top-1 left-1 text-xs font-bold text-gray-600">
        {slot.id}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1">
        {isAvailable ? (
          <>
            <div className="w-8 h-8 border-2 border-dashed border-green-400 rounded flex items-center justify-center mb-1">
              <Car className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-700">Available</span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center mb-1">
              <Car className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-bold text-red-700 mb-1">
              {slot.carNumber}
            </div>
            {currentDuration > 0 && (
              <div className="flex items-center text-xs text-red-600">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(currentDuration)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Status indicator */}
      <div
        className={cn(
          'absolute bottom-1 right-1 w-2 h-2 rounded-full',
          isAvailable ? 'bg-green-500' : 'bg-red-500'
        )}
      />
    </div>
  );
};
