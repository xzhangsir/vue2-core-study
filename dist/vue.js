(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  // 对模板进行编译
  function compileToFunction(template) {
    // 1 template  转 ast语法树
    // 2 生成render （返回的就是 虚拟dom）
    console.log(template);
  }

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

  // 对数组中的部分方法进行重写
  var oldArrayProto = Array.prototype; //获取数组的原型

  var newArrayProto = Object.create(oldArrayProto); // 找到所有的变异方法  即可以修改原数组的方法

  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // console.log(method)
      // 内部调用原来的方法  函数的劫持  切片编程
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 对数组中新增的数据 进行劫持


      var inserted; //新增的内容

      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        // 对新增的内容进行观测
        ob.observeArray(inserted);
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false //不能被枚举

      }); // data.__ob__ = this //副作用 给数据加了一个标识上有__ob__ 则说明这个属性被观测过

      if (Array.isArray(data)) {
        // 重写部分数组中的方法
        data.__proto__ = newArrayProto;
        this.observeArray(data);
      } else {
        // Object.defineProperty 只能劫持已经存在的属性
        // vue2中加了 $set  $delete api
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        //循环对象对属性进行依次的劫持
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(target, key, value) {
    observe(value); //如果value是对象 再次递归劫持 深度劫持

    Object.defineProperty(target, key, {
      get: function get() {
        console.log('来取值了', key);
        return value;
      },
      set: function set(newValue) {
        console.log('设置值了', key);
        if (newValue === value) return;
        observe(newValue); //如果设置的值是对象 再次代理

        value = newValue;
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || data == null) {
      return; //只对对象进行劫持
    }

    if (data.__ob__ instanceof Observer) {
      // 说明这个对象被代理过了
      return data.__ob__;
    } // 如果对象被劫持过 就不需要再被劫持了


    return new Observer(data);
  }

  function initState(vm) {
    // 获取所有的用户选项
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key]; //vm._data.name
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function initData(vm) {
    //用户写入的data   可能是function 或者 Object
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data; // 对data进行数据劫持

    observe(data); // 将vm._data用vm来代理

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initMixin(Vue) {
    Vue.prototype.__init = function (options) {
      var vm = this;
      vm.$options = options; //将用户的选项挂载到实例上
      //初始化状态

      initState(vm);

      if (options.el) {
        vm.$mount(options.el); //实现数据的挂载
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var ops = vm.$options;

      if (!ops.render) {
        //先找render 没有render 找template
        var template;

        if (!ops.template && el) {
          //没有template 用外部的html
          template = el.outerHTML;
        } else {
          if (el) {
            template = ops.template;
          }
        }

        if (template) {
          // 对模板进行编译
          var render = compileToFunction(template);
          ops.render = render;
        }
      }

      ops.render; //最终可以获取到render方法
    };
  }

  function Vue(options) {
    this.__init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
