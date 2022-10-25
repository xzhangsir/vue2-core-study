let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    Dep.target.addDep(this)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}

Dep.target = null

// 用栈来保存watcher
const targetStack = []

export function pushTarget(watcher) {
  targetStack.push(watcher)
  Dep.target = watcher // Dep.target指向当前watcher
}
export function popTarget() {
  targetStack.pop() // 当前watcher出栈 拿到上一个watcher
  Dep.target = targetStack[targetStack.length - 1]
}

export default Dep
