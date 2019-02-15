/* @flow */

import config from '../config'
import { noop } from 'shared/util'

export let warn = noop
export let tip = noop
export let generateComponentTrace = (noop: any)	// 解决 flow 检查问题

if (process.env.NODE_ENV !== 'production') {

	const hasConsole = typeof console !== undefined

	warn = (msg, vm) => {
	  const trace = vm ? generateComponentTrace(vm) : ''

	  if (config.warnHandler) {
	    config.warnHandler.call(null, msg, vm, trace)
	  } else if (hasConsole && (!config.silent)) {
	    console.error(`[Vue warn]: ${msg}${trace}`)
	  }
	}

	tip = (msg, vm) => {
	  if (hasConsole && (!config.slient)) {
	    console.warn(`[Vue tip]: ${msg}` + (
	      vm ? generateComponentTrace(vm) : ''
      ))
    }
  }

}
