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
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed']; // 组件 指令 过滤器

  var ASSETS_TYPE = ['component', 'directive', 'filter']; // 策略

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
  } // 组件 指令 过滤器的合并策略


  function mergeAssets(parentVal, childVal) {
    //比如有同名的全局组件和自己定义的局部组件 那么parentVal代表全局组件 自己定义的组件是childVal  首先会查找自已局部组件有就用自己的  没有就从原型继承全局组件  res.__proto__===parentVal
    var res = Object.create(parentVal);

    if (childVal) {
      for (var k in childVal) {
        // /返回的是构造的对象 可以拿到父亲原型上的属性 并且将儿子的都拷贝到自己身上
        res[k] = childVal[k];
      }
    }

    return res;
  } // 定义组件的合并策略


  ASSETS_TYPE.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });
  function mergeOptions(parent, child) {
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
      // console.log(strats, k)
      if (strats[k]) {
        options[k] = strats[k](parent[k], child[k]);
      } else {
        // 默认策略
        options[k] = child[k] ? child[k] : parent[k];
      }
    }

    return options;
  } // 判断是不是对象

  function isObject(data) {
    if (_typeof(data) !== 'object' || data === null) {
      return false;
    }

    return true;
  } //判断是不是常规html标签

  function isReservedTag(tagName) {
    // 定义常见标签
    var str = 'html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot';
    var obj = {};
    str.split(',').forEach(function (tag) {
      obj[tag] = true;
    });
    return obj[tagName];
  } // 是否是合格的数组索引

  function isValidArrayIndex(val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val);
  } // 伪数组转真数组

  function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var res = new Array(i);

    while (i--) {
      res[i] = list[i + start];
    }

    return res;
  }

  function initAssetRegisters(Vue) {
    ASSETS_TYPE.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (type === 'component' && typeof definition !== 'function') {
          // 全局组件注册
          // 子组件可能也有extend方法
          definition = this.options._base.extend(definition);
        }

        this.options[type + 's'][id] = definition;
      };
    });
  }

  function initExtend(Vue) {
    var cid = 0; //组件的唯一标识

    Vue.extend = function (options) {
      function Sub(options) {
        this.__init(options);
      }

      Sub.cid = cid++; // 子类继承父类
      // 子类的原型指向父类

      Sub.prototype = Object.create(this.prototype); // constructor 指向自己

      Sub.prototype.constructor = Sub; //合并自己的options和父类的options

      Sub.options = mergeOptions(this.options, options);
      return Sub;
    };
  }

  function initUse(Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = this._installedPlugins || (this._installedPlugins = []);

      if (installedPlugins.indexOf(plugin) > -1) {
        // 如果这个插件安装过 就直接返回
        return this;
      } // 伪数组转真数组


      var args = toArray(arguments, 1);
      args.unshift(this); //在参数中添加vue的构造函数
      // 把自身 Vue 传到插件的 install 方法 这样可以避免第三方插件强依赖 Vue

      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args); //执行install方法
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args); //没有install方法直接把传入的插件执行
      } // 记录安装的插件


      installedPlugins.push(plugin);
      return this;
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {
      _base: Vue
    };

    Vue.mixin = function (mixin) {
      // 将用户的选型和全局的options进行合并
      // {} {created:function(){}} => {created:[fn]} //第一次
      // {created:[fn]} {created:[fn]} => {created:[fn,fn]} //再一次
      this.options = mergeOptions(this.options, mixin);
      return this;
    };

    ASSETS_TYPE.forEach(function (type) {
      Vue.options[type + 's'] = {};
    }); // Vue.extend方法定义

    initExtend(Vue); //assets注册方法 包含组件 指令和过滤器

    initAssetRegisters(Vue);
    initUse(Vue); //vue.use
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
        value: this,
        writable: true,
        configurable: true
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
      enumerable: true,
      configurable: true,
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

  function set(target, key, val) {
    // 如果是数组 直接调用我们重写的splice方法 可以刷新视图
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    } // 如果是对象本身的属性 则直接添加


    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val;
    }

    var ob = target.__ob__; // 如果对象本身就不是响应式 不需要将其定义成响应式属性

    if (!ob) {
      target[key] = val;
      return val;
    }

    defineReactive(target, key, val);
    ob.dep.notify();
    return val;
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

      this.user = options.user; //watch用到：标识是不是用户自己的watcher

      this.lazy = options.lazy; //标识计算属性watcher

      this.dirty = this.lazy; //dirty可变  表示计算watcher是否需要重新计算 默认值是true

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else if (typeof exprOrFn === 'string') {
        //用户watcher传过来的可能是一个字符串   类似a.a.a.a.b
        this.getter = function () {
          var path = exprOrFn.split('.');
          var obj = vm;

          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }

          return obj;
        };
      } // 实例化就会默认调用get方法
      // 非计算属性实例化就会默认调用get方法 进行取值  保留结果 计算属性实例化的时候不会去调用get


      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Wathcer, [{
      key: "get",
      value: function get() {
        // 在调用方法之前先把当前watcher实例推到全局Dep.target上
        pushTarget(this); //如果watcher是渲染watcher 那么就相当于执行  vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集

        var res = this.getter.call(this.vm); // 在调用方法之后把当前watcher实例从全局Dep.target移除

        popTarget();
        return res;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addWatcher(this);
        }
      } // 更新

    }, {
      key: "update",
      value: function update() {
        // 计算属性依赖的值发生变化 只需要把dirty置为true  下次访问到了重新计算
        if (this.lazy) {
          this.dirty = true;
        } else {
          /*
            console.log('我更新了')
            this.get() 
          */
          // 异步更新 每次watcher更新的时候 先将它用一个队列缓存起来 之后再一起调用
          queueWatcher(this);
        }
      } //   计算属性重新进行计算 并且计算完成把dirty置为false

    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "depend",
      value: function depend() {
        // 计算属性的watcher存储了依赖项的dep
        var i = this.deps.length;

        while (i--) {
          //调用依赖项的dep去收集渲染watcher
          this.deps[i].depend();
        }
      }
    }, {
      key: "run",
      value: function run() {
        // this.get()
        var oldVal = this.value; //老值

        var newVal = this.get(); //新值

        this.value = newVal; //现在的新值将成为下一次变化的老值
        // console.log(oldVal, newVal)

        if (this.user) {
          // 如果两次的值不相同  或者值是引用类型 因为引用类型新老值是相等的 他们是指向同一引用地址
          if (newVal !== oldVal || isObject(newVal)) {
            this.cb.call(this.vm, newVal, oldVal);
          }
        } else {
          // 真正的触发更新
          console.log('我真正的更新了'); // this.cb.call(this.vm)

          this.get();
        }
      }
    }]);

    return Wathcer;
  }();

  function initState(vm) {
    var options = vm.$options; // console.log(vm)

    if (options.data) {
      initData(vm);
    }

    if (options.watch) {
      initWatch$1(vm);
    }

    if (options.computed) {
      initComputed(vm);
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

  function initWatch$1(vm) {
    var watch = vm.$options.watch; // console.log('watch', watch)

    var _loop = function _loop(k) {
      //用户自定义watch的写法可能是数组 对象 函数 字符串
      var handler = watch[k];

      if (Array.isArray(handler)) {
        // 如果是数组就遍历进行创建
        handler.forEach(function (handle) {
          createWatcher(vm, k, handle);
        });
      } else {
        createWatcher(vm, k, handler);
      }
    };

    for (var k in watch) {
      _loop(k);
    }
  }

  function initComputed(vm) {
    var computed = vm.$options.computed; // 将计算属性的watcher保存到vm上

    var watchers = vm._computedWatchers = {};

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get; // 如果直接new Watcher 默认fn就会直接执行 加个lazy
      // 将计算属性和watcher对应起来

      watchers[key] = new Wathcer(vm, getter, function () {}, {
        lazy: true
      });
      defineComputed(vm, key, userDef);
    }
  }

  function createWatcher(vm, exprOrFn, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (isObject(handler)) {
      options = handler; //保存用户传入的对象

      handler = handler.handler; //这个代表真正用户传入的函数
    }

    if (typeof handler === 'string') {
      handler = vm[handler];
    }

    return vm.$watch(exprOrFn, handler, options);
  }

  function defineComputed(target, key, userDef) {
    var setter = userDef.set || function () {};

    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      // 判断这个数据是不是脏的
      get: createComputedGetter(key),
      set: setter
    });
  }

  function createComputedGetter(key) {
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
        watcher.depend(1);
      }

      return watcher.value;
    };
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

  function createElementVNode(vm, tag, data) {
    data = data || {};
    var key = data.key; // if (key) {
    //   delete data.key
    // }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      // 如果是普通标签
      return vnode(vm, tag, key, data, children);
    } else {
      // 否则就是组件
      var Ctor = vm.$options.components[tag]; //获取组件的构造函数

      return createComponentVNode(vm, tag, data, key, children, Ctor);
    }
  }

  function createComponentVNode(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      //   如果没有被改造成构造函数
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
  } // 判断两个虚拟节点是不是同一个


  function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  }

  function patch(oldVnode, vnode) {
    if (!oldVnode) {
      // 组件的创建过程是没有el属性的
      return createElm(vnode);
    } // console.log('oldVnode', oldVnode)
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
      // console.log('oldVnode', oldVnode)
      // console.log('newvnode', vnode)
      patchVnode(oldVnode, vnode);
    }
  }

  function patchVnode(oldVNode, vnode) {
    if (!isSameVnode(oldVNode, vnode)) {
      // 新老节点不相同 直接用新的替换掉老的
      var _el = createElm(vnode);

      oldVNode.el.parentNode.replaceChild(_el, oldVNode.el);
      return _el;
    } //如果旧节点是一个文本节点


    if (!oldVNode.tag) {
      if (oldVNode.text !== vnode.text) {
        oldVNode.el.textContent = vnode.text;
      }
    } // 不符合上面两种 代表新老标签一致 并且不是文本节点
    // 为了节点复用 所以直接把旧的虚拟dom对应的真实dom赋值给新的虚拟dom的el属性


    var el = vnode.el = oldVNode.el; // 更新属性

    patchProps(el, oldVNode.data, vnode.data); // 开始比较子节点

    var oldChildren = oldVNode.children || [];
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
      // 新的没有 老的有 删除老的
      el.innerHTML = '';
    }

    return el;
  } // diff核心 双指针


  function updateChildren(el, oldChildren, newChildren) {
    // console.log(el, oldChildren, newChildren)
    var oldStartIndex = 0;
    var newStartIndex = 0;
    var oldEndIndex = oldChildren.length - 1;
    var newEndIndex = newChildren.length - 1;
    var oldStartVnode = oldChildren[0];
    var newStartVnode = newChildren[0];
    var oldEndVnode = oldChildren[oldEndIndex];
    var newEndVnode = newChildren[newEndIndex]; // 根据key来创建老的儿子的index映射表  类似 {'a':0,'b':1} 代表key为'a'的节点在第一个位置 key为'b'的节点在第二个位置

    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        map[item.key] = index;
      });
      return map;
    } // 根据旧的节点生成 key和index的映射表 用于乱序比对


    var map = makeIndexByKey(oldChildren); // 只有当新老儿子的双指标的起始位置不大于结束位置的时候  才能循环 一方停止了就需要结束循环

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
        // 乱序比对  abcd=>bmapcq
        // 根据老的列表做一个映射关系 用新的去老的里面找 找到则移动 找不到则添加 最后多余的删除
        // 再把所有旧子节点的 key 做一个映射到旧节点下标的 key -> index 表，然后用新 vnode 的 key 去找出在旧节点中可以复用的位置。
        var moveIndex = map[newStartVnode.key];

        if (moveIndex !== undefined) {
          // 新的节点可以在旧节点中找到则移动
          var moveVnode = oldChildren[moveIndex]; //占位操作 避免数组塌陷  防止老节点移动走了之后破坏了初始的映射表位置

          oldChildren[moveIndex] = undefined; //把找到的节点移动到最前面

          el.insertBefore(moveVnode.el, oldStartVnode.el);
          patch(moveVnode, newStartVnode);
        } else {
          // 新的节点在旧节点中找不到则添加
          el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    } // 如果老节点循环完毕了 但是新节点还有  证明  新节点需要被添加到头部或者尾部


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var childEl = createElm(newChildren[i]);
        var anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null; //anchor为null的时候 等同于appendChild

        el.insertBefore(childEl, anchor);
      }
    } // 如果新节点循环完毕 老节点还有  证明老的节点需要直接被删除


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var _childEl = oldChildren[_i].el;
        el.removeChild(_childEl);
      }
    }
  } // 判断是否是组件Vnode


  function createComponent(vnode) {
    // 初始化组件
    // 创建组件实例
    var i = vnode.data; // 调用组件data.hook.init方法进行组件初始化过程 最终组件的vnode.componentInstance.$el就是组件渲染好的真实dom

    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    } // 如果组件实例化完毕有componentInstance属性 那证明是组件


    if (vnode.componentInstance) {
      return true;
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        data = vnode.data,
        children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      if (createComponent(vnode)) {
        // 如果是组件 返回真实组件渲染的真实dom
        return vnode.componentInstance.$el;
      } // 标签


      vnode.el = document.createElement(tag);
      patchProps(vnode.el, {}, data);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function patchProps(el) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // 老的属性中有  新的没有 要删除老的 样式和其它属性
    var oldStyles = oldProps.style || {};
    var newStyles = props.style || {};

    for (var key in oldStyles) {
      if (!newStyles[key]) {
        // 新的样式没有这个key 直接清空
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

  function initLifecycle(Vue) {
    Vue.prototype._update = function (vnode) {
      // console.log('upate', vnode)
      var vm = this; // vm.$el = patch(vm.$el, vnode)
      // 保留上一个的vnode

      var prevVnode = vm._vnode;
      vm._vnode = vnode;

      if (!prevVnode) {
        // 初次渲染
        vm.$el = patch(vm.$el, vnode);
      } else {
        // 上次和本次的进行diff更新
        vm.$el = patch(prevVnode, vnode);
      }
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
        var template = options.template;

        if (!template && el) {
          //没有template 用外部的html
          el = el.outerHTML;
          var render = compileToFunction(el); // console.log('render', render)

          options.render = render;
        }

        if (template) {
          var _render = compileToFunction(template);

          options.render = _render;
        }
      } // 挂载


      mountComponent(vm);
    };
  }

  function initWatch(Vue) {
    Vue.prototype.$watch = function (exprOrFn, cb, options) {
      // console.log("exprOrFn",exprOrFn)
      // console.log('cb', cb)
      var vm = this; //  user: true 这里表示是一个用户watcher

      new Wathcer(vm, exprOrFn, cb, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      })); // 如果有immediate属性 代表需要立即执行回调

      if (options && options.immediate) {
        cb(); //如果立刻执行
      }
    };
  }

  var Vue$1;
  var Store = /*#__PURE__*/function () {
    function Store(options) {
      _classCallCheck(this, Store);

      console.log(options); // this.state = options.state

      this._vm = new Vue$1({
        data: {
          state: options.state
        }
      });
    }

    _createClass(Store, [{
      key: "state",
      get: function get() {
        return this._vm.state;
      }
    }]);

    return Store;
  }(); // 实现store放到每一个使用的组件中

  function install(_Vue) {
    // Vue 已经存在并且相等，说明已经Vuex.use过
    if (Vue$1 && Vue$1._Vue === Vue$1) {
      return false;
    }

    Vue$1 = _Vue;
    Vue$1.mixin({
      beforeCreate: function beforeCreate() {
        var options = this.$options;

        if (options.store) {
          // 根实例
          this.$store = options.store;
        } else {
          // 其他
          this.$store = this.$parent && this.$parent.$store;
        }
      }
    });
  }

  var Vuex = {
    Store: Store,
    install: install
  };

  function Vue(options) {
    this.__init(options);
  }

  initMixin(Vue);
  initLifecycle(Vue);
  initGlobalAPI(Vue); //mixin

  initWatch(Vue); //watch

  Vue.prototype.$nextTick = nextTick;
  Vue.$set = set;
  Vue.use(Vuex);
  Vue._Vuex = Vuex; // ----diff-----为了方便观察前后的虚拟节点 测试代码------

  /* window.onload = function () {
    let render1 = compileToFunction(`
    <ul style = "color:green">
      <li key="e">e</li>
      <li key="d">d</li>
      <li key="a">a</li>
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
    }, 3000)
  }
   */

  return Vue;

}));
//# sourceMappingURL=vue.js.map
