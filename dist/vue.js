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

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 创建一个ast对象

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

  function parseHTML(html) {
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
    console.log(el); // 1） 将HTML 变成 ast语法树

    var ast = parseHTML(el); // console.log('ast', ast)
    // 2） 将ast语法树变成render函数
    // _c 元素 _v 文本 _s 是表达式
    // 2-1)ast语法树变成字符串

    var code = generate(ast); // console.log('code', code)
    // 2-2)字符串变成函数

    var render = new Function("with(this){return ".concat(code, "}")); // console.log('render', render)

    return render;
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

      console.log('数组劫持', args);
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

      return result;
    };
  });

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

      // 给 value 添加一个属性
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
        var keys = Object.keys(data); // console.log('keys', keys)

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
          observer(arr[i]);
        }
      }
    }]);

    return Observer;
  }(); // 对对象中的属性进行劫持


  function defineReactive(data, key, value) {
    observer(value); //深度递归劫持

    Object.defineProperty(data, key, {
      get: function get() {
        console.log('获取', key);
        return value;
      },
      set: function set(newVal) {
        console.log('设置', newVal);
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

    vm._data = data; // 将data上的属性代理到实例上 vm.msg = vm._data.msg

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 对data数据进行劫持


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

  function patch(oldVnode, vnode) {
    // vnode ->真实dom
    // 1）创建新dom
    var el = createEl(vnode);
    console.log(el); // 2) 新dom替换旧dom

    var parentEL = oldVnode.parentNode;
    parentEL.insertBefore(el, oldVnode.nextsibling);
    parentEL.removeChild(oldVnode);
    return el;
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
    //vm._render 1）将render函数 变成vnode
    //vm._update 2）将vnode变成真实DOM 放到页面中
    vm._update(vm._render());
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // vnode变成真实DOM
      var vm = this;
      console.log(vm); // 旧dom  虚拟dom

      vm.$el = patch(vm.$el, vnode);
    };
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // console.log('options', options)
      var vm = this;
      vm.$options = options; // 初始化状态

      initState(vm); // 模板渲染

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

            var render = compileToFunction(el);
            console.log(render);
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
      var vnode = render.call(vm);
      console.log('vnode', vnode);
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

  return Vue;

}));
//# sourceMappingURL=vue.js.map
