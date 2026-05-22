import { baseEslintConfig } from '@repo/eslint-config/base';
import { frontendEslintConfig } from '@repo/eslint-config/frontend';
import { testEslintConfig } from '@repo/eslint-config/test';
import { typescriptEslintConfig } from '@repo/eslint-config/typescript';

export default [
  ...baseEslintConfig,
  ...testEslintConfig,
  ...frontendEslintConfig,
  ...typescriptEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs', 'vite.config.ts'],
        },
      },
    },
  },
];
