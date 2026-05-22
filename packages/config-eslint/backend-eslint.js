import globals from "globals";

export const backendEslintConfig = [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
