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
export function pushTarget(watcher) {
  Dep.target = watcher
}
// 取消watcher
export function popTarget() {
  Dep.target = null
}

export default Dep
