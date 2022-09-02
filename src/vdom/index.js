const isReservedTag = (tag) => {
  // 判断是原始标签还是自定义组件的标签
  return ['a', 'div', 'li', 'button', 'ul', 'span', 'img', 'p'].includes(tag)
}

// h() _c()
export function createElementVNode(vm, tag, data, ...children) {
  // console.log(vm)
  data = data || {}
  let key = data.key
  if (key) {
    delete data.key
  }
  if (isReservedTag(tag)) {
    return vnode(vm, tag, key, data, children)
  } else {
    // 创造组件的虚拟节点
    let Ctor = vm.$options.components[tag]
    // Ctor 可能是个Sub类  还有可能是个组件的obj选项
    // console.log(vm.$options.components)
    // console.log(Ctor)
    return createComponentVNode(vm, tag, key, data, children, Ctor)
  }
}

function createComponentVNode(vm, tag, key, data, children, Ctor) {
  if (Ctor && typeof Ctor === 'object') {
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    init(vnode) {
      //稍后创建真实节点的时候 如果是组件则调用此方法
      // 保存组件的实例到虚拟节点上
      let instance = (vnode.componentInstance =
        new vnode.componentOptions.Ctor())
      instance.$mount() //实例上就会多一个$el
    }
  }
  return vnode(vm, tag, key, data, children, null, { Ctor })
}

// _v()
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}
// ast做的是语法层面的转化 他描述的是语法本身
// 我们的虚拟dom 是描述的dom元素 可以增加一些自定义属性

function vnode(vm, tag, key, data, children, text, componentOptions) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
    componentOptions // 组件的构造函数
  }
}

// 判断两个虚拟节点是不是同一个
export function isSameVnode(vnode1, vnode2) {
  return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key
}
