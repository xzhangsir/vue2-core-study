import { ASSETS_TYPE, mergeOptions } from '../utils/index'
import { initAssetRegisters } from './asset'
import { initExtend } from './initExtend'
import { initUse } from '../global-api/use'

export function initGlobalAPI(Vue) {
  Vue.options = {
    _base: Vue
  }
  Vue.mixin = function (mixin) {
    // 将用户的选型和全局的options进行合并
    // {} {created:function(){}} => {created:[fn]} //第一次
    // {created:[fn]} {created:[fn]} => {created:[fn,fn]} //再一次
    this.options = mergeOptions(this.options, mixin)
    return this
  }
  ASSETS_TYPE.forEach((type) => {
    Vue.options[type + 's'] = {}
  })
  // Vue.extend方法定义
  initExtend(Vue)
  //assets注册方法 包含组件 指令和过滤器
  initAssetRegisters(Vue)
  initUse(Vue) //vue.use
}
