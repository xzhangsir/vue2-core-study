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
      //先找render 没有render 找template
      let tempalte = options.tempalte
      if (!tempalte && el) {
        //没有template 用外部的html
        el = el.outerHTML
        let render = compileToFunction(el)
        console.log('render', render)
        options.render = render
      }
    }

    // 挂载
    mountComponent(vm, el)
  }
}
