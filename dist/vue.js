(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function initState(vm) {
    // 获取所有的用户选项
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    //用户写入的data   可能是function 或者 Object
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    console.log(data);
  }

  function initMixin(Vue) {
    Vue.prototype.__init = function (options) {
      var vm = this;
      vm.$options = options; //将用户的选项挂载到实例上
      //初始化状态

      initState(vm);
    };
  }

  function Vue(options) {
    this.__init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
