import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/*.js',
      '**/build',
      '**/build',
      '**/dist',
      '**/dist',
      '**/node_modules',
      '**/node_modules',
      '**/package-lock.json',
      '**/package-lock.json',
      '**/coverage',
      '**/coverage',
      '**/.git',
      '**/.git',
      '**/.github',
      '**/.github',
      '**/.husky',
      '**/.husky',
      '**/.vscode',
      '**/.vscode',
      '**/.devcontainer',
      '**/.devcontainer',
      '**/CHANGELOG.md',
      '**/README.md',
      '**/docs',
      '**/docs',
      '**/reports',
      '**/reports',
    ],
  },
  ...compat.extends(
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
      prettier,
      '@typescript-eslint': typescriptEslint,
      'typescript-sort-keys': typescriptSortKeys,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'commonjs',

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: './',
      },
    },

    settings: {
      'import/resolver': {
        typescript: {},
      },
    },

    rules: {
      'no-return-await': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'no-console': 'warn',
      'no-restricted-syntax': ['off', 'ForOfStatement'],
      'lines-between-class-members': 'off',
      'class-methods-use-this': 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],

      'key-spacing': [
        'error',
        {
          afterColon: true,
        },
      ],

      'no-multi-spaces': 'error',

      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
        },
      ],

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],

      'import/prefer-default-export': 'off',

      'import/no-duplicates': [
        'error',
        {
          considerQueryString: true,
        },
      ],

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/exports-last': ['error'],
      'import/newline-after-import': ['error'],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],

      'prettier/prettier': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/unbound-method': 'error',

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],

      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            memberTypes: [
              'signature',
              'public-instance-field',
              'protected-instance-field',
              'private-instance-field',
              'public-static-field',
              'protected-static-field',
              'private-static-field',
              'public-abstract-field',
              'protected-abstract-field',
              'field',
              'public-constructor',
              'protected-constructor',
              'private-constructor',
              'constructor',
              'public-instance-get',
              'protected-instance-get',
              'private-instance-get',
              'public-static-get',
              'protected-static-get',
              'private-static-get',
              'public-abstract-get',
              'protected-abstract-get',
              'get',
              'public-instance-set',
              'protected-instance-set',
              'private-instance-set',
              'public-static-set',
              'protected-static-set',
              'private-static-set',
              'public-abstract-set',
              'protected-abstract-set',
              'set',
              'public-instance-method',
              'protected-instance-method',
              'private-instance-method',
              'public-static-method',
              'protected-static-method',
              'private-static-method',
              'public-abstract-method',
              'protected-abstract-method',
              'method',
            ],

            order: 'alphabetically',
          },
        },
      ],

      '@typescript-eslint/lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
        },
      ],

      'typescript-sort-keys/interface': 'off',
      'typescript-sort-keys/string-enum': 'error',
    },
  },
];
