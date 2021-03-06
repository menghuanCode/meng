const path = require('path')
const buble = require('rollup-plugin-buble')              // 替代babel，用来转换es5
const alias = require('rollup-plugin-alias')              // 使用 packages 时可以定义别名
const cjs = require('rollup-plugin-commonjs')             // 将CommonJS 模块转换成 ES6
const replace = require('rollup-plugin-replace')          // 在捆绑文件时替换字符串
const node = require('rollup-plugin-node-resolve')        // 允许加载在 node_modules 中的第三方模块
const flow = require('rollup-plugin-flow-no-whitespace')  // 去掉flow使用的类型检查代码
const version = process.env.VERSION || require('../package.json').version   // 获取版本信息

// 广告
const banner =
  '/*!\n' +
  ` * Vue.js v${version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} Evan You\n` +
  ' * Released under the MIT License.\n' +
  ' */'

const weexFactoryPlugin = {
  intro() {
    return 'module.exports = function weexFactory(exports, document) {'
  },
  outro() {
    return '}'
  }
}


// 别名
const aliases = require('./alias');
// 路径转换
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

// 建设对象
const builds = {
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' }
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  }
}

/**
 * 获取定义
 * 适配器，转换成 RoullupJS可打包格式
 * @param name
 */
function genConfig(name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,        // 输出文件
    external: opts.external,  // 指出应将哪些模块视为外部模块
    plugins: [
      replace({   // 文件字符替换
        __VERSION__: version,
      }),
      flow(),      // node_module 中的第三方模块
      buble(),     // node_module 中的第三方模块
      alias(Object.assign({}, aliases, opts.alias)) // 定义别名, 引入 package 时可以直接使用别名
    ].concat(opts.plugins || []),   // 添加 options 中需要的插件
    output: {
      file: opts.dest,
      format:opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Vue'
    },
    onwarn: (msg, warn) => {  // 拦截警报
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    }
  }

  if (opts.env) {
    config.plugins.push(replace({   // 文件字符替换
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  Object.defineProperty(config, '_name', {  // 定义属性(私有)
    enumerable: false,
    value: name
  })

  return config
}



if (process.env.TARGET){
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}

