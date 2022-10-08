let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = [] //这里存放这当前属性对应的watcher有哪些
  }
  depend() {
    // 把自身-dep实例存放在watcher里面
    Dep.target.addDep(this)
  }
  addWatcher(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    //   依次执行subs里面的watcher更新方法
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
