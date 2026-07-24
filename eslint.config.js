const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      '**/typings/*.d.ts',
      'scripts/**/*'
    ],

    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: 'src/tsconfig.json',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.es2026,
        ...globals.node
      }
    },

    plugins: {
      '@typescript-eslint': tseslint
    },

    rules: {
      // keep your existing rules here unchanged
    }
  }
];
