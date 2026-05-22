import { baseEslintConfig } from "@repo/eslint-config/base";
import { backendEslintConfig } from "@repo/eslint-config/backend";
import { typescriptEslintConfig } from "@repo/eslint-config/typescript";

export default [
  ...baseEslintConfig,
  ...backendEslintConfig,
  ...typescriptEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs"],
        },
      },
    },
  },
];
