export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    // 标签
    // 创建标签
    // console.log(arguments)
    return createElement(...arguments)
  }
  Vue.prototype._v = function (text) {
    // 文本
    // 创建文本
    return createText(text)
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
    console.log('vnode', vnode)
    return vnode
  }
}

// 创建元素
function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children)
}

// 创建文本
function createText(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// 创建虚拟node
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
