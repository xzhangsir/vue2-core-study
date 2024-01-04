import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { nextTick } from './utils/next-tick'
function Vue(options) {
  this._init(options)
}
initMixin(Vue)
// 混入_render
renderMixin(Vue)
// 混入_update
lifecycleMixin(Vue)
initGlobalAPI(Vue)
Vue.prototype.$nextTick = nextTick
export default Vue
