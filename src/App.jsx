/**
 * Main App component with routing and state management
 */

import React from 'react';
import { StateProvider } from './app/providers/StateProvider.jsx';
import { AppRouter } from './app/routes/AppRouter.jsx';
import './App.css';

/**
 * Root application component
 */
function App() {
  return (
    <StateProvider>
      <AppRouter />
    </StateProvider>
  );
}

export default App;
