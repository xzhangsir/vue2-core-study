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
        // 还要让父亲记住自己
        currentParent.children.push(node); // 赋予parent属性

        node.parent = currentParent;
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

    return root;
  }

  function genProps(attrs) {
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

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function gen(node) {
    // 如果子节点是元素
    if (node.type === 1) {
      return codegen(node);
    } else {
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        // 纯文本
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        //_v('name'+_s(name))
        // console.log(text, defaultTagRE.exec(text))
        var tokens = [];
        var match;
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;

        while (match = defaultTagRE.exec(text)) {
          // console.log(match, '----')
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

  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null').concat(ast.children.length ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    // console.log(template)
    // 1 template  转 ast语法树
    var ast = parseHTML(template); // console.log(ast)
    // 2 生成render （返回的就是 虚拟dom）

    var code = codegen(ast); // console.log(code)
    // 模板引擎的实现原理 都是  with  + new Function

    code = "with(this){return ".concat(code, "}");
    var render = new Function(code); // console.log(render.toString())

    return render;
    /*   function anonymous() {
      with (this) {
        return _c(
          'div',
          { id: 'app', style: { color: 'red' } },
          _c('div', { style: { color: 'green' } }, _v('name:' + _s(name))),
          _c('i', null, _v('链接')),
          _c('div', null, _v('age:' + _s(age)))
        )
      }
    } */
  }

  // 策略
  var strats = {};
  var LIFECYCLE = ['beforeCreate', 'created'];
  LIFECYCLE.forEach(function (hook) {
    strats[hook] = function (p, c) {
      if (c) {
        if (p) {
          return p.concat(c);
        } else {
          return [c];
        }
      } else {
        return p;
      }
    };
  }); // 增加处理组件的策略

  strats.components = function (parentVal, childVal) {
    var res = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key]; //返回的是构造的对象 可以拿到父亲原型上的属性 并且将儿子的都拷贝到自己身上
      }
    }

    return res;
  };

  function mergeOptions(parent, child) {
    var options = [];

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      // 策略模式
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key];
      }
    }

    return options;
  }

  function initGlobalAPI(Vue) {
    Vue.options = {
      _base: Vue
    };

    Vue.mixin = function (mixin) {
      // console.log(this.options)
      // console.log(mixin)
      // 蒋用户的选型和全局的options进行合并
      // {} {created:function(){}} => {created:[fn]} //第一次
      // {created:[fn]} {created:[fn]} => {created:[fn,fn]} //再一次
      this.options = mergeOptions(this.options, mixin);
      return this;
    }; // 可以手动创造组件进行挂载


    Vue.extend = function (options) {
      // 实现根据用户的参数 返回一个构造函数
      function Sub() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        //最终使用一个组件 就是new一个实力
        this.__init(options); // 默认对子类进行初始化

      } // Sub.prototype.__proto__ = Vue.prototype
      // 子类继承父类


      Sub.prototype = Object.create(Vue.prototype);
      Sub.prototype.constructor = Sub;
      /*Sub.options = options */
      //保存用户传递的选项

      Sub.options = mergeOptions(Vue.options, options); //用户传递的选项和全局的选项合并下

      return Sub;
    };

    Vue.options.components = {};

    Vue.component = function (id, definition) {
      // 如果definition已经是一个函数了
      if (typeof definition !== 'function') {
        definition = Vue.extend(definition);
      }

      Vue.options.components[id] = definition; // console.log(Vue.options)
    };
  }

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++; // 属性的dep要收集watcher

      this.subs = []; //这里存放这当前属性对应的watcher有哪些
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        /* /这样同样的属性 会重复收集watcher
         this.subs.push(Dep.target)
        console.log(this.subs) */
        Dep.target.addDep(this); //(Dep.target就是当前的watcher)让watcher记住dep
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
  var stack = [];
  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var id = 0; // watcher 是观察者
  // dep 是被观察者
  // dep 变化了会通知观察者watcher更新

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrfn, options, cb) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.renderWatcher = options; //是一个渲染watcher

      if (typeof exprOrfn === 'string') {
        // watch需要的
        this.getter = function () {
          return vm[exprOrfn];
        };
      } else {
        this.getter = exprOrfn; //getter意味着调用这个函数会触发取值操作
      }

      this.deps = []; //视图记录属性

      this.depsId = new Set();
      this.lazy = options.lazy;
      this.dirty = this.lazy; //计算属性缓存标识

      this.vm = vm;
      this.user = options.user; //watch用到：标识是不是用户自己的watcher

      this.cb = cb;
      this.value = this.lazy ? undefined : this.get(); //先初始化一次
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        // 一个组件有多个属性 重复的属性 只记录一次
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.deps.push(dep); //watcher 记住了 dep

          this.depsId.add(id);
          dep.addSub(this); //让dep记住watcher
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        // 获取用户函数的返回值 并且标识为脏
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "get",
      value: function get() {
        /*    //当我们渲染watcher的时候 我们会把当前的渲染watcher放到Dep.target上
        Dep.target = this
        this.getter() //会去vm上取值
        Dep.target = null
        */
        pushTarget(this);
        var value = this.getter.call(this.vm);
        popTarget();
        return value;
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          // 让计算属性watcher也收集渲染watcher
          this.deps[i].depend();
        }
      }
    }, {
      key: "update",
      value: function update() {
        /*console.log('触发watcher更新了')
        this.get() //重新渲染 */
        if (this.lazy) {
          // 如果是计算属性 依赖的值变化了  就标识计算属性是脏的了
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
        /*  // 异步更新
        queueWatcher(this) //将当前的watcher放到队列中 去重
        */

      }
    }, {
      key: "run",
      value: function run() {
        console.log('渲染');
        var oldVal = this.value;
        var newVal = this.get();

        if (this.user) {
          this.cb.call(this.vm, newVal, oldVal);
        }
      }
    }]);

    return Watcher;
  }();

  var queue = [];
  var has = {};
  var pending = false;

  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(function (q) {
      return q.run();
    });
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      queue.push(watcher);
      has[id] = true; // 不管我们的update执行多少次 但是最终只执行一轮刷新操作

      if (!pending) {
        /*  // 异步更新
        setTimeout(flushSchedulerQueue, 0) */
        nextTick(flushSchedulerQueue);
        pending = true;
      }

      console.log(queue);
    }
  } // nextTick  用户可以调用 框架内部也可以调用
  // 所以将cb先存起来 依次执行


  var callbacks = [];
  var waiting = false;

  function flushCallbacks() {
    var cbs = callbacks.slice(0);
    waiting = false;
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
    callbacks.push(cb); // console.log(callbacks)

    if (!waiting) {
      /*  setTimeout(flushCallbacks, 0) */
      timerFunc(); //兼容性的

      waiting = true;
    }
  }
  // 一个视图中 会有多个属性 等同于 多个dep对应一个watcher
  // 同样一个属性可以对应多个视图  即 一个dep对应多个watcher
  // dep和watcher  是多对多的关系

  var isReservedTag = function isReservedTag(tag) {
    // 判断是原始标签还是自定义组件的标签
    return ['a', 'div', 'li', 'button', 'ul', 'span', 'img', 'p'].includes(tag);
  }; // h() _c()


  function createElementVNode(vm, tag, data) {
    // console.log(vm)
    data = data || {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vnode(vm, tag, key, data, children);
    } else {
      // 创造组件的虚拟节点
      var Ctor = vm.$options.components[tag]; // Ctor 可能是个Sub类  还有可能是个组件的obj选项
      // console.log(vm.$options.components)
      // console.log(Ctor)

      return createComponentVNode(vm, tag, key, data, children, Ctor);
    }
  }

  function createComponentVNode(vm, tag, key, data, children, Ctor) {
    if (Ctor && _typeof(Ctor) === 'object') {
      Ctor = vm.$options._base.extend(Ctor);
    }

    data.hook = {
      init: function init(vnode) {
        //稍后创建真实节点的时候 如果是组件则调用此方法
        // 保存组件的实例到虚拟节点上
        var instance = vnode.componentInstance = new vnode.componentOptions.Ctor();
        instance.$mount(); //实例上就会多一个$el
      }
    };
    return vnode(vm, tag, key, data, children, null, {
      Ctor: Ctor
    });
  } // _v()


  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  } // ast做的是语法层面的转化 他描述的是语法本身
  // 我们的虚拟dom 是描述的dom元素 可以增加一些自定义属性

  function vnode(vm, tag, key, data, children, text, componentOptions) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text,
      componentOptions: componentOptions // 组件的构造函数

    };
  } // 判断两个虚拟节点是不是同一个


  function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  }

  function createComponent(vnode) {
    var i = vnode.data;

    if ((i = i.hook) && (i = i.init)) {
      i(vnode); //初始化组件
    }

    if (vnode.componentInstance) {
      return true; //说明是组件
    }
  }

  function createElm(vnode) {
    // console.log(vnode)
    var tag = vnode.tag,
        data = vnode.data,
        children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      // 创建真实元素 也要区分组件还是元素
      if (createComponent(vnode)) {
        // 组件  vnode上就有了 componentInstance.$el
        return vnode.componentInstance.$el;
      } //标签
      // 将真实节点和虚拟节点对应起来


      vnode.el = document.createElement(tag);
      patchProps(vnode.el, {}, data);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      // 文本
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
  function patch(oldVNode, vnode) {
    if (!oldVNode) {
      // 这就是组件的挂载
      return createElm(vnode); //vm.$el 对应的就是组件渲染的结果
    } // console.log(oldVNode, vnode)
    // 初渲染流程


    var isRealElement = oldVNode.nodeType; // 判断是不是真实元素

    if (isRealElement) {
      var elm = oldVNode; //获取真实元素

      var parentElm = elm.parentNode; //拿到父元素

      var newElm = createElm(vnode); // console.log(newElm)

      parentElm.insertBefore(newElm, elm.nexSibling);
      parentElm.removeChild(elm);
      return newElm;
    } else {
      // console.log(oldVNode, vnode)
      // diff 算法
      // diff算法是个平级比较的过程 父亲和父亲比较 儿子和儿子比较
      // 1 两节点不是同一个节点 直接删除老的 换上新的 (没有比对了)
      // 2 两个节点是同一个节点 (判断节点的tag和节点的key)
      // 比较两个节点的属性是否有差异 (复用老的节点 将差异的属性更新)
      // 3 节点比较完  开始比较儿子
      patchVnode(oldVNode, vnode);
    }
  }

  function patchVnode(oldVNode, vnode) {
    if (!isSameVnode(oldVNode, vnode)) {
      // 新老节点不相同 直接用新的替换掉老的
      var _el = createElm(vnode);

      oldVNode.el.parentNode.replaceChild(_el, oldVNode.el);
      return _el;
    }
    /*新老节点相同*/


    var el = vnode.el = oldVNode.el; //复用老节点的元素
    // 文本的情况

    if (!oldVNode.tag) {
      // 是文本
      if (oldVNode.text !== vnode.text) {
        el.textContent = vnode.text;
      }
    } // 标签的情况
    // 比较标签属性


    patchProps(el, oldVNode.data, vnode.data); // console.log(oldVNode, vnode)
    // 比较儿子
    // 1 一方有儿子 一方没有儿子
    // 2 两方都有儿子

    var oldChildren = oldVNode.children || [];
    var newChildren = vnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 完整的diff
      updateChildren(el, oldChildren, newChildren);
    } else if (newChildren.length > 0) {
      // 老的没有  新的有儿子
      mountChildren(el, newChildren);
    } else if (oldChildren.length > 0) {
      // 新的没有 老的有 要删除
      unmountChildren(el);
    } // console.log(oldChildren, newChildren)


    return el;
  }

  function mountChildren(el, newChildren) {
    for (var i = 0; i < newChildren.length; i++) {
      var child = newChildren[i];
      el.appendChild(createElm(child));
    }
  }

  function unmountChildren(el) {
    el.innerHTML = '';
  }

  function updateChildren(el, oldChildren, newChildren) {
    var oldStartIndex = 0;
    var newStartIndex = 0;
    var oldEndIndex = oldChildren.length - 1;
    var newEndIndex = newChildren.length - 1;
    var oldStartVnode = oldChildren[0];
    var newStartVnode = newChildren[0];
    var oldEndVnode = oldChildren[oldEndIndex];
    var newEndVnode = newChildren[newEndIndex]; // console.log(oldStartVnode, newStartVnode)
    // console.log(oldEndVnode, newEndVnode)

    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (child, index) {
        map[child.key] = index;
      });
      return map;
    }

    var map = makeIndexByKey(oldChildren); // console.log(map)

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 双方有一方  头指针大于尾部指针 则停止循环
        // 头头比对
        // 如果是相同节点 则递归比较子节点
        patchVnode(oldStartVnode, newStartVnode); // 从头到尾移动指针

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        // 尾尾比对
        // 如果是相同节点 则递归比较子节点
        patchVnode(oldEndVnode, newEndVnode); // 从尾到头移动指针

        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        // 交叉比对(尾头)  abcd => dabc
        patchVnode(oldEndVnode, newStartVnode);
        el.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 交叉比对(头尾)  abcd => dcba
        patchVnode(oldStartVnode, newEndVnode);
        el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else {
        // 乱序比对  abcd=>bmapcq
        // 根据老的列表做一个映射关系 用新的去老的里面找 找到则移动 找不到则添加 最后多余的删除
        var moveIndex = map[newStartVnode.key];

        if (moveIndex !== undefined) {
          // 找到则移动
          var moveVnode = oldChildren[moveIndex]; // 找到对应的虚拟节点

          el.insertBefore(moveVnode.el, oldStartVnode.el); //

          oldChildren[moveIndex] = undefined; //标识这个节点已经移动了

          patchVnode(moveVnode, newStartVnode); //对比属性和子节点
        } else {
          // 找不到则添加
          el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    } //  abc => abcd   abc => dabc


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var childEl = createElm(newChildren[i]); // el.appendChild(childEl)

        var anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null; //获取下一个元素 可能没有

        el.insertBefore(childEl, anchor); //anchor为null的是 则会认为是appendChild
      }
    } //  abcd => abc dabc => abc


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        if (oldChildren[_i]) {
          var _childEl = oldChildren[_i].el;
          el.removeChild(_childEl);
        }
      }
    }
  }

  function initLifeCycle(Vue) {
    // _c('div',{id:"app",style:{"color":"red"}},_c('div',{style:{"color":"green"}},_v("name:"+_s(name))),_c('i',null,_v("链接")),_c('div',null,_v("age:"+_s(age))))
    Vue.prototype._update = function (vnode) {
      // console.log('update', vnode)
      var vm = this;
      var el = this.$el; // console.log(el)
      // patch  既有初始化的功能 又有更新的功能

      /* vm.$el = patch(el, vnode) */

      var prevVnode = vm._vnode; // 把组件第一次产生的虚拟节点保存到_vnode上

      vm._vnode = vnode;

      if (prevVnode) {
        //prevVnode 有值 说明第一次渲染过了
        // 更新
        vm.$el = patch(prevVnode, vnode);
      } else {
        // 初次渲染
        vm.$el = patch(el, vnode);
      }
    }; // _c('div',{},...children)


    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    }; // _c(text)


    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };

    Vue.prototype._render = function () {
      // 当渲染的时候会去实例中取值 我们就可以将属性和视图绑定在一起了
      // console.log('render')
      var vm = this; // 让with中的this指向vm

      return vm.$options.render.call(vm); //通过ast语法转义后生成的render
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;
    /*   // 1 调用render方法 产生虚拟节点
    let VNode = vm._render() //vm.$options.render()  返回的是虚拟节点
    // 2 根据虚拟dom 产生真实dom
    vm._update(VNode) //虚拟节点转真实节点
    // 3 插入到el元素中 */

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // true 标识是一个渲染watcher


    new Watcher(vm, updateComponent, true); // console.log(watcher)
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (handler) {
        return handler.call(vm);
      });
    }
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
      } // console.log('array 更新')


      ob.dep.notify(); //组件变化了通知对应的watcher更新

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.dep = new Dep();
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

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(target, key, value) {
    var childOb = observe(value); //如果value是对象 再次递归劫持 深度劫持

    var dep = new Dep(); //每个属性都有一个dep与之对应

    Object.defineProperty(target, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend(); //让这个属性的收集器 记住这个watcher

          if (childOb) {
            // 让数组和对象本身也实现依赖收集
            childOb.dep.depend(); // 数组里面套数组

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        } // console.log('来取值了', key)


        return value;
      },
      set: function set(newValue) {
        // console.log('设置值了', key)
        if (newValue === value) return;
        observe(newValue); //如果设置的值是对象 再次代理

        value = newValue;
        dep.notify(); //通知watcher更新
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

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch$1(vm);
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

  function initComputed(vm) {
    // 拿到用户的computed
    var computed = vm.$options.computed; // console.log('computed', computed)
    // const watchers = {}
    // 将计算属性的watcher保存到VM上

    var watchers = vm._computedWatchers = {};

    for (var key in computed) {
      var userDef = computed[key];
      var fn = typeof userDef === 'function' ? userDef : userDef.get; // 如果直接new Watcher 默认fn就会直接执行 加个lazy
      // 将计算属性和watcher对应起来

      watchers[key] = new Watcher(vm, fn, {
        lazy: true
      });
      defineComputed(vm, key, userDef);
    }
  }

  function defineComputed(target, key, userDef) {
    // const getter = typeof userDef === 'function' ? userDef : userDef.get
    var setter = userDef.set || function () {};

    Object.defineProperty(target, key, {
      // get: getter,
      // 不能直接执行getter 需要一个方法来判断这个数据是不是脏的
      get: createComputedGetter(key),
      set: setter
    });
  }

  function createComputedGetter(key) {
    // 我们需要检测是否需要执行这个getter
    return function () {
      // 获取对应属性的watcher
      var watcher = this._computedWatchers[key];

      if (watcher.dirty) {
        // 如果数据是脏的 就去执行用户传入的函数
        watcher.evaluate();
      }

      if (Dep.target) {
        //计算属性出栈后 还有渲染watcher
        // 我应该让计算属性watcher里面的属性 也去收集上层watcher
        watcher.depend();
      }

      return watcher.value;
    };
  }

  function initWatch$1(vm) {
    var watch = vm.$options.watch;

    for (var key in watch) {
      var handler = watch[key];
      console.log(handler);

      if (Array.handler) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher(vm, key, handler) {
    if (typeof handler === 'string') {
      handler = vm[handler];
    }

    return vm.$watch(key, handler);
  }

  function initMixin(Vue) {
    Vue.prototype.__init = function (options) {
      var vm = this; // vm.$options = options //将用户的选项挂载到实例上
      //我们定义的全局指令和过滤器…… 都会挂载到实力上

      vm.$options = mergeOptions(this.constructor.options, options); // console.log(vm.$options)

      callHook(vm, 'beforeCreate'); //初始化状态

      initState(vm);
      callHook(vm, 'created');

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
          // if (el) {
          template = ops.template; // }
        }

        if (template) {
          // 对模板进行编译
          var render = compileToFunction(template);
          ops.render = render;
        }
      }

      mountComponent(vm, el); //组件的挂载
      // console.log(ops.render) //最终可以获取到render方法
    };
  }

  function initWatch(Vue) {
    // watch最终调用的都是这个
    Vue.prototype.$watch = function (exprOrFn, cb) {
      new Watcher(this, exprOrFn, {
        user: true
      }, cb);
    };
  }

  function Vue(options) {
    this.__init(options);
  }

  Vue.prototype.$nextTick = nextTick;
  initMixin(Vue);
  initLifeCycle(Vue);
  initGlobalAPI(Vue);
  initWatch(Vue);
  // 将模板转化为ast语法树
  // 将ast语法树转为render函数
  // 每次数据更新只执行render函数(无须再次执行ast转化的过程)
  // 根据生成的虚拟节点创造真实DOM
  // --------- diff 为了方便观察前后的虚拟节点 测试代码------

  /* let render1 = compileToFunction(`<ul style = "color:red">
    <li key='a'>a</li>
    <li key="b">b</li>
    <li key="c">c</li>
    <li key="d">d</li>
  </ul>`)
  let vm1 = new Vue({ data: { name: 'zx' } })
  let prevVnode = render1.call(vm1)

  let el = createElm(prevVnode)
  document.body.appendChild(el)

  let render2 = compileToFunction(`<ul  style = "color:red">
    <li key="b">b</li>
    <li key="m">m</li>
    <li key="a">a</li>
    <li key="p">p</li>
    <li key="c">c</li>
    <li key="q">q</li>
  </ul>`)
  let vm2 = new Vue({ data: { name: 'xm' } })
  let nextVnode = render2.call(vm2)

  // 直接将新的节点替换掉老的
  //  setTimeout(() => {
  //   let newEl = createElm(nextVnode)
  //   el.parentNode.replaceChild(newEl, el)
  // }, 1000) 

  // diff
  setTimeout(() => {
    patch(prevVnode, nextVnode)
  }, 1000)
   */

  return Vue;

}));
//# sourceMappingURL=vue.js.map
