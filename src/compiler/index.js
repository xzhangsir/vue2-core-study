import { defaultTagRE, parseHTML } from './parse'

export function compileToFunctions(template) {
  // template  转 ast语法树
  let ast = parseHTML(template)
  // console.log('ast', ast)
  // 通过ast 重新生成代码
  let code = codegen(ast)
  // console.log('code', code)
  // _c('div',{id:"a",style:{"color":"red"}},_v("hello"),_c('span',{class:"b"},_v(_s(word)+"ww"+_s(username))))
  let render = new Function(`with(this){return ${code}}`)
  return render
}

function codegen(ast) {
  let children = genChildren(ast.children)
  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? getProps(ast.attrs) : 'null'
  }${ast.children.length ? `,${children}` : ''})`
  return code
}

function genChildren(children) {
  if (children) {
    return children.map((child) => gen(child)).join(',')
  }
}

function gen(node) {
  if (node.type === 1) {
    // 子节点是元素
    return codegen(node)
  } else {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      // 纯文本
      return `_v(${JSON.stringify(text)})`
    } else {
      // 有插值表达式
      defaultTagRE.lastIndex = 0
      let match
      let lastIndex = 0
      let tokens = []
      while ((match = defaultTagRE.exec(text))) {
        // console.log('match', match)
        let index = match.index
        // {{name}}xixi{{age}}
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      // {{name}}xixix
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function getProps(attrs) {
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
