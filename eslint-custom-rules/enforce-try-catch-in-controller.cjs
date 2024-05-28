function hasNotTryCatchBlock(node) {
  const functionBody = getFunctionBody(node);

  if (!functionBody) {
    return false;
  }

  const functionBodyText =
    functionBody.type === "BlockStatement" ? functionBody.body : functionBody;

  return !functionBodyText.some(
    (childNode) => childNode.type === "TryStatement",
  );
}

function getFunctionBody(node) {
  if (node.type === "FunctionDeclaration") {
    // Get block statement body
    return node.body.body;
  }

  if (node.type === "ArrowFunctionExpression") {
    // Get block statement body
    return node.body.body;
  }
}

function surroundWithTryCatchBlock(fixer, node, context) {
  const bodyNodes = getFunctionBody(node);
  const tryBlock = bodyNodes.reduce((acc, childNode) => {
    acc += context.getSourceCode().getText(childNode) + "\n";
    return acc;
  }, "");
  const tryCatchBlock = `{\n  try {\n${tryBlock}\n} catch (error) {\n  \n}\n}`;

  return fixer.replaceText(node.body, tryCatchBlock);
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      category: "Style guide",
      description: "Enforce the use of try catch blocks in controller files",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    // Let isControllerFile = true;
    const fileName = context.getFilename();
    const isControllerFile = fileName.includes(".controller");

    return {
      // FunctionDeclaration OR ArrowFunctionExpression
      FunctionDeclaration(node) {
        if (isControllerFile && hasNotTryCatchBlock(node)) {
          context.report({
            node,
            message: `Use a try catch block inside controller functions`,
            fix(fixer) {
              return surroundWithTryCatchBlock(fixer, node, context);
              // Return fixer.insertTextAfter(node, "\n} catch (error) {\n  console.error(error);\n}");
            },
          });
        }
      },
      ArrowFunctionExpression(node) {
        if (isControllerFile && hasNotTryCatchBlock(node)) {
          context.report({
            node,
            message: `Use a try catch block inside controller functions`,
            fix(fixer) {
              return surroundWithTryCatchBlock(fixer, node, context);
              // Return fixer.insertTextAfter(node, "\n} catch (error) {\n  console.error(error);\n}");
            },
          });
        }
      },
    };
  },
};
