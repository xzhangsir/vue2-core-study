let id = 0

class Wathcer {
  constructor(vm, exprOrFn, cb, options) {
    this.id = id++ // watcher的唯一标识
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb //回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    this.options = options
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    // 实例化就会默认调用get方法
    this.get()
  }
  get() {
    this.getter()
  }
}

export default Wathcer
