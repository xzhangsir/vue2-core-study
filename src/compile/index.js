import { generate } from './generate'
import { parseHTML } from './parseAst'

export function compileToFunction(el) {
  console.log(el)
  // 1） 将HTML 变成 ast语法树
  let ast = parseHTML(el)
  // console.log('ast', ast)
  // 2） 将ast语法树变成render函数
  // _c 元素 _v 文本 _s 是表达式
  // 2-1)ast语法树变成字符串
  let code = generate(ast)
  // console.log('code', code)
  // 2-2)字符串变成函数
  let render = new Function(`with(this){return ${code}}`)
  // console.log('render', render)
  return render
}
