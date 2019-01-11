/* @flow */

import { mergeOptions } from '../util/index'

let uid = 0;

export function initMixin(Vue: Class<Component>) {
  Vue.prototype.__init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid


    // 一个标志，以避免被观察到
    vm._isVue = true
    // 合并对象
    if (options && options._isComponent) {
      // 优化内部组件实例化，
      // 因为动态选项合并非常缓慢
      // 并且内部组件选项都不需要特殊处理
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

    if (process.env.NODE_ENV != 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }

    // 暴露真实的自我
    vm._self = vm
    // 初始化生命周期
    initLifecycle(vm)
    // 初始化事件
    initEvents(vm)
    // 初始化渲染
    initRender(vm)
    // 调用钩子，created 生命周期钩子在这个时候调用
    callHook(vm, 'created')
    // 如果有el，直接挂载el
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

// 初始化接口组件
export function initInternalComponent(vm: Component, options: InternalComponentOptions) {

}
