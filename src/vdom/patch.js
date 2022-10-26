import { isSameVnode } from './index'

export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    // 组件的创建过程是没有el属性的
    return createElm(vnode)
  }
  // console.log('oldVnode', oldVnode)
  // console.log('vnode', vnode)
  // 初次渲染
  const isRealElement = oldVnode.nodeType
  // console.log(isRealElement)
  // 判断是不是真实元素
  if (isRealElement) {
    // 获取真实元素
    const elm = oldVnode
    // 拿到父元素
    const parentElm = elm.parentNode
    let newElm = createElm(vnode)
    parentElm.insertBefore(newElm, elm.nexSibling)
    parentElm.removeChild(elm)
    return newElm
  } else {
    // diff
    patchVnode(oldVnode, vnode)
  }
}

function patchVnode(oldVnode, vnode) {
  if (!isSameVnode(oldVnode, vnode)) {
    // 新老节点不相同 直接用新的替换掉老的
    let el = createElm(vnode)
    oldVnode.el.parentNode.replaceChild(el, oldVnode.el)
    return el
  }
  // 旧节点是一个文本
  if (!oldVnode.tag) {
    if (oldVnode.text !== vnode.text) {
      oldVnode.el.textContent = vnode.text
    }
  }
  // 不符合上面两种 代表新老标签一致 并且不是文本节点
  // 为了节点复用 所以直接把旧的虚拟dom对应的真实dom赋值给新的虚拟dom的el属性
  const el = (vnode.el = oldVnode.el)
  // 更新属性
  updateProperties(el, oldVnode.data, vnode.data)
  // 比较子节点
  let oldChildren = oldVnode.children || []
  let newChildren = vnode.children || []
  if (oldChildren.length > 0 && newChildren.length > 0) {
    // diff核心
    // 新老都存在子节点
    updateChildren(el, oldChildren, newChildren)
  } else if (newChildren.length > 0) {
    // 老的没有儿子  新的有儿子  创建新的儿子
    for (let i = 0; i < newChildren.length; i++) {
      let child = newChildren[i]
      el.appendChild(createElm(child))
    }
  } else if (oldChildren.length > 0) {
    el.innerHTML = ''
  }
  return el
}

function updateChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0
  let newStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let newEndIndex = newChildren.length - 1

  let oldStartVnode = oldChildren[0]
  let newStartVnode = newChildren[0]
  let oldEndVnode = oldChildren[oldEndIndex]
  let newEndVnode = newChildren[newEndIndex]
  // 根据key来创建老的儿子的index映射表  类似 {'a':0,'b':1} 代表key为'a'的节点在第一个位置 key为'b'的节点在第二个位置
  function makeIndexByKey(children) {
    let map = {}
    children.forEach((item, index) => {
      map[item.key] = index
    })
    return map
  }
  // 根据旧的节点生成 key和index的映射表 用于乱序比对
  let map = makeIndexByKey(oldChildren)
  // 只有当新老儿子的双指标的起始位置不大于结束位置的时候  才能循环 一方停止了就需要结束循环
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 因为乱序对比过程把移动的vnode置为 undefined 如果不存在vnode节点 直接跳过
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头头比较
      // 递归比较儿子及儿子的子节点
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 尾尾比较
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 交叉比对 老的头和新的尾比较  abcd=>
      //                            dcba
      patch(oldStartVnode, newEndVnode)
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nexSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 交叉比对 旧的尾和新的头比较  abcd =>
      //                            dcba
      patch(oldEndVnode, newStartVnode)
      el.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      let moveIndex = map[newStartVnode.key]
      if (moveIndex !== undefined) {
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = undefined
        el.insertBefore(moveVnode.el, oldStartVnode.el)
        patch(moveVnode, oldStartVnode)
      } else {
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }
  // 如果老节点循环完毕了 但是新节点还有  证明  新节点需要被添加到头部或者尾部
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let childEl = createElm(newChildren[i])
      let anchor = newChildren[newEndIndex + 1]
        ? newChildren[newEndIndex + 1].el
        : null
      //anchor为null的时候 等同于appendChild
      el.insertBefore(childEl, anchor)
    }
  }
  // 如果新节点循环完毕 老节点还有  证明老的节点需要直接被删除
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let childEl = oldChildren[i].el
      el.removeChild(childEl)
    }
  }
}
// 判断是不是组件
function createComponent(vnode) {
  // 初始化组件
  // 创建组件实例
  let i = vnode.data
  // 调用组件data.hook.init方法进行组件初始化过程 最终组件的vnode.componentInstance.$el就是组件渲染好的真实dom
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }
  // 如果组件实例化完毕有componentInstance属性 那证明是组件
  if (vnode.componentInstance) {
    return true
  }
}

export function createElm(vnode) {
  let { tag, data, children, text } = vnode
  // 通过 tag 判断当前节点是元素 or 文本,判断逻辑：文本 tag 是 undefined
  if (typeof tag === 'string') {
    if (createComponent(vnode)) {
      // 如果是组件 返回真实组件渲染的真实dom
      return vnode.componentInstance.$el
    }
    vnode.el = document.createElement(tag) // 创建元素的真实节点
    // 处理 data 属性
    updateProperties(vnode.el, {}, data)
    // 继续处理元素的儿子：递归创建真实节点并添加到对应的父亲上
    children.forEach((child) => {
      // 若不存在儿子，children为空数组，循环终止
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text) // 创建文本的真实节点
  }
  return vnode.el
}

function updateProperties(el, oldProps = {}, props = {}) {
  let oldStyles = oldProps.style || {}
  let newStyles = props.style || {}
  for (let key in oldStyles) {
    if (!newStyles[key]) {
      el.style[key] = ''
    }
  }
  for (let key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(key)
    }
  }
  for (let key in props) {
    if (key === 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key])
    }
  }
}
