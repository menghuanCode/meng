/* @flow */

import config from '../config'
import { noop } from 'shared/util'

export let warn = noop
export let generateComponentTrace = (noop: any)   // 绕过检查


if (process.env.NODE_ENV != 'production') {
  const hasConsole = typeof console !== 'undefined'

  warn = (msg, vm) => {
    const trace = vm ? generateComponentTrace(vm) : ''

    // 如果有 warnHandle
    if (config.warnHandle) {
      config.warnHandler.call(null, msg, vm, trace)
    } else if (hasConsole && (!config.silent)) {    // config.slient  是否抑制警告
      console.error(`[Vue warn]: ${msg}${trace}`)
    }
  }

  formatComponentName = (vm, includeFile) => {
    if (vm.$root === vm) {
      return '<Root>'
    }
    const options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm
    let name = options.name || options._componentTag
    const file = options.__file

  }

  // 生成组件追踪
  generateComponentTrace = vm => {
    if (vm._isVue && vm.$parent) {
      const tree = []

      // 当前递归序列
      let currentRecursiveSequence = 0

      while (vm) {
      }
    } else {
      return `\n\n(found in ${formatComponentName(vm)})`
    }
  }
}
