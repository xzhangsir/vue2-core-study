export function createElm(vnode) {
  let { tag, data, children, text } = vnode
  if (typeof tag === 'string') {
    //标签
    // 将真实节点和虚拟节点对应起来
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, data)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    // 文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

export function patchProps(el, props) {
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

export function patch(oldVNode, vnode) {
  // 初渲染流程
  const isRealElement = oldVNode.nodeType
  // 判断是不是真实元素
  if (isRealElement) {
    const elm = oldVNode //获取真实元素
    const parentElm = elm.parentNode //拿到父元素
    let newElm = createElm(vnode)
    // console.log(newElm)
    parentElm.insertBefore(newElm, elm.nexSibling)
    parentElm.removeChild(elm)
    return newElm
  } else {
    // diff 算法
  }
}
