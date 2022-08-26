import Dep from './dep'

let id = 0

// watcher 是观察者
// dep 是被观察者
// dep 变化了会通知观察者watcher更新

class Watcher {
  constructor(vm, fn, options) {
    this.id = id++
    this.renderWatcher = options //是一个渲染watcher
    this.getter = fn //getter意味着调用这个函数会触发取值操作
    this.deps = [] //视图记录属性
    this.depsId = new Set()
    this.get() //先初始化一次
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
  get() {
    //当我们渲染watcher的时候 我们会把当前的渲染watcher放到Dep.target上
    Dep.target = this
    this.getter() //会去vm上取值
    Dep.target = null
  }
  update() {
    console.log('触发watcher更新了')
    this.get() //重新渲染
  }
}

export default Watcher

// 需要给每个属性 增加一个dep  目的就是收集watcher
// 一个视图中 会有多个属性 等同于 多个dep对应一个watcher
// 同样一个属性可以对应多个视图  即 一个dep对应多个watcher
// dep和watcher  是多对多的关系
