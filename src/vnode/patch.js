export function patch(oldVnode, vnode) {
  // console.log(oldVnode)
  // console.log(vnode)
  if (!oldVnode) {
    return createEl(vnode)
  }
  if (oldVnode.nodeType === 1) {
    // vnode ->真实dom
    // 1）创建新dom
    let el = createEl(vnode)
    // console.log(el)
    // 2) 新dom替换旧dom
    let parentEL = oldVnode.parentNode
    parentEL.insertBefore(el, oldVnode.nextsibling)
    parentEL.removeChild(oldVnode)
    return el
  } else {
    patchVnode(oldVnode, vnode)
    // diff
  }
}
function patchVnode(oldVnode, vnode) {
  // // 新老节点不相同 直接用新的替换掉老的
  if (!isSameVnode(oldVnode, vnode)) {
    let el = createEl(vnode)
    oldVnode.el.parentNode.replaceChild(el, oldVnode.el)
    return el
  } else {
    /*新老节点相同*/
    let el = (vnode.el = oldVnode.el)
    // console.log(el)

    if (!oldVnode.tag) {
      // 文本
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text
      }
    }
    patchProps(el, oldVnode.data, vnode.data)
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    // console.log(oldVnode, vnode)
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 完整的diff
      updateChildren(el, oldChildren, newChildren)
    } else if (newChildren.length > 0) {
      // 老的没有  新的有儿子
      // mountChildren(el, newChildren)
      for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i]
        el.appendChild(createEl(child))
      }
    } else if (oldChildren.length > 0) {
      // 新的没有 老的有 要删除
      // unmountChildren(el, oldChildren)
      el.innerHTML = ''
    }
    // console.log(oldChildren, newChildren)
    return el
  }
}

function updateChildren(el, oldChildren, newChildren) {
  console.log(el, oldChildren, newChildren)
  let oldStartIndex = 0
  let newStartIndex = 0

  let oldEndIndex = oldChildren.length - 1
  let newEndIndex = newChildren.length - 1

  let oldStartVnode = oldChildren[0]
  let newStartVnode = newChildren[0]

  let oldEndVnode = oldChildren[oldEndIndex]
  let newEndVnode = newChildren[newEndIndex]

  function makeIndexByKey(children) {
    let map = {}
    children.forEach((child, index) => {
      map[child.key] = index
    })
    return map
  }

  let map = makeIndexByKey(oldChildren)
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头头比对
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 尾尾比对
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 交叉比对(尾头)  abcd => dabc
      patchVnode(oldEndVnode, newStartVnode)
      el.insertBefore(oldEndVnode.el, oldStartVnode.el)

      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 交叉比对(头尾)  abcd => dcba
      patchVnode(oldStartVnode, newEndVnode)
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)

      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else {
      // 乱序比对
      // 根据老的列表做一个映射关系 用新的去老的里面找 找到则移动 找不到则添加 最后多余的删除
      let moveIndex = map[newStartVnode.key]
      if (moveIndex === undefined) {
        // 找不到则添加
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        // 找到则移动
        let moveVnode = oldChildren[moveIndex] // 找到对应的虚拟节点
        el.insertBefore(moveVnode.el, oldStartVnode.el) //
        oldChildren[moveIndex] = undefined //标识这个节点已经移动了
        patchVnode(moveVnode, newStartVnode) //对比属性和子节点
      }
      newStartVnode = newChildren[++newStartIndex] //移动指针
    }
  }
  // ab => abc     abc=>dabc
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let childEl = createEl(newChildren[i])
      // el.appendChild(childEl)
      let anchor = newChildren[newEndIndex + 1]
        ? newChildren[newEndIndex + 1].el
        : null //获取下一个元素 可能没有
      el.insertBefore(childEl, anchor)
    }
  }
  // abcd=>abc abc=>bc
  // console.log(oldStartIndex, oldEndIndex)
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i]) {
        let childEl = oldChildren[i].el
        el.removeChild(childEl)
      }
    }
  }
}
// 判断两个虚拟节点是不是同一个
function isSameVnode(vnode1, vnode2) {
  return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key
}

// 创建dom
export function createEl(vnode) {
  let { vm, tag, children, key, data, text } = vnode
  if (typeof tag === 'string') {
    if (createComponent(vnode)) {
      // 是组建
      // 组件  vnode上就有了 componentInstance.$el
      return vnode.componentInstance.$el
    } else {
      // 是标签  创建元素
      vnode.el = document.createElement(tag)

      patchProps(vnode.el, {}, data)
      if (children.length > 0) {
        children.forEach((child) => {
          vnode.el.appendChild(createEl(child))
        })
      }
    }
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
function createComponent(vnode) {
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vnode) //初始化组件
  }
  if (vnode.componentInstance) {
    return true //说明是组件
  }
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
