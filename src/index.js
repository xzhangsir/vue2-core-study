import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { initLifecycle } from './lifecycle'
import { nextTick } from './utils/next-tick'

function Vue(options) {
  this.__init(options)
}

initMixin(Vue)
initLifecycle(Vue)
initGlobalAPI(Vue) //mixin

Vue.prototype.$nextTick = nextTick
export default Vue
