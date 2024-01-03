import { isObject } from '../utils/index'
import { ArrayMethods } from './array'
import Dep from './dep'
export function observe(data) {
  // 如果传过来的是对象或者数组 进行属性劫持
  if (
    Object.prototype.toString.call(data) === '[object Object]' ||
    Array.isArray(data)
  ) {
    return new Observer(data)
  }
}

class Observer {
  constructor(val) {
    this.dep = new Dep()
    Object.defineProperty(val, '__ob__', {
      enumerable: false, //不可枚举
      value: this,
      writable: true,
      configurable: true
    })
    if (Array.isArray(val)) {
      val.__proto__ = ArrayMethods
      this.observerArray(val)
    } else {
      this.walk(val)
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      defineReactive(data, key, data[key])
    }
  }
  observerArray(data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }
}

function defineReactive(data, key, val) {
  let childOb = observe(val) // childOb就是Observer实例
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        // 如果有watcher dep就会保存watcher 同时watcher也会保存dep
        dep.depend()
        if (childOb) {
          // 这里表示 属性的值依然是一个对象 包含数组和对象 childOb指代的就是Observer实例对象  里面的dep进行依赖收集
          // 比如{a:[1,2,3]} 属性a对应的值是一个数组 观测数组的返回值就是对应数组的Observer实例对象
          childOb.dep.depend()
          // 如果数据结构类似 {a:[1,2,[3,4,[5,6]]]} 这种数组多层嵌套  数组包含数组的情况  那么我们访问a的时候 只是对第一层的数组进行了依赖收集 里面的数组因为没访问到  所以五大收集依赖  但是如果我们改变了a里面的第二层数组的值  是需要更新页面的  所以需要对数组递归进行依赖收集
          if (Array.isArray(val)) {
            // 如果内部还是数组
            dependArray(val) // 不停的进行依赖收集
          }
        }
      }
      return val
    },
    set(newVal) {
      if (newVal === val) return
      observe(newVal)
      val = newVal
      dep.notify() // 通知渲染watcher去更新--派发更新
    }
  })
}
// 递归收集数组依赖
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    // e.__ob__代表e已经被响应式观测了 但是没有收集依赖 所以把他们收集到自己的Observer实例的dep里面
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      // 如果数组里面还有数组  就递归去收集依赖
      dependArray(e)
    }
  }
}
