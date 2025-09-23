/**
 * Global state management using React useReducer
 */

import { createInitialState } from '../../entities/slot/index.js';

/**
 * Action types for state management
 */
export const ActionTypes = {
  // Slot management
  ASSIGN_CAR: 'ASSIGN_CAR',
  RELEASE_CAR: 'RELEASE_CAR',
  
  // State management
  LOAD_STATE: 'LOAD_STATE',
  RESET_STATE: 'RESET_STATE',
  
  // Revenue tracking
  ADD_REVENUE: 'ADD_REVENUE',
  
  // Registration index
  INCREMENT_REG_INDEX: 'INCREMENT_REG_INDEX',
};

/**
 * Action creators for better type safety and consistency
 */
export const Actions = {
  /**
   * Assigns a car to a parking slot
   * @param {number} slotId - Slot ID
   * @param {string} carNumber - Car license plate
   * @param {Date} entryTime - Entry timestamp
   */
  assignCar: (slotId, carNumber, entryTime = new Date()) => ({
    type: ActionTypes.ASSIGN_CAR,
    payload: { slotId, carNumber, entryTime },
  }),

  /**
   * Releases a car from a parking slot
   * @param {number} slotId - Slot ID
   * @param {Date} exitTime - Exit timestamp
   */
  releaseCar: (slotId, exitTime = new Date()) => ({
    type: ActionTypes.RELEASE_CAR,
    payload: { slotId, exitTime },
  }),

  /**
   * Loads state from external source
   * @param {import('../../entities/slot/types.js').AppState} state - State to load
   */
  loadState: (state) => ({
    type: ActionTypes.LOAD_STATE,
    payload: state,
  }),

  /**
   * Resets state to initial values
   */
  resetState: () => ({
    type: ActionTypes.RESET_STATE,
  }),

  /**
   * Adds revenue to total
   * @param {number} amount - Amount to add
   */
  addRevenue: (amount) => ({
    type: ActionTypes.ADD_REVENUE,
    payload: { amount },
  }),

  /**
   * Increments registration index
   */
  incrementRegIndex: () => ({
    type: ActionTypes.INCREMENT_REG_INDEX,
  }),
};

/**
 * State reducer function
 * @param {import('../../entities/slot/types.js').AppState} state - Current state
 * @param {Object} action - Action object
 * @returns {import('../../entities/slot/types.js').AppState} New state
 */
export const stateReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ASSIGN_CAR: {
      const { slotId, carNumber, entryTime } = action.payload;
      
      return {
        ...state,
        slots: state.slots.map(slot =>
          slot.id === slotId
            ? {
                ...slot,
                status: 'occupied',
                carNumber: carNumber.toUpperCase().trim(),
                entryTime,
              }
            : slot
        ),
      };
    }

    case ActionTypes.RELEASE_CAR: {
      const { slotId } = action.payload;
      
      return {
        ...state,
        slots: state.slots.map(slot =>
          slot.id === slotId
            ? {
                ...slot,
                status: 'available',
                carNumber: null,
                entryTime: null,
              }
            : slot
        ),
      };
    }

    case ActionTypes.LOAD_STATE: {
      // Validate loaded state structure
      const loadedState = action.payload;
      if (!loadedState || !Array.isArray(loadedState.slots)) {
        console.warn('Invalid state structure, using initial state');
        return createInitialState();
      }
      
      return {
        ...createInitialState(),
        ...loadedState,
      };
    }

    case ActionTypes.RESET_STATE: {
      return createInitialState();
    }

    case ActionTypes.ADD_REVENUE: {
      const { amount } = action.payload;
      
      return {
        ...state,
        totalRevenue: state.totalRevenue + amount,
      };
    }

    case ActionTypes.INCREMENT_REG_INDEX: {
      return {
        ...state,
        regIndex: state.regIndex + 1,
      };
    }

    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
};

/**
 * Creates initial state for the reducer
 * @returns {import('../../entities/slot/types.js').AppState}
 */
export const getInitialState = () => createInitialState();
