export function mounetComponent(vm, el) {
  //vm._render 1）将render函数 变成vnode
  //vm._update 2）将vnode变成真实DOM 放到页面中
  vm._update(vm._render())
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // vnode变成真实DOM
  }
}