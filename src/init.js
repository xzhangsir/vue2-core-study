import { compileToFunctions } from './compiler/index'
import { initState } from './initState'
import { mountComponent } from './lifecycle'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    initState(vm)
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
    mountComponent(vm, el)
  }
}
