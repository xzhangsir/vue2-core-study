// 对模板进行编译
// const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
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

export function parseHTML(html) {
  // 最终需要转化为一颗抽象语法树
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = []
  let currentParent //永远指向栈中的最后一个
  let root

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
    // 创造一个ast节点
    let node = createASTElement(tag, attrs)
    // 如果root为空 那这个节点就是当前树的根节点
    if (!root) {
      root = node
    }
    if (currentParent) {
      // 还要让父亲记住自己
      currentParent.children.push(node)
      // 赋予parent属性
      node.parent = currentParent
    }
    stack.push(node)
    currentParent = node

    // console.log(tag, attrs)
  }
  function chars(text) {
    text = text.replace(/\s/g, '')
    // 文本直接放到当前指向的节点
    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent
      })
    // console.log(text)
  }
  function end(tag) {
    let node = stack.pop() //弹出最后一个 校验标签是否合法
    currentParent = stack[stack.length - 1]
    // console.log(tag)
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    // console.log(start)
    if (start) {
      const match = {
        tagName: start[1], //标签名
        attrs: []
      }

      advance(start[0].length)
      // console.log(match)
      // console.log(html)
      // 如果不是开始标签的结束 就一直匹配下去
      let attr, end
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
      if (end) {
        advance(end[0].length)
      }
      // console.log(attr)
      // console.log(html)
      // console.log(match)
      return match
    }

    return false //不是开始标签
  }
  while (html) {
    //<div>hello</div>
    //如果indexOf中的索引是0 则说明是标签
    //如果大于0 则说明是文本结束的位置
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      const startTagMatch = parseStartTag() //开始标签的匹配结果
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        // console.log(html)
        continue
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      // 文本内容
      let text = html.substring(0, textEnd)
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  return root
}
