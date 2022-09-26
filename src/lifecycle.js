export function initLifecycle(Vue) {
  Vue.prototype._update = function () {
    console.log('upate')
  }
  Vue.prototype._render = function () {
    console.log('render')
  }
}

export function mountComponent(vm, el) {}
