// 重写数组方法

// 1) 获取原来数组的方法
let oldArrayProtoMethods = Array.prototype
// 2) 继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)
// 3）函数劫持
let methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']

methods.forEach((method) => {
  ArrayMethods[method] = function (...args) {
    // console.log('数组劫持', args)
    const result = oldArrayProtoMethods[method].apply(this, args)
    // 对数组中新增的数据 进行劫持
    let inserted //新增的内容
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
    let ob = this.__ob__
    if (inserted) {
      // 对新增的内容进行劫持
      ob.observeArray(inserted)
    }
    return result
  }
})
