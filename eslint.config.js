import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"], 
    languageOptions: {
      globals: {
        ...globals.node,  // Node.js globals
        ...globals.jest,  // Jest globals
      },
    },
    plugins: {
      js: pluginJs,      
      jest: pluginJest,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginJest.configs.recommended.rules,
    },
  },
];
