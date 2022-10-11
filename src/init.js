import { compileToFunction } from './compile/index'
import { initState } from './initState'
import { callHook, mountComponent } from './lifecycle'
import { mergeOptions } from './utils/index'

export function initMixin(Vue) {
  Vue.prototype.__init = function (options) {
    let vm = this
    // vm.$options = options
    // console.log('vm.constructor.options', vm.constructor.options)
    // console.log('options', options)
    vm.$options = mergeOptions(vm.constructor.options, options)
    console.log(vm)
    callHook(vm, 'beforeCreate') //初始化数据之前
    initState(vm)
    callHook(vm, 'created') //初始化数据之后
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    let vm = this
    el = document.querySelector(el)
    vm.$el = el
    let options = vm.$options
    if (!options.render) {
      //先找render 没有render 找template
      let template = options.template
      if (!template && el) {
        //没有template 用外部的html
        el = el.outerHTML
        let render = compileToFunction(el)
        // console.log('render', render)
        options.render = render
      }
      if (template) {
        let render = compileToFunction(template)
        options.render = render
      }
    }

    // 挂载
    mountComponent(vm, el)
  }
}
