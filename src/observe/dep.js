let id = 0

export default class Dep {
  constructor() {
    this.id = id++
    this.subs = [] //存放watcher的容器
  }
  depend() {
    //   如果当前存在watcher
    if (Dep.target) {
      Dep.target.addDep(this) // 把自身-dep实例存放在watcher里面
    }
  }
  notify() {
    //   依次执行subs里面的watcher更新方法
    this.subs.forEach((watcher) => watcher.update())
  }
  addSub(watcher) {
    //   把watcher加入到自身的subs容器
    this.subs.push(watcher)
  }
}

// 默认Dep.target为null
Dep.target = null
// 栈结构用来存watcher
const targetStack = []

export function pushTarget(watcher) {
  targetStack.push(watcher)
  Dep.target = watcher // Dep.target指向当前watcher
}
export function popTarget() {
  targetStack.pop() // 当前watcher出栈 拿到上一个watcher
  Dep.target = targetStack[targetStack.length - 1]
}

// dep.depend ->
//     Watcher.addDep(this)
//       this.deps.push(dep) //watcher记住dep
//       dep.addSub(wathcer) //dep 记住 watcher
//           this.subs.push(watcher)
