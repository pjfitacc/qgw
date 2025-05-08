import { defineConfig } from "eslint/config";
import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsdoc from "eslint-plugin-tsdoc";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends("plugin:@typescript-eslint/recommended"),

    files: ["src/**/*.ts"],

    plugins: {
      "@typescript-eslint": typescriptEslintEslintPlugin,
      tsdoc,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2016,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    rules: {
      "tsdoc/syntax": "warn",
    },
  },
]);
