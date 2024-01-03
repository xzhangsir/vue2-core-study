let oldArrMethods = Array.prototype
export let ArrayMethods = Object.create(oldArrMethods)
let methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']

for (let i = 0; i < methods.length; i++) {
  let method = methods[i]
  ArrayMethods[method] = function (...args) {
    let res = oldArrMethods[method].apply(this, args)
    let ob = this.__ob__
    let inserted //新增的值
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = arg.slice(2)
        break
      default:
        break
    }
    if (inserted) {
      ob.observerArray(inserted)
    }
    console.log('inserted', inserted)
    ob.dep.notify()
    return res
  }
}
