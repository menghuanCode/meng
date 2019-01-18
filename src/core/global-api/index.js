import config from "../config";


export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      // 不要替换 Vue.config 对象，而是设置单个字段
      'Do not replace the Vue.config object, set individual fields instead.'
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }
}
