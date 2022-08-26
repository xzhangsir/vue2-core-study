import Watcher from './observe/watcher'
import { createElementVNode, createTextVNode } from './vdom'

function createElm(vnode) {
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

function patch(oldVNode, vnode) {
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

export function initLifeCycle(Vue) {
  // _c('div',{id:"app",style:{"color":"red"}},_c('div',{style:{"color":"green"}},_v("name:"+_s(name))),_c('i',null,_v("链接")),_c('div',null,_v("age:"+_s(age))))
  Vue.prototype._update = function (vnode) {
    // console.log('update', vnode)
    const el = this.$el
    // console.log(el)
    // patch  既有初始化的功能 又有更新的功能
    vm.$el = patch(el, vnode)
  }
  // _c('div',{},...children)
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }
  // _c(text)
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments)
  }
  Vue.prototype._s = function (value) {
    if (typeof value !== 'object') return value
    return JSON.stringify(value)
  }
  Vue.prototype._render = function () {
    // 当渲染的时候会去实例中取值 我们就可以将属性和视图绑定在一起了
    // console.log('render')
    const vm = this
    // 让with中的this指向vm
    return vm.$options.render.call(vm) //通过ast语法转义后生成的render
  }
}

export function mountComponent(vm, el) {
  vm.$el = el
  /*   // 1 调用render方法 产生虚拟节点
  let VNode = vm._render() //vm.$options.render()  返回的是虚拟节点
  // 2 根据虚拟dom 产生真实dom
  vm._update(VNode) //虚拟节点转真实节点
  // 3 插入到el元素中 */

  const updateComponent = () => {
    vm._update(vm._render())
  }

  // true 标识是一个渲染watcher
  const watcher = new Watcher(vm, updateComponent, true)
  console.log(watcher)
}
