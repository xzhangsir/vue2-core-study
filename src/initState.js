import { observer } from './observe/index'
import watcher from './observe/watcher'
import { nextTick } from './utils/nextTick'
export function initState(vm) {
  let ops = vm.$options
  // console.log('ops', ops)
  if (ops.data) {
    initData(vm)
  }
  if (ops.props) {
    initProps()
  }
  if (ops.watch) {
    initWatch(vm)
  }
  if (ops.computed) {
    initComputed()
  }
  if (ops.methods) {
    initMethods()
  }
}

function initData(vm) {
  // console.log('vm:data初始化', vm)
  let data = vm.$options.data
  // 对象或者函数
  if (typeof data === 'object' && data !== null) {
    data = data
  } else if (typeof data === 'function') {
    data = data.call(vm)
  } else {
    console.error('data type error')
    return false
  }
  vm._data = data

  // 将data上的属性代理到实例上 vm.msg = vm._data.msg
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  // 对data数据进行劫持
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

function initProps() {}
function initWatch(vm) {
  let watch = vm.$options.watch
  console.log(watch)
  for (let key in watch) {
    let handler = watch[key]
    // handler  可能是数组对象字符 函数
    if (Array.isArray(handler)) {
      // 数组
      handler.forEach((item) => createrWatcher(vm, key, item))
    } else {
      // 对象字符串函数
      createrWatcher(vm, key, handler)
    }
  }
}

// vm.$watch(()=>{return "a"}) //返回的值就是watcher上的属性
function createrWatcher(vm, exprOrfn, handler, options) {
  if (typeof handler === 'object') {
    options = handler
    handler = handler.handler
  } else if (typeof handler === 'string') {
    handler = vm[handler]
  }
  // 最终都交给$watch处理
  return vm.$watch(exprOrfn, handler, options)
}

function initComputed() {}
function initMethods() {}

export function stateMixin(vm) {
  vm.prototype.$nextTick = function (cb) {
    nextTick(cb)
  }
  vm.prototype.$watch = function (exprOrfn, handler, options) {
    // console.log(exprOrfn, handler, options)
    new watcher(this, exprOrfn, handler, { ...options, user: true })
    if (options && options.immediate) {
      // immediate 立即执行
      handler.call(vm)
    }
  }
}
