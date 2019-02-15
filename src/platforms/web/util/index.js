/* @flow */

import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'


/**
 * 如果元素选择器不是元素，则查询它
 */
export function query(el: string | Element): Element {
	if (typeof el === 'string') {
		const selected = document.querySelector(el)
		if (!selected) {
			process.env.NODE_ENV !== 'production' && console.warn(
				'无法找到元素：' + el
			)
			return document.createElement('div')
		}
		return selected
	} else {
		return el
	}
}
