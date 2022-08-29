import Dep from './observe/dep'
import { observe } from './observe/index'
import Watcher from './observe/watcher'

export function initState(vm) {
  // 获取所有的用户选项
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
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

function initComputed(vm) {
  // 拿到用户的computed
  const computed = vm.$options.computed
  // console.log('computed', computed)
  // const watchers = {}
  // 将计算属性的watcher保存到VM上
  const watchers = (vm._computedWatchers = {})
  for (let key in computed) {
    let userDef = computed[key]

    let fn = typeof userDef === 'function' ? userDef : userDef.get
    // 如果直接new Watcher 默认fn就会直接执行 加个lazy
    // 将计算属性和watcher对应起来
    watchers[key] = new Watcher(vm, fn, { lazy: true })

    defineComputed(vm, key, userDef)
  }
}

function defineComputed(target, key, userDef) {
  // const getter = typeof userDef === 'function' ? userDef : userDef.get
  const setter = userDef.set || (() => {})

  Object.defineProperty(target, key, {
    // get: getter,
    // 不能直接执行getter 需要一个方法来判断这个数据是不是脏的
    get: createComputedGetter(key),
    set: setter
  })
}

function createComputedGetter(key) {
  // 我们需要检测是否需要执行这个getter

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
      watcher.depend()
    }
    return watcher.value
  }
}

function initWatch(vm) {
  let watch = vm.$options.watch

  for (let key in watch) {
    const handler = watch[key]
    console.log(handler)
    if (Array.handler) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, key, handler) {
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(key, handler)
}
