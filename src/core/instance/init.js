/* @flow */

import { initProxy } from './proxy'
import { initEvents } from './events'
import { initRender } from './render'
import { initLifecycle, callHook } from './lifecycle'



let uid = 0;

export function initMixin(Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++


    // 一个标志，以避免被观察到
    vm._isVue = true


    if (process.env.NODE_ENV !== 'production') {
      // 初始化代理，代理所有的属性和方法
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }

    // 暴露真实的自我
    vm._self = vm
    // 初始化生命周期、事件、渲染
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    // 调用钩子 created 生命周期钩子
    // 初始化完成之后调用 created
    callHook(vm, 'created')
    // // 如果有el，直接挂载el
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
