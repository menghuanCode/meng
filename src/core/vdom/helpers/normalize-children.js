/* @flow */

import { isFalse, isTrue, isDef, isUndef, isPrimitive } from 'shared/util'

/**
 * 模板编辑器尝试通过在编译时静态分析模板来达到最小化、规范化的需要。
 * 对于纯 HTML 标记， 可以完全跳过规范化，因为生成的渲染函数保证返回Array<VNode>。
 * 有两种情况需要额外的标准化：
 */

/**
 * 1. 当 children 选项包含 component 的，因为功能组件可能返回一个数组而不是一个根。
 * 在这种情况下，只需要一个简单的规范化 —— 如果有任何子节点是一个数组，我们用 Array.prototype.concat
 * 来展平 整个数组，保证深度只有一级，因为 功能组件 已经规范化了自己的 children。
 */
export function simpleNormalizeChildren	(children: any) {
	for (let i = 0; i < children.length; i++) {
		if (Array.isArray(children[i])) {
			return Array.prototype.concat.apply([], children)
		}
	}
	return children
}

/**
 * 当子节点包含	始终生成嵌套数组的构造时，例如：<template>,<slot>,v-for
 * 或当用户使用手写的渲染函数/JSX 提供的子项时。
 * 在这种情况下，需要完全标准化以满足所有可能类型的 children 价值观
 */
export function normalizeChildren(children: any): ?Array<VNode> {
	return isPrimitive(children)
		? [createTextVNode(children)]
		: Array.isArray(children)
			? normalizeArrayChildren(children)
			: undefined
}

// 是文本节点
function isTextNode(node): boolean {
	return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren(children: any, nestedIndex?: string): Array<VNode> {
	const res = []
	let i, c, lastIndex, last
	for (i = 0; i < children.length; i++) {
		c = children[i]
		if (isUndef(c) || typeof c === 'boolean') continue
		lastIndex = res.length - 1
		last = res[lastIndex]
		// 嵌套
		if (Array.isArray(c)) {
			if (c.length > 0) {
				c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)
				// 合并响铃文字节点
				if (isTextNode(c[0]) && isTextNode(last)) {
					res[lastIndex] = createTextVNode(last.text + (c[0]: any).text)
					c.shift()
				}
				res.push.apply(res, c)
			}
		} else if (isPrimitive(c)) {
			if (isTextNode(last)) {
				// 合并相邻的文本节点
				// 这对于SSR进程是必要的，因为文本节点是
				// 在呈现为HTML字符串时基本上合并
				res[lastIndex] = createTextVNode(last.text + c)
			}
		} else {
			if (isTextNode(c) && isTextNode(last)) {
        // 合并相邻的文本节点
        res[lastIndex] = createTextVNode(last.text + c.text)
			} else {
				// 嵌套数组自己的默认键(可能由v-for生成)
				if (isTrue(children._isVList) &&
					isDef(c.tag) &&
					isUndef(c.key) &&
					isDef(nestedIndex)) {
					c.key = `__vlist${nestedIndex}_${i}__`
				}
				res.push(c)
			}
		}
	}
	return res
}