import { observer } from './observe/index'

export function initState(vm) {
  let options = vm.$options
  console.log(vm)
  if (options.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  console.log('刚要初始化的data', data)
  if (data !== null && typeof data === 'object') {
    data = data
  } else if (typeof data === 'function') {
    data = data.call(vm)
  } else {
    console.error('data type err')
    return false
  }
  vm._data = data

  console.log('处理后的data', data)

  for (let key in data) {
    proxy(vm, '_data', key)
  }

  // 对data中的数据进行劫持
  observer(data)
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
