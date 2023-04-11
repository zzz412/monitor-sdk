const path = require('path')
const dts = require('rollup-plugin-dts').default
const ts = require('rollup-plugin-typescript2')

const resolve = (url) => path.resolve(__dirname, url)

module.exports = [
  {
    input: './src/core/index.ts',
    output: [
      // ES
      { file: resolve('lib/index.esm.js'), format: 'esm' },
      // umd
      { file: resolve('lib/index.js'), format: 'umd', name: 'monitorSdk' },
      // cjs
      { file: resolve('lib/index.cjs.js'), format: 'cjs' },
    ],
    // 配置监听处理
    watch: {
      exclude: 'node_modules/**',
    },
    plugins: [ts()],
  },
  {
    input: './src/core/index.ts',
    output: [{ file: resolve('lib/index.d.ts'), format: 'es' }],
    plugins: [dts()],
  },
]
