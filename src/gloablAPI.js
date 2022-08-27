import { mergeOptions } from './utils'
export function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // console.log(this.options)
    // console.log(mixin)
    // 蒋用户的选型和全局的options进行合并
    // {} {created:function(){}} => {created:[fn]} //第一次
    // {created:[fn]} {created:[fn]} => {created:[fn,fn]} //再一次
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
