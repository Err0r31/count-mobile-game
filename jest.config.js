/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-router|@expo-google-fonts|@unimodules|unimodules|native-base)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(mp3|wav|ogg)$": "<rootDir>/__mocks__/fileMock.js",
    "^@app/(.*)$": "<rootDir>/app/$1",
    "^@storage$": "<rootDir>/storage.ts",
    "^@storage/(.*)$": "<rootDir>/storage/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  verbose: true,

  // Включение cборки покрытия кода (coverage)
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.ts",
    "app/**/*.tsx",
    "!app/**/__tests__/**",
    "!app/**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
