import { mergeOptions } from '../utils/index'

export function initExtend(Vue) {
  let cid = 0 //组件的唯一标识
  Vue.extend = function (options) {
    function Sub(options) {
      this.__init(options)
    }
    Sub.cid = cid++
    // 子类继承父类
    // 子类的原型指向父类
    Sub.prototype = Object.create(this.prototype)
    // constructor 指向自己
    Sub.prototype.constructor = Sub
    //合并自己的options和父类的options
    Sub.options = mergeOptions(this.options, options)
    return Sub
  }
}
