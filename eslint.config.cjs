// ESLint flat config for ESLint v9
const typescript = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  // Ignore common build folders
  {
    ignores: ['node_modules/**', 'build/**', 'web-build/**', '.expo/**'],
  },
  {
    // Language options and parser
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      globals: {
        JSX: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    settings: {},
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    // Apply prettier compatibility via plugin/extend handled by package
  },
];
