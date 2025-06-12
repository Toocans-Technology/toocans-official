// jest.setup.js
import '@testing-library/jest-dom';

// You can add other global setups here if needed.
// For example, mocking global objects or functions:
// global.matchMedia = global.matchMedia || function() {
//   return {
//     matches: false,
//     addListener: function() {},
//     removeListener: function() {}
//   };
// };

// Mock for next/router (if not handled by next/jest automatically for your version)
// jest.mock('next/router', () => require('next-router-mock'));

// Mock for fetch if you haven't done it in specific tests or want a global default
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({ data: 'mocked data' }),
//   })
// );

// Any other global mocks or configurations can go here.
// For example, if you're using an i18n library, you might initialize it here.

// Silence console.error and console.warn during tests if they are too noisy,
// but be careful as this might hide important warnings.
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(jest.fn());
//   jest.spyOn(console, 'warn').mockImplementation(jest.fn());
// });
