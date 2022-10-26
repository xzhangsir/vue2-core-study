import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { renderMixin } from './lifecycle'
import { nextTick } from './utils/next-tick'
import { compileToFunction } from './compile/index'
import { createElm, patch } from './vdom/patch'

function Vue(options) {
  this.__init(options)
}

initMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)
Vue.prototype.$nextTick = nextTick
export default Vue

/*
window.onload = function () {
  let render1 = compileToFunction(`
  <ul style = "color:red">
    <li key = 'a'>a</li>
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
  }, 1000)
}
*/
