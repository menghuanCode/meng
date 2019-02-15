/* @flow */

import Watcher from '../observer/watcher'
import { createEmptyVNode } from '../vdom/vnode'

import {
	warn
} from '../util/index'


export function initLifecycle (vm: Component) {

}

export function lifecycleMixin(Vue: Class<Component>) {
	Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
		const vm: Comment = this
		const prevEl = vm.$el
		const prevVNode = vm._vnode

		vm._vnode = vnode

		// Vue.prototype.__patch__ 是在入口注入
    // 基于使用的DOM
    if (!prevVNode) {
    	// 初始化渲染
    	vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
    	// 更新
    	vm.$el = vm.__patch__(prevVNode, vnode)
    }
	}
}


export function mountComponent (
	vm: Component,
	el: ?Element,
	hydrating?: boolean
): Component {
	vm.$el = el
	if (!vm.$options.render) {
		vm.$options.render = createEmptyVNode
		if (process.env.NODE_ENV !== 'production') {
			if (vm.$options.template && vm.$options.template.charAt(0) !== '#'
					|| vm.$options.el || el) {
				warn(
	        '您使用的是 runtime-only 版本的Vue模板 ' +
	        '编译器不可用。要么将模板预编译为 ' +
	        '呈现函数，或使用编译器包含的生成',
	        vm
	      )
			} else {
				warn(
					'装载组件失败：未定义模板或渲染函数。',
					vm
				)
			}
		}

		callHook(vm, 'beforeMount')

		let updateComponet

		updateComponet = () => {
			vm._update(vm._render(), hydrating)
		}


		// 我们这观察者的构造函数中定义了vm._watcher
		// 因为观察者的初始化可能会调用 $forceUpdate
		// PS:(例如，在子组件的挂载挂钩内)，这依赖于已定义的vm._watcher
		new Watcher(vm, updateComponent, noop, {
			before () {
				if (vm.isMounted && !vm._isDestroyed) {
					callHook(vm, 'beforeUpdate')
				}
			}
		}, true /* isRenderWatcher */)
		hydrating = false

		// 手动挂载实例，调用挂载自己
		// 在插入的钩子中调用了渲染创建的子组件
		if (vm.$vnode == null) {
			vm._isMounted = true
			callHook(vm, 'mounted')
		}
		return vm
	}
}

export function callHook (vm: Component, hook: string) {

}
