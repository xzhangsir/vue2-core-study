import { observer } from './observe/index'
export function initState(vm) {
  let ops = vm.$options
  // console.log('ops', ops)
  if (ops.data) {
    initData(vm)
  }
  if (ops.props) {
    initProps()
  }
  if (ops.watch) {
    initWatch()
  }
  if (ops.computed) {
    initComputed()
  }
  if (ops.methods) {
    initMethods()
  }
}

function initData(vm) {
  // console.log('vm:data初始化', vm)
  let data = vm.$options.data
  // 对象或者函数
  if (typeof data === 'object' && data !== null) {
    data = data
  } else if (typeof data === 'function') {
    data = data.call(vm)
  } else {
    console.error('data type error')
    return false
  }
  vm._data = data
  // 对data数据进行劫持
  observer(data)
}

function initProps() {}
function initWatch() {}
function initComputed() {}
function initMethods() {}
