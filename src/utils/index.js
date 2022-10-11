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
