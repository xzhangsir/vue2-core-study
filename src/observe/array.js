let oldArrayMethods = Array.prototype

export const ArrayMethods = Object.create(oldArrayMethods)
let methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']

methods.forEach((method) => {
  ArrayMethods[method] = function (...args) {
    let result = oldArrayMethods[method].call(this, ...args)
    let ob = this.__ob__
    let inserted // 新增的值
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted) {
      ob.observerArray(inserted)
    }
    ob.dep.notify()
    return result
  }
})
