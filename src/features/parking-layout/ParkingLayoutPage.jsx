/**
 * Parking Layout Page - Main page for viewing and managing parking slots
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card.jsx';
import { Badge } from '../../shared/ui/badge.jsx';
import { Button } from '../../shared/ui/button.jsx';
import { RefreshCw, Plus } from 'lucide-react';
import { useAppState, useStateOperations } from '../../app/providers/StateProvider.jsx';
import { getSlotCounts, findSlotByCarNumber } from '../../entities/slot/index.js';
import { ParkingGrid } from './components/ParkingGrid.jsx';
import { CarAssignmentDialog } from './components/CarAssignmentDialog.jsx';
import { SlotDetailsDialog } from './components/SlotDetailsDialog.jsx';

/**
 * Parking Layout Page component
 */
export const ParkingLayoutPage = () => {
  const state = useAppState();
  const { assignCar, releaseCar, incrementRegIndex } = useStateOperations();
  const slotCounts = getSlotCounts(state.slots);

  // Dialog states
  const [assignmentDialog, setAssignmentDialog] = useState({
    open: false,
    slot: null,
  });
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    slot: null,
  });

  // Handle slot click
  const handleSlotClick = (slot) => {
    if (slot.status === 'available') {
      // Open assignment dialog for available slots
      setAssignmentDialog({
        open: true,
        slot,
      });
    } else {
      // Open details dialog for occupied slots
      setDetailsDialog({
        open: true,
        slot,
      });
    }
  };

  // Handle car assignment
  const handleCarAssignment = async (slotId, carNumber) => {
    // Check if car is already parked
    const existingSlot = findSlotByCarNumber(state.slots, carNumber);
    if (existingSlot) {
      throw new Error(`Car ${carNumber} is already parked in slot ${existingSlot.id}`);
    }

    // Assign car to slot
    assignCar(slotId, carNumber, new Date());
    incrementRegIndex();
  };

  // Handle car release
  const handleCarRelease = async (slotId) => {
    releaseCar(slotId, new Date());
  };

  // Auto-refresh every 30 seconds to update durations
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update live durations
      setDetailsDialog(prev => ({ ...prev }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parking Layout</h1>
          <p className="text-muted-foreground">
            Manage parking slots and assign vehicles
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {slotCounts.total} Total Slots
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-200">
            {slotCounts.available} Available
          </Badge>
          <Badge variant="outline" className="text-red-600 border-red-200">
            {slotCounts.occupied} Occupied
          </Badge>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Available Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {slotCounts.available}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for new vehicles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Occupied Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {slotCounts.occupied}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently parked vehicles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {Math.round((slotCounts.occupied / slotCounts.total) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Current utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Parking grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Parking Grid</CardTitle>
              <CardDescription>
                Click on available slots to assign vehicles, or occupied slots to view details
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ParkingGrid onSlotClick={handleSlotClick} />
        </CardContent>
      </Card>

      {/* Car Assignment Dialog */}
      <CarAssignmentDialog
        open={assignmentDialog.open}
        onOpenChange={(open) => setAssignmentDialog({ open, slot: open ? assignmentDialog.slot : null })}
        slot={assignmentDialog.slot}
        onAssign={handleCarAssignment}
      />

      {/* Slot Details Dialog */}
      <SlotDetailsDialog
        open={detailsDialog.open}
        onOpenChange={(open) => setDetailsDialog({ open, slot: open ? detailsDialog.slot : null })}
        slot={detailsDialog.slot}
      />
    </div>
  );
};
