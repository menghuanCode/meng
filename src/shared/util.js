/* @flow */

/**
 * 制作Map
 */
export function makeMap(
  str: string,
  expectsLowerCase: boolean     // 预计转小写
) : (key: string) => true | void {
  const map = Object.create(null)
  const list = str.split(',')
  for(let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }

  return expectsLowerCase
    ? (val) => map[val.toLowerCase()]
    : (val) => map[val]
}

/**
 * 检查标签是否为内置标签
 */
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * 创建一个存函数的缓存版本
 */
export function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn(str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}


/**
 * Camelize 驼峰化 一个-连接的字符串
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * 不执行任何操作。
 * Stubbing args 使 Flow 流畅不会留下任何无用的代码
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
export function noop(a?: any, b?: any, c:? any) {

}

/**
 * 总是 return false
 */
export const no = (a?: any, b?: any, c?: any) => false

