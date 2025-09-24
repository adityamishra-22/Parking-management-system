/**
 * Application header with title and key statistics
 */

import React from "react";
import { Car, DollarSign, Hash } from "lucide-react";
import { useAppState } from "../providers/StateProvider.jsx";
import { getSlotCounts } from "../../entities/slot/index.js";
import { formatAmount } from "../../entities/slot/index.js";

/**
 * Header component with app title and live statistics
 */
export const Header = () => {
  const state = useAppState();
  const slotCounts = getSlotCounts(state.slots);

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* App title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Parking Management System
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time parking slot management
              </p>
            </div>
          </div>

          {/* Live statistics */}
          <div className="flex items-center space-x-6">
            {/* Available slots */}
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                {slotCounts.available} Available
              </span>
            </div>

            {/* Occupied slots */}
            <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-700">
                {slotCounts.occupied} Occupied
              </span>
            </div>

            {/* Total revenue */}
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {formatAmount(state.totalRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
