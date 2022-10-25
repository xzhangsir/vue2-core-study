export function isObject(data) {
  return data !== null && typeof data === 'object'
}

// 定义生命周期
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

let strats = {} // 存放所有策略

LIFECYCLE_HOOKS.forEach((hook) => {
  // 创建生命周期的合并策略
  strats[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal)
      } else {
        if (Array.isArray(childVal)) {
          return childVal
        } else {
          return [childVal]
        }
      }
    } else {
      return parentVal
    }
  }
})

export function mergeOptions(parentVal, childVal) {
  // console.log(parentVal, childVal)
  let options = {}
  for (let key in parentVal) {
    mergeFiled(key)
  }
  for (let key in childVal) {
    if (!parentVal.hasOwnProperty(key)) {
      mergeFiled(key)
    }
  }

  function mergeFiled(key) {
    if (strats[key]) {
      options[key] = strats[key](parentVal[key], childVal[key])
    } else {
      // 默认合并方法：优先使用新值覆盖老值
      options[key] = childVal[key] || parentVal[key]
    }
  }
  return options
}
