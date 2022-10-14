import { foreach } from '../utils/index'
let Vue
export class Store {
  constructor(options) {
    console.log(options)
    // this.state = options.state

    let getters = options.getters
    this.getters = {}
    let computed = {}

    foreach(getters, (key, val) => {
      computed[key] = () => {
        return val.call(this, this.state)
      }
      Object.defineProperty(this.getters, key, {
        get: () => {
          // return val(this.state)
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
  }
  get state() {
    return this._vm.state
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
