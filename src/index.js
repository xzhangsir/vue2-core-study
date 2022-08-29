import { compileToFunction } from './compiler'
import { initGlobalAPI } from './gloablAPI'
import { initMixin } from './init'
import { initLifeCycle } from './lifecycle'
import { nextTick } from './observe/watcher'
import { createElm } from './vdom/patch'
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

let render1 = compileToFunction('<i>{{name}}</i>')
let vm1 = new Vue({ data: { name: 'zx' } })
let prevVnode = render1.call(vm1)

let el = createElm(prevVnode)
document.body.appendChild(el)

let render2 = compileToFunction('<em>{{name}}</em>')
let vm2 = new Vue({ data: { name: 'xm' } })
let nextVnode = render2.call(vm2)

console.log(prevVnode)
console.log(nextVnode)

// 直接将新的节点替换掉老的
/* setTimeout(() => {
  let newEl = createElm(nextVnode)
  el.parentNode.replaceChild(newEl, el)
}, 1000) */

// diff算法是个平级比较的过程 父亲和父亲比较 儿子和儿子比较
