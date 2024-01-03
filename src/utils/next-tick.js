let callBacks = []
let pending = false

function flushCallbacks() {
  let cbs = callBacks.slice(0)
  pending = false
  callBacks = []
  cbs.forEach((cb) => cb())
}

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
  callBacks.push(cb)
  if (!pending) {
    pending = true
    timerFunc()
  }
}
