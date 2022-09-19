(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 标签名
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // <span:xx>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 开始标签

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 结束标签

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 属性  第一个分组是属性的key  value在分组 3/4/5中

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // <br/>

  var startTagClose = /^\s*(\/?)>/; // {{}}

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function parseHTML(html) {
    // 创建一个ast对象
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        //元素
        attrs: attrs,
        //属性
        children: [],
        //子节点
        type: 1,
        //元素类型(标签 1)
        parent: null
      };
    }

    var root; //根元素

    var currentParent; //当前的父亲

    var stack = [];

    function start(tag, attrs) {
      // 开始标签
      // console.log('开始标签', tag, attrs)
      var element = createASTElement(tag, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }

    function charts(text) {
      // 文本
      // console.log('文本', text)
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          type: 3,
          //元素类型(文本 3)
          text: text
        });
      }
    }

    function end(tag) {
      // 结束标签
      // console.log('结束标签', tag)
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent.tag;
        currentParent.children.push(element);
      }
    }

    while (html) {
      // 判断标签
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 1) 开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 2) 结束标签


        var endTagMatch = html.match(endTag); // console.log(endTagMatch)

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      } // 文本


      var text = void 0;

      if (textEnd > 0) {
        // console.log(textEnd)
        // 获取文本内容
        text = html.substring(0, textEnd);
        charts(text); // console.log(text)
      }

      if (text) {
        advance(text.length);
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        // console.log(start)
        // 创建ast语法树
        var match = {
          tagName: start[1],
          attrs: []
        }; // 删除开始标签 <div

        advance(start[0].length);

        var attr, _end; // 处理属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          }); // 删除属性

          advance(attr[0].length); // break
        }

        if (_end) {
          // 删掉 >
          advance(_end[0].length);
          return match;
        }
      }
    }

    function advance(n) {
      html = html.substring(n); // console.log(html)
    } // console.log(root)


    return root;
  }

  function genPorps(attrs) {
    // console.log(attrs)
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            if (item) {
              var _item$split = item.split(':'),
                  _item$split2 = _slicedToArray(_item$split, 2),
                  key = _item$split2[0],
                  value = _item$split2[1];

              obj[key] = value;
            }
          }); // style="color:#f00;font-size:20px;"
          //          ||
          // {color: '#f00', font-size: '20px'}

          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  } // 处理子节点


  function genChildren(ast) {
    var children = ast.children;

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }

    return null;
  }

  function gen(node) {
    // 文本 或者 标签
    if (node.type === 1) {
      // 标签
      return generate(node);
    } else if (node.type === 3) {
      // 文本  （纯文本和插值表达式）
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        // 没有插值的纯文本
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        // 有插值表达式
        var tokens = [];
        var lastIndex = defaultTagRE.lastIndex = 0;
        var match;

        while (match = defaultTagRE.exec(text)) {
          // console.log('match', match)
          var index = match.index;

          if (index > lastIndex) {
            // 添加内容
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        } // console.log(tokens)


        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function generate(ast) {
    var children = genChildren(ast);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length ? "".concat(genPorps(ast.attrs)) : undefined, ",").concat(children, ")"); // console.log(code)

    return code;
  }

  function compileToFunction(el) {
    // console.log(el)
    // 1） 将HTML 变成 ast语法树
    var ast = parseHTML(el); // console.log('ast', ast)
    // 2） 将ast语法树变成render函数
    // _c 元素 _v 文本 _s 是表达式
    // 2-1)ast语法树变成字符串

    var code = generate(ast); // console.log('code', code)
    // 2-2)字符串变成函数

    var render = new Function("with(this){return ".concat(code, "}")); // console.log('render', render)

    return render;
  }

  var HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destroyed']; // 策略模式

  var starts = {};

  starts.data = function (parentVal, childVal) {
    // 合并data
    return childVal;
  };

  starts.computed = function () {// 合并computed
  }; // starts.watch = function () {
  //   // 合并watch
  // }


  HOOKS.forEach(function (hooks) {
    starts[hooks] = mergeHook;
  });

  function mergeHook(parentVal, childVal) {
    // console.log(parentVal, childVal)
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  function mergeOptions(parent, child) {
    // 合并对象
    // console.log(parent, child)
    var options = {}; // 父亲

    for (var key in parent) {
      mergeField(key);
    } // 儿子有


    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      // 策略模式
      if (starts[key]) {
        options[key] = starts[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key];
      }
    } // console.log('options', options)


    return options;
  }

  function initGlobApi(Vue) {
    // created:[a,b,c]
    // watch:[a,b]
    Vue.options = {};

    Vue.mixin = function (mixin) {
      // console.log(this)
      // 对象的合并
      // console.log(Vue.options)
      // console.log(mixin)
      this.options = mergeOptions(this.options, mixin); // console.log(this.options)

      return this;
    };
  }

  // 重写数组方法
  // 1) 获取原来数组的方法
  var oldArrayProtoMethods = Array.prototype; // 2) 继承

  var ArrayMethods = Object.create(oldArrayProtoMethods); // 3）函数劫持

  var methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];
  methods.forEach(function (method) {
    ArrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // console.log('数组劫持', args)
      var result = oldArrayProtoMethods[method].apply(this, args); // 对数组中新增的数据 进行劫持

      var inserted; //新增的内容

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      var ob = this.__ob__;

      if (inserted) {
        // 对新增的内容进行劫持
        ob.observeArray(inserted);
      }

      ob.dep.notify();
      return result;
    };
  });

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = [];
    } // 让watcher收集dep


    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // this.subs.push(Dep.target)
        Dep.target.addDep(this);
      } // dep收集watcher

    }, {
      key: "addWatcher",
      value: function addWatcher(watcher) {
        this.subs.push(watcher);
      } // 更新

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null; // 添加watcher

  function pushTarget(watcher) {
    Dep.target = watcher;
  } // 取消watcher

  function popTarget() {
    Dep.target = null;
  }

  function observer$1(data) {
    if (_typeof(data) !== 'object' || data === null) {
      // data不是对象或者data为空 不劫持
      return data;
    } // console.log('劫持data:', data)


    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // console.log('value', value)
      this.dep = new Dep(); // 给 value 添加一个属性

      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        //不可枚举
        value: this
      }); // value.__ob__ = this //副作用 给数据加了一个标识上有__ob__ 则说明这个属性被观测过
      // 判断是不是数组

      if (Array.isArray(value)) {
        console.log('数组', value); // 重写数组 的部分方法

        value.__proto__ = ArrayMethods; // 数组里面包含对象

        this.observeArray(value); //[{a:1}]
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key]; // 对每一个属性进行劫持

          defineReactive(data, key, value);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(arr) {
        for (var i = 0; i < arr.length; i++) {
          observer$1(arr[i]);
        }
      }
    }]);

    return Observer;
  }(); // 对对象中的属性进行劫持


  function defineReactive(data, key, value) {
    var childDep = observer$1(value); //深度递归劫持

    var dep = new Dep(); //给每个属性添加一个dep

    Object.defineProperty(data, key, {
      get: function get() {
        // console.log('childDep', childDep)
        // console.log('获取', key)
        // 收集依赖
        if (Dep.target) {
          dep.depend(); // 让数组和对象本身也实现依赖收集

          if (childDep.dep) {
            childDep.dep.depend();
          }
        } // console.log(dep)


        return value;
      },
      set: function set(newVal) {
        // console.log('设置', newVal)
        if (newVal === value) return;
        observer$1(newVal); //对设置的值 进行劫持

        value = newVal; // 触发更新

        dep.notify();
      }
    });
  }

  var callbacks = [];
  var waiting = false;

  function flushCallbacks() {
    var cbs = callbacks.slice(0);
    waiting = false;
    callbacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  }

  var timerFunc; // nextTick 内部没有直接使用setTimeout 而是采用优雅降级的方式
  // 内部先采用promise (ie不兼容)
  // MutationObserver
  // 考虑IE专享的 setImmediate
  // 实在不行 就用 setTimeout

  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });

    timerFunc = function timerFunc() {
      textNode.textContent = 2; // 1 变 2    flushCallbacks执行
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick(cb) {
    // cb  有 vue更新的 也 有用户的
    // console.log(cb)
    callbacks.push(cb);

    if (!waiting) {
      // setTimeout(flushCallbacks, 0)
      timerFunc(); //兼容

      waiting = true;
    }
  }

  var id = 0;

  var watcher = /*#__PURE__*/function () {
    function watcher(vm, updateComponent, cb, options) {
      _classCallCheck(this, watcher);

      this.vm = vm;
      this.exprOrfn = updateComponent;
      this.cb = cb;
      this.options = options;
      this.id = id++;
      this.deps = [];
      this.depsId = new Set(); // console.log(this.exprOrfn)

      if (typeof this.exprOrfn === 'function') {
        this.getter = this.exprOrfn; //更新视图
      } else if (typeof this.exprOrfn === 'string') {
        // watch
        // console.log(vm)
        this.getter = function () {
          var path = this.exprOrfn.split('.');
          var obj = vm;

          for (var i = 0; i < path.length; i++) {
            // console.log(path[i], vm[path[i]])
            obj = obj[path[i]];
          } // console.log(obj)


          return obj;
        };
      }

      this.value = this.get(); //保持watch的初始值

      this.user = options.user; //watch用到：标识是不是用户自己的watcher
    }

    _createClass(watcher, [{
      key: "run",
      value: function run() {
        var oldVal = this.value;
        var newVal = this.get();
        this.value = newVal;

        if (this.user) {
          this.cb.call(this.vm, newVal, oldVal);
        }
      } // 初次渲染

    }, {
      key: "get",
      value: function get() {
        pushTarget(this); //给dep添加watcher

        var value = this.getter(); //渲染页面

        popTarget(); //给dep取消watcher

        return value;
      } // wather dep 相互关联

    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addWatcher(this);
        }
      } // 更新

    }, {
      key: "update",
      value: function update() {
        // this.getter()
        // 多次调用update 只执行一次 缓存
        queueWatcher(this);
      }
    }]);

    return watcher;
  }(); // 将需要批量更新的watcher存放到队列中


  var queue = [];
  var has = {};
  var pending = false;

  function flushWatcher() {
    queue.slice(0).forEach(function (watcher) {
      watcher.run(); // watcher.cb()
    });
    queue = [];
    has = {};
    pending = false;
  }

  function queueWatcher(watcher) {
    var id = watcher.id; // console.log(id)

    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;

      if (!pending) {
        pending = true;
        /*     setTimeout(() => {
          queue.forEach((watcher) => watcher.run())
          queue = []
          has = {}
          pending = false
        }) */

        nextTick(flushWatcher);
      }
    }
  }

  function initState(vm) {
    var ops = vm.$options; // console.log('ops', ops)

    if (ops.data) {
      initData(vm);
    }

    if (ops.props) ;

    if (ops.watch) {
      initWatch(vm);
    }

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

    vm._data = data; // 将data上的属性代理到实例上 vm.msg = vm._data.msg

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 对data数据进行劫持


    observer$1(data);
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

  function initWatch(vm) {
    var watch = vm.$options.watch;
    console.log(watch);

    var _loop = function _loop(key) {
      var handler = watch[key]; // handler  可能是数组对象字符 函数

      if (Array.isArray(handler)) {
        // 数组
        handler.forEach(function (item) {
          return createrWatcher(vm, key, item);
        });
      } else {
        // 对象字符串函数
        createrWatcher(vm, key, handler);
      }
    };

    for (var key in watch) {
      _loop(key);
    }
  } // vm.$watch(()=>{return "a"}) //返回的值就是watcher上的属性


  function createrWatcher(vm, exprOrfn, handler, options) {
    if (_typeof(handler) === 'object') {
      options = handler;
      handler = handler.handler;
    } else if (typeof handler === 'string') {
      handler = vm[handler];
    } // 最终都交给$watch处理


    return vm.$watch(exprOrfn, handler, options);
  }

  function stateMixin(vm) {
    vm.prototype.$nextTick = function (cb) {
      nextTick(cb);
    };

    vm.prototype.$watch = function (exprOrfn, handler, options) {
      // console.log(exprOrfn, handler, options)
      new watcher(this, exprOrfn, handler, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));

      if (options && options.immediate) {
        // immediate 立即执行
        handler.call(vm);
      }
    };
  }

  function patch(oldVnode, vnode) {
    // console.log(oldVnode)
    // console.log(vnode)
    if (oldVnode.nodeType === 1) {
      // vnode ->真实dom
      // 1）创建新dom
      var el = createEl(vnode); // console.log(el)
      // 2) 新dom替换旧dom

      var parentEL = oldVnode.parentNode;
      parentEL.insertBefore(el, oldVnode.nextsibling);
      parentEL.removeChild(oldVnode);
      return el;
    } else {
      patchVnode(oldVnode, vnode); // diff
    }
  }

  function patchVnode(oldVnode, vnode) {
    // // 新老节点不相同 直接用新的替换掉老的
    if (!isSameVnode(oldVnode, vnode)) {
      var el = createEl(vnode);
      oldVnode.el.parentNode.replaceChild(el, oldVnode.el);
      return el;
    } else {
      /*新老节点相同*/
      var _el = vnode.el = oldVnode.el;

      console.log(_el);

      if (!oldVnode.tag) {
        // 文本
        if (oldVnode.text !== vnode.text) {
          _el.textContent = vnode.text;
        }
      }

      patchProps(_el, oldVnode.data, vnode.data);
      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || [];
      console.log(oldVnode, vnode);

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 完整的diff
        updateChildren(_el, oldChildren, newChildren);
      } else if (newChildren.length > 0) {
        // 老的没有  新的有儿子
        // mountChildren(el, newChildren)
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];

          _el.appendChild(createEl(child));
        }
      } else if (oldChildren.length > 0) {
        // 新的没有 老的有 要删除
        // unmountChildren(el, oldChildren)
        _el.innerHTML = '';
      } // console.log(oldChildren, newChildren)


      return _el;
    }
  }

  function updateChildren(el, oldChildren, newChildren) {
    console.log(el, oldChildren, newChildren);
    var oldStartIndex = 0;
    var newStartIndex = 0;
    var oldEndIndex = oldChildren.length - 1;
    var newEndIndex = newChildren.length - 1;
    var oldStartVnode = oldChildren[0];
    var newStartVnode = newChildren[0];
    var oldEndVnode = oldChildren[oldEndIndex];
    var newEndVnode = newChildren[newEndIndex];

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 头头比对
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        // 尾尾比对
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[++oldEndIndex];
        newEndVnode = newChildren[++newEndIndex];
      }
    } // ab => abc     abc=>dabc


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var childEl = createEl(newChildren[i]);
        el.appendChild(childEl);
      }
    } // abcd=>abc abc=>bc


    console.log(oldStartIndex, oldEndIndex);

    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        if (oldChildren[_i]) {
          var _childEl = oldChildren[_i].el;
          el.removeChild(_childEl);
        }
      }
    }
  } // 判断两个虚拟节点是不是同一个


  function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  } // 创建dom


  function createEl(vnode) {
    var tag = vnode.tag,
        children = vnode.children;
        vnode.key;
        var data = vnode.data,
        text = vnode.text;

    if (typeof tag === 'string') {
      // 是标签  创建元素
      vnode.el = document.createElement(tag);
      patchProps(vnode.el, {}, data);

      if (children.length > 0) {
        children.forEach(function (child) {
          vnode.el.appendChild(createEl(child));
        });
      }
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }
  function patchProps(el) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // 老的属性中有 新的没有 要删除老的  样式和其它属性
    var oldStyles = oldProps.style || {};
    var newStyles = props.style || {};

    for (var key in oldStyles) {
      if (!newStyles[key]) {
        el.style[key] = '';
      }
    }

    for (var _key in oldProps) {
      if (!props[_key]) {
        el.removeAttribute(_key);
      }
    } // 新的覆盖老的
    // console.log('props', props)


    for (var _key2 in props) {
      if (_key2 === 'style') {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(_key2, props[_key2]);
      }
    }
  }

  function mounetComponent(vm, el) {
    callHook(vm, 'beforeMount');
    /* 
    //vm._render 1）将render函数 变成vnode
    //vm._update 2）将vnode变成真实DOM 放到页面中
    vm._update(vm._render()) 
    */

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    new watcher(vm, updateComponent, function () {
      callHook(vm, 'updated');
    }, true);
    callHook(vm, 'mounted');
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // vnode变成真实DOM
      var vm = this; // console.log(vnode)

      console.log(vm); // 旧dom  虚拟dom

      vm.$el = patch(vm.$el, vnode);
    };
  } // 生命周期的调用

  function callHook(vm, hook) {
    // console.log(vm)
    var handlers = vm.$options[hook]; // console.log(hook)
    // console.log(handlers)

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // console.log('options', options)
      var vm = this; // vm.$options = options
      // console.log(Vue.options)

      vm.$options = mergeOptions(Vue.options, options); // console.log(vm.$options)
      // callHook

      callHook(vm, 'beforeCreate'); // 初始化状态

      initState(vm);
      callHook(vm, 'created'); // console.log(vm)
      // 模板渲染

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      vm.$el = el;
      var options = vm.$options;

      if (!options.render) {
        // 没有render
        var template = options.template;

        if (!template) {
          //没有template
          if (el) {
            // 获取HTML
            el = el.outerHTML; // 先变成ast语法树 再转为redner函数

            var render = compileToFunction(el); // console.log(render)

            options.render = render;
          }
        } // 挂载组件


        mounetComponent(vm);
      }
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      // 标签
      // 创建标签
      // console.log(arguments)
      return createElement.apply(void 0, arguments);
    };

    Vue.prototype._v = function (text) {
      // 文本
      // 创建文本
      return createText(text);
    };

    Vue.prototype._s = function (val) {
      // 插值表达式
      if (val) {
        if (_typeof(val) === 'object') {
          return JSON.stringify(val);
        }

        return val;
      }

      return '';
    };

    Vue.prototype._render = function () {
      // 将render函数 变成vnode
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm); // console.log('vnode', vnode)

      return vnode;
    };
  } // 创建元素

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, data.key, children);
  } // 创建文本


  function createText(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } // 创建虚拟node


  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    // 初始化
    this._init(options);
  }

  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
  initGlobApi(Vue);
  stateMixin(Vue); //给vm添加$nextTick

  window.onload = function () {
    var render1 = compileToFunction("<ul><li>2</li><li>3</li></ul>");
    var vm1 = new Vue({
      data: {
        name: 'zx'
      }
    });
    var prevVnode = render1.call(vm1);
    var el = createEl(prevVnode); // console.log(render1)
    // console.log(prevVnode)
    // console.log(el)
    // console.log(document.body)

    document.body.appendChild(el);
    var render2 = compileToFunction("<ul><li>1</li><li>2</li><li>3</li></ul>");
    var vm2 = new Vue({
      data: {
        name: 'xm'
      }
    });
    var nextVnode = render2.call(vm2); // console.log(render2)
    // console.log(nextVnode)

    setTimeout(function () {
      patch(prevVnode, nextVnode);
    }, 3000);
  };

  return Vue;

}));
//# sourceMappingURL=vue.js.map
