import { isSameVnode } from './index'

export function patch(oldVnode, vnode) {
  // console.log('oldVnode', oldVnode)
  // console.log('vnode', vnode)
  // 初次渲染
  const isRealElement = oldVnode.nodeType
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
    // diff 算法
    // diff算法是个平级比较的过程 父亲和父亲比较 儿子和儿子比较
    // 1 两节点不是同一个节点 直接删除老的 换上新的 (没有比对了)
    // 2 两个节点是同一个节点 (判断节点的tag和节点的key)
    // 比较两个节点的属性是否有差异 (复用老的节点 将差异的属性更新)
    // 3 节点比较完  开始比较儿子
    console.log('oldVnode', oldVnode)
    console.log('newvnode', vnode)
    patchVnode(oldVnode, vnode)
  }
}

function patchVnode(oldVNode, vnode) {
  if (!isSameVnode(oldVNode, vnode)) {
    // 新老节点不相同 直接用新的替换掉老的
    let el = createElm(vnode)
    oldVNode.el.parentNode.replaceChild(el, oldVNode.el)
    return el
  }

  //如果旧节点是一个文本节点
  if (!oldVNode.tag) {
    if (oldVNode.text !== vnode.text) {
      oldVNode.el.textContent = vnode.text
    }
  }
  // 不符合上面两种 代表新老标签一致 并且不是文本节点
  // 为了节点复用 所以直接把旧的虚拟dom对应的真实dom赋值给新的虚拟dom的el属性
  const el = (vnode.el = oldVNode.el)
  // 更新属性
  patchProps(el, oldVNode.data, vnode.data)
  // 开始比较子节点
  let oldChildren = oldVNode.children || []
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
    // 新的没有 老的有 删除老的
    el.innerHTML = ''
  }
  return el
}

function updateChildren(el, oldChildren, newChildren) {
  console.log(el, oldChildren, newChildren)
}

export function createElm(vnode) {
  let { tag, data, children, text } = vnode
  if (typeof tag === 'string') {
    // 标签
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, {}, data)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function patchProps(el, oldProps = {}, props = {}) {
  // 老的属性中有  新的没有 要删除老的 样式和其它属性
  let oldStyles = oldProps.style || {}
  let newStyles = props.style || {}

  for (let key in oldStyles) {
    if (!newStyles[key]) {
      // 新的样式没有这个key 直接清空
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
