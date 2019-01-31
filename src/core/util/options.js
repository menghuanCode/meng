/* @flow */

import config from '../config'

import {
	hasOwn,
	isBuiltInTag
} from 'shared/util'

// 选项合并策略
// 如何将父选项值和子选项值合并成最终值
const strats = config.optionMergeStrategies

/**
 * 限制选择
 */
if (process.env.NODE_ENV !== 'production') {
	strats.el = strats.propsData = function (parent, child, vm, key) {
		if (!vm) {
			console.warn(`选项"${key}"只能在实例` + `使用'new'关键字创建`)
		}
		return defaultStrat(parent, child)
	}

}


/**
 * 默认策略.
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
	return childVal === undefined
		? parentVal
		: childVal
}

/**
 * 验证组件名称
 */
function checkComponents (options: Object) {
	for (const key in options.components) {
		validateComponentName(key)
	}
}

export function validateComponentName(name: string) {
	if (!/^[a-zA-Z][\w-]*$/.test(name)) {
		console.warn(
			'无效的组件名称： "' + name + '". 组件名称 ' +
			'只能包含字母数字字符和连字符', + 
			'必须以字母开头'
		)
	}
	
	if (isBuiltInTag(name) || config.isReservedTag(name)) {
		console.warn(
	      '不能讲内置或保留的html元素用于组件 ' +
	      'id: ' + name
		)
	}
}


/**
 * 合并两个对象生成一个新的。
 * 用于实例化和继承的核心实用程序
 */

export function mergeOptions (
	parent: Object,
	child: Object,
	vm?: Component
): Object {
	if (process.env.NODE_ENV !== 'production') {
		checkComponents(child)
	}

	if (typeof child === 'function') {
		child = child.options
	}

	// normalizeProps(child, vm)
	// normalizePropsInject(child, vm)
	// normalizeDirectives(child)

	// 在子选项上应用 extends 和 mixins,
	// 但前提是他是一个原始选项对象
	// 而不是另一个 mergeOptions 调用的结果。
	// 只有合并的选项具有 _base 属性。
	if (!child._base) {
		if (child.extends) {
			parent = mergeOptions(parent, child.extends, vm)
		}
		if (child.mixins) {
			for(let i = 0, l = child.mixins.length; i < l; i++) {
				parent = mergeOptions(parent, child.mixins[i], vm)
			}
		}
	}

	const options = {}
	let key
	for (key in parent) {
		mergeFiled(key)
	}
	for (key in child) {
		if (!hasOwn(parent, key)) {
			mergeFiled(key)
		}
	}

	function mergeFiled(key) {
		const strat = strats[key] || defaultStrat
		options[key] = strat(parent[key], child[key], vm, key)
	}

	return options
}