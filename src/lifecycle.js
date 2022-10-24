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
    this.$el = patch(this.$el, vnode)
  }
  Vue.prototype._render = function () {
    const vm = this
    return vm.$options.render.call(vm)
  }
}

export function mountComponent(vm, el) {
  vm._update(vm._render())
}
