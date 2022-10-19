import { createRoute } from '../create-route-map'

class History {
  constructor(router) {
    this.router = router // 存储子类传入的 router 实例
    this.current = createRoute(null, {
      path: '/'
    })
    console.log(this.current)
  }
  // 根据路径进行路由匹配，并添加路径改变的监听器
  transitionTo(location, cb) {
    console.log('location', location)
    // 获取到最新的路由地址 根据这个地址渲染组件
    // console.log(this.router)
    let router = this.router.matcher.match(location)
    console.log('router', router)
    this.current = createRoute(router, { path: location })
    console.log(this.current)
    cb && cb()
  }
}

export { History }
