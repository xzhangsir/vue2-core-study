import { initMixin } from './init'
import { renderMixin } from './lifecycle'

function Vue(options) {
  this.__init(options)
}

initMixin(Vue)
renderMixin(Vue)
export default Vue
