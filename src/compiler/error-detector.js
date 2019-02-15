/* @flow */

// 检测模板中有问题的表达式
export function detectErrors(ast: ?ASTNode): Array<string> {
  const errors: Array<string> = []
  if (ast) {
    checkNode(ast, errors)
  }
  return errors
}

function checkNode(node: ASTNode, errors: Array<string>) {
}
