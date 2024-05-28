module.exports = {
  meta: {
    type: "problem",
    docs: {
      category: "Style guide",
      description:
        "Enforce the use of custom error classes instead of the built-in `Error` class",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    // Let isControllerFile = true;
    const fileName = context.getFilename();
    const isFileCovered = [".controller", ".route"].some((file) =>
      fileName.includes(file),
    );

    return {
      ThrowStatement(node) {
        // If (isControllerFile) return;
        // check if parent is function or arrow function
        // something like
        // node.closest() === "FunctionDeclaration" || node.closest() === "ArrowFunctionExpression"

        if (
          isFileCovered &&
          node.argument.type === "NewExpression" &&
          node.argument.callee.name === "Error"
        ) {
          context.report({
            node,
            message: `Use a custom error class instead of the built-in \`Error\``,
          });
        }
      },
    };
  },

  // Return {
  //   FunctionDeclaration(node) {
  //     context.report({
  //       node,
  //       message:
  //         "Use a custom error class instead of the built-in `Error` class",
  //     });
  //     // If (!isControllerFile) return;
  //     // const throwStatements = context
  //     // .getSourceCode()
  //     // .getDescendantNodes(node);
  //     // .filter(
  //     // (descendantNode) => true,
  //     // DescendantNode.type === "ThrowStatement" && true,
  //     // DescendantNode.argument &&
  //     // descendantNode.argument.type === "NewExpression" &&
  //     // descendantNode.argument.callee.name === "Error",
  //     // );
  //     // throwStatements.forEach((throwStatement) => {
  //     //   context.report({
  //     //     node: throwStatement.argument,
  //     //     message:
  //     //       "Use a custom error class instead of the built-in `Error` class",
  //     //   });
  //     // });
  //   },
  // };
};
