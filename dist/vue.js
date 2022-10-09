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
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // <span:xx>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 开始标签

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 结束标签

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 属性  第一个分组是属性的key  value在分组 3/4/5中

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // <br/>

  var startTagClose = /^\s*(\/?)>/; // {{}}

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
      // 创建一个ast节点
      var node = createASTElement(tag, attrs); // console.log('node', node)

      if (!root) {
        // 如果root为空 那这个节点就是当前树的根节点
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
    } // 处理开始标签


    function parseStartTag() {
      var start = html.match(startTagOpen); // console.log('start', start)

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var attr, _end; //  如果不是开始标签的结束 就一直匹配下去


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        } // console.log('end', end)


        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }

      return false;
    }

    while (html) {
      // <div>hello</div>
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 说明是标签
        var startTagMatch = parseStartTag(); // console.log('startTagMatch', startTagMatch)
        // console.log('剩余的HTML', html)

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
        //说明是文本结束的位置
        // console.log('html', html)
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
    // console.log(node)
    if (node.type === 1) {
      // 子节点是元素
      return codegen(node);
    } else {
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        // 纯文本
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        // 有插值表达式
        defaultTagRE.lastIndex = 0;
        var match;
        var lastIndex = 0;
        var tokens = []; // console.log(defaultTagRE.exec(text))

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
    // console.log('attrs', attrs)
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
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
    // console.log('ast', ast)
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null').concat(ast.children.length ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(el) {
    // console.log('el', el)
    // 1 template  转 ast语法树
    var ast = parseHTML(el); // console.log('ast', ast)
    // 2 生成render （返回的就是 虚拟dom）

    var code = codegen(ast); // console.log('code', code)

    code = "with(this){return ".concat(code, "}"); // console.log('code', code)

    var render = new Function(code);
    return render;
  }

  // 定义生命周期
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed']; // 策略

  var strats = {}; // 为生命周期添加合并策略

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  }); //生命周期合并策略

  function mergeHook(parentVal, childVal) {
    // 如果有儿子
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
    // console.log(parent, child)
    var options = {}; // 遍历父亲

    for (var k in parent) {
      // console.log('parent', k)
      mergeField(k);
    } // 父亲没有  儿子有


    for (var _k in child) {
      if (!parent.hasOwnProperty(_k)) {
        // console.log('child', child)
        mergeField(_k);
      }
    }

    function mergeField(k) {
      if (strats[k]) {
        options[k] = strats[k](parent[k], child[k]);
      } else {
        // 默认策略
        options[k] = child[k] ? child[k] : parent[k];
      }
    }

    return options;
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      // 将用户的选型和全局的options进行合并
      // {} {created:function(){}} => {created:[fn]} //第一次
      // {created:[fn]} {created:[fn]} => {created:[fn,fn]} //再一次
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
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

      var result = oldArrayMethods[method].apply(this, args); // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  this就是a  ob就是a.__ob__ 这个属性代表的是该数据已经被响应式观察过了 __ob__对象指的就是Observer实例

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
      } // console.log(this)


      if (inserted) {
        //对新增的内容进行劫持
        ob.observeArray(inserted);
      } //数组派发更新 ob指的就是数组对应的Observer实例 我们在get的时候判断如果属性的值还是对象那么就在Observer实例的dep收集依赖 所以这里是一一对应的  可以直接更新


      ob.dep.notify();
      return result;
    };
  };

  for (var _i = 0, _methods = methods; _i < _methods.length; _i++) {
    _loop();
  }

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = []; //这里存放这当前属性对应的watcher有哪些
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // 把自身-dep实例存放在watcher里面
        Dep.target.addDep(this);
      }
    }, {
      key: "addWatcher",
      value: function addWatcher(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        //   依次执行subs里面的watcher更新方法
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null; // 用栈来保存watcher

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
    if (data === null || _typeof(data) !== 'object') {
      // data不是对象或者data为空 不劫持
      return data;
    } // console.log('要进行劫持的数据', data)


    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.dep = new Dep(); // 给 value 添加一个属性

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
    var childOb = observer$1(value); // 为每个属性实例化一个Dep 每个属性都有一个dep与之对应

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        // console.log('获取key', key, value)
        if (Dep.target) {
          dep.depend();

          if (childOb && childOb.dep) {
            childOb.dep.depend(); // 数组里面嵌套数组

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newVal) {
        // console.log('设置key', key, newVal)
        if (value === newVal) return;
        observer$1(newVal); //对设置的值 进行劫持

        value = newVal;
        dep.notify(); //通知渲染watcher去更新--派发更新
      }
    });
  }

  function initState(vm) {
    var options = vm.$options; // console.log(vm)

    if (options.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data; // console.log('刚要初始化的data', data)

    if (data !== null && _typeof(data) === 'object') {
      data = data;
    } else if (typeof data === 'function') {
      data = data.call(vm);
    } else {
      console.error('data type err');
      return false;
    }

    vm._data = data; // console.log('处理后的data', data)

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 对data中的数据进行劫持


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

  var callbacks = [];
  var pending = false;

  function flushCallbacks() {
    var cbs = callbacks.slice(0);
    pending = false;
    callbacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  } // nextTick 内部没有直接使用setTimeout 而是采用优雅降级的方式
  // 内部先采用promise (ie不兼容)
  // MutationObserver
  // 考虑IE专享的 setImmediate
  // 实在不行 就用 setTimeout


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
      textNode.data = String(counter); //counter变化    flushCallbacks执行
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
    //除了渲染watcher  还有用户自己手动调用的nextTick 一起被收集到数组
    callbacks.push(cb);

    if (!pending) {
      //如果多次调用nextTick  只会执行一次异步 等异步队列清空之后再把标志变为false
      pending = true;
      timerFunc();
    }
  }

  var queue = []; //存放watcher的队列

  var has = {}; //watcher去重

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      has[id] = true;
      queue.push(watcher); //  进行异步调用

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

  var Wathcer = /*#__PURE__*/function () {
    function Wathcer(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Wathcer);

      this.id = id++; // watcher的唯一标识

      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb; //回调函数 比如在watcher更新之前可以执行beforeUpdate方法

      this.options = options;
      this.deps = []; //存放dep的容器

      this.depsId = new Set(); //保证deps中的dep是唯一的

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } // 实例化就会默认调用get方法


      this.get();
    }

    _createClass(Wathcer, [{
      key: "get",
      value: function get() {
        // 在调用方法之前先把当前watcher实例推到全局Dep.target上
        pushTarget(this); //如果watcher是渲染watcher 那么就相当于执行  vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集

        this.getter(); // 在调用方法之后把当前watcher实例从全局Dep.target移除

        popTarget();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps = dep;
          dep.addWatcher(this);
        }
      } // 更新

    }, {
      key: "update",
      value: function update() {
        /*   console.log('我更新了')
        this.get() */
        // 异步更新 每次watcher更新的时候 先将它用一个队列缓存起来 之后再一起调用
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        // 真正的触发更新
        console.log('我真正的更新了');
        this.get();
      }
    }]);

    return Wathcer;
  }();

  function createElementVNode(vm, tag, data) {
    data = data || {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode(vm, tag, key, data, children);
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
  } // 判断两个虚拟节点是不是同一个


  function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  }

  function patch(oldVnode, vnode) {
    // console.log('oldVnode', oldVnode)
    // console.log('vnode', vnode)
    // 初次渲染
    var isRealElement = oldVnode.nodeType; // 判断是不是真实元素

    if (isRealElement) {
      // 获取真实元素
      var elm = oldVnode; // 拿到父元素

      var parentElm = elm.parentNode;
      var newElm = createElm(vnode);
      parentElm.insertBefore(newElm, elm.nexSibling);
      parentElm.removeChild(elm);
      return newElm;
    } else {
      // diff 算法
      // diff算法是个平级比较的过程 父亲和父亲比较 儿子和儿子比较
      // 1 两节点不是同一个节点 直接删除老的 换上新的 (没有比对了)
      // 2 两个节点是同一个节点 (判断节点的tag和节点的key)
      // 比较两个节点的属性是否有差异 (复用老的节点 将差异的属性更新)
      // 3 节点比较完  开始比较儿子
      console.log(oldVnode);
      console.log(vnode);
      patchVnode(oldVnode, vnode);
    }
  }

  function patchVnode(oldVNode, vnode) {
    if (!isSameVnode(oldVNode, vnode)) {
      // 新老节点不相同 直接用新的替换掉老的
      var el = createElm(vnode);
      oldVNode.el.parentNode.replaceChild(el, oldVNode.el);
      return el;
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        data = vnode.data,
        children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      // 标签
      vnode.el = document.createElement(tag);
      patchProps(vnode.el, data);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function patchProps(el, props) {
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

  function initLifecycle(Vue) {
    Vue.prototype._update = function (vnode) {
      // console.log('upate', vnode)
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };

    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._s = function (val) {
      if (_typeof(val) !== 'object') return val;
      return JSON.stringify(val);
    };

    Vue.prototype._render = function () {
      var vm = this;
      return vm.$options.render.call(vm);
    };
  }
  function mountComponent(vm, el) {
    /*
    // 1 调用render方法 产生虚拟节点
    let VNode = vm._render()
    // 2 将vnode变成真实DOM 放到页面中
    vm._update(VNode)
    */
    callHook(vm, 'beforeMount'); //初始渲染之前

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    new Wathcer(vm, updateComponent, null, true);
    callHook(vm, 'mounted'); //渲染完成之后
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (handler) {
        return handler.call(vm);
      });
    }
  }

  function initMixin(Vue) {
    Vue.prototype.__init = function (options) {
      var vm = this; // vm.$options = options
      // console.log('vm.constructor.options', vm.constructor.options)
      // console.log('options', options)

      vm.$options = mergeOptions(vm.constructor.options, options);
      console.log(vm);
      callHook(vm, 'beforeCreate'); //初始化数据之前

      initState(vm);
      callHook(vm, 'created'); //初始化数据之后

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
        //先找render 没有render 找template
        var tempalte = options.tempalte;

        if (!tempalte && el) {
          //没有template 用外部的html
          el = el.outerHTML;
          var render = compileToFunction(el); // console.log('render', render)

          options.render = render;
        }
      } // 挂载


      mountComponent(vm);
    };
  }

  function Vue(options) {
    this.__init(options);
  }

  initMixin(Vue);
  initLifecycle(Vue);
  initGlobalAPI(Vue); //mixin

  Vue.prototype.$nextTick = nextTick;

  window.onload = function () {
    var render1 = compileToFunction("\n  <ol style = \"color:red\">\n    <li key = 'a'>a</li>\n    <li key=\"b\">b</li>\n    <li key=\"c\">c</li>\n  </ol>");
    var vm1 = new Vue({
      data: {
        name: 'zx'
      }
    });
    var prevVnode = render1.call(vm1);
    var el = createElm(prevVnode);
    document.body.appendChild(el);
    var render2 = compileToFunction("\n  <ul  style = \"color:red\">\n    <li key=\"a\">a</li>\n    <li key=\"b\">b</li>\n    <li key=\"c\">c</li>\n    <li key=\"d\">d</li>\n  </ul>");
    var vm2 = new Vue({
      data: {
        name: 'xm'
      }
    });
    var nextVnode = render2.call(vm2);
    setTimeout(function () {
      patch(prevVnode, nextVnode);
    }, 1000);
  };

  return Vue;

}));
//# sourceMappingURL=vue.js.map
