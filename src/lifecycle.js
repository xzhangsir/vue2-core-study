import Watcher from './observe/watcher'
import { isObject } from './utils/index'
import { createElementVNode, createTextVNode } from './vdom/index'
import { patch } from './vdom/patch'

export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    // createElement 创建元素型的节点
    return createElementVNode(this, ...arguments)
  }
  Vue.prototype._v = function () {
    // 创建文本的虚拟节点
    return createTextVNode(this, ...arguments)
  }
  Vue.prototype._s = function (val) {
    // JSON.stringify
    if (isObject(val)) {
      // 是对象，转成字符串
      return JSON.stringify(val)
    } else {
      // 不是对象，直接返回
      return val
    }
  }

  Vue.prototype._update = function (vnode) {
    // this.$el = patch(this.$el, vnode)
    let vm = this
    const prevVnode = vm._vnode
    vm._vnode = vnode
    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVnode, vnode)
    }
  }
  Vue.prototype._render = function () {
    const vm = this
    return vm.$options.render.call(vm)
  }
}

export function mountComponent(vm, el) {
  let updateComponent = () => {
    vm._update(vm._render())
  }
  callHook(vm, 'beforeMount')
  new Watcher(vm, updateComponent, () => {}, true)
  // 当视图挂载完成，调用钩子: mounted
  callHook(vm, 'mounted')
}
//从$options取对应的生命周期函数数组并执行
export function callHook(vm, hook) {
  // 获取生命周期对应函数数组
  let handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((fn) => {
      fn.call(vm) // 生命周期中的 this 指向 vm 实例
    })
  }
}
