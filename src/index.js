import { compileToFunction } from './compiler'
import { initGlobalAPI } from './gloablAPI'
import { initMixin } from './init'
import { initLifeCycle } from './lifecycle'
import { nextTick } from './observe/watcher'
import { createElm, patch } from './vdom/patch'
import { initWatch } from './watch'
function Vue(options) {
  this.__init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCycle(Vue)
initGlobalAPI(Vue)
initWatch(Vue)

export default Vue

// 创造响应式数据
// 将模板转化为ast语法树
// 将ast语法树转为render函数
// 每次数据更新只执行render函数(无须再次执行ast转化的过程)
// 根据生成的虚拟节点创造真实DOM

// ---------为了方便观察前后的虚拟节点 测试代码------

let render1 = compileToFunction(`<ul style = "color:red">
  <li key='a'>a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>`)
let vm1 = new Vue({ data: { name: 'zx' } })
let prevVnode = render1.call(vm1)

let el = createElm(prevVnode)
document.body.appendChild(el)

let render2 = compileToFunction(`<ul  style = "color:red">
  <li key="b">b</li>
  <li key="m">m</li>
  <li key="a">a</li>
  <li key="p">p</li>
  <li key="c">c</li>
  <li key="q">q</li>
</ul>`)
let vm2 = new Vue({ data: { name: 'xm' } })
let nextVnode = render2.call(vm2)

// 直接将新的节点替换掉老的
/* setTimeout(() => {
  let newEl = createElm(nextVnode)
  el.parentNode.replaceChild(newEl, el)
}, 1000) */

// diff
setTimeout(() => {
  patch(prevVnode, nextVnode)
}, 1000)
