import { observe } from './observe/index'

export function initState(vm) {
  // 获取所有的用户选项
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key] //vm._data.name
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}

function initData(vm) {
  //用户写入的data   可能是function 或者 Object
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data
  // 对data进行数据劫持
  observe(data)
  // 将vm._data用vm来代理
  for (let key in data) {
    proxy(vm, '_data', key)
  }
}
