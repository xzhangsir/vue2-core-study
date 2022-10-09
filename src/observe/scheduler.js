import { nextTick } from '../utils/next-tick'

let queue = [] //存放watcher的队列
let has = {} //watcher去重
export function queueWatcher(watcher) {
  let id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)
    //  进行异步调用
    nextTick(flushSchedulerQueue)
  }
}

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)
  flushQueue.forEach((q) => q.run())
  queue = []
  has = {}
}
