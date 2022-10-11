import { ASSETS_TYPE } from '../utils/index'

export function initAssetRegisters(Vue) {
  ASSETS_TYPE.forEach((type) => {
    Vue[type] = function (id, definition) {
      if (type === 'component' && typeof definition !== 'function') {
        // 全局组件注册
        // 子组件可能也有extend方法
        definition = this.options._base.extend(definition)
      }
      this.options[type + 's'][id] = definition
    }
  })
}
