import { compileToFunction } from './compile/index'
import { initState } from './initState'
import { callHook, mounetComponent } from './lifecycle'
import { mergeOptions } from './utils/index'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // console.log('options', options)
    let vm = this
    // vm.$options = options
    // console.log(Vue.options)
    vm.$options = mergeOptions(Vue.options, options)
    // console.log(vm.$options)
    // callHook
    callHook(vm, 'beforeCreate')
    // 初始化状态
    initState(vm)
    callHook(vm, 'created')
    // console.log(vm)
    // 模板渲染
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
      // 没有render
      let template = options.template
      if (!template) {
        //没有template
        if (el) {
          // 获取HTML
          el = el.outerHTML
          // 先变成ast语法树 再转为redner函数
          let render = compileToFunction(el)
          // console.log(render)
          options.render = render
        }
      }
      // 挂载组件
      mounetComponent(vm, el)
    }
  }
}
