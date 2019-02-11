/* @flow */

import {
	noop,
	isReserved,
	isPlainObject
} from '../util/index'

const sharedPropertyDefinition = {
	enumerable: true,
	configurable: true,
	get: noop,
	set: noop
}

export function proxy(target: Object, sourceKey: string, key: string) {
	sharedPropertyDefinition.get = function proxyGetter() {
		return this[sourceKey][key]
	}
	sharedPropertyDefinition.set = function proxySetter(val) {
		this[sourceKey][key] = val
	}

	Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function initState(vm: Component) {
	vm._watchers = []
	const opts = vm.$options
	if (opts.props) initProps(vm, opts.props)
	if (opts.methods) initMethods(vm, opts.methods)
	if (opts.data) {
		initData(vm)
	} else {
		// observe(vm._data = {}, true /* asRootData */)
	}
}

function initData(vm: Component) {
	let data = vm.$options.data
	data = vm._data = typeof data === 'function'
		? getData(data, vm)
		: data || {}

	if (!isPlainObject(data)) {
		data = {}
		process.env.NODE_ENV !== 'production' && warn(
			'data函数应该返回一个对象:\n' + 
			'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
			vm
		)
	}

	// 实例上的代理数据
	const keys = Object.keys(data)
	const props = vm.$options.props
	const methods = vm.$options.methods
	let i = keys.length
	while(i--) {
		const key = keys[i]
		if (process.env.NODE_ENV !== 'production') {
			if (methods && hasOwn(methods, key)) {
				warn(`方法 "${key}" 已被定义为 data 属性.`, vm)
			}
		}

		if (props && hasOwn(props, key)) {
			process.env.NODE_ENV !== 'production' && warn(
				`data 属性 "${key}" 以被声明为一个 prop 属性. ` +
	        	`使用 prop 默认值代替.`,
	        	vm
			)
		} else if(!isReserved(key)) {
			proxy(vm, `_data`, key)
		}
	}

}


/**
 * 获取数据
 */
export function getData(data: Function, vm: Component): any {
	try {
		return data.call(vm, vm)
	} catch (e) {

	} finally {

	}
}

export function stateMixin(Vue: Class<Component>) {

}