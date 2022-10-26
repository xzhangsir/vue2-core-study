import { isObject } from '../utils/index'
import Dep, { popTarget, pushTarget } from './dep'
import { queueWatcher } from './scheduler'

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
    this.user = options.user
    this.lazy = options.lazy
    this.dirty = this.lazy
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else if (typeof exprOrFn === 'string') {
      //用户watcher传过来的可能是一个字符串   类似a.a.a.a.b
      this.getter = function () {
        let path = exprOrFn.split('.')
        let obj = vm
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    this.value = this.lazy ? undefined : this.get()
  }
  get() {
    // Dep.target = this
    pushTarget(this)
    let res = this.getter.call(this.vm)
    // Dep.target = null
    popTarget()
    return res
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  depend() {
    // 计算属性的watcher存储了依赖项的dep
    let i = this.deps.length
    while (i--) {
      //调用依赖项的dep去收集渲染watcher
      this.deps[i].depend()
    }
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
    // console.log('更新ll')
    // this.get()
    // 异步更新
    //queueWatcher(this)
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run() {
    console.log('更新')
    // this.get()
    let oldVal = this.value
    let newVal = this.get()
    this.value = newVal
    if (this.user) {
      if (newVal !== oldVal || isObject(newVal)) {
        this.cb.call(this.vm, newVal, oldVal)
      }
    } else {
      this.get()
    }
  }
}
export default Watcher
