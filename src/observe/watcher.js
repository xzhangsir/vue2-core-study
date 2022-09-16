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
  get() {
    this.getter()
  }
}

export default watcher
