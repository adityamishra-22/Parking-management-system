/**
 * Car search component for finding parked vehicles
 */

import React, { useState } from 'react';
import { Search, Car, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card.jsx';
import { Input } from '../../../shared/ui/input.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import { Label } from '../../../shared/ui/label.jsx';
import { Alert, AlertDescription } from '../../../shared/ui/alert.jsx';
import { Badge } from '../../../shared/ui/badge.jsx';
import { useAppState } from '../../../app/providers/StateProvider.jsx';
import { 
  findSlotByCarNumber, 
  computeBilling, 
  formatDuration, 
  formatAmount,
  isValidCarNumber 
} from '../../../entities/slot/index.js';

/**
 * Car search component
 * @param {Object} props - Component props
 * @param {Function} props.onCarFound - Callback when car is found
 */
export const CarSearch = ({ onCarFound }) => {
  const state = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundSlot, setFoundSlot] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setFoundSlot(null);

    const query = searchQuery.trim();
    if (!query) {
      setError('Please enter a car number to search');
      return;
    }

    if (!isValidCarNumber(query)) {
      setError('Please enter a valid car number format');
      return;
    }

    setIsSearching(true);

    try {
      // Simulate search delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const slot = findSlotByCarNumber(state.slots, query);
      
      if (!slot) {
        setError(`Car ${query.toUpperCase()} not found in the parking system`);
        return;
      }

      setFoundSlot(slot);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear error and results when user types
    if (error) setError('');
    if (foundSlot) setFoundSlot(null);
  };

  const handleGenerateReceipt = () => {
    if (foundSlot && onCarFound) {
      // Pass the slot with a flag indicating this is for receipt generation
      onCarFound(foundSlot, true);
      
      // Reset the search state after generating receipt
      setSearchQuery('');
      setFoundSlot(null);
      setError('');
    }
  };

  const currentBilling = foundSlot ? computeBilling(foundSlot.entryTime) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="w-5 h-5" />
          <span>Find Vehicle</span>
        </CardTitle>
        <CardDescription>
          Search for a parked vehicle by license plate number
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carSearch">License Plate Number</Label>
            <div className="flex space-x-2">
              <Input
                id="carSearch"
                type="text"
                placeholder="e.g., MH12AB1234"
                value={searchQuery}
                onChange={handleInputChange}
                className="uppercase flex-1"
                disabled={isSearching}
              />
              <Button 
                type="submit" 
                disabled={isSearching || !searchQuery.trim()}
                className="px-6"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search results */}
        {foundSlot && currentBilling && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-medium text-sm text-muted-foreground mb-3">
                Vehicle Found
              </h3>
              
              {/* Vehicle info card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-900 text-lg">
                      {foundSlot.carNumber}
                    </span>
                  </div>
                  <Badge variant="destructive">
                    Slot {foundSlot.id}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-blue-600 font-medium">Entry Time</div>
                    <div className="text-blue-800">
                      {new Date(foundSlot.entryTime).toLocaleString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-blue-600 font-medium flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Duration</span>
                    </div>
                    <div className="text-blue-800 font-medium">
                      {formatDuration(currentBilling.duration)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Current Charges</span>
                    <span className="text-blue-900 font-bold text-xl">
                      {formatAmount(currentBilling.amount)}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    ₹10 for first hour, ₹20 for each additional hour
                  </div>
                </div>
              </div>

              {/* Generate receipt button */}
              <Button 
                onClick={handleGenerateReceipt}
                className="w-full mt-4"
                size="lg"
              >
                Generate Receipt & Release Vehicle
              </Button>
            </div>
          </div>
        )}

        {/* Quick tips */}
        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
          <div className="font-medium mb-1">Search Tips:</div>
          <ul className="space-y-1">
            <li>• Enter the complete license plate number</li>
            <li>• Search is case-insensitive</li>
            <li>• Only currently parked vehicles will be found</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
