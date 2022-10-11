import { isObject, isReservedTag } from '../utils/index'

export function createElementVNode(vm, tag, data, ...children) {
  data = data || {}
  let key = data.key
  // if (key) {
  //   delete data.key
  // }
  if (isReservedTag(tag)) {
    // 如果是普通标签
    return vnode(vm, tag, key, data, children)
  } else {
    // 否则就是组件
    let Ctor = vm.$options.components[tag] //获取组件的构造函数
    return createComponentVNode(vm, tag, data, key, children, Ctor)
  }
}
function createComponentVNode(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    //   如果没有被改造成构造函数
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

// 判断两个虚拟节点是不是同一个
export function isSameVnode(vnode1, vnode2) {
  return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key
}
