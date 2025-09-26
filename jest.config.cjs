module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: [
    '**/test/**/*.test.{js,ts}'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts'
  ],
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        target: 'ES2022',
        module: 'ESNext'
      }
    }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  // Fix Jest hanging by forcing exit after tests complete
  forceExit: true,
  // Detect open handles to help debug async issues
  detectOpenHandles: true,
  // Set timeout for test suite
  testTimeout: 30000,
  // Transform ES modules in node_modules that Jest can't handle
  transformIgnorePatterns: [
    'node_modules/(?!.*)'
  ]
};