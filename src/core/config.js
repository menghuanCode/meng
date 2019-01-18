/* @flow */

import { no } from 'shared/util'

export type Config = {
  silent: boolean,
  warnHandler: ?(msg: string, vm: Component, trace: string) => void;


  // platform
  isReservedTag: (x?: string) => boolean;
}

export default ({

  /**
  * 是否抑制警告
  */
  silent: false,

  /**
   * 观察者的警告处理程序发出警告
   */
  warnHandler: null,

  /**
   * v-on 自定义用户密钥别名
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * 检查标签是否可以保留，以便不能将其注册为组件。
   * 这取决与平台，可能会被覆盖
   */
  isReservedTag: no
})
