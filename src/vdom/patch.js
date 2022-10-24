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
    // diff
  }
}

function createElm(vnode) {
  let { tag, data, children, text } = vnode
  // 通过 tag 判断当前节点是元素 or 文本,判断逻辑：文本 tag 是 undefined
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag) // 创建元素的真实节点
    // 处理 data 属性
    updateProperties(vnode.el, data)
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

function updateProperties(el, props = {}) {
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
