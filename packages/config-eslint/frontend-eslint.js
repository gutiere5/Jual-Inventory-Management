import { baseEslintConfig } from "./base-eslint.js";
import reactEslintConfig from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import globals from "globals";

export const frontendEslintConfig = [
  reactEslintConfig.configs.flat.recommended,
  reactEslintConfig.configs.flat["jsx-runtime"],
  reactHooks.configs.flat["recommended-latest"],
  reactRefresh.configs.recommended,
  {
    settings: {
      react: { version: "19.2.4" },
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
