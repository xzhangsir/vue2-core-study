let oldArrayMethods = Array.prototype

export let ArrayMethods = Object.create(oldArrayMethods)
let methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']

for (let method in methods) {
  ArrayMethods[method] = function (...args) {
    let result = oldArrayMethods[method].apply(this, args)
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
      this.__ob__.observeArray(inserted)
    }
    return result
  }
}
