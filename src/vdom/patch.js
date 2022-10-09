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
    console.log(oldVnode)
    console.log(vnode)
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
}

export function createElm(vnode) {
  let { tag, data, children, text } = vnode
  if (typeof tag === 'string') {
    // 标签
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, data)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function patchProps(el, props) {
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
