import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
function Vue(options) {
  this._init(options)
}
initMixin(Vue)
// 混入_render
renderMixin(Vue)
// 混入_update
lifecycleMixin(Vue)
export default Vue
