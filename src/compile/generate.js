/**
 *
 * <div id="app" class="add num">xin {{msg}}<span>988</span></div>
 * _c(div,{id:app},_v('xin' + _s(msg)),_c)
 *
 *
 */

import { defaultTagRE } from './parseAst'

// 处理属性
function genPorps(attrs) {
  // console.log(attrs)
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach((item) => {
        if (item) {
          let [key, value] = item.split(':')
          obj[key] = value
        }
      })
      // style="color:#f00;font-size:20px;"
      //          ||
      // {color: '#f00', font-size: '20px'}
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}
// 处理子节点
function genChildren(ast) {
  let children = ast.children
  if (children) {
    return children.map((child) => gen(child)).join(',')
  }
  return null
}
function gen(node) {
  // 文本 或者 标签
  if (node.type === 1) {
    // 标签
    return generate(node)
  } else if (node.type === 3) {
    // 文本  （纯文本和插值表达式）
    let text = node.text
    if (!defaultTagRE.test(text)) {
      // 没有插值的纯文本
      return `_v(${JSON.stringify(text)})`
    } else {
      // 有插值表达式
      let tokens = []
      let lastIndex = (defaultTagRE.lastIndex = 0)
      let match
      while ((match = defaultTagRE.exec(text))) {
        // console.log('match', match)
        let index = match.index
        if (index > lastIndex) {
          // 添加内容
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      // console.log(tokens)
      return `_v(${tokens.join('+')})`
    }
  }
}

export function generate(ast) {
  let children = genChildren(ast)

  let code = `_c(${ast.tag},${
    ast.attrs.length ? `${genPorps(ast.attrs)}` : null
  },${children})`
  console.log(code)
  return code
}
