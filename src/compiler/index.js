/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'


// `createCompilerCreator` 创建编译创建器
// parser / optimizer / codegen， 例如SSR优化编译器。
//  这里我们只使用默认部件导出默认编译器。
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)

  debugger
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
