/**
 * Application footer component
 */

import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Footer component with current time and system info
 */
export const Footer = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {/* Current time */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(currentTime)}</span>
          </div>

          {/* System info */}
          <div className="flex items-center space-x-4">
            <span>© 2024 Parking Management System</span>
            <span>•</span>
            <span>Built with React & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
