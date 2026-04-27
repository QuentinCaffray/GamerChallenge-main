import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

const eslintConfig = defineConfig([
  // Configurations Next.js (Core Web Vitals + TypeScript)
  ...nextVitals,
  ...nextTs,

  // Override des ignores par défaut de Next.js
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Ajout de tes ignores personnalisés
    'node_modules/',
    'dist/',
    'coverage/',
    'prisma/migrations/',
    '*.lock'
  ]),

  // Configuration personnalisée pour TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all']
    }
  }
]);

export default eslintConfig;
