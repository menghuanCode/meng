/* @flow */

const _toString = Object.prototype.toString
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