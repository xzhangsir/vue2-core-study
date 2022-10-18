import createRouteMap, { createRoute } from './create-route-map'

export default function createMatcher(routes) {
  //  路由配置的扁平化处理 [{},{}] =>{"/":{组件的相关信息},"/home":{}}
  let { pathMap } = createRouteMap(routes)

  // 根据路径进行路由匹配
  function match(location) {
    let record = pathMap[location]
    if (record) {
      return createRoute(record, { path: location })
    }
    return createRoute(null, { path: location })
  }
  console.log(match('/about/a'))
  /**
   * 动态添加路由匹配规则
   *  将追加的路由规则进行扁平化处理
   */
  function addRoutes(routes) {
    createRouteMap(routes, pathMap)
  }
  // addRoutes([
  //   {
  //     path: '/c',
  //     component: 'xxx'
  //   }
  // ])
  console.log(pathMap)
  return {
    addRoutes, // 添加路由
    match // 用于匹配路径
  }
}
