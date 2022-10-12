import { isValidArrayIndex } from '../utils/index'
import { ArrayMethods } from './array'
import Dep from './dep'

export function observer(data) {
  if (data === null || typeof data !== 'object') {
    // data不是对象或者data为空 不劫持
    return data
  }
  // console.log('要进行劫持的数据', data)
  return new Observer(data)
}

class Observer {
  constructor(value) {
    this.dep = new Dep()
    // 给 value 添加一个属性
    Object.defineProperty(value, '__ob__', {
      enumerable: false, //不可枚举
      value: this,
      writable: true,
      configurable: true
    })
    if (Array.isArray(value)) {
      // 重写数组 的部分方法
      value.__proto__ = ArrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      // 对data中的每一个属性进行劫持
      const key = keys[i]
      defineReactive(data, key, data[key])
    }
  }
  observeArray(data) {
    for (let i = 0; i < data.length; i++) {
      observer(data[i])
    }
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

function defineReactive(data, key, value) {
  let childOb = observer(value)
  // 为每个属性实例化一个Dep 每个属性都有一个dep与之对应
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      // console.log('获取key', key, value)
      if (Dep.target) {
        dep.depend()
        if (childOb && childOb.dep) {
          childOb.dep.depend()
          // 数组里面嵌套数组
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newVal) {
      // console.log('设置key', key, newVal)
      if (value === newVal) return
      observer(newVal) //对设置的值 进行劫持
      value = newVal
      dep.notify() //通知渲染watcher去更新--派发更新
    }
  })
}

export function set(target, key, val) {
  // 如果是数组 直接调用我们重写的splice方法 可以刷新视图
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 如果是对象本身的属性 则直接添加
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = target.__ob__
  // 如果对象本身就不是响应式 不需要将其定义成响应式属性
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(target, key, val)
  ob.dep.notify()
  return val
}
