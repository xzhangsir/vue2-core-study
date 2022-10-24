import { compileToFunction } from './compile/index'
import { initState } from './initState'
import { mountComponent } from './lifecycle'

export function initMixin(Vue) {
  Vue.prototype.__init = function (options) {
    let vm = this
    vm.$options = options
    initState(vm)
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
