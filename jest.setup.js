// jest.setup.js
import '@testing-library/jest-dom' // Extends Jest with custom matchers for DOM elements
import 'whatwg-fetch' // Polyfill for fetch in Node.js environment for Jest

// Mock NextAuth's useSession hook
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'), // Import and retain default behavior
  useSession: jest.fn(), // Mock useSession
}));

// Mock Next's useRouter hook
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(() => ({ // Provide a mock implementation for useRouter
    push: jest.fn(), // Mock the push function
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
  redirect: jest.fn(), // Also mock redirect if used standalone
}));

// You can add other global mocks or setup here, e.g., for environment variables
// process.env.NEXTAUTH_URL = 'http://localhost:3000/api/auth'; // Example

// Mock global fetch
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks(); // Clears mock usage data between tests
  (global.fetch as jest.Mock).mockClear(); // Also clear fetch mocks specifically
});
