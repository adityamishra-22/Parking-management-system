/**
 * Main application layout with navigation and content area
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation.jsx';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

/**
 * Main application layout component
 */
export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Navigation sidebar */}
        <Navigation />
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
