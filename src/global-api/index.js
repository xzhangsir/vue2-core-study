import { mergeOptions } from '../utils/index'

export function initGlobalAPI(Vue) {
  // 全局属性：Vue.options
  // 功能：存放 mixin, component, filte, directive 属性
  Vue.options = {}
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
    console.log(this.options)
    return this
  }
}
