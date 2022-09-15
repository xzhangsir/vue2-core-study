/**
 *
 * <div id="app" class="add num">xin {{msg}}<span>988</span></div>
 * _c(div,{id:app},_v('xin' + _s(msg)),_c)
 *
 *
 */
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

export function generate(ast) {
  let code = `_c(${ast.tag},${
    ast.attrs.length ? `${genPorps(ast.attrs)}` : null
  })`
  console.log(code)
}
