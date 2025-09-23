/**
 * Comprehensive test suite for the Parking Management System
 * Tests core business logic, state management, and utility functions
 */

// Mock Date for consistent testing
const mockDate = new Date('2025-09-23T17:42:00.000Z');
global.Date = class extends Date {
  constructor(...args) {
    if (args.length === 0) {
      return mockDate;
    }
    return new Date(...args);
  }
  
  static now() {
    return mockDate.getTime();
  }
};

// Import modules to test
import { 
  createSlot, 
  createReceipt, 
  createInitialState,
  calculateDuration,
  calculateAmount,
  computeBilling,
  findSlotById,
  findSlotByCarNumber,
  getAvailableSlots,
  getOccupiedSlots,
  getSlotCounts,
  isValidCarNumber,
  formatCarNumber,
  formatDuration,
  formatAmount
} from '../entities/slot/index.js';

import {
  generateReceiptId,
  createExtendedReceipt,
  formatReceiptDate,
  formatReceiptTime,
  generateReceiptText,
  validateReceipt
} from '../entities/receipt/index.js';

import {
  serializeForStorage,
  deserializeFromStorage,
  saveState,
  loadState,
  isStorageAvailable
} from '../shared/lib/storage.js';

import {
  ActionTypes,
  Actions,
  stateReducer
} from '../shared/lib/store.js';

// Test Suite: Slot Entity
describe('Slot Entity Tests', () => {
  
  describe('Factory Functions', () => {
    test('createSlot should create a valid slot', () => {
      const slot = createSlot(1);
      expect(slot).toEqual({
        id: 1,
        status: 'available',
        carNumber: null,
        entryTime: null
      });
    });

    test('createReceipt should create a valid receipt', () => {
      const entryTime = new Date('2025-09-23T17:00:00.000Z');
      const exitTime = new Date('2025-09-23T17:30:00.000Z');
      
      const receipt = createReceipt(1, 'MH12AB1234', entryTime, exitTime, 30, 10);
      
      expect(receipt).toEqual({
        slotId: 1,
        carNumber: 'MH12AB1234',
        entryTime,
        exitTime,
        duration: 30,
        amount: 10
      });
    });

    test('createInitialState should create valid initial state', () => {
      const state = createInitialState();
      
      expect(state.slots).toHaveLength(30);
      expect(state.totalRevenue).toBe(0);
      expect(state.regIndex).toBe(1);
      expect(state.slots[0]).toEqual({
        id: 1,
        status: 'available',
        carNumber: null,
        entryTime: null
      });
    });
  });

  describe('Billing Calculations', () => {
    test('calculateDuration should calculate minutes correctly', () => {
      const entryTime = new Date('2025-09-23T17:00:00.000Z');
      const exitTime = new Date('2025-09-23T17:30:00.000Z');
      
      expect(calculateDuration(entryTime, exitTime)).toBe(30);
    });

    test('calculateAmount should apply correct pricing', () => {
      expect(calculateAmount(30)).toBe(10); // 30 minutes = ₹10
      expect(calculateAmount(60)).toBe(10); // 1 hour = ₹10
      expect(calculateAmount(90)).toBe(30); // 1.5 hours = ₹10 + ₹20
      expect(calculateAmount(120)).toBe(30); // 2 hours = ₹10 + ₹20
      expect(calculateAmount(150)).toBe(50); // 2.5 hours = ₹10 + ₹20 + ₹20
    });

    test('computeBilling should combine duration and amount', () => {
      const entryTime = new Date('2025-09-23T17:00:00.000Z');
      const exitTime = new Date('2025-09-23T17:30:00.000Z');
      
      const billing = computeBilling(entryTime, exitTime);
      
      expect(billing).toEqual({
        duration: 30,
        amount: 10
      });
    });
  });

  describe('Slot Management', () => {
    const slots = [
      { id: 1, status: 'available', carNumber: null, entryTime: null },
      { id: 2, status: 'occupied', carNumber: 'MH12AB1234', entryTime: new Date() },
      { id: 3, status: 'occupied', carNumber: 'KA01CD5678', entryTime: new Date() }
    ];

    test('findSlotById should find slot by ID', () => {
      expect(findSlotById(slots, 2)).toEqual(slots[1]);
      expect(findSlotById(slots, 99)).toBeNull();
    });

    test('findSlotByCarNumber should find slot by car number', () => {
      expect(findSlotByCarNumber(slots, 'MH12AB1234')).toEqual(slots[1]);
      expect(findSlotByCarNumber(slots, 'mh12ab1234')).toEqual(slots[1]); // Case insensitive
      expect(findSlotByCarNumber(slots, 'NOTFOUND')).toBeNull();
    });

    test('getAvailableSlots should return available slots', () => {
      const available = getAvailableSlots(slots);
      expect(available).toHaveLength(1);
      expect(available[0]).toEqual(slots[0]);
    });

    test('getOccupiedSlots should return occupied slots', () => {
      const occupied = getOccupiedSlots(slots);
      expect(occupied).toHaveLength(2);
      expect(occupied).toEqual([slots[1], slots[2]]);
    });

    test('getSlotCounts should return correct counts', () => {
      const counts = getSlotCounts(slots);
      expect(counts).toEqual({
        total: 3,
        available: 1,
        occupied: 2
      });
    });
  });

  describe('Validation Functions', () => {
    test('isValidCarNumber should validate car numbers', () => {
      expect(isValidCarNumber('MH12AB1234')).toBe(true);
      expect(isValidCarNumber('KA01CD5678')).toBe(true);
      expect(isValidCarNumber('DL9CAB123')).toBe(true);
      
      expect(isValidCarNumber('INVALID')).toBe(false);
      expect(isValidCarNumber('123456')).toBe(false);
      expect(isValidCarNumber('')).toBe(false);
      expect(isValidCarNumber(null)).toBe(false);
    });

    test('formatCarNumber should format car numbers', () => {
      expect(formatCarNumber('mh12ab1234')).toBe('MH12AB1234');
      expect(formatCarNumber('  ka01cd5678  ')).toBe('KA01CD5678');
      expect(formatCarNumber('DL9CAB123')).toBe('DL9CAB123');
    });
  });

  describe('Formatting Functions', () => {
    test('formatDuration should format minutes correctly', () => {
      expect(formatDuration(30)).toBe('30 minutes');
      expect(formatDuration(60)).toBe('1 hour');
      expect(formatDuration(90)).toBe('1 hour 30 minutes');
      expect(formatDuration(120)).toBe('2 hours');
      expect(formatDuration(150)).toBe('2 hours 30 minutes');
    });

    test('formatAmount should format currency correctly', () => {
      expect(formatAmount(10)).toBe('₹10');
      expect(formatAmount(100)).toBe('₹100');
      expect(formatAmount(0)).toBe('₹0');
    });
  });
});

