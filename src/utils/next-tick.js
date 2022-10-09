let callbacks = []
let pending = false

function flushCallbacks() {
  let cbs = callbacks.slice(0)
  pending = false
  callbacks = []
  cbs.forEach((cb) => cb())
}
// nextTick 内部没有直接使用setTimeout 而是采用优雅降级的方式
// 内部先采用promise (ie不兼容)
// MutationObserver
// 考虑IE专享的 setImmediate
// 实在不行 就用 setTimeout
let timerFunc
if (typeof Promise !== 'undefined') {
  // 如果支持 Promise
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
} else if (typeof MutationObserver !== 'undefined') {
  // MutationObserver 主要监听dom变化
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
    //counter变化    flushCallbacks执行
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick(cb) {
  //除了渲染watcher  还有用户自己手动调用的nextTick 一起被收集到数组
  callbacks.push(cb)
  if (!pending) {
    //如果多次调用nextTick  只会执行一次异步 等异步队列清空之后再把标志变为false
    pending = true
    timerFunc()
  }
}
