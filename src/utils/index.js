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
// 策略
const strats = {}
// 为生命周期添加合并策略
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook
})
//生命周期合并策略
function mergeHook(parentVal, childVal) {
  // 如果有儿子
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
  // console.log(parent, child)
  const options = {}
  // 遍历父亲
  for (let k in parent) {
    // console.log('parent', k)
    mergeField(k)
  }
  // 父亲没有  儿子有
  for (let k in child) {
    if (!parent.hasOwnProperty(k)) {
      // console.log('child', child)
      mergeField(k)
    }
  }

  function mergeField(k) {
    if (strats[k]) {
      options[k] = strats[k](parent[k], child[k])
    } else {
      // 默认策略
      options[k] = child[k] ? child[k] : parent[k]
    }
  }
  return options
}
