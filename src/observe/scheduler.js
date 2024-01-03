import { nextTick } from '../utils/next-tick'

let queue = []
let has = {}
export function queueWatcher(watcher) {
  let id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    nextTick(flushSchedulerQueue)
  }
}

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)
  flushQueue.forEach((q) => q.run())
  queue = []
  has = {}
}
