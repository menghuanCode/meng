/* @flow */

import {
	no
} from 'shared/util'

export type Config = {
	// user
	optionMergeStrategies: { [key: string]: Function },

	//platform
	isReservedTag: (x?: string) => boolean
}


export default ({
	/**
	 * 选项合并策略（用于 code/util/options）
	 */
	// $flow-disable-line
	optionMergeStrategies: Object.create(null),

	/**
   * 检查标签是否被保留，因为它不能注册为一个组件
   * 这取决于平台，可能被覆盖
   */
  isReservedTag: no
  
}: Config)