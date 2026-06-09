export default {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ['node', 'require', 'default'],
    },
    setupFiles: ['<rootDir>/src/mocks/setupFetch.ts'],
    setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/src/mocks/setup.ts'],
    transform: {
        '^.+\\.(ts|tsx|js|jsx|mjs)$': 'babel-jest',
    },
    transformIgnorePatterns: [],
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy',
        '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/src/__tests__/__mocks__/fileMock.ts',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
};
