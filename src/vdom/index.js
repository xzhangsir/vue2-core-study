// h() _c()
export function createElementVNode(vm, tag, data, ...children) {
  data = data || {}
  let key = data.key
  if (key) {
    delete data.key
  }
  return vnode(vm, tag, data.key, data, children)
}

// _v()
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}
// ast做的是语法层面的转化 他描述的是语法本身
// 我们的虚拟dom 是描述的dom元素 可以增加一些自定义属性

function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text
  }
}
