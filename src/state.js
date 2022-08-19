export function initState(vm) {
  // 获取所有的用户选项
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  //用户写入的data   可能是function 或者 Object
  let data = vm.$options.data

  data = typeof data === 'function' ? data.call(vm) : data
  console.log(data)
}
