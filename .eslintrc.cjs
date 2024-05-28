module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:@joao-cst/recommended",
    "xo",
    "plugin:import/recommended",
    "plugin:unicorn/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["**/*.spec.js", "**/*.spec.jsx"],
      env: {
        jest: true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "import/no-unresolved": 2,
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": [
      "error",
      "always",
      {
        arraysInObjects: false,
      },
    ],
    "import/extensions": ["error", "always"],
    "unicorn/prevent-abbreviations": "off",
    "unicorn/no-array-for-each": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "new-cap": "off",
    // No var shadowing
    "no-shadow": "error",
    "unicorn/no-array-reduce": "off",
    "unicorn/prefer-optional-catch-binding": "off",
    "capitalized-comments": "off",
  },
};
