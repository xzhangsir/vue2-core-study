export function patch(oldVnode, vnode) {
  // vnode ->真实dom
  // 1）创建新dom
  let el = createEl(vnode)
  console.log(el)
  // 2) 新dom替换旧dom
  let parentEL = oldVnode.parentNode
  parentEL.insertBefore(el, oldVnode.nextsibling)
  parentEL.removeChild(oldVnode)
  return el
}
// 创建dom
function createEl(vnode) {
  let { tag, children, key, data, text } = vnode
  if (typeof tag === 'string') {
    // 是标签  创建元素
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, {}, data)
    if (children.length > 0) {
      children.forEach((child) => {
        vnode.el.appendChild(createEl(child))
      })
    }
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

export function patchProps(el, oldProps = {}, props = {}) {
  // 老的属性中有 新的没有 要删除老的  样式和其它属性
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
  // 新的覆盖老的
  // console.log('props', props)
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
