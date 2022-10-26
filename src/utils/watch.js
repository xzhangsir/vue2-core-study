import Watcher from '../observe/watcher'

export function initWatch(Vue) {
  Vue.prototype.$watch = function (exprOrFn, cb, options) {
    const vm = this
    new Watcher(vm, exprOrFn, cb, { ...options, user: true })
    // 如果有immediate属性 代表需要立即执行回调
    if (options && options.immediate) {
      cb() //如果立刻执行
    }
  }
}
