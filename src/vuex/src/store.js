import { foreach } from '../utils/index'
let Vue
export class Store {
  constructor(options) {
    // console.log(options)
    this.getters = {}
    let computed = {}

    foreach(options.getters, (key, val) => {
      computed[key] = () => {
        return val.call(this, this.state)
      }
      Object.defineProperty(this.getters, key, {
        get: () => {
          console.log(this)
          return this._vm[key]
        }
      })
    })
    this._vm = new Vue({
      data: {
        state: options.state
      },
      computed
    })
    this.mutations = {}
    this.actions = {}
    foreach(options.mutations, (key, val) => {
      this.mutations[key] = (payload) => val.call(this, this.state, payload)
    })
    foreach(options.actions, (key, val) => {
      this.actions[key] = (payload) => val.call(this, this, payload)
    })
  }
  get state() {
    return this._vm.state
  }
  commit = (type, payload) => {
    this.mutations[type](payload)
  }
  dispatch = (type, payload) => {
    this.actions[type](payload)
  }
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
