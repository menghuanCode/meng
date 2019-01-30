/* @flow */
import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { ASSET_TYPES } from 'shared/constants'
import buildInComponents from '../components/index'

import {
	extend
} from '../util/index'

export function initGlobalAPI(Vue: GlobalAPI) {
	// config
	const configDef = {}
	configDef.get = () => config
	
	if (process.env.NODE_ENV !== 'production') {
		configDef.set = () => {
			console.warn("不能替换 Vue.config 对象， 而是设置单个字段");
		}	
	}
	Object.defineProperty(Vue, 'config', configDef)

	// 公开的 util 方法
	// 注意： 这不是公共API的一部分，避免依赖
	// 除非你意识到风险
	Vue.util = {

	}

	Vue.options = Object.create(null)
	ASSET_TYPES.forEach(type => {
		Vue.options[type + 's'] = Object.create(null)
	})

	// 它用于标识"base"构造函数以扩展所有纯对象
	// 包含在Weex的多实例场景中的组件
	Vue.options._base = Vue

	extend(Vue.options.components, buildInComponents)

	initUse(Vue)
	initMixin(Vue)
	initExtend(Vue)
	initAssetRegisters(Vue)
}