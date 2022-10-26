import { isObject } from '../utils/index'
import { ArrayMethods } from './array'
import Dep from './dep'

export function observer(data) {
  if (!isObject(data)) {
    return //只对对象进行劫持
  }
  // if (data.__ob__ instanceof Observer) {
  //   // 说明这个对象被代理过了
  //   return data.__ob__
  // }
  return new Observer(data)
}

class Observer {
  constructor(value) {
    this.dep = new Dep()
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      value: this,
      writable: true,
      configurable: true
    })
    if (Array.isArray(value)) {
      value.__proto__ = ArrayMethods
      this.observerArray(value)
    } else {
      this.walk(value)
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
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend()
        if (childOb) {
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
      if (value === newVal) return
      observer(newVal)
      value = newVal
      dep.notify()
    }
  })
}

// dep.depend ->
//     Watcher.addDep(this)
//       this.deps.push(dep) //watcher记住dep
//       dep.addSub(wathcer) //dep 记住 watcher
//           this.subs.push(watcher)

export function set(target, key, value) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, value)
    return value
  }
  // 如果是对象本身的属性 则直接添加
  if (key in target && !(key in Object.prototype)) {
    target[key] = value
    return value
  }
  const ob = target.__ob__
  console.log(target)
  // 如果对象本身就不是响应式 不需要将其定义成响应式属性
  if (!ob) {
    target[key] = value
    return value
  }
  defineReactive(target, key, value)
  ob.dep.notify()
  return value
}
