import { defaultTagRE, parseHTML } from './parse'

function gen(node) {
  if (node.type === 1) {
    return codegen(node)
  } else {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      // 纯文本
      return `_v(${JSON.stringify(text)})`
    } else {
      //有插值表达式
      defaultTagRE.lastIndex = 0
      let match
      let lastIndex = 0
      let tokens = []
      while ((match = defaultTagRE.exec(text))) {
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

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name == 'style') {
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

function codegen(ast) {
  let children = genChildren(ast.children)
  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
  }${ast.children.length ? `,${children}` : ''})`
  return code
}

export function compileToFunction(el) {
  let ast = parseHTML(el)
  // console.log(ast)
  let code = codegen(ast)
  // console.log(code)
  code = `with(this){return ${code}}`
  // console.log('code', code)
  let render = new Function(code)
  return render
}
