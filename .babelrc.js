const babelPresetFlowVue = {
  plugins: [
    require('@babel/plugin-proposal-class-properties'), // 转换，建议类的属性
    // require('@babel/plugin-syntax-flow'), // 不需要, 包含在 transform-flow-strip-types 里
    require('@babel/plugin-transform-flow-strip-types') // 转换 flow 类型注释
  ]
}

module.exports = {
  presets: [
    require('@babel/preset-env'),
    // require('babel-preset-flow-vue')
    babelPresetFlowVue
  ],
  plugins: [
    require('babel-plugin-transform-vue-jsx'),      // 允许在 vue 使用 jsx 语法
    require('@babel/plugin-syntax-dynamic-import')  // 允许 动态导入语法
  ],
  ignore: [
    'dist/*.js',
    'packages/**/*.js'
  ]
}
