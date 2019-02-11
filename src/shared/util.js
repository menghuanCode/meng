/* @flow */

export const emptyObject = Object.freeze({})

// 这些助手有助于在JS引擎中生成更好的VM代码，
// 这是因为它们的明确性和内嵌性
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}
export function isTrue (v: any): boolean %checks {
  return v === true
}
export function isFalse (v: any): boolean %checks {
  return v === false
}

export function isPrimitive (value: any): boolean %checks {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
	)
}

export function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}

export function isRegExp(v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}


/**
 * 获取值的原始类型字符串, e.g., [object Object].
 */
const _toString = Object.prototype.toString

export function toRawType(value: any): string {
	return _toString._call(value).split(8, -1)
}

/**
 * String object 类型检查.只返回 true
 * 用于纯 JavaScript 对象。
 */
export function isPlainObject(obj: any): boolean {
	return _toString.call(obj) === '[object Object]'
}

/**
 * 制作一个地图和返回一个检查 key 函数
 * 判断是否在地图里面
 */
export function makeMap(
	str: string,
	expectsLowerCase?: boolean
): (key: string) => true | void {
	let obj = {}
	let keys = str.split(',')

	return expectsLowerCase
		? key => obj[key.toLowerCase()]
		: key => obj[key]
}

/**
 * 检查一个 tag 是否是内置 tag
 */
export const isBuiltInTag = makeMap('slot,component', true)



/**
 * 检查对象是否有属性
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj: Object | Array<*>, key: string): boolean {
	return hasOwnProperty.call(obj, key)
}

/**
 * 将属性混合到目标对象中
 */
export function extend (to: Object, _from: ?Object): Object {
	for(const key in _from) {
		to[key] = _from[key]
	}

	return to
}

/**
 * 不执行任何操作，
 * Flow 流畅转换，不会留下无用的转换代码
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 *
 */
export function noop (a?: any, b?: any, c?: any) {}

/**
 * 总是返回 false
 */
export const no = (a?: any, b?: any, c?: any) => false


const camelizeRE = /-(\w)/g

/**
 * 驼峰化  -连接符转换
 */
export const camelize = cached((str: string) => {
	return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * 首字母大小
 */
export const capitalize = cached((str: string): string => {
	return str.charAt(0).toUpperCase + str.slice(1)
})


/**
 * 创建一个纯函数的缓存版本
 */
export function cached<F: Function>(fn: F): F {
	const cache = Object.create(null)
	return (function cachedFn(str: string) {
		const hit = cache[str]
		return hit || (cache[str] = fn(str))
	}: any)
}

/**
 * 纯函数，返回相同的值
 */
export const identity = (_: any) => _

