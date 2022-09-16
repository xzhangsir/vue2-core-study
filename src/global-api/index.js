import { mergeOptions } from '../utils/index'

export function initGlobApi(Vue) {
  // created:[a,b,c]
  // watch:[a,b]
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // console.log(this)
    // 对象的合并
    // console.log(Vue.options)
    // console.log(mixin)
    this.options = mergeOptions(this.options, mixin)
    // console.log(this.options)
    return this
  }
}
