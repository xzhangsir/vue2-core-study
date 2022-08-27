import { initMixin } from './init'
import { initLifeCycle } from './lifecycle'
import { nextTick } from './observe/watcher'
function Vue(options) {
  this.__init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCycle(Vue)

export default Vue

// 创造响应式数据
// 将模板转化为ast语法树
// 将ast语法树转为render函数
// 每次数据更新只执行render函数(无须再次执行ast转化的过程)
// 根据生成的虚拟节点创造真实DOM
