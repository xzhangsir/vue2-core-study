import RouterLink from './components/routerLink.jsx'
import RouterView from './components/routerView'

let Vue

export default class VueRouter {
  constructor() {}
}

VueRouter.install = (_vue) => {
  Vue = _vue
  // console.log(Vue)

  Vue.component('router-link', RouterLink)
  Vue.component('router-view', RouterView)

  // 通过生命周期，为所有组件混入 router 属性
  Vue.mixin({
    beforeCreate() {
      // this 指向当前组件实例
      // 将 new Vue 时传入的 router 实例共享给所有子组件
      if (this.$options.router) {
        // 根组件才有 router
        this._routerRoot = this // 为根组件添加 _routerRoot 属性指向根组件自己
        this._router = this.$options.router // this._router 指向 this.$options.router
      } else {
        // console.log(this.$parent)
        // 子组件
        // 如果是子组件，就去找父亲上的_routerRoot属性，并继续传递给儿子
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
      // 这样，所有组件都能够通过 this._routerRoot._router 获取到同一个 router 实例；
    }
  })
}
