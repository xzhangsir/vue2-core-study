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

  var oldArrayMethods = Array.prototype;
  var ArrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];

  var _loop = function _loop() {
    var method = _methods[_i];

    ArrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args);
      var inserted; // 新增的值

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      } // console.log(this)


      if (inserted) {
        //对新增的内容进行劫持
        this.__ob__.observeArray(inserted);
      }

      return result;
    };
  };

  for (var _i = 0, _methods = methods; _i < _methods.length; _i++) {
    _loop();
  }

  function observer(data) {
    if (data === null || _typeof(data) !== 'object') {
      // data不是对象或者data为空 不劫持
      return data;
    }

    console.log('要进行劫持的数据', data);
    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 给 value 添加一个属性
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        //不可枚举
        value: this
      });

      if (Array.isArray(value)) {
        // 重写数组 的部分方法
        value.__proto__ = ArrayMethods;
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);

        for (var i = 0; i < keys.length; i++) {
          // 对data中的每一个属性进行劫持
          var key = keys[i];
          defineReactive(data, key, data[key]);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        for (var i = 0; i < data.length; i++) {
          observer(data[i]);
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observer(value);
    Object.defineProperty(data, key, {
      get: function get() {
        console.log('获取key', key, value);
        return value;
      },
      set: function set(newVal) {
        console.log('设置key', key, newVal);
        if (value === newVal) return;
        observer(newVal); //对设置的值 进行劫持

        value = newVal;
      }
    });
  }

  function initState(vm) {
    var options = vm.$options;
    console.log(vm);

    if (options.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    console.log('刚要初始化的data', data);

    if (data !== null && _typeof(data) === 'object') {
      data = data;
    } else if (typeof data === 'function') {
      data = data.call(vm);
    } else {
      console.error('data type err');
      return false;
    }

    vm._data = data;
    console.log('处理后的data', data);

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 对data中的数据进行劫持


    observer(data);
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }

  function initMixin(Vue) {
    Vue.prototype.__init = function (options) {
      var vm = this;
      vm.$options = options;
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
