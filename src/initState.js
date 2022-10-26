import { observer } from './observe/index'
import { isObject } from './utils/index'

export function initState(vm) {
  let options = vm.$options
  if (options.data) {
    initData(vm)
  }
  if (options.watch) {
    initWatch(vm)
  }
}

function initWatch(vm) {
  let watch = vm.$options.watch
  for (let k in watch) {
    const handler = watch[k]
    if (Array.isArray(handler)) {
      handler.forEach((handle) => {
        createWatcher(vm, k, handle)
      })
    } else {
      createWatcher(vm, k, handler)
    }
  }
}

function createWatcher(vm, exprOrFn, handler, options = {}) {
  if (isObject(handler)) {
    options = handler //保存用户传入的对象
    handler = handler.handler //这个代表真正用户传入的函数
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(exprOrFn, handler, options)
}

function initData(vm) {
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

  observer(data)
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      return (vm[source][key] = newVal)
    }
  })
}
