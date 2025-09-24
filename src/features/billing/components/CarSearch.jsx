/**
 * Car search component for finding parked vehicles
 */

import React, { useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/ui/card.jsx";
import { Input } from "../../../shared/ui/input.jsx";
import { Button } from "../../../shared/ui/button.jsx";
import { Label } from "../../../shared/ui/label.jsx";
import { Alert, AlertDescription } from "../../../shared/ui/alert.jsx";
import { useAppState } from "../../../app/providers/StateProvider.jsx";
import {
  findSlotByCarNumber,
  isValidCarNumber,
} from "../../../entities/slot/index.js";

/**
 * Car search component
 * @param {Object} props - Component props
 * @param {Function} props.onCarFound - Callback when car is found
 */
export const CarSearch = ({ onCarFound }) => {
  const state = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    const query = searchQuery.trim();
    if (!query) {
      setError("Please enter a car registration number");
      return;
    }

    if (!isValidCarNumber(query)) {
      setError("Please enter a valid registration number format");
      return;
    }

    setIsSearching(true);

    try {
      // Simulate processing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const slot = findSlotByCarNumber(state.slots, query);

      if (!slot) {
        setError(`Car ${query.toUpperCase()} not found in the parking system`);
        return;
      }

      // Trigger receipt generation (only preview, not close)
      if (onCarFound) {
        onCarFound(slot);
      }

      // Reset the form after generating receipt
      setSearchQuery("");
      setError("");
    } catch {
      setError("Receipt generation failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (error) setError("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="w-5 h-5" />
          <span>Generate Receipt</span>
        </CardTitle>
        <CardDescription>
          Enter car registration number to generate receipt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generate Receipt form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carSearch">Car Registration Number</Label>
            <div className="flex space-x-2">
              <Input
                id="carSearch"
                type="text"
                placeholder="Enter registration number"
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
                {isSearching ? "Generating..." : "Generate Receipt"}
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

        {/* Quick tips */}
        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
          <div className="font-medium mb-1">Receipt Generation:</div>
          <ul className="space-y-1">
            <li>• Enter the complete registration number</li>
            <li>• Receipt will be generated automatically</li>
            <li>• Only currently parked vehicles can generate receipts</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
