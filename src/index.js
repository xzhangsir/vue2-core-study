import { initGlobApi } from './global-api/index'
import { initMixin } from './init'
import { stateMixin } from './initState'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vnode/index'

function Vue(options) {
  // 初始化
  this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobApi(Vue)
stateMixin(Vue) //给vm添加$nextTick
export default Vue
