import { observe } from './observe/index'
import { isObject } from './utils/index'

export function initState(vm) {
  let options = vm.$options
  if (options.data) {
    initData(vm)
  }
}

export function initData(vm) {
  let data = vm.$options.data
  if (isObject(data)) {
    data = data
  } else if (typeof data === 'function') {
    data = data.call(vm)
  } else {
    console.error('data type error')
    return false
  }
  vm._data = data
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}

function proxy(vm, soure, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[soure][key]
    },
    set(newVal) {
      return (vm[soure][key] = newVal)
    }
  })
}
