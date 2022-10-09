let queue = [] //存放watcher的队列
let has = {} //watcher去重
let pending = false
export function queueWatcher(watcher) {
  let id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)
    // 不管我们的update执行多少次 但是最终只执行一轮刷新操作
    if (!pending) {
      setTimeout(flushSchedulerQueue, 0)
      pending = true
    }
  }
}

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)
  flushQueue.forEach((q) => q.run())
  queue = []
  has = {}
  pending = false
}
