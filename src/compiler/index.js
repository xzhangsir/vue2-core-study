import { parseHTML } from './parse'

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function gen(node) {
  // 如果子节点是元素
  if (node.type === 1) {
    return codegen(node)
  } else {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      // 纯文本
      return `_v(${JSON.stringify(text)})`
    } else {
      //_v('name'+_s(name))
      // console.log(text, defaultTagRE.exec(text))
      let tokens = []
      let match
      defaultTagRE.lastIndex = 0
      let lastIndex = 0
      while ((match = defaultTagRE.exec(text))) {
        // console.log(match, '----')
        let index = match.index
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)

        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genChildren(children) {
  if (children) {
    return children.map((child) => gen(child)).join(',')
  }
}

function codegen(ast) {
  let children = genChildren(ast.children)
  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
  }${ast.children.length ? `,${children}` : ''})`

  return code
}

export function compileToFunction(template) {
  // 1 template  转 ast语法树
  let ast = parseHTML(template)
  console.log(ast)
  // 2 生成render （返回的就是 虚拟dom）
  // console.log(template)
  console.log(codegen(ast))
}
