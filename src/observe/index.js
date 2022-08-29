import { newArrayProto } from './array'
import Dep from './dep'

class Observer {
  constructor(data) {
    this.dep = new Dep()

    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false //不能被枚举
    })
    // data.__ob__ = this //副作用 给数据加了一个标识上有__ob__ 则说明这个属性被观测过
    if (Array.isArray(data)) {
      // 重写部分数组中的方法
      data.__proto__ = newArrayProto
      this.observeArray(data)
    } else {
      // Object.defineProperty 只能劫持已经存在的属性
      // vue2中加了 $set  $delete api
      this.walk(data)
    }
  }
  walk(data) {
    //循环对象对属性进行依次的劫持
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    data.forEach((item) => observe(item))
  }
}

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i]
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

export function defineReactive(target, key, value) {
  let childOb = observe(value) //如果value是对象 再次递归劫持 深度劫持
  let dep = new Dep() //每个属性都有一个dep与之对应
  Object.defineProperty(target, key, {
    get() {
      if (Dep.target) {
        dep.depend() //让这个属性的收集器 记住这个watcher
        if (childOb) {
          // 让数组和对象本身也实现依赖收集
          childOb.dep.depend()
          // 数组里面套数组
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      // console.log('来取值了', key)
      return value
    },
    set(newValue) {
      // console.log('设置值了', key)
      if (newValue === value) return
      observe(newValue) //如果设置的值是对象 再次代理
      value = newValue
      dep.notify() //通知watcher更新
    }
  })
}

export function observe(data) {
  if (typeof data !== 'object' || data == null) {
    return //只对对象进行劫持
  }
  if (data.__ob__ instanceof Observer) {
    // 说明这个对象被代理过了
    return data.__ob__
  }
  // 如果对象被劫持过 就不需要再被劫持了
  return new Observer(data)
}
