module.exports = {
  meta: {
    type: "problem",
    docs: {
      category: "Style guide",
      description: "Enforce the use of logger.error() inside try and catch statements",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    const fileName = context.getFilename();
    const isControllerFile = fileName.includes(".controller");

    return {
      CatchClause(node) {
        if (!isControllerFile) return;
        const blockStatement = node.body;
        const hasLoggerError = blockStatement.body.some(statement => {
          return statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'CallExpression' &&
            statement.expression.callee.type === 'MemberExpression' &&
            statement.expression.callee.object.name === 'logger' &&
            statement.expression.callee.property.name === 'error';
        });

        if (!hasLoggerError) {
          context.report({
            node,
            message: "Use logger.error() inside catch statements",
          });
        }
      },
      TryStatement(node) {
        if (!isControllerFile) return;
        const blockStatement = node.block;
        const firstStatement = blockStatement.body[0];
        const lastStatement = blockStatement.body[blockStatement.body.length - 1];
        const hasLoggerError = [firstStatement, lastStatement].every(statement => {
          return statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'CallExpression' &&
            statement.expression.callee.type === 'MemberExpression' &&
            statement.expression.callee.object.name === 'logger' &&
            statement.expression.callee.property.name === 'info';
        });

        if (!hasLoggerError) {
          context.report({
            node,
            message: "Use logger.info() at the beginning and end of try statements",
          });
        }
      },
    };
  },
};
