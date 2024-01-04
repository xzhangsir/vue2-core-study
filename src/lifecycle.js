import Watcher from './observe/watcher'
import { patch } from './vdom/patch'

export function mountComponent(vm, el) {
  // 上一步模板编译解析生成了render函数
  // 下一步就是执行vm._render()方法 调用生成的render函数 生成虚拟dom
  // 最后使用vm._update()方法把虚拟dom渲染到页面

  // 真实的el选项赋值给实例的$el属性 为之后虚拟dom产生的新的dom替换老的dom做铺垫
  vm.$el = el
  //   _update和._render方法都是挂载在Vue原型的方法  类似_init
  let updateComponent = () => {
    vm._update(vm._render())
  }
  callHook(vm, 'beforeMount')
  new Watcher(
    vm,
    updateComponent,
    () => {
      callHook(vm, 'beforeUpdate') //更新之前
    },
    true
  )
  callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
  // 把_update挂载在Vue的原型
  Vue.prototype._update = function (vnode) {
    const vm = this
    // patch是渲染vnode为真实dom核心
    vm.$el = patch(vm.$el, vnode)
  }
}

//从$options取对应的生命周期函数数组并执行
export function callHook(vm, hook) {
  // 获取生命周期对应函数数组
  let handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((fn) => {
      fn.call(vm) // 生命周期中的 this 指向 vm 实例
    })
  }
}
