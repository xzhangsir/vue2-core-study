export function patch(oldVnode, vnode) {
  console.log('oldVnode', oldVnode)
  console.log('vnode', vnode)
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
    // diff
  }
}

function createElm(vnode) {
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
