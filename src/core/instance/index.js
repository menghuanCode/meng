import { initMixin } from './init'
import { stateMixin } from './state'
 
// Vue 也是从一个基础函数一步步实现而来的
function Vue(options) {
	// this instanceof Vue 可以判断 Vue 是否是 new 调用
	if (process.env.NODE_ENV !== 'production' && 
		!(this instanceof Vue) ) {
		console.error('Vue 是一个构造器，必须用 "new" 关键字调用')
	}

	this.__init(options)
}

initMixin(Vue)
stateMixin(Vue)


export default Vue