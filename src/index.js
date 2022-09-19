import { compileToFunction } from './compile/index'
import { initGlobApi } from './global-api/index'
import { initMixin } from './init'
import { stateMixin } from './initState'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vnode/index'
import { createEl, patch } from './vnode/patch'

function Vue(options) {
  // 初始化
  this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobApi(Vue)
stateMixin(Vue) //给vm添加$nextTick

export default Vue

window.onload = function () {
  let render1 = compileToFunction(`<div id = "a" class = "cc" ></div>`)
  let vm1 = new Vue({ data: { name: 'zx' } })
  let prevVnode = render1.call(vm1)
  let el = createEl(prevVnode)
  // console.log(render1)
  // console.log(prevVnode)
  // console.log(el)
  // console.log(document.body)
  document.body.appendChild(el)
  let render2 = compileToFunction(
    `<div id = "c" class = "cc dd" >{{name}}</div>`
  )
  let vm2 = new Vue({ data: { name: 'xm' } })
  let nextVnode = render2.call(vm2)
  // console.log(render2)
  // console.log(nextVnode)
  setTimeout(() => {
    patch(prevVnode, nextVnode)
  }, 1000)
}
