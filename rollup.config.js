import babel from 'rollup-plugin-babel'
// npm install @rollup/plugin-node-resolve  //引用文件的时候 就没有必要写indedx了
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.js', //入口
  output: {
    file: './dist/vue.js', //出口
    name: 'Vue',
    format: 'umd', //esm commonjs iife自执行函数  umd（commonjs amd）
    sourcemap: true //方便调试源代码
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' //排除node_models下所有文件
    }),
    resolve()
  ]
}
