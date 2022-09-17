import { popTarget, pushTarget } from './dep'
let id = 0
class watcher {
  constructor(vm, updateComponent, cb, options) {
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = []
    this.depsId = new Set()
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent //更新视图
    }
    this.get()
  }
  run() {
    this.getter()
  }
  // 初次渲染
  get() {
    pushTarget(this) //给dep添加watcher
    this.getter() //渲染页面
    popTarget() //给dep取消watcher
  }
  // wather dep 相互关联
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addWatcher(this)
    }
  }
  // 更新
  update() {
    // this.getter()
    // 多次调用update 只执行一次 缓存
    queueWatcher(this)
  }
}

// 将需要批量更新的watcher存放到队列中
let queue = []
let has = {}
let pending = false
function queueWatcher(watcher) {
  let id = watcher.id
  // console.log(id)
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      pending = true
      setTimeout(() => {
        queue.forEach((watcher) => watcher.run())
        queue = []
        has = {}
        pending = false
      })
    }
  }
}

export default watcher
