// 标签名
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// <span:xx>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 属性  第一个分组是属性的key  value在分组 3/4/5中
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// <br/>
const startTagClose = /^\s*(\/?)>/
// {{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 创建一个ast对象
function createASTElement(tag, attrs) {
  return {
    tag, //元素
    attrs, //属性
    children: [], //子节点
    type: 1, //元素类型(标签 1)
    parent: null
  }
}

let root //根元素
let currentParent //当前的父亲
let stack = []

function start(tag, attrs) {
  // 开始标签
  console.log('开始标签', tag, attrs)
  let element = createASTElement(tag, attrs)
  if (!root) {
    root = element
  }
  currentParent = element
  stack.push(element)
}
function charts(text) {
  // 文本
  console.log('文本', text)
  text = text.replace(/s/g, '')
  if (text) {
    currentParent.children.push({
      type: 3, //元素类型(文本 3)
      text
    })
  }
}
function end(tag) {
  // 结束标签
  console.log('结束标签', tag)
  let element = stack.pop()
  currentParent = stack[stack.length - 1]

  if (currentParent) {
    element.parent = currentParent.tag
    currentParent.children.push(element)
  }
}

function parseHTML(html) {
  while (html) {
    // 判断标签
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 1) 开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 2) 结束标签
      let endTagMatch = html.match(endTag)
      // console.log(endTagMatch)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    // 文本
    let text
    if (textEnd > 0) {
      // console.log(textEnd)
      // 获取文本内容
      text = html.substring(0, textEnd)
      charts(text)
      // console.log(text)
    }
    if (text) {
      advance(text.length)
    }
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      // console.log(start)
      // 创建ast语法树
      let match = {
        tagName: start[1],
        attrs: []
      }
      // 删除开始标签 <div
      advance(start[0].length)
      let attr, end
      // 处理属性
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        // 删除属性
        advance(attr[0].length)
        // break
      }
      if (end) {
        // 删掉 >
        advance(end[0].length)
        return match
      }
    }
  }
  function advance(n) {
    html = html.substring(n)
    // console.log(html)
  }
  console.log(root)
  return root
}

export function compileToFunction(el) {
  console.log(el)
  let ast = parseHTML(el)
}
