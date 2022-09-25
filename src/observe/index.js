import { ArrayMethods } from './array'

export function observer(data) {
  if (data === null || typeof data !== 'object') {
    // data不是对象或者data为空 不劫持
    return data
  }
  console.log('要进行劫持的数据', data)
  return new Observer(data)
}

class Observer {
  constructor(value) {
    // 给 value 添加一个属性
    Object.defineProperty(value, '__ob__', {
      enumerable: false, //不可枚举
      value: this
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

function defineReactive(data, key, value) {
  observer(value)
  Object.defineProperty(data, key, {
    get() {
      console.log('获取key', key, value)
      return value
    },
    set(newVal) {
      console.log('设置key', key, newVal)
      if (value === newVal) return
      observer(newVal) //对设置的值 进行劫持
      value = newVal
    }
  })
}
