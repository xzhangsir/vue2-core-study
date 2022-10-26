import { toArray } from '../utils/index'

export function initUse(Vue) {
  Vue.use = function (plugin) {
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      // 如果这个插件安装过 就直接返回
      return this
    }
    // 伪数组转真数组
    const args = toArray(arguments, 1)
    args.unshift(this) //在参数中添加vue的构造函数
    // 把自身 Vue 传到插件的 install 方法 这样可以避免第三方插件强依赖 Vue
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args) //执行install方法
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args) //没有install方法直接把传入的插件执行
    }

    // 记录安装的插件
    installedPlugins.push(plugin)
    return this
  }
}
