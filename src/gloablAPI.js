import { mergeOptions } from './utils'
export function initGlobalAPI(Vue) {
  Vue.options = {
    _base: Vue
  }
  Vue.mixin = function (mixin) {
    // console.log(this.options)
    // console.log(mixin)
    // 蒋用户的选型和全局的options进行合并
    // {} {created:function(){}} => {created:[fn]} //第一次
    // {created:[fn]} {created:[fn]} => {created:[fn,fn]} //再一次
    this.options = mergeOptions(this.options, mixin)
    return this
  }
  // 可以手动创造组件进行挂载
  Vue.extend = function (options) {
    // 实现根据用户的参数 返回一个构造函数
    function Sub(options = {}) {
      //最终使用一个组件 就是new一个实力
      this.__init(options) // 默认对子类进行初始化
    }
    // Sub.prototype.__proto__ = Vue.prototype
    // 子类继承父类
    Sub.prototype = Object.create(Vue.prototype)
    Sub.prototype.constructor = Sub
    /*Sub.options = options */ //保存用户传递的选项
    Sub.options = mergeOptions(Vue.options, options) //用户传递的选项和全局的选项合并下

    return Sub
  }
  Vue.options.components = {}
  Vue.component = function (id, definition) {
    // 如果definition已经是一个函数了
    if (typeof definition !== 'function') {
      definition = Vue.extend(definition)
    }
    Vue.options.components[id] = definition
    // console.log(Vue.options)
  }
}
