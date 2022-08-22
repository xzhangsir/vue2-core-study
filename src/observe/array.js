// 对数组中的部分方法进行重写

let oldArrayProto = Array.prototype //获取数组的原型

export let newArrayProto = Object.create(oldArrayProto)

// 找到所有的变异方法  即可以修改原数组的方法
let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']

methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    // console.log(method)
    // 内部调用原来的方法  函数的劫持  切片编程
    const result = oldArrayProto[method].call(this, ...args)

    // 对数组中新增的数据 进行劫持
    let inserted //新增的内容
    let ob = this.__ob__
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
      // 对新增的内容进行观测
      ob.observeArray(inserted)
    }
    return result
  }
})
