const isReservedTag = (tag) => {
  // 判断是原始标签还是自定义组件的标签
  return ['a', 'div', 'li', 'button', 'ul', 'span', 'img', 'p'].includes(tag)
}

export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    // 标签
    // 创建标签
    // console.log(arguments)
    return createElement(this, ...arguments)
  }
  Vue.prototype._v = function (text) {
    // 文本
    // 创建文本
    return createText(this, text)
  }
  Vue.prototype._s = function (val) {
    // 插值表达式
    if (val) {
      if (typeof val === 'object') {
        return JSON.stringify(val)
      }
      return val
    }
    return ''
  }
  Vue.prototype._render = function () {
    // 将render函数 变成vnode
    let vm = this
    let render = vm.$options.render
    let vnode = render.call(vm)
    // console.log('vnode', vnode)
    return vnode
  }
}

// 创建元素和组件
function createElement(vm, tag, data = {}, ...children) {
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, data.key, children)
  } else {
    // 创建组件
    console.log(vm)
    const Ctor = vm.$options['components'][tag]

    return createComponentVnode(vm, tag, data, children, Ctor)
  }
}

// 创建组件的虚拟dom
function createComponentVnode(vm, tag, data, children, Ctor) {
  console.log(typeof Ctor)
  if (Ctor && typeof Ctor === 'object') {
    Ctor = vm.constructor.extend(Ctor)
    console.log(Ctor)
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
  return vnode(
    vm,
    'vue-component' + tag,
    data,
    undefined,
    undefined,
    undefined,
    {
      Ctor,
      children
    }
  )
}

// 创建文本
function createText(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

// 创建虚拟node
function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}
