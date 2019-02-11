/* @flow */

import { warn } from './debug'
import config from '../config'

import {
  extend,
  hasOwn,
  camelize,
  toRawType,
  capitalize,
  isBuiltInTag,
  isPlainObject
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
			warn(
        `选项 "${key}" 只能在实例中使用，` +
        '`new` 关键字创建实例.'
      )
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
		warn(
			'无效的组件名称： "' + name + '". 组件名称 ' +
			'只能包含字母数字字符和连字符', + 
			'必须以字母开头'
		)
	}
	
	if (isBuiltInTag(name) || config.isReservedTag(name)) {
		warn(
	      '不能讲内置或保留的html元素用于组件 ' +
	      'id: ' + name
		)
	}
}

/**
 * 规范化 props
 * 基于对象格式
 */
function normalizeProps(options: Object, vm: ?Component) {
	const props = options.props
	if (!props) return
	const res = {}
	let i, val, name
	if (Array.isArray(props)) {
		i = props.length
		while(i--) {
			val = props[i]
			if (typeof val === 'string') {
				name = camelize(val)
				res[name] = { type: null }
			} else if (process.env.NODE_ENV !== 'production') {
				warn('使用数组语法时，props必须是字符串.')
			}
		}
	} else if (isPlainObject(props)) {
		for(const key in props) {
			val = props[key]
			name = camelize[key]
			res[name] = isPlainObject(val)
				? val
				: { type: val }
		}
	} else if (process.env.NODE_ENV !== 'production') {
		warn(
      `选项 "props" 的值无效: 期望是一个数组或者对象, ` +
      `但传递过来的是 ${toRawType(props)}.`,
      vm
    )
	}
}

/**
 * 规范化 Inject
 * 基于对象的格式
 */
function normalizeInject(options: Object, vm: ?Comment) {
	const inject = options.inject
	if (!inject) return
	const normalized = options.inject = {}
	if (Array.isArray(inject)) {
		for(let i = 0; i < inject.length; i++) {
			normalized[inject[i]] = { from: inject[i] }
		} 
	} else if(isPlainObject(inject)) {
		for (const key in inject) {
			const val = inject[key]
			normalized[key] = isPlainObject(val)
				? extend({ from: key }, val)
				: { from: val }
		}
	} else if(process.env.NODE_ENV !== 'production') {
			warn(
      `选项 "inject" 的值无效: 期望是一个数组或者对象, ` +
      `但传递过来的是 ${toRawType(inject)}.`,
      vm
    	)
	}
}


/**
 * 规范化 directives
 * 基于对象的格式
 */
function normalizeDirectives(options: Object) {
	const dirs = options.directives
	if (dirs) {
		for(const key in dirs) {
			const def = dirs[key]
			if (typeof def === 'function') {
				dirs[key] = { bind: def, update: def }
			}
		}
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

	normalizeProps(child, vm)
	normalizeInject(child, vm)
	normalizeDirectives(child)

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
