import { observer } from './observe/index'
import { isObject } from './utils/index'

export function initState(vm) {
  let options = vm.$options
  // console.log(vm)
  if (options.data) {
    initData(vm)
  }
  if (options.watch) {
    initWatch(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  // console.log('刚要初始化的data', data)
  if (data !== null && typeof data === 'object') {
    data = data
  } else if (typeof data === 'function') {
    data = data.call(vm)
  } else {
    console.error('data type err')
    return false
  }
  vm._data = data

  // console.log('处理后的data', data)

  for (let key in data) {
    proxy(vm, '_data', key)
  }

  // 对data中的数据进行劫持
  observer(data)
}

function initWatch(vm) {
  let watch = vm.$options.watch
  // console.log('watch', watch)
  for (let k in watch) {
    //用户自定义watch的写法可能是数组 对象 函数 字符串
    const handler = watch[k]
    if (Array.isArray(handler)) {
      // 如果是数组就遍历进行创建
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

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}
