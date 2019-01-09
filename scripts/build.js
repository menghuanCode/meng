const fs = require('fs')
const path = require('path')
const zlib = require('zlib')          // 压缩库
const rollup = require("rollup")      // 打包器
const terser = require('terser')      /* terser建议您使用RollupJS捆绑您的模块，因为这会产生更小的代码
                                       * uglify-es是不再保持和uglify-js不支持ES6 +。
                                       * terser是一个分叉，uglify-es保留API并与CLI兼容性uglify-es和uglify-js@3。
                                       */


// 如果没有这个目录
if(!fs.existsSync('dist')) {
  // 创建该目录
  fs.mkdirSync('dist')
}

let builds = require('./config').getAllBuilds()

// 通过命令行arg过滤构建
if (process.argv[2]) {
  // 字符串转数组
  const filters = process.argv[2].split(',')

  builds = builds.filter(b => {
    // Array.prototype.some 返回 true/false
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })

} else {
  // 默认情况下过滤掉 weex 构建
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

// 构建
build(builds)

function build(builds) {

}
