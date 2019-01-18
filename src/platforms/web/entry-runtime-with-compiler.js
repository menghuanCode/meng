/* @flow */
import Vue from './runtime/index'
import { initGlobalAPI } from './global-api/index'

initGlobalAPI(Vue)


const mount = Vue.prototype.$mount
Vue.prototype.$mount = function () {

}


export default Vue
