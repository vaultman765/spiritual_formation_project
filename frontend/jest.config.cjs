module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/?(*.)+(test).[jt]s?(x)', '**/*.test.ts', '**/*.test.tsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};