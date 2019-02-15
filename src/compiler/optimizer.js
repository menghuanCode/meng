/* @flow */

import { makeMap, isBuiltInTag, cached, no } from "shared/util";

/**
 * 优化器的目标：遍历生成的模板 AST 树
 * 并检测纯静态的子树, 即从不需要更改的DOM的部分。
 *
 * 一旦我们检测到这些子树，我们就可以：
 *
 * 1. 将它们提升为常数，这样我们就不再需要在每次重新渲染时为它们创建新的节点;
 * 2. 在修补过程中完全跳过它们。
 */
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
}

