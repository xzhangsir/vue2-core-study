import { isObject, isReservedTag } from '../utils/index'

export function createElementVNode(vm, tag, data, ...children) {
  data = data || {}
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data.key, data, children, undefined)
  } else {
    let Ctor = vm.$options.components[tag]
    return createComponentVNode(vm, tag, data, data.key, children, Ctor)
  }
}

function createComponentVNode(vm, tag, data, key, children, Ctor) {
  // 局部组件定义不会被Vue.extend处理成为组件
  if (isObject(Ctor)) {
    // 处理局部组件
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    init(vnode) {
      //稍后创建真实节点的时候 如果是组件则调用此方法
      let child = (vnode.componentInstance = new Ctor({ _isComponent: true })) //实例化组件
      child.$mount() //因为没有传入el属性  需要手动挂载 为了在组件实例上面增加$el方法可用于生成组件的真实渲染节点
    }
  }
  return vnode(vm, tag, key, data, children, null, { Ctor })
}

export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, key, data, children, text, componentOptions = {}) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
    componentOptions
  }
}

export function isSameVnode(vnode1, vnode2) {
  return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key
}
