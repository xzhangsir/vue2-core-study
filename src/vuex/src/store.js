import { foreach } from '../utils/index'
import ModuleCollection from '../src/module-collection'

let Vue
export class Store {
  constructor(options) {
    const { getters, state } = options

    this._actions = {}
    this._mutations = {}
    this._getters = {}

    // 收集通过 store.subcribe 订阅状态变更事件的处理函数 fn
    // 当 mutation 执行时，触发全部订阅事件执行，返回当前 mutation 和更新后的状态
    this._subscribes = []

    // 1,模块收集：options 格式化 -> Vuex 模块树
    this._modules = new ModuleCollection(options)
    // 2,模块安装
    installModule(this, state, [], this._modules.root)
    // 3,将 state 状态、getters 定义在当前的 vm 实例上
    resetStoreVM(this, state)
    // 依次执行 options 选项中的 plugins 插件,传入当前 store 实例
    options.plugins.forEach((plugin) => plugin(this))
  }
  get state() {
    return this._vm.state
  }
  // 提供 store.subscribe 状态变更事件订阅功能
  // 将回调函数统计收集到 _subscribes 数组中；
  subscribe(fn) {
    console.log('订阅 Vuex 状态变化，收集处理函数')
    this._subscribes.push(fn)
    console.log('this._subscribes', this._subscribes)
  }
  // Vuex 状态替换
  replaceState(state) {
    this._vm._data.state = state
  }
  // 当用户调用this.$store.commit 方法的时候会调用这个方法
  commit = (type, payload) => {
    // this.mutations[type](payload)
    this._mutations[type].forEach((mutation) => mutation.call(this, payload))
  }
  dispatch = (type, payload) => {
    // this.actions[type](payload)
    this._actions[type].forEach((action) => action.call(this, payload))
  }
}
/**
 * 重置 Store 容器对象的 vm 实例
 * @param {*} store store实例，包含 _wrappedGetters 即全部的 getter 方法；
 * @param {*} state 根状态，在状态安装完成后包含全部模块状态；
 */
function resetStoreVM(store, state) {
  const computed = {} // 定义 computed 计算属性
  store.getters = {} // 定义 store 容器实例中的 getters
  // 遍历 _wrappedGetters 构建 computed 对象并进行数据代理
  foreach(store._getters, (fn, key) => {
    // 构建 computed 对象，后面借助 Vue 计算属性实现数据缓存
    computed[key] = () => {
      return fn()
    }
    // 数据代理：将 getter 的取值代理到 vm 实例上，到计算数据取值
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    })
  })
  // 使用 state 根状态 和 computed 创建 vm 实例，成为响应式数据
  store._vm = new Vue({
    // 借助 data 使根状态 state 成为响应式数据
    data() {
      return {
        state
      }
    },
    // 借助 computed 计算属性实现数据缓存
    computed
  })
}

/**
 * 安装模块
 * @param {*} store       容器
 * @param {*} rootState   根状态
 * @param {*} path        所有路径
 * @param {*} module      格式化后的模块对象
 */
const installModule = (store, rootState, path, module) => {
  // 根据当前模块的 path 路径，拼接当前模块的命名空间标识
  let namespace = store._modules.getNamespaced(path)
  // 处理子模块：将子模块上的状态，添加到对应父模块的状态中；
  if (path.length > 0) {
    // 从根状态开始逐层差找，找到当前子模块对应的父模块状态
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current]
    }, rootState)
    // 支持 Vuex 动态添加模块，将新增状态直接定义成为响应式数据；
    Vue.$set(parent, path[path.length - 1], module.state)
  }
  // 遍历当前模块中的 actions、mutations、getters
  // 将它们分别定义到 store 中的 _actions、_mutations、_getters;

  // 遍历 mutation
  module.forEachMutation((mutation, key) => {
    // console.log(mutation, key, namespace)
    // 处理成为数组类型：每个 key 可能会存在多个需要被处理的函数
    store._mutations[namespace + key] = store._mutations[namespace + key] || []
    // 向 _mutations 对应 key 的数组中，放入对应的处理函数
    store._mutations[namespace + key].push((payload) => {
      // 执行 mutation，传入当前模块的 state 状态
      // mutation.call(store, module.state, payload)
      mutation.call(store, getState(store, path), payload)

      // 当 mutation 执行时，依次执行 store.subscribe 状态变更事件订阅的处理函数 fn
      store._subscribes.forEach((fn) => {
        console.log('状态更新，依次执行订阅处理')
        // fn(mutation, rootState)
        fn(mutation, store.state)
      })
    })
  })
  // 遍历 action
  module.forEachAction((action, key) => {
    store._actions[namespace + key] = store._actions[namespace + key] || []
    store._actions[namespace + key].push((payload) => {
      action.call(store, store, payload)
    })
  })
  // 遍历 getter
  module.forEachGetter((getter, key) => {
    // 注意：getter 重名将会被覆盖
    store._getters[namespace + key] = function () {
      // 执行对应的 getter 方法，传入当前模块的 state 状态，返回执行结果
      // return getter(module.state)
      return getter(getState(store, path))
    }
  })
  // 遍历当前模块的儿子
  module.forEachChild((child, key) => {
    // 递归安装/加载子模块
    installModule(store, rootState, path.concat(key), child)
  })
}
// 通过当前模块路径 path，从最新的根状态上，获取模块的最新状态
function getState(store, path) {
  return path.reduce((newState, current) => {
    return newState[current]
  }, store.state) // replaceState 后的最新状态
}

// 实现store放到每一个使用的组件中
export function install(_Vue) {
  // Vue 已经存在并且相等，说明已经Vuex.use过
  if (Vue && Vue._Vue === Vue) {
    return false
  }
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      let options = this.$options
      if (options.store) {
        // 根实例
        this.$store = options.store
      } else {
        // 其他
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}
