let oldArrayMethods = Array.prototype

export let ArrayMethods = Object.create(oldArrayMethods)

let methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']

for (let method of methods) {
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
    // console.log(this)
    if (inserted) {
      //对新增的内容进行劫持
      this.__ob__.observeArray(inserted)
    }
    return result
  }
}
