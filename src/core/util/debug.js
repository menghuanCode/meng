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
}
