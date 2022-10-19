class History {
  constructor(router) {
    this.router = router // 存储子类传入的 router 实例
  }
  // 根据路径进行路由匹配，并添加路径改变的监听器
  transitionTo(location, cb) {
    console.log('location', location)
    cb && cb()
  }
}

export { History }
