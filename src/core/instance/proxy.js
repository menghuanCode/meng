/* flow 不检查此文件，因为不能很好的和 proxy 兼容 */

import config from 'core/config'
import { warn, makeMap, isNative } from '../util/index'

let initProxy

if (process.env.NODE_ENV !== 'production') {

  // 允许全局
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )

  /**
   * 属性或方法 key 未在实例上定义，但在渲染期间引用。
   * 通过初始化属性，确保此属性在数据选项或基于类的组件中，是被动的.
   * 看： https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties
   */
  const warnNonPresent = (target, key) => {
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }


  /**
   * 必须使用 $data.key 访问属性，
   * 因为在Vue实例中未代理以"$"或"_"开头的属性
   * 以防止与Vue内部冲突
   */
  const warnReservedPrefix = (target, key) => {
    warn(
      `Property "${key}" must be accessed with "$data.${key}" because ` +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    )
  }

  const hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy)

  // 有 Proxy (Native Code)
  if (hasProxy) {
    // 是内置修饰符
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')

    /**
     * Proxy 代理
     * config.keyCodes 在里面的注释中我会把它认为是 proxy
     */
    config.keyCodes = new Proxy(config.keyCodes, {
      // 拦截对象属性的设置
      set(target, key, value) {
        if (isBuiltInModifier(key)) {
          // 警告： 避免覆盖 config.keyCodes中的内置修饰符
          warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          return false
        } else {
          target[key] = value
          return true
        }
      }
    })
  }

  const hasHandler = {
    // 拦截 key in proxy 的操作, 返回一个布尔值
    has (target, key) {
      const has = key in target
      const isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
      if (!has && !isAllowed) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }

      return has || !isAllowed
    }
  }

  const getHandler = {
    get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return target[key]
    }
  }


  /**
   * 初始化代理
   */
  initProxy = function (vm) {
    if (hasProxy) {
      // 确认要使用代理程序
      const options = vm.$options
      const handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler

      console.log(1)

      vm._renderProxy = new Proxy(vm, handlers)
    } else {
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
