/**
 * Global state provider using React Context and useReducer
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { stateReducer, getInitialState, Actions } from '../../shared/lib/store.js';
import { saveState, loadState } from '../../shared/lib/storage.js';

/**
 * Context for state value
 */
const StateContext = createContext(null);

/**
 * Context for dispatch function
 */
const DispatchContext = createContext(null);

/**
 * State provider component that wraps the entire application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const StateProvider = ({ children }) => {
  // Initialize state with useReducer
  const [state, dispatch] = useReducer(stateReducer, null, () => {
    // Try to load state from localStorage on initialization
    const savedState = loadState();
    return savedState || getInitialState();
  });

  // Auto-save state to localStorage whenever it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState(state);
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Enhanced dispatch with automatic persistence
  const enhancedDispatch = (action) => {
    dispatch(action);
    
    // For certain actions, we might want immediate persistence
    if (action.type === 'RESET_STATE') {
      setTimeout(() => saveState(state), 0);
    }
  };

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={enhancedDispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

/**
 * Hook to access the current state
 * @returns {import('../../entities/slot/types.js').AppState} Current application state
 */
export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === null) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};

/**
 * Hook to access the dispatch function
 * @returns {Function} Dispatch function for state updates
 */
export const useAppDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === null) {
    throw new Error('useAppDispatch must be used within a StateProvider');
  }
  return context;
};

/**
 * Combined hook for both state and dispatch
 * @returns {[import('../../entities/slot/types.js').AppState, Function]} State and dispatch
 */
export const useAppStateAndDispatch = () => {
  return [useAppState(), useAppDispatch()];
};

/**
 * Hook for common state operations
 * @returns {Object} Object with common state operations
 */
export const useStateOperations = () => {
  const dispatch = useAppDispatch();
  
  return {
    assignCar: (slotId, carNumber, entryTime) => 
      dispatch(Actions.assignCar(slotId, carNumber, entryTime)),
    
    releaseCar: (slotId, exitTime) => 
      dispatch(Actions.releaseCar(slotId, exitTime)),
    
    addRevenue: (amount) => 
      dispatch(Actions.addRevenue(amount)),
    
    incrementRegIndex: () => 
      dispatch(Actions.incrementRegIndex()),
    
    resetState: () => 
      dispatch(Actions.resetState()),
    
    loadState: (state) => 
      dispatch(Actions.loadState(state)),
  };
};
