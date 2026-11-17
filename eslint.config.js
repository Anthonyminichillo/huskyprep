import js from "@eslint/js";
import globals from "globals";

// Backend lint config. The React frontend has its own config in frontend/.
export default [
  { ignores: ["node_modules/", "frontend/"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
];
