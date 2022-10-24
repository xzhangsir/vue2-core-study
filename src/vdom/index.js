export function createElementVNode(vm, tag, data, ...children) {
  data = data || {}
  let key = data.key
  return vnode(vm, tag, data.key, data, children, undefined)
}
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

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
