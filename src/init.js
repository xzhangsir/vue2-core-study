import { compileToFunction } from './compile/index'
import { initState } from './initState'
import { callHook, mountComponent } from './lifecycle'
import { mergeOptions } from './utils/index'

export function initMixin(Vue) {
  Vue.prototype.__init = function (options) {
    let vm = this
    // vm.$options = options
    // 此时需使用 options 与 mixin 合并后的全局 options 再进行一次合并
    // console.log(vm.constructor.options, options)
    vm.$options = mergeOptions(vm.constructor.options, options)
    // console.log(vm.$options)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
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
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      let render = compileToFunction(template)
      options.render = render
    }
    mountComponent(vm, el)
  }
}
