(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  // 对模板进行编译
  // const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 开始标签

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 结束标签

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 属性  第一个分组是属性的key  value在分组 3/4/5中

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // <br/>

  var startTagClose = /^\s*(\/?)>/; // {{}}

  function parseHTML(html) {
    // 最终需要转化为一颗抽象语法树
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var currentParent; //永远指向栈中的最后一个

    var root;

    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tag, attrs) {
      // 创造一个ast节点
      var node = createASTElement(tag, attrs); // 如果root为空 那这个节点就是当前树的根节点

      if (!root) {
        root = node;
      }

      if (currentParent) {
        // 赋予parent属性
        node.parent = currentParent; // 还要让父亲记住自己

        currentParent.children.push(node);
      }

      stack.push(node);
      currentParent = node; // console.log(tag, attrs)
    }

    function chars(text) {
      text = text.replace(/\s/g, ''); // 文本直接放到当前指向的节点

      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      }); // console.log(text)
    }

    function end(tag) {
      stack.pop(); //弹出最后一个 校验标签是否合法

      currentParent = stack[stack.length - 1]; // console.log(tag)
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen); // console.log(start)

      if (start) {
        var match = {
          tagName: start[1],
          //标签名
          attrs: []
        };
        advance(start[0].length); // console.log(match)
        // console.log(html)
        // 如果不是开始标签的结束 就一直匹配下去

        var attr, _end;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
        } // console.log(attr)
        // console.log(html)
        // console.log(match)


        return match;
      }

      return false; //不是开始标签
    }

    while (html) {
      //<div>hello</div>
      //如果indexOf中的索引是0 则说明是标签
      //如果大于0 则说明是文本结束的位置
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); //开始标签的匹配结果

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); // console.log(html)

          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      if (textEnd > 0) {
        // 文本内容
        var text = html.substring(0, textEnd);

        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    }

    console.log(root);
  }

  function compileToFunction(template) {
    // 1 template  转 ast语法树
    parseHTML(template); // 2 生成render （返回的就是 虚拟dom）

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
