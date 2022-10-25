import Dep, { popTarget, pushTarget } from './dep'

let id = 0

class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.id = id++
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.deps = []
    this.depsId = new Set()
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.get()
  }
  get() {
    // Dep.target = this
    pushTarget(this)
    this.getter()
    // Dep.target = null
    popTarget()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      // 让watcher记住dep
      this.deps.push(dep)
      this.depsId.add(id)
      // 让dep记住watcher
      dep.addSub(this)
    }
  }
  update() {
    console.log('更新')
    this.get()
  }
}
export default Watcher
