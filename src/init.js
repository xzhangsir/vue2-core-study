import { initState } from './initState'

export function initMixin(Vue) {
  Vue.prototype.__init = function (options) {
    let vm = this
    vm.$options = options
    initState(vm)
  }
}
