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

strats.components = function (parentVal, childVal) {
  const res = Object.create(parentVal)
  if (childVal) {
    for (let k in childVal) {
      res[k] = childVal[k]
    }
  }
  return res
}

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