// Test Suite: Receipt Entity
describe('Receipt Entity Tests', () => {
  
  test('generateReceiptId should generate unique IDs', () => {
    const id1 = generateReceiptId();
    const id2 = generateReceiptId();
    
    expect(id1).toMatch(/^PMS-\d{4}-[A-Z0-9]{8}$/);
    expect(id2).toMatch(/^PMS-\d{4}-[A-Z0-9]{8}$/);
    expect(id1).not.toBe(id2);
  });

  test('createExtendedReceipt should create extended receipt', () => {
    const basicReceipt = {
      slotId: 1,
      carNumber: 'MH12AB1234',
      entryTime: new Date('2025-09-23T17:00:00.000Z'),
      exitTime: new Date('2025-09-23T17:30:00.000Z'),
      duration: 30,
      amount: 10
    };

    const extended = createExtendedReceipt(basicReceipt, 5);
    
    expect(extended).toMatchObject(basicReceipt);
    expect(extended.id).toMatch(/^PMS-\d{4}-[A-Z0-9]{8}$/);
    expect(extended.regIndex).toBe(5);
    expect(extended.generatedAt).toBeInstanceOf(Date);
    expect(extended.status).toBe('completed');
  });

  test('formatReceiptDate should format dates correctly', () => {
    const date = new Date('2025-09-23T17:30:00.000Z');
    const formatted = formatReceiptDate(date);
    
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [ap]m/);
  });

  test('generateReceiptText should create formatted receipt', () => {
    const receipt = {
      id: 'PMS-0001-ABCD1234',
      slotId: 1,
      carNumber: 'MH12AB1234',
      entryTime: new Date('2025-09-23T17:00:00.000Z'),
      exitTime: new Date('2025-09-23T17:30:00.000Z'),
      duration: 30,
      amount: 10,
      regIndex: 5,
      generatedAt: new Date('2025-09-23T17:30:00.000Z')
    };

    const text = generateReceiptText(receipt);
    
    expect(text).toContain('PARKING RECEIPT');
    expect(text).toContain('PMS-0001-ABCD1234');
    expect(text).toContain('MH12AB1234');
    expect(text).toContain('₹10');
  });

  test('validateReceipt should validate receipt data', () => {
    const validReceipt = {
      id: 'PMS-0001-ABCD1234',
      slotId: 1,
      carNumber: 'MH12AB1234',
      entryTime: new Date(),
      exitTime: new Date(),
      duration: 30,
      amount: 10
    };

    expect(validateReceipt(validReceipt)).toBe(true);
    expect(validateReceipt({})).toBe(false);
    expect(validateReceipt(null)).toBe(false);
  });
});

