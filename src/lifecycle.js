export function initLifeCycle(Vue) {
  Vue.prototype._update = function () {
    console.log('update')
  }
  Vue.prototype._render = function () {
    console.log('render')
  }
}

export function mountComponent(vm, el) {
  // 1 调用render方法 产生虚拟节点
  vm._render() //vm.$options.render()  返回的是虚拟节点
  // 2 根据虚拟dom 产生真实dom
  // vm._update() //虚拟节点转真实节点
  // 3 插入到el元素中
}
