import { isObject } from '../utils/index'
import { popTarget, pushTarget } from './dep'
import { queueWatcher } from './scheduler'

let id = 0

class Wathcer {
  constructor(vm, exprOrFn, cb, options) {
    this.id = id++ // watcher的唯一标识
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb //回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    this.options = options
    this.deps = [] //存放dep的容器
    this.depsId = new Set() //保证deps中的dep是唯一的
    this.user = options.user //watch用到：标识是不是用户自己的watcher
    this.lazy = options.lazy //标识计算属性watcher
    this.dirty = this.lazy //dirty可变  表示计算watcher是否需要重新计算 默认值是true
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else if (typeof exprOrFn === 'string') {
      //用户watcher传过来的可能是一个字符串   类似a.a.a.a.b
      this.getter = function () {
        let path = exprOrFn.split('.')
        let obj = vm
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    // 实例化就会默认调用get方法
    // 非计算属性实例化就会默认调用get方法 进行取值  保留结果 计算属性实例化的时候不会去调用get
    this.value = this.lazy ? undefined : this.get()
  }
  get() {
    // 在调用方法之前先把当前watcher实例推到全局Dep.target上
    pushTarget(this)
    //如果watcher是渲染watcher 那么就相当于执行  vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集
    let res = this.getter.call(this.vm)
    // 在调用方法之后把当前watcher实例从全局Dep.target移除
    popTarget()
    return res
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addWatcher(this)
    }
  }
  // 更新
  update() {
    // 计算属性依赖的值发生变化 只需要把dirty置为true  下次访问到了重新计算
    if (this.lazy) {
      this.dirty = true
    } else {
      /*
        console.log('我更新了')
        this.get() 
      */
      // 异步更新 每次watcher更新的时候 先将它用一个队列缓存起来 之后再一起调用
      queueWatcher(this)
    }
  }
  //   计算属性重新进行计算 并且计算完成把dirty置为false
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  depend() {
    // 计算属性的watcher存储了依赖项的dep
    let i = this.deps.length
    while (i--) {
      //调用依赖项的dep去收集渲染watcher
      this.deps[i].depend()
    }
  }
  run() {
    // this.get()
    let oldVal = this.value //老值
    let newVal = this.get() //新值
    this.value = newVal //现在的新值将成为下一次变化的老值
    // console.log(oldVal, newVal)
    if (this.user) {
      // 如果两次的值不相同  或者值是引用类型 因为引用类型新老值是相等的 他们是指向同一引用地址
      if (newVal !== oldVal || isObject(newVal)) {
        this.cb.call(this.vm, newVal, oldVal)
      }
    } else {
      // 真正的触发更新
      console.log('我真正的更新了')
      // this.cb.call(this.vm)
      this.get()
    }
  }
}

export default Wathcer
