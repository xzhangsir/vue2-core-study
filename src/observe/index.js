class Observer {
  constructor(data) {
    // Object.defineProperty 只能劫持已经存在的属性
    // vue2中加了 $set  $delete api
    this.walk(data)
  }
  walk(data) {
    //循环对象对属性进行依次的劫持
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
}

export function defineReactive(target, key, value) {
  observe(value) //如果value是对象 再次递归劫持 深度劫持
  Object.defineProperty(target, key, {
    get() {
      console.log('来取值了')
      return value
    },
    set(newValue) {
      console.log('设置值了')
      if (newValue === value) return
      value = newValue
    }
  })
}

export function observe(data) {
  if (typeof data !== 'object' || data == null) {
    return //只对对象进行劫持
  }
  // 如果对象被劫持过 就不需要再被劫持了
  return new Observer(data)
}
