/* not type checking this file because flow doesn't play well with Proxy */
import config from 'core/config'
import { warn, makeMap, isNative } from '../util/index'


let initProxy

if (process.env.NODE_ENV !== 'production') {

	// 允许的全局
	const allowedGlobals = makeMap(
		'Infinity,undefined,NaN,isFinite,isNaN,' +
		'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
		'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
		'require' // for Webpack/Browserify
	)

	// 警告不存在
	const warnNonPresent = (target, key) => {
		warn(
	      `属性或方法 "${key}" 是没有定义在实例上的但 ` +
	      '在渲染时引用. 确保此属性具有反应性, ' +
	      '要么在 data 选项, 要么在基于类的组件, 通过 ' +
	      '初始化属性. ' +
	      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
	      target
	    )
	}

	// 警告保留字前缀
	const warnReservedPrefix = (target, key) => {
		warn(
	      `属性 "${key}" 必须使用 "$data.${key}" 才能访问到， 因为 ` +
	      '属性的开头使用 "$" 或 "_" 前缀，所以没有在 Vue 的实例中做代理， ' +
	      '以防止与 Vue 内部冲突' +
	      'See: https://vuejs.org/v2/api/#data',
	      target
	    )
	}


	const hasProxy =
		typeof Proxy !== 'undefined' && isNative(Proxy)

	const getHandler = {
		get (target, key) {
			if (typeof key === 'string' && !(key in target)) {
				if (key in target.$data) warnReservedPrefix(target, key)			
				else warnNonPresent(target, key)
			}
			return target[key]
		}
	}

	const hasHandler = {
		has (target, key) {
			const has = key in target
			const isAllowed = allowedGlobals(key)  ||
				(typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))

			if (!has && !isAllowed) {
				if (key in target.$data) warnReservedPrefix(target, key)
				else warnNonPresent(target, key)
			}

			return has || !isAllowed
		}
	}



	initProxy = function initProxy(vm) {
		if (hasProxy) {
			// 明确要使用的代理处理程序
			const options = vm.$options
			const handlers = options.render && options.render._withStripped
				? getHandler
				: hasHandler
			vm._renderProxy = new Proxy(vm, handlers)
		}	 else {
			vm._renderProxy = vm
		}
	}

}

export { initProxy }