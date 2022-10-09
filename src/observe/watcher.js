import { popTarget, pushTarget } from './dep'
import { queueWatcher } from './scheduler'

let id = 0

class Wathcer {
  constructor(vm, exprOrFn, cb, options) {
    this.id = id++ // watcher的唯一标识
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb //回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    this.options = options
    this.deps = [] //存放dep的容器
    this.depsId = new Set() //保证deps中的dep是唯一的
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    // 实例化就会默认调用get方法
    this.get()
  }
  get() {
    // 在调用方法之前先把当前watcher实例推到全局Dep.target上
    pushTarget(this)
    //如果watcher是渲染watcher 那么就相当于执行  vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集
    this.getter()
    // 在调用方法之后把当前watcher实例从全局Dep.target移除
    popTarget()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps = dep
      dep.addWatcher(this)
    }
  }
  // 更新
  update() {
    /*   console.log('我更新了')
    this.get() */
    // 异步更新 每次watcher更新的时候 先将它用一个队列缓存起来 之后再一起调用
    queueWatcher(this)
  }
  run() {
    // 真正的触发更新
    console.log('我真正的更新了')
    this.get()
  }
}

export default Wathcer
