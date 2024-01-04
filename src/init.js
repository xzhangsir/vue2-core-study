import { compileToFunctions } from './compiler/index'
import { initState } from './initState'
import { callHook, mountComponent } from './lifecycle'
import { mergeOptions } from './utils/index'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // vm.$options = options
    // 此时需使用 options 与 mixin 合并后的全局 options 再进行一次合并
    vm.$options = mergeOptions(vm.constructor.options, options)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)

    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      if (template) {
        const render = compileToFunctions(template)
        // `<div id="a">hello</div>`
        //  h('div',{id:'a'},'hello')
        options.render = render
      }
    }
    // 挂载
    return mountComponent(vm, el)
  }
}
