import { ArrayMethods } from './arr'
import Dep from './dep'
export function observer(data) {
  if (typeof data !== 'object' || data === null) {
    // data不是对象或者data为空 不劫持
    return data
  }

  // console.log('劫持data:', data)
  return new Observer(data)
}

class Observer {
  constructor(value) {
    // 给 value 添加一个属性
    Object.defineProperty(value, '__ob__', {
      enumerable: false, //不可枚举
      value: this
    })
    // value.__ob__ = this //副作用 给数据加了一个标识上有__ob__ 则说明这个属性被观测过

    // 判断是不是数组
    if (Array.isArray(value)) {
      console.log('数组', value)
      // 重写数组 的部分方法
      value.__proto__ = ArrayMethods
      // 数组里面包含对象
      this.observeArray(value) //[{a:1}]
    } else {
      this.walk(value)
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    // console.log('keys', keys)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = data[key]
      // 对每一个属性进行劫持
      defineReactive(data, key, value)
    }
  }
  observeArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      observer(arr[i])
    }
  }
}
// 对对象中的属性进行劫持
function defineReactive(data, key, value) {
  observer(value) //深度递归劫持
  let dep = new Dep() //给每个属性添加一个dep
  Object.defineProperty(data, key, {
    get() {
      console.log('获取', key)
      // 收集依赖
      if (Dep.target) {
        dep.depend()
      }
      console.log(dep)
      return value
    },
    set(newVal) {
      // console.log('设置', newVal)
      if (newVal === value) return
      observer(newVal) //对设置的值 进行劫持
      value = newVal
      // 触发更新
      dep.notify()
    }
  })
}
