export const HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destroyed'
]
// 策略模式
let starts = {}

starts.data = function (parentVal, childVal) {
  // 合并data
  return childVal
}
starts.computed = function () {
  // 合并computed
}
// starts.watch = function () {
//   // 合并watch
// }

HOOKS.forEach((hooks) => {
  starts[hooks] = mergeHook
})

function mergeHook(parentVal, childVal) {
  // console.log(parentVal, childVal)
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}

export function mergeOptions(parent, child) {
  // 合并对象
  // console.log(parent, child)
  const options = {}
  // 父亲
  for (let key in parent) {
    mergeField(key)
  }
  // 儿子有
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    // 策略模式
    if (starts[key]) {
      options[key] = starts[key](parent[key], child[key])
    } else {
      options[key] = child[key] || parent[key]
    }
  }
  // console.log('options', options)
  return options
}
