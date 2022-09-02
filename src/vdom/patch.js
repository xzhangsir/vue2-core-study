import { isSameVnode } from '.'

function createComponent(vnode) {
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vnode) //初始化组件
  }
  if (vnode.componentInstance) {
    return true //说明是组件
  }
}

export function createElm(vnode) {
  // console.log(vnode)
  let { tag, data, children, text } = vnode
  if (typeof tag === 'string') {
    // 创建真实元素 也要区分组件还是元素
    if (createComponent(vnode)) {
      // 组件  vnode上就有了 componentInstance.$el
      return vnode.componentInstance.$el
    }

    //标签
    // 将真实节点和虚拟节点对应起来
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, {}, data)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    // 文本
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

export function patch(oldVNode, vnode) {
  if (!oldVNode) {
    // 这就是组件的挂载
    return createElm(vnode) //vm.$el 对应的就是组件渲染的结果
  }
  // console.log(oldVNode, vnode)
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
    // console.log(oldVNode, vnode)
    // diff 算法
    // diff算法是个平级比较的过程 父亲和父亲比较 儿子和儿子比较
    // 1 两节点不是同一个节点 直接删除老的 换上新的 (没有比对了)
    // 2 两个节点是同一个节点 (判断节点的tag和节点的key)
    // 比较两个节点的属性是否有差异 (复用老的节点 将差异的属性更新)
    // 3 节点比较完  开始比较儿子

    patchVnode(oldVNode, vnode)
  }
}

function patchVnode(oldVNode, vnode) {
  if (!isSameVnode(oldVNode, vnode)) {
    // 新老节点不相同 直接用新的替换掉老的
    let el = createElm(vnode)
    oldVNode.el.parentNode.replaceChild(el, oldVNode.el)
    return el
  }
  /*新老节点相同*/
  let el = (vnode.el = oldVNode.el) //复用老节点的元素
  // 文本的情况
  if (!oldVNode.tag) {
    // 是文本
    if (oldVNode.text !== vnode.text) {
      el.textContent = vnode.text
    }
  }
  // 标签的情况
  // 比较标签属性
  patchProps(el, oldVNode.data, vnode.data)
  // console.log(oldVNode, vnode)

  // 比较儿子
  // 1 一方有儿子 一方没有儿子
  // 2 两方都有儿子

  let oldChildren = oldVNode.children || []
  let newChildren = vnode.children || []
  if (oldChildren.length > 0 && newChildren.length > 0) {
    // 完整的diff
    updateChildren(el, oldChildren, newChildren)
  } else if (newChildren.length > 0) {
    // 老的没有  新的有儿子
    mountChildren(el, newChildren)
  } else if (oldChildren.length > 0) {
    // 新的没有 老的有 要删除
    unmountChildren(el, oldChildren)
  }
  // console.log(oldChildren, newChildren)
  return el
}

function mountChildren(el, newChildren) {
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i]
    el.appendChild(createElm(child))
  }
}
function unmountChildren(el) {
  el.innerHTML = ''
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

  // console.log(oldStartVnode, newStartVnode)
  // console.log(oldEndVnode, newEndVnode)

  function makeIndexByKey(children) {
    let map = {}
    children.forEach((child, index) => {
      map[child.key] = index
    })
    return map
  }

  let map = makeIndexByKey(oldChildren)
  // console.log(map)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 双方有一方  头指针大于尾部指针 则停止循环
      // 头头比对
      // 如果是相同节点 则递归比较子节点
      patchVnode(oldStartVnode, newStartVnode)
      // 从头到尾移动指针
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 尾尾比对
      // 如果是相同节点 则递归比较子节点
      patchVnode(oldEndVnode, newEndVnode)
      // 从尾到头移动指针
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
      // 乱序比对  abcd=>bmapcq
      // 根据老的列表做一个映射关系 用新的去老的里面找 找到则移动 找不到则添加 最后多余的删除
      let moveIndex = map[newStartVnode.key]
      if (moveIndex !== undefined) {
        // 找到则移动
        let moveVnode = oldChildren[moveIndex] // 找到对应的虚拟节点
        el.insertBefore(moveVnode.el, oldStartVnode.el) //
        oldChildren[moveIndex] = undefined //标识这个节点已经移动了
        patchVnode(moveVnode, newStartVnode) //对比属性和子节点
      } else {
        // 找不到则添加
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  //  abc => abcd   abc => dabc
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let childEl = createElm(newChildren[i])
      // el.appendChild(childEl)
      let anchor = newChildren[newEndIndex + 1]
        ? newChildren[newEndIndex + 1].el
        : null //获取下一个元素 可能没有
      el.insertBefore(childEl, anchor) //anchor为null的是 则会认为是appendChild
    }
  }
  //  abcd => abc dabc => abc
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i]) {
        let childEl = oldChildren[i].el
        el.removeChild(childEl)
      }
    }
  }
}
