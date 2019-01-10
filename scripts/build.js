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

// 获取全部 Builds Config
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

// 开始构建
build(builds)


function build(builds) {
  let built = 0
  const total = builds.length

  // 迭代模式
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

// 建设输出
function buildEntry(config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /min\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({output}) => {
      for(const chunkOrAsset of output) {
        let code = chunkOrAsset.code
        if (isProd) {
          const minified = (banner ? banner + '\n' : '') + terser.minify(code, {
            output: {
              ascii_only: true
            },
            compress: {
              pure_funcs: ['makeMap']
            }
          }).code
          return write(file, minified, true)
        } else {
          return write(file, code)
        }
      }
    })
}

/**
 * write 书写
 * 调用 node 的 fs.writeFile 写入文件
 * @param dest 文件名
 * @param code 数据代码
 * @param zip 是否压缩
 * @returns {Promise<any>}
 */
function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + " " + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

// 获取大小
function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

// 打印错误
function logError(e) {
  console.log(e)
}

// 蓝色
function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
