import { initMixin } from './init'
function Vue(options) {
  this.__init(options)
}

initMixin(Vue)

export default Vue
