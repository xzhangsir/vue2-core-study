import { isObject } from '../utils/index'
import { ArrayMethods } from './array'

export function observer(data) {
  if (isObject(data)) {
    return data
  }
  return new Observer(data)
}

class Observer {
  constructor(value) {
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      value: this
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

function defineReactive(data, key, value) {
  observer(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newVal) {
      if (value === newVal) return
      observer(newVal)
      value = newVal
    }
  })
}
