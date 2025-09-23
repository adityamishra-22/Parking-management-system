/**
 * Parking grid component displaying all parking slots
 */

import React from 'react';
import { ParkingSlot } from './ParkingSlot.jsx';
import { useAppState } from '../../../app/providers/StateProvider.jsx';

/**
 * Parking grid component
 * @param {Object} props - Component props
 * @param {Function} props.onSlotClick - Handler for slot clicks
 */
export const ParkingGrid = ({ onSlotClick }) => {
  const state = useAppState();

  // Organize slots into a 5x6 grid (30 slots total)
  const rows = 5;
  const cols = 6;
  const slotsGrid = [];

  for (let row = 0; row < rows; row++) {
    const rowSlots = [];
    for (let col = 0; col < cols; col++) {
      const slotIndex = row * cols + col;
      const slot = state.slots[slotIndex];
      if (slot) {
        rowSlots.push(slot);
      }
    }
    slotsGrid.push(rowSlots);
  }

  return (
    <div className="space-y-4">
      {/* Grid legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-green-400 bg-green-50 rounded"></div>
          <span className="text-green-700 font-medium">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-red-700 font-medium">Occupied</span>
        </div>
      </div>

      {/* Parking grid */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="space-y-3">
          {slotsGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-3">
              {row.map((slot) => (
                <div key={slot.id} className="w-20 h-20">
                  <ParkingSlot
                    slot={slot}
                    onClick={onSlotClick}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Entrance/Exit indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-blue-700 font-medium text-sm">Entrance/Exit</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        Click on an available slot to assign a vehicle, or click on an occupied slot to view details
      </div>
    </div>
  );
};
