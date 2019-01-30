/* @flow */

import Vue from './runtime/index'

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
	el?: string | Element,
	hydrating?: boolean
): Component {
	
	return mount.call(this, el, hydrating)
}



export default Vue