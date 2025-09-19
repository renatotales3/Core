module.exports = {
  ignores: ['node_modules/', 'build/', 'web-build/', '.expo/', '*.min.js', '*.bundle'],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  },
  settings: {},
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      ignores: ['node_modules/'],
      languageOptions: {
        parser: require.resolve('@typescript-eslint/parser'),
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    },
  ],
};
