/* @flow */

import { initProxy } from './proxy'
import { initState } from './state'
import { initEvents } from './events'
import { initRender } from './render'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { mergeOptions } from '../util/index'


let uid = 0

export function initMixin (Vue: Class<Component>) {
	Vue.prototype._init = function (options?: Object){ 
		const vm: Component = this
		// a uid
		vm._uid = uid++	

		// 一个标志，以避免被观察到
		vm._isVue = true

		// 合并對象
		if (options && options._isComponent) {
			// 优化内部组件实例化，因为动态选项合并非常缓慢，
			// 并且没有内部组件选项需要特殊处理
		} else {
			vm.$options = mergeOptions(
				// resolveConstructorOptions(vm.constructor),
				options || {},
				vm
			)
		}


		if (process.env.NODE_ENV !== 'production') {
			initProxy(vm)
		} else {
			vm._renderProxy = vm
		}

		// 暴露真实的自我
		vm._self = vm
		initLifecycle(vm)
		initEvents(vm)
		initRender(vm)
		callHook(vm, 'beforeCreate')
		initInjections(vm)		// 在 data/props 注入之前解析
		initState(vm)			
		initProvide(vm)			// 在 data/props 注入之后解析
		callHook(vm, 'created')

		if (vm.$options.el) {
			vm.$mount(vm.$options.el)
		}
	}
}

export function resolveConstructorOptions(Ctor: Class<Component>) {
	let options = Ctor.options
	return options
}