/**
 * Billing summary component showing revenue and statistics
 */

import React from 'react';
import { DollarSign, TrendingUp, Clock, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card.jsx';
import { Badge } from '../../../shared/ui/badge.jsx';
import { useAppState } from '../../../app/providers/StateProvider.jsx';
import { 
  getOccupiedSlots, 
  formatAmount, 
  computeBilling 
} from '../../../entities/slot/index.js';

/**
 * Billing summary component
 */
export const BillingSummary = () => {
  const state = useAppState();
  const occupiedSlots = getOccupiedSlots(state.slots);

  // Calculate potential revenue from current sessions
  const currentSessionsValue = occupiedSlots.reduce((total, slot) => {
    if (slot.entryTime) {
      const billing = computeBilling(slot.entryTime);
      return total + billing.amount;
    }
    return total;
  }, 0);

  // Calculate average session duration
  const averageDuration = occupiedSlots.length > 0 
    ? occupiedSlots.reduce((total, slot) => {
        if (slot.entryTime) {
          const billing = computeBilling(slot.entryTime);
          return total + billing.duration;
        }
        return total;
      }, 0) / occupiedSlots.length
    : 0;

  const formatDurationHours = (minutes) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600 flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Total Revenue</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {formatAmount(state.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            From completed sessions
          </p>
        </CardContent>
      </Card>

      {/* Current Sessions Value */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Pending Revenue</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">
            {formatAmount(currentSessionsValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            From active sessions
          </p>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-600 flex items-center space-x-2">
            <Car className="w-4 h-4" />
            <span>Active Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            {occupiedSlots.length}
          </div>
          <p className="text-xs text-muted-foreground">
            Currently parked vehicles
          </p>
        </CardContent>
      </Card>

      {/* Average Duration */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-600 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Avg. Duration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">
            {formatDurationHours(averageDuration)}
          </div>
          <p className="text-xs text-muted-foreground">
            Current active sessions
          </p>
        </CardContent>
      </Card>

      {/* Active Sessions Details */}
      {occupiedSlots.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <CardDescription>
              Current vehicles and their billing status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {occupiedSlots.map((slot) => {
                const billing = computeBilling(slot.entryTime);
                return (
                  <div 
                    key={slot.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        Slot {slot.id}
                      </Badge>
                      <div>
                        <div className="font-medium">{slot.carNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(slot.entryTime).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        {formatAmount(billing.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDurationHours(billing.duration)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