// Test Suite: Storage
describe('Storage Tests', () => {
  
  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
  });

  test('serializeForStorage should handle Date objects', () => {
    const data = {
      date: new Date('2025-09-23T17:00:00.000Z'),
      string: 'test',
      number: 42
    };

    const serialized = serializeForStorage(data);
    expect(serialized).toContain('"date":{"__type":"Date","value":"2025-09-23T17:00:00.000Z"}');
  });

  test('deserializeFromStorage should restore Date objects', () => {
    const serialized = '{"date":{"__type":"Date","value":"2025-09-23T17:00:00.000Z"},"string":"test"}';
    const deserialized = deserializeFromStorage(serialized);
    
    expect(deserialized.date).toBeInstanceOf(Date);
    expect(deserialized.date.toISOString()).toBe('2025-09-23T17:00:00.000Z');
    expect(deserialized.string).toBe('test');
  });

  test('isStorageAvailable should detect localStorage availability', () => {
    expect(isStorageAvailable()).toBe(true);
    
    // Mock unavailable localStorage
    global.localStorage = undefined;
    expect(isStorageAvailable()).toBe(false);
  });
});

// Test Suite: State Management
describe('State Management Tests', () => {
  
  test('Actions should create proper action objects', () => {
    const assignAction = Actions.assignCar(1, 'MH12AB1234', new Date());
    expect(assignAction).toEqual({
      type: ActionTypes.ASSIGN_CAR,
      payload: { slotId: 1, carNumber: 'MH12AB1234', entryTime: expect.any(Date) }
    });

    const releaseAction = Actions.releaseCar(1, new Date());
    expect(releaseAction).toEqual({
      type: ActionTypes.RELEASE_CAR,
      payload: { slotId: 1, exitTime: expect.any(Date) }
    });
  });

  test('stateReducer should handle ASSIGN_CAR action', () => {
    const initialState = createInitialState();
    const action = Actions.assignCar(1, 'MH12AB1234', new Date());
    
    const newState = stateReducer(initialState, action);
    
    expect(newState.slots[0]).toEqual({
      id: 1,
      status: 'occupied',
      carNumber: 'MH12AB1234',
      entryTime: expect.any(Date)
    });
  });

  test('stateReducer should handle RELEASE_CAR action', () => {
    const initialState = createInitialState();
    // First assign a car
    const assignedState = stateReducer(initialState, Actions.assignCar(1, 'MH12AB1234', new Date()));
    
    // Then release it
    const releasedState = stateReducer(assignedState, Actions.releaseCar(1, new Date()));
    
    expect(releasedState.slots[0]).toEqual({
      id: 1,
      status: 'available',
      carNumber: null,
      entryTime: null
    });
  });

  test('stateReducer should handle ADD_REVENUE action', () => {
    const initialState = createInitialState();
    const action = Actions.addRevenue(50);
    
    const newState = stateReducer(initialState, action);
    
    expect(newState.totalRevenue).toBe(50);
  });

  test('stateReducer should handle INCREMENT_REG_INDEX action', () => {
    const initialState = createInitialState();
    const action = Actions.incrementRegIndex();
    
    const newState = stateReducer(initialState, action);
    
    expect(newState.regIndex).toBe(2);
  });
});

// Run all tests
console.log('🧪 Running Parking Management System Tests...');

// Simple test runner
const runTests = () => {
  let passed = 0;
  let failed = 0;
  
  const testResults = [];
  
  // Mock test framework functions
  global.describe = (name, fn) => {
    console.log(`\n📋 ${name}`);
    fn();
  };
  
  global.test = (name, fn) => {
    try {
      fn();
      console.log(`  ✅ ${name}`);
      passed++;
      testResults.push({ name, status: 'passed' });
    } catch (error) {
      console.log(`  ❌ ${name}: ${error.message}`);
      failed++;
      testResults.push({ name, status: 'failed', error: error.message });
    }
  };
  
  global.expect = (actual) => ({
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toHaveLength: (expected) => {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${actual.length}`);
      }
    },
    toBeInstanceOf: (expected) => {
      if (!(actual instanceof expected)) {
        throw new Error(`Expected instance of ${expected.name}, got ${typeof actual}`);
      }
    },
    toMatch: (pattern) => {
      if (!pattern.test(actual)) {
        throw new Error(`Expected ${actual} to match ${pattern}`);
      }
    },
    toContain: (expected) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    },
    toMatchObject: (expected) => {
      for (const key in expected) {
        if (actual[key] !== expected[key]) {
          throw new Error(`Expected ${key} to be ${expected[key]}, got ${actual[key]}`);
        }
      }
    },
    not: {
      toBe: (expected) => {
        if (actual === expected) {
          throw new Error(`Expected not to be ${expected}`);
        }
      }
    }
  });
  
  global.beforeEach = (fn) => fn();
  global.jest = { fn: () => () => {} };
  
  return { passed, failed, testResults };
};

export { runTests };
