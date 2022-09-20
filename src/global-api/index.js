import { mergeOptions } from '../utils/index'

export function initGlobApi(Vue) {
  // created:[a,b,c]
  // watch:[a,b]
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // console.log(this)
    // 对象的合并
    // console.log(Vue.options)
    // console.log(mixin)
    this.options = mergeOptions(this.options, mixin)
    // console.log(this.options)
    return this
  }
  // 放全局组件的映射关系
  Vue.options.components = {}
  Vue.component = function (id, componentDef) {
    componentDef.name = componentDef.name || id
    // Vue 创建组件的核心 Vue.extend()
    componentDef = Vue.extend(componentDef)
    this.options.components[id] = componentDef
    console.log(this.options)
  }
  Vue.extend = function (options) {
    let spuer = this
    const Sub = function vuecomponent(opts) {
      this._init(opts)
    }
    // 子组件继承父组件
    Sub.prototype = Object.create(spuer.prototype)
    // 将子组件中的this指向Sub
    Sub.prototype.constructor = Sub
    // 将父组件中的属性合并
    Sub.options = mergeOptions(spuer.options, options)
    console.log(spuer.options, options)
    console.log(Sub.options)
    return Sub
  }
}
