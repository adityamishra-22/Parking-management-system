/**
 * Navigation sidebar with menu items
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Receipt, BarChart3, Settings, RefreshCw } from 'lucide-react';
import { Button } from '../../shared/ui/button.jsx';
import { useStateOperations } from '../providers/StateProvider.jsx';
import { cn } from '../../shared/lib/utils.js';

/**
 * Navigation menu items configuration
 */
const navigationItems = [
  {
    to: '/layout',
    icon: LayoutGrid,
    label: 'Parking Layout',
    description: 'View and manage parking slots',
  },
  {
    to: '/billing',
    icon: Receipt,
    label: 'Billing',
    description: 'Generate receipts and billing',
  },
];

/**
 * Navigation sidebar component
 */
export const Navigation = () => {
  const { resetState } = useStateOperations();

  const handleResetState = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      resetState();
    }
  };

  return (
    <nav className="w-64 bg-white border-r border-border flex flex-col">
      {/* Navigation items */}
      <div className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Navigation
          </h2>
          
          {navigationItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                <Icon className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Quick stats section */}
        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetState}
            className="w-full justify-start"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset All Data
          </Button>
        </div>
      </div>

      {/* Footer section */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <div className="font-medium">Parking Management</div>
          <div>Version 1.0.0</div>
        </div>
      </div>
    </nav>
  );
};
