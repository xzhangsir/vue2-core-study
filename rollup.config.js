import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js',
  output: {
    file: 'dist/vue.js',
    format: 'umd',
    name: 'Vue',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      port: 8181,
      contentBase: '', //空字符串就是在当前目录找
      openPage: '/index.html'
    })
  ]
}
