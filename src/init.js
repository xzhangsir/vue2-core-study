import { initState } from './state'

export function initMixin(Vue) {
  Vue.prototype.__init = function (options) {
    const vm = this
    vm.$options = options //将用户的选项挂载到实例上

    //初始化状态
    initState(vm)
  }
}
