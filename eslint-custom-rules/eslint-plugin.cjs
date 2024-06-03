module.exports = {
  rules: {
    "enforce-custom-error": require("./enforce-custom-error.cjs"),
    "enforce-try-catch-in-controller": require("./enforce-try-catch-in-controller.cjs"),
    "enforce-consistent-return-express": require("./enforce-consistent-return-express.cjs"),
    "enforce-logger": require("./enforce-logger.cjs"),
  },
  configs: {
    recommended: {
      plugins: ["@joao-cst"],
      rules: {
        "@joao-cst/enforce-custom-error": "error",
        "@joao-cst/enforce-try-catch-in-controller": "error",
        "@joao-cst/enforce-consistent-return-express": "error",
        "@joao-cst/enforce-logger": "error",
      },
    },
  },
};
