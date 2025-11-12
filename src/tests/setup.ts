import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock localStorage with actual implementation
let storage: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, value: string) => { storage[key] = value; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { storage = {}; },
  get length() { return Object.keys(storage).length; },
  key: (index: number) => Object.keys(storage)[index] || null,
};

global.localStorage = localStorageMock as Storage;

