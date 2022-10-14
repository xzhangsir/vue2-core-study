import { observer } from './observe/index'
import { isObject } from './utils/index'
import Watcher from './observe/watcher'
import Dep from './observe/dep'

export function initState(vm) {
  let options = vm.$options
  console.log(vm)
  if (options.data) {
    initData(vm)
  }
  if (options.watch) {
    initWatch(vm)
  }
  if (options.computed) {
    initComputed(vm)
  }
  if (options.methods) {
    initMethods(vm)
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

function initComputed(vm) {
  const computed = vm.$options.computed
  // 将计算属性的watcher保存到vm上
  const watchers = (vm._computedWatchers = {})
  for (let key in computed) {
    let userDef = computed[key]
    let getter = typeof userDef === 'function' ? userDef : userDef.get
    // 如果直接new Watcher 默认fn就会直接执行 加个lazy
    // 将计算属性和watcher对应起来
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true })
    defineComputed(vm, key, userDef)
  }
}

function initMethods(vm) {
  let methods = vm.$options.methods
  for (let key in methods) {
    vm[key] =
      typeof methods[key] !== 'function' ? () => {} : methods[key].bind(vm)
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

function defineComputed(target, key, userDef) {
  const setter = userDef.set || (() => {})
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    // 判断这个数据是不是脏的
    get: createComputedGetter(key),
    set: setter
  })
}

function createComputedGetter(key) {
  return function () {
    // 获取对应属性的watcher
    const watcher = this._computedWatchers[key]
    if (watcher.dirty) {
      // 如果数据是脏的 就去执行用户传入的函数
      watcher.evaluate()
    }
    if (Dep.target) {
      //计算属性出栈后 还有渲染watcher
      // 我应该让计算属性watcher里面的属性 也去收集上层watcher
      watcher.depend(1)
    }
    return watcher.value
  }
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
