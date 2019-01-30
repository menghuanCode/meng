/* @flow */

export function initExtend(Vue: GlobalAPI) {

	/**
	 * 每个构造器，包括 Vue，都有一个唯一的 CID。
	 * 这使得我们能够创建包裹的 "子构造函数"用于原型继承，
	 * 并缓存它们
	 */
	
	Vue.cid = 0
	let cid = 1

	Vue.extend = function (extendOptions: Object): Function {
		
	}
}