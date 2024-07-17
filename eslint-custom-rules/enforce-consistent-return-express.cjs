function isWithinCatchClause(node) {
  while (node) {
    if (node.type === "CatchClause") {
      return true;
    }

    node = node.parent;
  }

  return false;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      category: "Style guide",
      description:
        "Enforce the consistent use of res.json({ message: string, data: any }) in Express routes",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node?.callee?.property?.name !== "json") return;
        const [firstArg] = node.arguments;
        if (firstArg?.type === "ObjectExpression") {
          const messageProp = firstArg.properties.find(
            (prop) => prop.key.name === "message",
          );
          const dataProp = firstArg.properties.find(
            (prop) => prop.key.name === "data",
          );
          const errorProp = firstArg.properties.find(
            (prop) => prop.key.name === "error",
          );

          const isInCatchClause = isWithinCatchClause(node);

          // if (isInCatchClause && (!messageProp || !errorProp)) {
          //   context.report({
          //     node,
          //     message: "Use res.json({ message: string, error: any })",
          //   });
          //   return;
          // }

          if (isInCatchClause) return;

          if (!messageProp || !dataProp) {
            context.report({
              node,
              message: "Use res.json({ message: string, data: any })",
            });
          }
        } else {
          const isInCatchClause = isWithinCatchClause(node);

          // if (isInCatchClause) {
          //   context.report({
          //     node,
          //     message: "Use res.json({ message: string, error: any })",
          //   });
          //   return;
          // }

          if (isInCatchClause) return;

          context.report({
            node,
            message: "Use res.json({ message: string, data: any })",
          });
        }
      },
    };
  },
};
