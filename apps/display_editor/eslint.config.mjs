import { baseEslintConfig } from '@repo/eslint-config/base';
import { frontendEslintConfig } from '@repo/eslint-config/frontend';
import { testEslintConfig } from '@repo/eslint-config/test';

export default [
  ...baseEslintConfig,
  ...frontendEslintConfig,
  ...testEslintConfig,
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
