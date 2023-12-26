import { isObject } from '../utils/index'
import { ArrayMethods } from './array'
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
    Object.defineProperty(val, '__ob__', {
      enumerable: false, //不可枚举
      value: this
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
  observe(val)
  Object.defineProperty(data, key, {
    get() {
      return val
    },
    set(newVal) {
      if (newVal === val) return
      observe(newVal)
      val = newVal
    }
  })
}
