import Wathcer from './observe/watcher'
import { createElementVNode, createTextVNode } from './vdom/index'
import { patch } from './vdom/patch'

export function initLifecycle(Vue) {
  Vue.prototype._update = function (vnode) {
    console.log('upate', vnode)
    let vm = this
    vm.$el = patch(vm.$el, vnode)
  }
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments)
  }
  Vue.prototype._s = function (val) {
    if (typeof val !== 'object') return val
    return JSON.stringify(val)
  }
  Vue.prototype._render = function () {
    const vm = this
    return vm.$options.render.call(vm)
  }
}

export function mountComponent(vm, el) {
  /*
  // 1 调用render方法 产生虚拟节点
  let VNode = vm._render()
  // 2 将vnode变成真实DOM 放到页面中
  vm._update(VNode)
  */
  let updateComponent = () => {
    vm._update(vm._render())
  }
  new Wathcer(vm, updateComponent, null, true)
}
