import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // Change to 'commonjs' if you use require/module.exports
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
    },
    rules: {
      'no-console': 'off', // Console is fine for server logging
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
]
