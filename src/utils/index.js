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
// 组件 指令 过滤器
export const ASSETS_TYPE = ['component', 'directive', 'filter']
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
// 组件 指令 过滤器的合并策略
function mergeAssets(parentVal, childVal) {
  //比如有同名的全局组件和自己定义的局部组件 那么parentVal代表全局组件 自己定义的组件是childVal  首先会查找自已局部组件有就用自己的  没有就从原型继承全局组件  res.__proto__===parentVal
  const res = Object.create(parentVal)
  if (childVal) {
    for (let k in childVal) {
      // /返回的是构造的对象 可以拿到父亲原型上的属性 并且将儿子的都拷贝到自己身上
      res[k] = childVal[k]
    }
  }
  return res
}
// 定义组件的合并策略
ASSETS_TYPE.forEach((type) => {
  strats[type + 's'] = mergeAssets
})
export function mergeOptions(parent, child) {
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
    // console.log(strats, k)
    if (strats[k]) {
      options[k] = strats[k](parent[k], child[k])
    } else {
      // 默认策略
      options[k] = child[k] ? child[k] : parent[k]
    }
  }
  return options
}

// 判断是不是对象
export function isObject(data) {
  if (typeof data !== 'object' || data === null) {
    return false
  }
  return true
}

//判断是不是常规html标签
export function isReservedTag(tagName) {
  // 定义常见标签
  let str =
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  let obj = {}
  str.split(',').forEach((tag) => {
    obj[tag] = true
  })
  return obj[tagName]
}

// 是否是合格的数组索引
export function isValidArrayIndex(val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

// 伪数组转真数组
export function toArray(list, start) {
  start = start || 0
  let i = list.length - start
  const res = new Array(i)
  while (i--) {
    res[i] = list[i + start]
  }
  return res
}
