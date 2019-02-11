/* @flow */

import VNode, { createEmptyVNode } from './vnode'

import {
	warn,
	isDef,
	isUndef,
	isTrue,
	isObject,
	isPrimitive
} from '../util/index'

import {
	normalizeChildren,
	simpleNormalizeChildren
} from './helpers/index'

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2


// 包装器功能，用于提供更灵活的界面，而不会被流量呼叫
export function createElement (
	context: Component,
	tag: any,
	data: any,
	children: any,
	normalizationType: any,
	alwaysNormalize: boolean
): VNode | Array<VNode> {
	if (Array.isArray(data) || isPrimitive(data)) {
		normalizationType = children
		children = data
		data = undefined
	}
	if (isTrue(alwaysNormalize)) {
		normalizationType = ALWAYS_NORMALIZE
	}

	return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
	context: Component,
	tag?: string | Class<Component> | Function | Object,
	data?: VNodeData,
	children?: any,
	normalizationType?: number
): VNode | Array<VNode> {

  debugger
	if(isDef(data) && isDef((data: any).__ob__)) {
		process.env.NODE_ENV !== 'production' && warn(
			`避免将观察到的数据对象用作Vnode数据: ${JSON.stringify(data)}\n` +
			'始终在每个渲染中创建新的Vnode数据对象!',
			context
		)
		return createEmptyVNode()
	}

	// 对象语法 in v-bind
	if (isDef(data) && isDef(data.is)) {
		tag = data.is
	}

	if (!tag) {
		// 在组件的情况下： 是设置一个错误的值
		return createEmptyVNode()
	}

	// 对非基础类型发出警告
	if (process.env.NODE_ENV !== 'production' &&
		isDef(data) && isDef(data.key) && !isPrimitive(data.key)
	) {
		if (!__WEEX__ || !('@binding' in data.key)) {
			warn(
				'避免使用 非-基础值 作为键,' +
        '使用 字符串/数字 值代替.',
        context
      )
		}
	}

	// 支持单个函数子级作为默认作用域槽
	if (normalizationType === ALWAYS_NORMALIZE) {
		children = normalizeChildren(children)
	} else if (normalizationType === SIMPLE_NORMALIZE) {
		children = simpleNormalizeChildren(children)
	}

	let vnode, ns
	if (typeof tag === 'string') {
		let Ctor
		if (config.isReservedTag(tag)) {
			// 平台内置的保留标签
			vnode = new VNode(
				config.parsePlatformTagName(tag), data, children,
				undefined, undefined, context
			)
		}
		// else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {

		// }
		else {
			// 未知或未列出的命名空间元素
			// 在运行时检查，因为它的父级规范化子级时可能会为其分配命名空间
			vnode = new VNode(
				tag, data, children,
				undefined, undefined, context
			)
		}
	}

}
