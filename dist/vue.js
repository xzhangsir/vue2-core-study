(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function observer(data) {
    if (_typeof(data) !== 'object' || data === null) {
      // data不是对象或者data为空 不劫持
      return data;
    }

    console.log('劫持data:', data);
    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.walk(value);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); // console.log('keys', keys)

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key]; // 对每一个属性进行劫持

          defineReactive(data, key, value);
        }
      }
    }]);

    return Observer;
  }(); // 对对象中的属性进行劫持


  function defineReactive(data, key, value) {
    observer(value); //深度递归劫持

    Object.defineProperty(data, key, {
      get: function get() {
        console.log('获取');
        return value;
      },
      set: function set(newVal) {
        console.log('设置');
        if (newVal === value) return;
        observer(newVal); //对设置的值 进行劫持

        value = newVal;
      }
    });
  }

  function initState(vm) {
    var ops = vm.$options; // console.log('ops', ops)

    if (ops.data) {
      initData(vm);
    }

    if (ops.props) ;

    if (ops.watch) ;

    if (ops.computed) ;

    if (ops.methods) ;
  }

  function initData(vm) {
    // console.log('vm:data初始化', vm)
    var data = vm.$options.data; // 对象或者函数

    if (_typeof(data) === 'object' && data !== null) {
      data = data;
    } else if (typeof data === 'function') {
      data = data.call(vm);
    } else {
      console.error('data type error');
      return false;
    }

    vm._data = data; // 对data数据进行劫持

    observer(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // console.log('options', options)
      var vm = this;
      vm.$options = options; // 初始化状态

      initState(vm);
    };
  }

  function Vue(options) {
    // 初始化
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
