import { patch } from './vnode/patch'

export function mounetComponent(vm, el) {
  callHook(vm, 'beforeMount')
  //vm._render 1）将render函数 变成vnode
  //vm._update 2）将vnode变成真实DOM 放到页面中
  vm._update(vm._render())
  callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // vnode变成真实DOM
    let vm = this
    // console.log(vm)
    // 旧dom  虚拟dom
    vm.$el = patch(vm.$el, vnode)
  }
}

// 生命周期的调用
export function callHook(vm, hook) {
  // console.log(vm)
  const handlers = vm.$options[hook]
  // console.log(hook)
  // console.log(handlers)
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
