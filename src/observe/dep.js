let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = [] //这里存放这当前属性对应的watcher有哪些
  }
}

Dep.target = null
export default Dep
