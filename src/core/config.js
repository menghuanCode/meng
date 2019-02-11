/* @flow */

import {
  no,
  noop,
  identity
} from 'shared/util'

export type Config = {
	// user
	optionMergeStrategies: { [key: string]: Function };
  silent: boolean;
  errorHandler: ?(err: Error, vm: Component, info: string) => void;
	warnHandler: ?(msg: string, vm: Component, trace: string) => void;
  ignoredElements: Array<string | RegExp>;


	//platform
	isReservedTag: (x?: string) => boolean;
	isUnknownElement: (x?: string) => boolean;
	parsePlatformTagName: (x: string) => string;
}


export default ({
	/**
	 * 选项合并策略（用于 code/util/options）
	 */
	// $flow-disable-line
	optionMergeStrategies: Object.create(null),

	/**
	 * 观察者是否抑制警告
	 */
	silent: false,

  /**
   * 观察者的错误处理函数
   */
  errorHandler: null,

	/**
 	 * 观察者的警告处理函数
 	 */
  warnHandler: null,

  /**
   * 忽略某些自定义元素
   */
  ignoredElements: [],


  /*********************************** platform ***********************************/

	/**
   * 检查标签是否被保留，因为它不能注册为一个组件
   * 这取决于平台，可能被覆盖
   */
  isReservedTag: no,

  /**
   * 解析特定平台的真实标签名称
   */
  parsePlatformTagName: identity,


  /**
   * 检查元素是否是未知元素。
   * 平台依赖性
   */
  isUnknownElement: no,

}: Config)
