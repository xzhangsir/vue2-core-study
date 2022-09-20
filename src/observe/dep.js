let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  // 让watcher收集dep
  depend() {
    // this.subs.push(Dep.target)
    Dep.target.addDep(this)
  }
  // dep收集watcher
  addWatcher(watcher) {
    this.subs.push(watcher)
  }
  // 更新
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}

Dep.target = null
// 添加watcher
let stack = [] //栈
export function pushTarget(watcher) {
  Dep.target = watcher
  //watcher 入栈
  stack.push(watcher) //渲染watcher 计算属性watcher
}
// 取消watcher
export function popTarget() {
  // Dep.target = null
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep
