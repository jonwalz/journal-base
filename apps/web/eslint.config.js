import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importX from "eslint-plugin-import-x";
import globals from "globals";

export default defineConfig([
  // Ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/.cache/**",
      "**/public/build/**",
    ],
  },

  // Base JS/TS config
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React config for all JS/TS files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "import-x": importX,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
      "import-x/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // React rules
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      // JSX A11y rules
      ...jsxA11y.configs.recommended.rules,

      // Import rules
      "import-x/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],
      "import-x/no-duplicates": "warn",

      // TypeScript overrides
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",

      // React Hooks - disable strict experimental rules
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",

      // Disable prop-types (using TypeScript)
      "react/prop-types": "off",
    },
  },

  // Node config for config files
  {
    files: ["*.config.{js,ts,mjs,cjs}", "vite.config.ts", "postcss.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
