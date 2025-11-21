import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactRefresh from "eslint-plugin-react-refresh";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Import sorting, React Refresh, and Prettier integration
  {
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      "react-refresh": reactRefresh,
    },

    rules: {
      // --- Import sorting ---
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // --- React Refresh (dev only, but safe to include) ---
      "react-refresh/only-export-components": "warn",

      // --- Prettier formatting ---
      // This makes ESLint show Prettier errors in the Problems panel
      "prettier/prettier": "error",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
