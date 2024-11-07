import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"], // Specify the file types this config applies to
    languageOptions: {
      globals: {
        ...globals.node,  // Node.js globals
        ...globals.jest,  // Jest globals
      },
    },
    plugins: {
      js: pluginJs,      // Register ESLint's built-in JavaScript rules
      jest: pluginJest,  // Register Jest plugin as an object
    },
    rules: {
      // Enable recommended rules for both plugins
      ...pluginJs.configs.recommended.rules,
      ...pluginJest.configs.recommended.rules,
    },
  },
];
