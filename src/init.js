import { compileToFunction } from './compile/index'
import { initState } from './initState'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // console.log('options', options)
    let vm = this
    vm.$options = options
    // 初始化状态
    initState(vm)
    // 模板渲染
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    let vm = this
    let options = vm.$options
    if (!options.render) {
      // 没有render
      let template = options.template
      if (!template) {
        //没有template
        if (el) {
          // 获取HTML
          el = document.querySelector(el).outerHTML
          // 变成ast语法树
          let ast = compileToFunction(el)
          // render()
        }
      }
    }
  }
}
