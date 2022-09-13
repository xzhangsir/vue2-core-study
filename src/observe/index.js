export function observer(data) {
  if (typeof data !== 'object' || data === null) {
    // data不是对象或者data为空 不劫持
    return data
  }
  console.log('劫持data:', data)
  return new Observer(data)
}

class Observer {
  constructor(value) {
    this.walk(value)
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
}
// 对对象中的属性进行劫持
function defineReactive(data, key, value) {
  observer(value) //深度递归劫持
  Object.defineProperty(data, key, {
    get() {
      console.log('获取')
      return value
    },
    set(newVal) {
      console.log('设置')
      if (newVal === value) return
      observer(newVal) //对设置的值 进行劫持
      value = newVal
    }
  })
}
