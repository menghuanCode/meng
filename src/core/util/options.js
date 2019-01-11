/* @flow */

import { warn } from './debug'

import {
  camelize,
  isBuiltInTag
} from 'shared/util'

/**
 * 检查组件
 */
function checkComponents(options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}


/**
 * 验证组件名称
 * @param name 组件名
 */
function validateComponentName(name: string) {
  // 名称是否符合合法
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      // 无效组件名: name. 组件名
      'Invalid component name: "' + name + '". Component names ' +
      // 只能包含字母数字和连接字符-
      'can only contain alphanumeric characters and the hyphen, ' +
      // 开始必须是字母
      'and must start with a letter.'
    )
  }

  //
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    // 不要使用内置或保留的HTML元素作为组件
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}


/**
 * 确保将所有 props 选项语法规范化为
 * Object-based format.
 */
function normalizeProps(options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name

  // 如果是数组
  if (Array.isArray(props)) {
    i = props.length
    while(i--) {
      val = props[i]
      if (typeof val === 'string') {
        name =
      }
    }
  }

  options.props = res
}


/**
 * 将两个选项对象合并成一个新对象。
 * 在实例化和继承中实用的核心使用程序。
 */
export function mergeOptions(
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  // 规范化 props
  normalizeProps(child, vm)
  // 标准化注入
  normalizeInject(child, vm)
  // 规范化指令
  nomalizeDirectives(child)

  // 对子选项上应用 extends 和 mixins,
  // 但前提是它是一个原始选项对象，
  // 而不是另一个 mergeOptions 调用的结果。
  // 只有 mergeOptions 有 _base 属性
}


