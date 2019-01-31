/* @flow */

/**
 * 检查一个 string 开头是否是 $ 或者 _
 */
export function isReserved (str: string): boolean {
	const c = (str + '').charCodeAt(0)
	return c === 0x24 || c === 0x5F
}