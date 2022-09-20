import watcher from './observe/watcher'
import { patch } from './vnode/patch'

export function mounetComponent(vm, el) {
  callHook(vm, 'beforeMount')

  /* 
  //vm._render 1）将render函数 变成vnode
  //vm._update 2）将vnode变成真实DOM 放到页面中
  vm._update(vm._render()) 
  */
  let updateComponent = () => {
    vm._update(vm._render())
  }
  new watcher(
    vm,
    updateComponent,
    () => {
      callHook(vm, 'updated')
    },
    true
  )

  callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // vnode变成真实DOM
    let vm = this
    // console.log(vnode)
    // console.log(vm)
    // 旧dom  虚拟dom
    // vm.$el = patch(vm.$el, vnode)
    let prevVnode = vm._vnode
    if (prevVnode) {
      //prevVnode 有值 说明第一次渲染过了
      // 更新
      vm.$el = patch(prevVnode, vnode)
    } else {
      // 初次渲染
      vm.$el = patch(vm.$el, vnode)
      vm._vnode = vnode
    }
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
