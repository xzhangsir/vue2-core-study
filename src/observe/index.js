import { newArrayProto } from './array'

class Observer {
  constructor(data) {
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

export function defineReactive(target, key, value) {
  observe(value) //如果value是对象 再次递归劫持 深度劫持
  Object.defineProperty(target, key, {
    get() {
      console.log('来取值了', key)
      return value
    },
    set(newValue) {
      console.log('设置值了', key)
      if (newValue === value) return
      observe(newValue) //如果设置的值是对象 再次代理
      value = newValue
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
