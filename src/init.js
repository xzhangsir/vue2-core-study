import { compileToFunction } from './compiler'
import { mountComponent } from './lifecycle'
import { initState } from './state'

export function initMixin(Vue) {
  Vue.prototype.__init = function (options) {
    const vm = this
    vm.$options = options //将用户的选项挂载到实例上

    //初始化状态
    initState(vm)

    if (options.el) {
      vm.$mount(options.el) //实现数据的挂载
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    let ops = vm.$options
    if (!ops.render) {
      //先找render 没有render 找template
      let template
      if (!ops.template && el) {
        //没有template 用外部的html
        template = el.outerHTML
      } else {
        if (el) {
          template = ops.template
        }
      }
      if (template) {
        // 对模板进行编译
        const render = compileToFunction(template)
        ops.render = render
      }
    }
    mountComponent(vm, el) //组件的挂载
    // console.log(ops.render) //最终可以获取到render方法
  }
}
