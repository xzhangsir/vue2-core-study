import Watcher from './observe/watcher'

export function initWatch(Vue) {
  // watch最终调用的都是这个
  Vue.prototype.$watch = function (exprOrFn, cb) {
    new Watcher(this, exprOrFn, { user: true }, cb)
  }
}
