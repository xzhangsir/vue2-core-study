import createRouteMap from './create-route-map'

export default function createMatcher(routes) {
  //  路由配置的扁平化处理 [{},{}] =>{"/":{组件的相关信息},"/home":{}}
  let { pathMap } = createRouteMap(routes)
  console.log(pathMap)
}
