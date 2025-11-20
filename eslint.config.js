// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);

export default [
  {
    files: ["**/__tests__/**/*.{ts,tsx,js,jsx}", "jestSetup.js"],
    languageOptions: {
      globals: {
        jest: true
      }
    }
  }
];
