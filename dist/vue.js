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

  function isObject(data) {
    return data !== null && _typeof(data) === 'object';
  }

  // 定义生命周期
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {}; // 存放所有策略

  LIFECYCLE_HOOKS.forEach(function (hook) {
    // 创建生命周期的合并策略
    strats[hook] = function (parentVal, childVal) {
      if (childVal) {
        if (parentVal) {
          return parentVal.concat(childVal);
        } else {
          if (Array.isArray(childVal)) {
            return childVal;
          } else {
            return [childVal];
          }
        }
      } else {
        return parentVal;
      }
    };
  });
  strats.components = function (parentVal, childVal) {
    var res = Object.create(parentVal);
    if (childVal) {
      for (var k in childVal) {
        res[k] = childVal[k];
      }
    }
    return res;
  };
  function mergeOptions(parentVal, childVal) {
    // console.log(parentVal, childVal)
    var options = {};
    for (var key in parentVal) {
      mergeFiled(key);
    }
    for (var _key in childVal) {
      if (!parentVal.hasOwnProperty(_key)) {
        mergeFiled(_key);
      }
    }
    function mergeFiled(key) {
      if (strats[key]) {
        options[key] = strats[key](parentVal[key], childVal[key]);
      } else {
        // 默认合并方法：优先使用新值覆盖老值
        options[key] = childVal[key] || parentVal[key];
      }
    }
    return options;
  }
  function isReservedTag(tagName) {
    // 定义常见标签
    var str = 'html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot';
    var obj = {};
    str.split(',').forEach(function (tag) {
      obj[tag] = true;
    });
    return obj[tagName];
  }

  function initGlobalAPI(Vue) {
    // 全局属性：Vue.options
    // 功能：存放 mixin, component, filte, directive 属性
    Vue.options = {
      _base: Vue
    };
    Vue.options.components = {};
    Vue.mixin = function (options) {
      this.options = mergeOptions(this.options, options);
      // console.log(this.options)
      return this;
    };
    var cid = 0;
    Vue.extend = function (options) {
      var Super = this;
      var Sub = function Sub(options) {
        this.__init(options);
      };
      Sub.cid = cid++;
      Sub.prototype = Object.create(Super.prototype);
      // Object.create 会产生一个新的实例作为子类的原型，导致constructor指向错误
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(this.options, options);
      return Sub;
    };
    Vue.component = function (id, definition) {
      if (typeof definition !== 'function') {
        definition = Vue.extend(definition);
      }
      Vue.options.components[id] = definition;
    };
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
    if (isReservedTag(tag)) {
      return vnode(vm, tag, data.key, data, children, undefined);
    } else {
      var Ctor = vm.$options.components[tag];
      return createComponentVNode(vm, tag, data, data.key, children, Ctor);
    }
  }
  function createComponentVNode(vm, tag, data, key, children, Ctor) {
    // 局部组件定义不会被Vue.extend处理成为组件
    if (isObject(Ctor)) {
      // 处理局部组件
      Ctor = vm.$options._base.extend(Ctor);
    }
    data.hook = {
      init: function init(vnode) {
        //稍后创建真实节点的时候 如果是组件则调用此方法
        var child = vnode.componentInstance = new Ctor({
          _isComponent: true
        }); //实例化组件
        child.$mount(); //因为没有传入el属性  需要手动挂载 为了在组件实例上面增加$el方法可用于生成组件的真实渲染节点
      }
    };

    return vnode(vm, tag, key, data, children, null, {
      Ctor: Ctor
    });
  }
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function vnode(vm, tag, key, data, children, text) {
    var componentOptions = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  }
  function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  }

  function patch(oldVnode, vnode) {
    if (!oldVnode) {
      // 组件的创建过程是没有el属性的
      return createElm(vnode);
    }
    // console.log('oldVnode', oldVnode)
    // console.log('vnode', vnode)
    // 初次渲染
    var isRealElement = oldVnode.nodeType;
    // console.log(isRealElement)
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
    } else {
      // diff
      patchVnode(oldVnode, vnode);
    }
  }
  function patchVnode(oldVnode, vnode) {
    if (!isSameVnode(oldVnode, vnode)) {
      // 新老节点不相同 直接用新的替换掉老的
      var _el = createElm(vnode);
      oldVnode.el.parentNode.replaceChild(_el, oldVnode.el);
      return _el;
    }
    // 旧节点是一个文本
    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        oldVnode.el.textContent = vnode.text;
      }
    }
    // 不符合上面两种 代表新老标签一致 并且不是文本节点
    // 为了节点复用 所以直接把旧的虚拟dom对应的真实dom赋值给新的虚拟dom的el属性
    var el = vnode.el = oldVnode.el;
    // 更新属性
    updateProperties(el, oldVnode.data, vnode.data);
    // 比较子节点
    var oldChildren = oldVnode.children || [];
    var newChildren = vnode.children || [];
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // diff核心
      // 新老都存在子节点
      updateChildren(el, oldChildren, newChildren);
    } else if (newChildren.length > 0) {
      // 老的没有儿子  新的有儿子  创建新的儿子
      for (var i = 0; i < newChildren.length; i++) {
        var child = newChildren[i];
        el.appendChild(createElm(child));
      }
    } else if (oldChildren.length > 0) {
      el.innerHTML = '';
    }
    return el;
  }
  function updateChildren(el, oldChildren, newChildren) {
    var oldStartIndex = 0;
    var newStartIndex = 0;
    var oldEndIndex = oldChildren.length - 1;
    var newEndIndex = newChildren.length - 1;
    var oldStartVnode = oldChildren[0];
    var newStartVnode = newChildren[0];
    var oldEndVnode = oldChildren[oldEndIndex];
    var newEndVnode = newChildren[newEndIndex];
    // 根据key来创建老的儿子的index映射表  类似 {'a':0,'b':1} 代表key为'a'的节点在第一个位置 key为'b'的节点在第二个位置
    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        map[item.key] = index;
      });
      return map;
    }
    // 根据旧的节点生成 key和index的映射表 用于乱序比对
    var map = makeIndexByKey(oldChildren);
    // 只有当新老儿子的双指标的起始位置不大于结束位置的时候  才能循环 一方停止了就需要结束循环
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      // 因为乱序对比过程把移动的vnode置为 undefined 如果不存在vnode节点 直接跳过
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 头头比较
        // 递归比较儿子及儿子的子节点
        patch(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        // 尾尾比较
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 交叉比对 老的头和新的尾比较  abcd=>
        //                            dcba
        patch(oldStartVnode, newEndVnode);
        el.insertBefore(oldStartVnode.el, oldEndVnode.el.nexSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        // 交叉比对 旧的尾和新的头比较  abcd =>
        //                            dcba
        patch(oldEndVnode, newStartVnode);
        el.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        var moveIndex = map[newStartVnode.key];
        if (moveIndex !== undefined) {
          var moveVnode = oldChildren[moveIndex];
          oldChildren[moveIndex] = undefined;
          el.insertBefore(moveVnode.el, oldStartVnode.el);
          patch(moveVnode, oldStartVnode);
        } else {
          el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        }
        newStartVnode = newChildren[++newStartIndex];
      }
    }
    // 如果老节点循环完毕了 但是新节点还有  证明  新节点需要被添加到头部或者尾部
    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var childEl = createElm(newChildren[i]);
        var anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null;
        //anchor为null的时候 等同于appendChild
        el.insertBefore(childEl, anchor);
      }
    }
    // 如果新节点循环完毕 老节点还有  证明老的节点需要直接被删除
    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var _childEl = oldChildren[_i].el;
        el.removeChild(_childEl);
      }
    }
  }
  // 判断是不是组件
  function createComponent(vnode) {
    // 初始化组件
    // 创建组件实例
    var i = vnode.data;
    // 调用组件data.hook.init方法进行组件初始化过程 最终组件的vnode.componentInstance.$el就是组件渲染好的真实dom
    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    }
    // 如果组件实例化完毕有componentInstance属性 那证明是组件
    if (vnode.componentInstance) {
      return true;
    }
  }
  function createElm(vnode) {
    var tag = vnode.tag,
      data = vnode.data,
      children = vnode.children,
      text = vnode.text;
    // 通过 tag 判断当前节点是元素 or 文本,判断逻辑：文本 tag 是 undefined
    if (typeof tag === 'string') {
      if (createComponent(vnode)) {
        // 如果是组件 返回真实组件渲染的真实dom
        return vnode.componentInstance.$el;
      }
      vnode.el = document.createElement(tag); // 创建元素的真实节点
      // 处理 data 属性
      updateProperties(vnode.el, {}, data);
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
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
    }
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
      // this.$el = patch(this.$el, vnode)
      var vm = this;
      var prevVnode = vm._vnode;
      vm._vnode = vnode;
      if (!prevVnode) {
        vm.$el = patch(vm.$el, vnode);
      } else {
        vm.$el = patch(prevVnode, vnode);
      }
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
    callHook(vm, 'beforeMount');
    new Watcher(vm, updateComponent, function () {}, true);
    // 当视图挂载完成，调用钩子: mounted
    callHook(vm, 'mounted');
  }
  //从$options取对应的生命周期函数数组并执行
  function callHook(vm, hook) {
    // 获取生命周期对应函数数组
    var handlers = vm.$options[hook];
    if (handlers) {
      handlers.forEach(function (fn) {
        fn.call(vm); // 生命周期中的 this 指向 vm 实例
      });
    }
  }

  function initMixin(Vue) {
    Vue.prototype.__init = function (options) {
      var vm = this;
      // vm.$options = options
      // 此时需使用 options 与 mixin 合并后的全局 options 再进行一次合并
      // console.log(vm.constructor.options, options)
      vm.$options = mergeOptions(vm.constructor.options, options);
      // console.log(vm.$options)
      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');
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
  initGlobalAPI(Vue);
  Vue.prototype.$nextTick = nextTick;

  /*
  window.onload = function () {
    let render1 = compileToFunction(`
    <ul style = "color:red">
      <li key = 'a'>a</li>
      <li key="b">b</li>
      <li key="c">c</li>
    </ul>`)
    let vm1 = new Vue({ data: { name: 'zx' } })
    let prevVnode = render1.call(vm1)
    let el = createElm(prevVnode)
    document.body.appendChild(el)

    let render2 = compileToFunction(`
    <ul  style = "color:red">
      <li key="a">a</li>
      <li key="b">b</li>
      <li key="c">c</li>
      <li key="d">d</li>
    </ul>`)
    let vm2 = new Vue({ data: { name: 'xm' } })
    let nextVnode = render2.call(vm2)

    setTimeout(() => {
      patch(prevVnode, nextVnode)
    }, 1000)
  }
  */

  return Vue;

}));
//# sourceMappingURL=vue.js.map
