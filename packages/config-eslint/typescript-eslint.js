import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export const typescriptEslintConfig = defineConfig(
  ...tseslint.configs.strict,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        allowDefaultProject: ["eslint.config.mjs", "vite.config.ts"],
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
);
