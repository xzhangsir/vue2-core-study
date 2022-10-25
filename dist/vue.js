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
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  // <span:xx>
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  // 开始标签
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  // 结束标签
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  // 属性  第一个分组是属性的key  value在分组 3/4/5中
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // <br/>
  var startTagClose = /^\s*(\/?)>/;
  // {{}}
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var root;
    var currentParent; //永远指向栈中的最后一个
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
      var node = createASTElement(tag, attrs);
      if (!root) {
        root = node;
      }
      if (currentParent) {
        node.parent = currentParent;
        currentParent.children.push(node);
      }
      stack.push(node);
      currentParent = node;
    }
    function end() {
      stack.pop();
      currentParent = stack[stack.length - 1];
    }
    function chars(text) {
      text = text.replace(/\s/g, '');
      if (text) {
        currentParent.children.push({
          type: TEXT_TYPE,
          text: text,
          parent: currentParent
        });
      }
    }
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      // console.log('start', start)
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        // 如果不是开始标签的结束 就一直匹配下去
        var attr, _end;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }
        if (_end) {
          advance(_end[0].length);
        }
        return match;
      }
      return false;
    }
    while (html) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // 标签
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[2]);
          continue;
        }
      }
      if (textEnd > 0) {
        var text = html.substring(0, textEnd);
        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    }
    return root;
  }

  function gen(node) {
    if (node.type === 1) {
      return codegen(node);
    } else {
      var text = node.text;
      if (!defaultTagRE.test(text)) {
        // 纯文本
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        //有插值表达式
        defaultTagRE.lastIndex = 0;
        var match;
        var lastIndex = 0;
        var tokens = [];
        while (match = defaultTagRE.exec(text)) {
          var index = match.index;
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }
  function genChildren(children) {
    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }
  function genProps(attrs) {
    var str = '';
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (attr.name == 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];
            obj[key] = value;
          });
          attr.value = obj;
        })();
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null').concat(ast.children.length ? ",".concat(children) : '', ")");
    return code;
  }
  function compileToFunction(el) {
    var ast = parseHTML(el);
    // console.log(ast)
    var code = codegen(ast);
    // console.log(code)
    code = "with(this){return ".concat(code, "}");
    // console.log('code', code)
    var render = new Function(code);
    return render;
  }

  function isObject(data) {
    return data !== null && _typeof(data) === 'object';
  }

  var oldArrayMethods = Array.prototype;
  var ArrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];
  methods.forEach(function (method) {
    ArrayMethods[method] = function () {
      var _oldArrayMethods$meth;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayMethods$meth = oldArrayMethods[method]).call.apply(_oldArrayMethods$meth, [this].concat(args));
      var ob = this.__ob__;
      var inserted; // 新增的值
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
        ob.observerArray(inserted);
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
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
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
  Dep.target = null;

  // 用栈来保存watcher
  var targetStack = [];
  function pushTarget(watcher) {
    targetStack.push(watcher);
    Dep.target = watcher; // Dep.target指向当前watcher
  }

  function popTarget() {
    targetStack.pop(); // 当前watcher出栈 拿到上一个watcher
    Dep.target = targetStack[targetStack.length - 1];
  }

  function observer$1(data) {
    if (!isObject(data)) {
      return; //只对对象进行劫持
    }
    // if (data.__ob__ instanceof Observer) {
    //   // 说明这个对象被代理过了
    //   return data.__ob__
    // }
    return new Observer(data);
  }
  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      this.dep = new Dep();
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        value: this,
        writable: true,
        configurable: true
      });
      if (Array.isArray(value)) {
        value.__proto__ = ArrayMethods;
        this.observerArray(value);
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
          defineReactive(data, key, data[key]);
        }
      }
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        for (var i = 0; i < data.length; i++) {
          observer$1(data[i]);
        }
      }
    }]);
    return Observer;
  }();
  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();
      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }
  function defineReactive(data, key, value) {
    var childOb = observer$1(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            // 数组里面嵌套数组
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value;
      },
      set: function set(newVal) {
        if (value === newVal) return;
        observer$1(newVal);
        value = newVal;
        dep.notify();
      }
    });
  }

  // dep.depend ->
  //     Watcher.addDep(this)
  //       this.deps.push(dep) //watcher记住dep
  //       dep.addSub(wathcer) //dep 记住 watcher
  //           this.subs.push(watcher)

  function initState(vm) {
    var options = vm.$options;
    if (options.data) {
      initData(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    if (isObject(data)) {
      data = data;
    } else if (typeof data === 'function') {
      data = data.call(vm);
    } else {
      console.error('data type error');
      return false;
    }
    vm._data = data;
    for (var key in data) {
      proxy(vm, '_data', key);
    }
    observer$1(data);
  }
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        return vm[source][key] = newVal;
      }
    });
  }

  var callBacks = [];
  var pending = false;
  function flushCallbacks() {
    var cbs = callBacks.slice(0);
    pending = false;
    callBacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  }
  var timerFunc;
  if (typeof Promise !== 'undefined') {
    // 如果支持 Promise
    var p = Promise.resolve();
    timerFunc = function timerFunc() {
      p.then(flushCallbacks);
    };
  } else if (typeof MutationObserver !== 'undefined') {
    // MutationObserver 主要监听dom变化
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
      //counter变化    flushCallbacks执行
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
    callBacks.push(cb);
    if (!pending) {
      pending = true;
      timerFunc();
    }
  }

  var queue = [];
  var has = {};
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;
      nextTick(flushSchedulerQueue);
    }
  }
  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0);
    flushQueue.forEach(function (q) {
      return q.run();
    });
    queue = [];
    has = {};
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);
      this.id = id++;
      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.deps = [];
      this.depsId = new Set();
      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      }
      this.get();
    }
    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // Dep.target = this
        pushTarget(this);
        this.getter();
        // Dep.target = null
        popTarget();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsId.has(id)) {
          // 让watcher记住dep
          this.deps.push(dep);
          this.depsId.add(id);
          // 让dep记住watcher
          dep.addSub(this);
        }
      }
    }, {
      key: "update",
      value: function update() {
        // console.log('更新ll')
        // this.get()
        // 异步更新
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        console.log('更新');
        this.get();
      }
    }]);
    return Watcher;
  }();

  function createElementVNode(vm, tag, data) {
    data = data || {};
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, data.key, data, children, undefined);
  }
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  function patch(oldVnode, vnode) {
    // console.log('oldVnode', oldVnode)
    // console.log('vnode', vnode)
    // 初次渲染
    var isRealElement = oldVnode.nodeType;
    // 判断是不是真实元素
    if (isRealElement) {
      // 获取真实元素
      var elm = oldVnode;
      // 拿到父元素
      var parentElm = elm.parentNode;
      var newElm = createElm(vnode);
      parentElm.insertBefore(newElm, elm.nexSibling);
      parentElm.removeChild(elm);
      return newElm;
    }
  }
  function createElm(vnode) {
    var tag = vnode.tag,
      data = vnode.data,
      children = vnode.children,
      text = vnode.text;
    // 通过 tag 判断当前节点是元素 or 文本,判断逻辑：文本 tag 是 undefined
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag); // 创建元素的真实节点
      // 处理 data 属性
      updateProperties(vnode.el, data);
      // 继续处理元素的儿子：递归创建真实节点并添加到对应的父亲上
      children.forEach(function (child) {
        // 若不存在儿子，children为空数组，循环终止
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text); // 创建文本的真实节点
    }

    return vnode.el;
  }
  function updateProperties(el) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var key in props) {
      if (key === 'style') {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      // createElement 创建元素型的节点
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._v = function () {
      // 创建文本的虚拟节点
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (val) {
      // JSON.stringify
      if (isObject(val)) {
        // 是对象，转成字符串
        return JSON.stringify(val);
      } else {
        // 不是对象，直接返回
        return val;
      }
    };
    Vue.prototype._update = function (vnode) {
      this.$el = patch(this.$el, vnode);
    };
    Vue.prototype._render = function () {
      var vm = this;
      return vm.$options.render.call(vm);
    };
  }
  function mountComponent(vm, el) {
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };
    new Watcher(vm, updateComponent, function () {}, true);
  }

  function initMixin(Vue) {
    Vue.prototype.__init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);
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
        var template = options.template;
        if (!template && el) {
          template = el.outerHTML;
        }
        var render = compileToFunction(template);
        options.render = render;
      }
      mountComponent(vm);
    };
  }

  function Vue(options) {
    this.__init(options);
  }
  initMixin(Vue);
  renderMixin(Vue);
  Vue.prototype.$nextTick = nextTick;

  return Vue;

}));
//# sourceMappingURL=vue.js.map
