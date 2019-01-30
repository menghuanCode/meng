/* @flow */

import { ASSET_TYPES } from 'shared/constants'

export function initAssetRegisters(Vue: GlobalAPI) {
	/**
	 *  创建资产注册方法
	 */
	ASSET_TYPES.forEach(type => {
		Vue[type] = function (
			id: string,
			definition: Function | Object
		): Function | Object | void {
			return definition
		}
	})
}