/**
 * Receipt preview component for displaying and printing receipts
 */

import React from 'react';
import { Receipt, Printer, Download, Car, Clock, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import { Separator } from '../../../shared/ui/separator.jsx';
import { Badge } from '../../../shared/ui/badge.jsx';
import { 
  formatAmount, 
  formatDuration 
} from '../../../entities/slot/index.js';
import { 
  formatReceiptDate,
  generateReceiptText 
} from '../../../entities/receipt/index.js';

/**
 * Receipt preview component
 * @param {Object} props - Component props
 * @param {import('../../../entities/receipt/types.js').ExtendedReceipt|null} props.receipt - Receipt to display
 * @param {Function} props.onPrint - Print handler
 * @param {Function} props.onDownload - Download handler
 * @param {Function} props.onClose - Close handler
 */
export const ReceiptPreview = ({ receipt, onPrint, onDownload, onClose }) => {
  const handlePrint = () => {
    if (receipt && onPrint) {
      onPrint(receipt);
    }
  };

  const handleDownload = () => {
    if (receipt && onDownload) {
      onDownload(receipt);
    }
  };

  const handlePrintWindow = () => {
    if (!receipt) return;

    const printContent = generateReceiptText(receipt);
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Parking Receipt - ${receipt.id}</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                line-height: 1.4;
                margin: 20px;
                white-space: pre-wrap;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!receipt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5" />
            <span>Receipt Preview</span>
          </CardTitle>
          <CardDescription>
            Receipt will appear here after generating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Receipt Generated</p>
            <p className="text-sm">
              Search for a vehicle and generate a receipt to see the preview here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Receipt Preview</span>
            </CardTitle>
            <CardDescription>
              Receipt ID: {receipt.id}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            Generated
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Receipt content */}
        <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              PARKING RECEIPT
            </h2>
            <div className="text-sm text-gray-600">
              Parking Management System
            </div>
            <Separator className="my-3" />
          </div>

          {/* Receipt details */}
          <div className="space-y-4">
            {/* Receipt ID and Slot */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Receipt ID:</span>
              <span className="font-mono text-sm">{receipt.id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Slot Number:</span>
              <Badge variant="outline">{receipt.slotId}</Badge>
            </div>

            <Separator />

            {/* Vehicle information */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Vehicle</span>
              </div>
              <div className="text-lg font-bold text-blue-900">
                {receipt.carNumber}
              </div>
            </div>

            {/* Timing information */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Entry Time:</span>
                </div>
                <span className="text-sm font-mono">
                  {formatReceiptDate(receipt.entryTime)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Exit Time:</span>
                </div>
                <span className="text-sm font-mono">
                  {formatReceiptDate(receipt.exitTime)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Duration:</span>
                </div>
                <span className="text-sm font-medium">
                  {formatDuration(receipt.duration)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Billing information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Total Amount</span>
                </div>
                <span className="text-2xl font-bold text-green-900">
                  {formatAmount(receipt.amount)}
                </span>
              </div>
              <div className="text-xs text-green-600">
                ₹10 for first hour, ₹20 for each additional hour
              </div>
            </div>

            <Separator />

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <div>Generated: {formatReceiptDate(receipt.generatedAt)}</div>
              <div>Registration: #{receipt.regIndex}</div>
              <div className="mt-3 font-medium">
                Thank you for using our parking service!
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button 
            onClick={handlePrintWindow}
            variant="outline"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          
          {onClose && (
            <Button 
              onClick={onClose}
              variant="destructive"
            >
              Close Parking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
