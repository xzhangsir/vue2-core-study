import { nextTick } from '../utils/nextTick'
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
    // console.log(this.exprOrfn)
    if (typeof this.exprOrfn === 'function') {
      this.getter = this.exprOrfn //更新视图
    } else if (typeof this.exprOrfn === 'string') {
      // watch
      // console.log(vm)
      this.getter = function () {
        let path = this.exprOrfn.split('.')
        let obj = vm
        for (let i = 0; i < path.length; i++) {
          // console.log(path[i], vm[path[i]])
          obj = obj[path[i]]
        }
        // console.log(obj)
        return obj
      }
    }
    this.value = this.get() //保持watch的初始值
    this.user = options.user //watch用到：标识是不是用户自己的watcher
  }
  run() {
    let oldVal = this.value
    let newVal = this.get()
    this.value = newVal
    if (this.user) {
      this.cb.call(this.vm, newVal, oldVal)
    }
  }
  // 初次渲染
  get() {
    pushTarget(this) //给dep添加watcher
    const value = this.getter() //渲染页面
    popTarget() //给dep取消watcher
    return value
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
function flushWatcher() {
  queue.slice(0).forEach((watcher) => {
    watcher.run()
    // watcher.cb()
  })
  queue = []
  has = {}
  pending = false
}
function queueWatcher(watcher) {
  let id = watcher.id
  // console.log(id)
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      pending = true
      /*     setTimeout(() => {
        queue.forEach((watcher) => watcher.run())
        queue = []
        has = {}
        pending = false
      }) */

      nextTick(flushWatcher)
    }
  }
}

export default watcher
