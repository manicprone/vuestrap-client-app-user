import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import alias from 'rollup-plugin-alias'
import vue from 'rollup-plugin-vue'
import json from 'rollup-plugin-json'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import url from 'rollup-plugin-url'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/plugin.js',
    format: 'cjs',
  },
  external: ['axios'],
  plugins: [
    globals(),
    builtins(),
    alias({
      vue$: 'vue/dist/vue.common.js',
      '@': path.resolve('./src/'),
      resolve: ['.js', '.vue'],
    }),
    vue(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    uglify(),
    json(),
    url({
      limit: 10 * 1024, // inline files < 10k, copy files > 10k
      include: ['**/*.svg'],
      emitFiles: true,
    }),
  ],
}
