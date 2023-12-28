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
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
let root, currentParent //代表根节点 和当前父节点
// 标识元素和文本type
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3
// 栈结构 来表示开始和结束标签
let stack = []
// 解析HTML生成ast
export function parseHTML(html) {
  while (html) {
    // 寻找<
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 说明是开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        // 把解析好的标签名和属性解析生成ast
        handleStartTag(startTagMatch)
        continue
      }
      // 匹配结束标签
      const endTagMatch = html.match(endTag)
      // console.log('endTagMatch', endTagMatch)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        handleEndTag(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      //说明是文本结束的位置
      // console.log('html', html)
      let text = html.substring(0, textEnd)
      if (text) {
        handleChars(text)
        advance(text.length)
      }
    }
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 匹配到了开始标签 就裁掉 eg:<div
      advance(start[0].length)
      // 开始匹配属性
      // end代表结束符号>  如果不是匹配到了结束标签
      // attr 表示匹配的属性
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        attr = {
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        }
        match.attrs.push(attr)
      }
      if (end) {
        //  标签匹配到了>  代表开始标签解析完毕
        advance(1)
        return match
      }
    }
  }
  function handleStartTag({ tagName, attrs }) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }
  // 生成ast方法
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }
  function handleEndTag(tagName) {
    let element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }
  // 对文本进行处理
  function handleChars(text) {
    // 去掉空格
    text = text.replace(/\s/g, '')
    if (text) {
      currentParent.children.push({
        type: TEXT_TYPE,
        text
      })
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  return root
}
