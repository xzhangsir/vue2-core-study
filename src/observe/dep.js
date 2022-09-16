class Dep {
  constructor() {
    this.subs = []
  }
  // 收集watcher
  depend() {
    this.subs.push(Dep.target)
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
