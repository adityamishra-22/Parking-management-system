/**
 * Main application router configuration
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ParkingLayoutPage } from '../../features/parking-layout/ParkingLayoutPage.jsx';
import { BillingPage } from '../../features/billing/BillingPage.jsx';
import { AppLayout } from '../layout/AppLayout.jsx';

/**
 * Main application router component
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Default route redirects to parking layout */}
          <Route index element={<Navigate to="/layout" replace />} />
          
          {/* Parking layout page */}
          <Route path="layout" element={<ParkingLayoutPage />} />
          
          {/* Billing page */}
          <Route path="billing" element={<BillingPage />} />
          
          {/* Catch-all route for 404s */}
          <Route path="*" element={<Navigate to="/layout" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
