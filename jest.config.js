/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo/web',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((react-native.*|@react-native.*|expo.*|@expo.*|@react-navigation.*|nativewind)/))',
  ],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'core/**/*.{ts,tsx}',
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
    '!**/__mocks__/**',
    '!**/*.spec.ts',
    '!**/*.spec.tsx',
    '!**/theme/**',
    '!**/assets/**',
    '!**/constants/**',
    '!**/tailwind/**',
    '!**/nativewind-env/**',
    '!**/components/**',
    '!core/database/mockDb.ts',
    '!core/examplearrays/**',
    '!core/helper/queryClient.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // fakeTimers desactivado para compatibilidad con React Query
  // fakeTimers: {
  //   enableGlobally: true,
  // },
};
