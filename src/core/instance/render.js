/* @flow */

import {
	warn,
	handleError
} from '../util/index'

import { createElement } from '../vdom/create-element'
import VNode, { createEmptyVNode } from '../vdom/vnode'

export function initRender(vm: Component) {
	// 将 createElement fn 绑定到实例，以便我们在其中获得适当的渲染上下文。
	// args 顺序: tag, data, children, normailzationType, alwaysNormailze
	// 内部版本由从模板编译的渲染函数使用
	vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
	// 标准化始终适用于公共版本，用于
	// 用户编写的渲染函数
	vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}

export function renderMixin(Vue: Class<Component>) {


	Vue.prototype._render = function (): VNode {

	  debugger;

		const vm: Component = this
		const { render, _parentVNode } = vm.$options


		// 渲染自身
		let vnode

		try {
			vnode = render.call(vm._renderProxy, vm.$createElement)
		} catch(e) {
			handleError(e, vm, `render`)
			// return 错误渲染结果或之前的 vnode，
			// 以防止渲染错误导致组件空白
			if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
				try {
					vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
				} catch (e) {
					handleError(e, vm, `renderError`)
					vnode = vm._vnode
				}
			} else {
				vnode = vm._vnode
			}
		}
		// 如果渲染出错，则返回空的 vnode
		if (!(vnode instanceof VNode)) {
			if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
				 warn(
          '从渲染函数返回多个根节点。 渲染功能 ' +
          '渲染函数应返回单个根节点.',
          vm
        )
			}
			vnode = createEmptyVNode()
		}

		// set parent
		vnode.parent = _parentVNode
		return vnode
	}


}
