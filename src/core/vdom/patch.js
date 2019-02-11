/**
 * 基于Snabbdom的虚拟DOM修补算法
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

import VNode, { cloneVNode } from './vnode'
import config from '../config'

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  isRegExp,
  isPrimitive
} from '../util/index'


const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  function sameVnode(a, b) {

  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  // 是未知的元素
  function isUnknownElement(vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      ! (
        config.ignoredElements.length &&
        config.ignoredElements.some(ignore => {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  // 为范围 css 设置范围 id 属性
  // 这是作为特殊情况实现的，以避免开销
  // 通过正常的属性修补过程。
  function setScope(vnode) {
  }

  function invokeCreateHooks(vnode, insertedVnodeQueue) {

  }

  function insert(parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (ref.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref)
        }
      } else {
        nodeOps.appendChild(parent, elm)
      }
    }
  }

  // 检查重复key
  function checkDuplicateKeys(children) {
    const seenKeys = {}
    for(let i = 0; i < children.length; i++) {
      const vnode = children[i]
      const key = vnode.key
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            `检测到重复的 key: '${key}'. 这可能导致更新错误.`,
            vnode.context
          )
        } else {
          seenKeys[key] = true
        }
      }
    }
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'productiion') {
        checkDuplicateKeys(children)
      }
      for(let i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
  }

  let creatingElmInVPre = 0

  function createElm(
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // 这个vnode用于之前的渲染！现在它被用作新节点，
      // 当它被用作插入参考节点时，覆盖其元素会导致潜在的补丁错误。
      // 相反，我们在为其创建关联的DOM元素之前按需克隆节点。
    }

    // 尝试创建一个组件节点


    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if(isDef(tag)) {
      if (process.env.NODE_ENV !== 'productiion') {
        if (data && data.pre) {
          creatingElmInVPre++
        }
        if (isUnknownElement(vnode, creatingElmInVPre)) {
          warn(
            '未知的自定义元素: <' + tag + '> - 你是否 ' +
            '正确的注册了组件? 对于递归组件, ' +
            '确保提供"name"选项.',
            vnode.context
          )
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNs(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode)
      setScope(vnode)

      // 如果是服务端
      if (__WEEX__) {

      } else {
        createChildren(vnode, children, insertedVnodeQueue)
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        insert(parentElm, vnode.elm, refElm)
      }

      if (process.env.NODE_ENV !== 'productiion' && data && data.pre) {
        creatingElmInVPre--
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }

  function invokeDestroyHook () {

  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {

    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch 现有的根节点
      } else {
        if (isRealElement) {
          // 挂载一个真实的
          // 检查这是否是服务器呈现的内容以及我们是否可以执行
          // 一个成功的 hydration

          if (isTrue(hydrating)) {

          }
          // 要么没有服务端渲染，要么 hydration 失败
          // 创建一个空的节点替换它
          // 真实DOM 转换成 虚拟DOM
          oldVnode = entryNodeAt(oldVnode)
        }

        // 替换已存在元素
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // 创建新的节点
        createElm(
          vnode,
          insertedVnodeQueue,
          // 非常罕见的边缘情况: 如果旧元素处于离开的过滤状态 请不要插入.
          // 仅发生在 transition + keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // 以递归方式更新父占位符节点元素

        // 销毁旧的节点
        if (isDef(parentElm)) {

        } else if (isDef(oldVnode.tag)) {

        }
      }
    }

    return vnode.elm
  }
}
