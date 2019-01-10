module.exports = {
  root: true,     // 指定根目录
  parserOptions: {  // 解析选项
    parser: require.resolve('babel-eslint'),  // 指定解析器
    ecmaVersion: 2018,                        // 指定要使用的 ECMAScript 语法，默认(3, 5)  ps:2018(es9)
    sourceType: 'module'                      // 默认 "script"，代码在 ECMAScript 模块中可以设置成 "module"
  },
  env: {         // 全局配置
    es6: true,      // 自动启用ES6语法
    node: true,     // 启用 node 环境
    browser: true   // 启用 浏览器环境
  },
  plugins: [     // 配置插件
    "flowtype"   // eslint-plugin-flowtype 插件，必须使用npm进行安装
  ],
  extends: [    // 扩展配置文件
    "eslint:recommended",           // 允许的核心规则
    "plugin:flowtype/recommended"   // 使用插件中的配置，eslint-plugin-flowtype
  ],
  globals: {    // 脚本在执行期间访问的其他全局变量
    "__WEEX__": true,         // true: 允许覆盖变量
    "WXEnvironment": true     // false 禁止覆盖变量
  },
  rules: {      // 配置规则
    /**
     * 0(off) 关闭规则
     * 1(warn)  打开规则，并且作为一个警告(并不会导致检查不通过)。
     * 2(error) 打开规则，并且作为一个错误(退出码为1，检查不通过)。
     */

    'no-console': process.env.NODE_ENV !== 'production' ? 0 : 2,      // 禁止console
    'no-useless-escape': 0,                                           // 禁止不必要的转义
    'no-empty': 0                                                     // 禁止通空语句块
  }
}
