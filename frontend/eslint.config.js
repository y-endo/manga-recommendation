import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // --- 命名規則 ---
      // クラス、インターフェース、型エイリアスなどはパスカルケース
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['StrictPascalCase'],
        },
      ],
      // --- import関連 ---
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              pattern: './**.+(css|scss|sass)',
              group: 'sibling',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
          },
        },
      ],
      'import/no-duplicates': 'error',
    },
  },
  prettier,
];

export default config;
