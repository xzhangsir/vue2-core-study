import Dep, { popTarget, pushTarget } from './dep'

let id = 0

// watcher 是观察者
// dep 是被观察者
// dep 变化了会通知观察者watcher更新

class Watcher {
  constructor(vm, exprOrfn, options, cb) {
    this.id = id++
    this.renderWatcher = options //是一个渲染watcher
    if (typeof exprOrfn === 'string') {
      // watch需要的
      this.getter = function () {
        return vm[exprOrfn]
      }
    } else {
      this.getter = exprOrfn //getter意味着调用这个函数会触发取值操作
    }

    this.deps = [] //视图记录属性
    this.depsId = new Set()
    this.lazy = options.lazy
    this.dirty = this.lazy //计算属性缓存标识
    this.vm = vm
    this.user = options.user //watch用到：标识是不是用户自己的watcher
    this.cb = cb
    this.value = this.lazy ? undefined : this.get() //先初始化一次
  }
  addDep(dep) {
    // 一个组件有多个属性 重复的属性 只记录一次
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep) //watcher 记住了 dep
      this.depsId.add(id)
      dep.addSub(this) //让dep记住watcher
    }
  }
  evaluate() {
    // 获取用户函数的返回值 并且标识为脏
    this.value = this.get()
    this.dirty = false
  }
  get() {
    /*    //当我们渲染watcher的时候 我们会把当前的渲染watcher放到Dep.target上
    Dep.target = this
    this.getter() //会去vm上取值
    Dep.target = null
 */
    pushTarget(this)
    let value = this.getter.call(this.vm)
    popTarget()
    return value
  }
  depend() {
    let i = this.deps.length
    while (i--) {
      // 让计算属性watcher也收集渲染watcher
      this.deps[i].depend()
    }
  }
  update() {
    /*console.log('触发watcher更新了')
    this.get() //重新渲染 */
    if (this.lazy) {
      // 如果是计算属性 依赖的值变化了  就标识计算属性是脏的了
      this.dirty = true
    } else {
      queueWatcher(this)
    }
    /*  // 异步更新
    queueWatcher(this) //将当前的watcher放到队列中 去重
  */
  }
  run() {
    console.log('渲染')
    let oldVal = this.value
    let newVal = this.get()
    if (this.user) {
      this.cb.call(this.vm, newVal, oldVal)
    }
  }
}
let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)
  queue = []
  has = {}
  pending = false
  flushQueue.forEach((q) => q.run())
}

function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    // 不管我们的update执行多少次 但是最终只执行一轮刷新操作
    if (!pending) {
      /*  // 异步更新
      setTimeout(flushSchedulerQueue, 0) */
      nextTick(flushSchedulerQueue)
      pending = true
    }
    console.log(queue)
  }
}
// nextTick  用户可以调用 框架内部也可以调用
// 所以将cb先存起来 依次执行
let callbacks = []
let waiting = false
function flushCallbacks() {
  let cbs = callbacks.slice(0)
  waiting = false
  callbacks = []
  cbs.forEach((cb) => cb())
}

// nextTick 内部没有直接使用setTimeout 而是采用优雅降级的方式
// 内部先采用promise (ie不兼容)
// MutationObserver
// 考虑IE专享的 setImmediate
// 实在不行 就用 setTimeout
let timerFunc
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContent = 2
    // 1 变 2    flushCallbacks执行
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick(cb) {
  callbacks.push(cb)
  // console.log(callbacks)
  if (!waiting) {
    /*  setTimeout(flushCallbacks, 0) */
    timerFunc() //兼容性的
    waiting = true
  }
}

export default Watcher

// 需要给每个属性 增加一个dep  目的就是收集watcher
// 一个视图中 会有多个属性 等同于 多个dep对应一个watcher
// 同样一个属性可以对应多个视图  即 一个dep对应多个watcher
// dep和watcher  是多对多的关系
