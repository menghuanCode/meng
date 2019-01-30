/* @flow */

export function initMixin(Vue: GlobalAPI) {
	Vue.mixin = function (mixin: Object) {
		return this
	}
}