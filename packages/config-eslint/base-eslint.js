import eslintJS from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import pluginQuery from "@tanstack/eslint-plugin-query";

// Sets up linting for Prettier, tanstack, turbo, and default eslint
export const baseEslintConfig = defineConfig([
  eslintJS.configs.recommended,
  turboPlugin.configs["flat/recommended"],
  ...pluginQuery.configs["flat/recommended-strict"],
  eslintConfigPrettier,
  {
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "no-console": "error",
    },
  },
  {
    ignores: [
      "generated/",
      "dist/",
      "coverage/",
      ".turbo/",
      ".vite/",
      ".next/",
      "build/",
      "out/",
      ".cache/",
      "tmp/",
    ],
  },
]);
