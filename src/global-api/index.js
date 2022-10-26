import { isObject, mergeOptions } from '../utils/index'

export function initGlobalAPI(Vue) {
  // 全局属性：Vue.options
  // 功能：存放 mixin, component, filte, directive 属性
  Vue.options = {
    _base: Vue
  }
  Vue.options.components = {}
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
    // console.log(this.options)
    return this
  }
  let cid = 0
  Vue.extend = function (options) {
    const Super = this
    const Sub = function (options) {
      this.__init(options)
    }
    Sub.cid = cid++
    Sub.prototype = Object.create(Super.prototype)
    // Object.create 会产生一个新的实例作为子类的原型，导致constructor指向错误
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(this.options, options)
    return Sub
  }
  Vue.component = function (id, definition) {
    if (typeof definition !== 'function') {
      definition = Vue.extend(definition)
    }
    Vue.options.components[id] = definition
  }
}
