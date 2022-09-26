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
    // 创建一个ast节点
    let node = createASTElement(tag, attrs)
    // console.log('node', node)
    if (!root) {
      // 如果root为空 那这个节点就是当前树的根节点
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
  // 处理开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen)
    // console.log('start', start)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let attr, end
      //  如果不是开始标签的结束 就一直匹配下去
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      // console.log('end', end)
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }
  while (html) {
    // <div>hello</div>
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 说明是标签
      const startTagMatch = parseStartTag()
      // console.log('startTagMatch', startTagMatch)
      // console.log('剩余的HTML', html)
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
      //说明是文本结束的位置
      // console.log('html', html)
      let text = html.substring(0, textEnd)
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  return root
}
