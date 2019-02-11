/* @flow */

/**
 * 观察者解析表达式，收集依赖关系，
 * 并在表达式值更改时触发回调。
 * 这用于 $watch() api 和指令。
 */

export default class Watcher {
	vm: Component;

	constructor (
		vm: Component,
		expOrFn: string | Function,
		cb: Function,
		options?: ?Object,
		isRenderWatcher?: boolean
	) {
		
	}


}

