import { initMixin } from './init'
import { warn } from '../util/index'

// 创建Vue 函数
function Vue(options) {
  // 必须 new 实例化
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructot and should be called with the `new` keyword')
  }

  this._init(options)
}

Vue.prototype._init = function () {

}

// 初始化混入
initMixin(Vue)

export default Vue
