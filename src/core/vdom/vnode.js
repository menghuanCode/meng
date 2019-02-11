/* @flow */

export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
	text: string | void;
	elm: Node | void;
  context: Comment | void; // 在这个组件作用域内渲染
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void;  // 组件实例
  asyncFactory: Function | void; // 异步组件工厂函数

  parent: VNode | void   // 组件占位符节点
  key: string | void;


	isComment: boolean;	// 空注释占位符？
	constructor (
		tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function

	) {
		this.tag = tag
		this.data = data
    this.key = data && data.key
		this.children = children
		this.text = text
    this.elm = elm
    this.context = context
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined

    this.ns = undefined
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined

    this.isStatic = false
    this.isComment = false
    this.isCloned = true

  }
}

export const createEmptyVNode = (text: string = '') => {
	const node = new VNode()
	node.text = text
	node.isComment = true
	return node
}

export function createTextVNode (val: string | number) {
	return  new VNode(undefined, undefined, undefined, String(val))
}

// 优化的浅克隆
// 用于静态节点和插槽节点，因为它们可以重复使用
// 多次渲染，克隆它们可以避免DOM操作依赖时的错误
// 在他们的元素上参考。
export function cloneVNode(vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // 克隆children数组以避免在克隆时改变原始数据
    // 一个子.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )

  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}

