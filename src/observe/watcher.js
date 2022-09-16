import { popTarget, pushTarget } from './dep'

class watcher {
  constructor(vm, updateComponent, cb, options) {
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent //更新视图
    }
    this.get()
  }
  // 初次渲染
  get() {
    pushTarget(this) //给dep添加watcher
    this.getter() //渲染页面
    popTarget() //给dep取消watcher
  }
  // 更新
  update() {
    this.getter()
  }
}

export default watcher
