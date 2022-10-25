import { initMixin } from './init'
import { renderMixin } from './lifecycle'
import { nextTick } from './utils/next-tick'

function Vue(options) {
  this.__init(options)
}

initMixin(Vue)
renderMixin(Vue)
Vue.prototype.$nextTick = nextTick
export default Vue
