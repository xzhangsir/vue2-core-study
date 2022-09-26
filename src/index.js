import { initMixin } from './init'
import { initLifecycle } from './lifecycle'

function Vue(options) {
  this.__init(options)
}

initMixin(Vue)
initLifecycle(Vue)
export default Vue
