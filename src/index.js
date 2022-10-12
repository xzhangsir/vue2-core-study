import { compileToFunction } from './compile/index'
import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { initLifecycle } from './lifecycle'
import { nextTick } from './utils/next-tick'
import { createElm, patch } from './vdom/patch'
import { initWatch } from './watch'

function Vue(options) {
  this.__init(options)
}

initMixin(Vue)
initLifecycle(Vue)
initGlobalAPI(Vue) //mixin
initWatch(Vue) //watch
Vue.prototype.$nextTick = nextTick
export default Vue

// ----diff-----为了方便观察前后的虚拟节点 测试代码------
/* window.onload = function () {
  let render1 = compileToFunction(`
  <ul style = "color:green">
    <li key="e">e</li>
    <li key="d">d</li>
    <li key="a">a</li>
    <li key="b">b</li>
    <li key="c">c</li>
  </ul>`)
  let vm1 = new Vue({ data: { name: 'zx' } })
  let prevVnode = render1.call(vm1)
  let el = createElm(prevVnode)
  document.body.appendChild(el)

  let render2 = compileToFunction(`
  <ul  style = "color:red">
    <li key="a">a</li>
    <li key="b">b</li>
    <li key="c">c</li>
    <li key="d">d</li>
  </ul>`)
  let vm2 = new Vue({ data: { name: 'xm' } })
  let nextVnode = render2.call(vm2)

  setTimeout(() => {
    patch(prevVnode, nextVnode)
  }, 3000)
}
 */
