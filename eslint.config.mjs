import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import reactRefresh from "eslint-plugin-react-refresh";

// Note: eslint-config-prettier is a config package that disables conflicting ESLint rules.
// We import it dynamically (CJS) because it's not an ESM export.
const prettierConfig = await import("eslint-config-prettier").then((m) => m.default || m);

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // Plugins + rules
  {
    plugins: {
      import: importPlugin,
      "react-refresh": reactRefresh,
      // optionally: "prettier": require("eslint-plugin-prettier") // only if you want plugin
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

      // --- React Refresh ---
      "react-refresh/only-export-components": "warn",
    },
  },
  prettierConfig,

  // Global ignores (keep at the end)
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
