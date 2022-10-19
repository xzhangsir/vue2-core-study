import RouterLink from './components/routerLink.jsx'
import RouterView from './components/routerView'
import createMatcher from './create-matcher.js'
import HashHistory from './history/hash.js'
import BrowserHistory from './history/history.js'
let Vue

export default class VueRouter {
  constructor(options = {}) {
    // 路由匹配器-处理路由配置：将树形结构的嵌套数组转化为扁平化结构的对象，便于后续的路由匹配\
    //[{},{}] =>{"/":{组件的相关信息},"/home":{}}
    // 路由匹配器返回两个核心方法：match、addRoutes
    this.matcher = createMatcher(options.routes || []) // options.routes 默认[]
    // 根据不同的路由模式，生成对应的处理实例
    options.mode = options.mode || 'hash' // 默认hash模式
    switch (options.mode) {
      case 'hash':
        this.history = new HashHistory(this)
        break
      case 'history':
        this.history = new BrowserHistory(this)
        break
    }
    console.log(this)
  }
  // 路由初始化方法，供 install 安装时调用
  init(app) {
    // 当前的history实例：可能是HashHistory，也可能是BrowserHistory；
    const history = this.history
    // 设置监听器：内部调用的是不同子类中的实现
    const setUpListener = () => {
      history.setupListener()
    }
    // 初始化时，获取当前hash值进行跳转, 并设置监听器
    history.transitionTo(history.getCurrentLocation(), setUpListener)
  }
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
        // 在根组件中，调用路由实例上的 init 方法，完成插件的初始化
        this._router.init(this) // this 为根实例

        // 目标：让 this._router.history.current 成为响应式数据；
        // 作用：current用于渲染时会进行依赖收集，当current更新时可以触发视图更新；
        // 方案：在根组件实例上定义响应式数据 _route，将this._router.history.current对象中的属性依次代理到 _route 上；
        // 优势：当current对象中的任何属性发生变化时，都会触发响应式更新；
        // Vue.util.defineReactive: Vue 构造函数中提供的工具方法,用于定义响应式数据
        Vue.util.defineReactive(this, '_route', this._router.history.current)
        console.log(this._route)
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
