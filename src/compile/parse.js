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
export function parseHTML(html) {
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = []
  let root
  let currentParent //永远指向栈中的最后一个
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs)
    if (!root) {
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
  }
  function end() {
    stack.pop()
    currentParent = stack[stack.length - 1]
  }
  function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent
      })
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    // console.log('start', start)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      // 如果不是开始标签的结束 就一直匹配下去
      let attr, end
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[2])
        continue
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  return root
}
