let callbacks = []
let waiting = false
function flushCallbacks() {
  let cbs = callbacks.slice(0)
  waiting = false
  callbacks = []
  cbs.forEach((cb) => cb())
}
let timerFunc
// nextTick 内部没有直接使用setTimeout 而是采用优雅降级的方式
// 内部先采用promise (ie不兼容)
// MutationObserver
// 考虑IE专享的 setImmediate
// 实在不行 就用 setTimeout
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContent = 2
    // 1 变 2    flushCallbacks执行
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
  // cb  有 vue更新的 也 有用户的
  // console.log(cb)
  callbacks.push(cb)
  if (!waiting) {
    // setTimeout(flushCallbacks, 0)
    timerFunc() //兼容
    waiting = true
  }
}
