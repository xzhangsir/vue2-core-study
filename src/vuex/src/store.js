import { foreach } from '../utils/index'
import ModuleCollection from './module-collection'
let Vue
export class Store {
  constructor(options) {
    const { getters, state } = options
    this._actions = {}
    this._mutations = {}
    this._getters = {}
    this._modules = new ModuleCollection(options)
    console.log(this._modules)
    // 模块安装
    installModule(this, state, [], this._modules.root)
    //将 state 状态、getters 定义在当前的 vm 实例上
    resetStoreVM(this, state)
  }
  get state() {
    return this._vm.state
  }
  commit = (type, payload) => {
    this._mutations[type].forEach((mutation) => mutation.call(this, payload))
  }
  dispatch = (type, payload) => {
    this._actions[type].forEach((action) => action.call(this, payload))
  }
}

function installModule(store, rootState, path, module) {
  // console.log(store, rootState, path, module)
  let namespace = store._modules.getNamespaced(path)
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current]
    }, rootState)
    // 支持 Vuex 动态添加模块，将新增状态直接定义成为响应式数据；
    Vue.$set(parent, path[path.length - 1], module.state)
  }
  // 遍历 mutation
  module.forEachMutation((mutation, key) => {
    // console.log(mutation, key, namespace)
    store._mutations[namespace + key] = store._mutations[namespace + key] || []
    store._mutations[namespace + key].push((payload) => {
      mutation.call(store, module.state, payload)
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
    store._getters[namespace + key] = function () {
      return getter(module.state)
    }
  })
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child)
  })
}

function resetStoreVM(store, state) {
  const computed = {}
  store.getters = {}
  foreach(store._getters, (key, fn) => {
    computed[key] = () => fn()
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    })
  })
  store._vm = new Vue({
    data() {
      return {
        state
      }
    },
    computed
  })
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
