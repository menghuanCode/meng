/* @flow */

import { noop, extend } from "shared/util"
import { warn as baseWarn, tip } from 'core/util/debug'

type CompiledFunctionResult = {
  render: Function;
  staticRenderFns: Array<Function>;
}

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
export function createCompileToFunctionFn (compile: Function): Function {
  const cache = Object.create(null)

  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    options = extend({}, options)
    const warn = options.warn || baseWarn
    delete options.warn

    if (process.env.NODE_ENV !== 'productiion') {
      // 检测可能的CSP限制
      try {
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            '您似乎在具有禁止不安全评估的内容安全策略的环境中使用Vue.js的独立版本。' +
            '模板编译器无法在此环境中工作。' +
            '考虑放宽策略以允许不安全评估或将模板预编译为渲染功能。'
          )
        }
      }
    }

    // check cache
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template

    if (cache[key]) {
      return cache[key]
    }

    // compile
    const compiled = compile(template, options)

    // 检查编译错误/提示
    if (process.env.NODE_ENV !== 'productiion') {
      if (compiled.errors && compiled.errors.length) {
        warn(`Error compiling template:\n\n${template}\n\n` +
          compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
          vm
        )
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(msg => tip(msg, vm))
      }
    }

    // 将代码转换为函数
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => createFunction(code, fnGenErrors))

    // 检查函数生成错误。
    // 只有在编译器本身存在错误时才会发生这种情况。
    // 主要用于codegen开发使用
    if (process.env.NODE_ENV !== 'productiion') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `无法生成渲染函数:\n\n` +
          fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
          vm
        )
      }
    }

    return (cache[key] = res)
  }
}
