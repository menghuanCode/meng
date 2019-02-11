/* @flow */

// 浏览器环境嗅探
export const inBrowser = typeof window !== 'undefined'
export const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform

// 是否原生
export function isNative(Ctor: any): boolean {
	return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

