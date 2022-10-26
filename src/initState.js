import Dep from './observe/dep'
import { observer } from './observe/index'
import Watcher from './observe/watcher'
import { isObject } from './utils/index'

export function initState(vm) {
  let options = vm.$options
  if (options.data) {
    initData(vm)
  }
  if (options.watch) {
    initWatch(vm)
  }
  if (options.computed) {
    initComputed(vm)
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

function initComputed(vm) {
  const computed = vm.$options.computed
  const watchers = (vm._computedWatchers = {})
  for (let key in computed) {
    let userDef = computed[key]
    let getter = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true })
    defineComputed(vm, key, userDef)
  }
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
    const watcher = this._computedWatchers[key]
    if (watcher.dirty) {
      // 如果数据是脏的 就去执行用户传入的函数
      watcher.evaluate()
    }
    if (Dep.target) {
      //计算属性出栈后 还有渲染watcher
      // 我应该让计算属性watcher里面的属性 也去收集上层watcher
      watcher.depend()
    }
    return watcher.value
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
