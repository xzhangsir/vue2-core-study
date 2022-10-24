export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    // createElement 创建元素型的节点
    console.log(arguments)
  }
  Vue.prototype._v = function () {
    // 创建文本的虚拟节点
    console.log(arguments)
  }
  Vue.prototype._s = function () {
    // JSON.stringify
    console.log(arguments)
  }

  Vue.prototype._update = function () {
    console.log('upate')
  }
  Vue.prototype._render = function () {
    console.log('render')
  }
}

export function mountComponent(vm, el) {}
