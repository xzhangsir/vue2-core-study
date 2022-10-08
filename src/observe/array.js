let oldArrayMethods = Array.prototype

export let ArrayMethods = Object.create(oldArrayMethods)

let methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']

for (let method of methods) {
  ArrayMethods[method] = function (...args) {
    let result = oldArrayMethods[method].apply(this, args)
    // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  this就是a  ob就是a.__ob__ 这个属性代表的是该数据已经被响应式观察过了 __ob__对象指的就是Observer实例
    const ob = this.__ob__
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
      ob.observeArray(inserted)
    }
    //数组派发更新 ob指的就是数组对应的Observer实例 我们在get的时候判断如果属性的值还是对象那么就在Observer实例的dep收集依赖 所以这里是一一对应的  可以直接更新
    ob.dep.notify()
    return result
  }
}
