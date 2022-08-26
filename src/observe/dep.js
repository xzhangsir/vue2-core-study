let id = 0

class Dep {
  constructor() {
    this.id = id++
    // 属性的dep要收集watcher
    this.subs = [] //这里存放这当前属性对应的watcher有哪些
  }
  depend() {
    /* /这样同样的属性 会重复收集watcher
     this.subs.push(Dep.target)
    console.log(this.subs) */
    Dep.target.addDep(this) //(Dep.target就是当前的watcher)让watcher记住dep
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}
Dep.target = null

export default Dep
