/* @flow */

// 浏览器环境嗅探
export const inBrowser = typeof window !== 'undefined'
export const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform

export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isEdge = UA && UA.indexOf('edge/') > 0

// 是否原生
export function isNative(Ctor: any): boolean {
	return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

// 这需要lazy-evaled，因为之前可能需要vue
// vue-server-renderer可以设置VUE_ENV
let _isServer
export const isServerRendering = () => {
  if (_isServer === undefined) {
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // 检测vue-server-renderer的存在并避免
      // Webpack 填充进程
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }

  return _isServer
}
