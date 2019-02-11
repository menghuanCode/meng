/* @flow */

import { initProxy } from './proxy'
import { initState } from './state'
import { initEvents } from './events'
import { initRender } from './render'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions } from '../util/index'


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
				resolveConstructorOptions(vm.constructor),
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
	if (Ctor.super) {
		const superOptions = resolveConstructorOptions(Ctor.super)
		const cachedSuperOptions = Ctor.superOptions
		if (superOptions !== cachedSuperOptions) {
			// super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // 检查是否有后期修改或附加选项(#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // 更新基本扩展选项
      if (modifiedOptions) {
      	extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
      	options.component[options.name] = Ctor
      }
		}
	}
	return options
}

function resolveModifiedOptions(Ctor: Class<Component>): ?Object {
	let modified
	const latest = Ctor.options
	const extended = Ctor.options
	const sealed = Ctor.sealedOptions
	for (const key in latest) {
		if (latest[key] !== sealed[key]) {
			if (!modified) modified = {}
			modified[key] = dedupe(latest[key], extended[key], sealed[key])
		}
	}
	return modified
}

// 重复数据删除
function dedupe(lastest, extended, sealed) {
	// 比较最新和密封以确保生命周期挂钩不会重复
	// 合并之间
	if (Array.isArray(lastest)) {
		const res = []
		sealed = Array.isArray(sealed) ? sealed : [sealed]
		extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
    	//推送原始选项而非密封选项以排除重复选项
    	if (extended.indexOf(lastest[i]) >= 0 || sealed.indexOf(lastest[i] < 0)) {
    		res.push(lastest[i])
    	}
    }
    return res
	} else {
		return lastest
	}
}