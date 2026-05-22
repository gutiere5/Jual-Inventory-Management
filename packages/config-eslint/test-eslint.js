import tseslint from "typescript-eslint";
import vitest from "eslint-plugin-vitest";
import { defineConfig } from "eslint/config";

export const testEslintConfig = defineConfig(
  {
    files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    ...tseslint.configs.disableTypeChecked,
  },
);
