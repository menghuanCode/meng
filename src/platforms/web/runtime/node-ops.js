/* @flow */

export function createElement(tagName: string, vnode: VNode): Element {
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }

  // false 或 null 会删除该属性，但 undefined 不会
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple')
  }
  return elm
}

export function createElementNS(namespace: string, tagName: string): Element {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

export function createTextNode(text: string): Text {
  return document.createTextNode(text)
}

export function createComment(text: string): Text {
  return document.createComment(text)
}

export function removeChild(node: Node, child: Node) {
  node.removeChild(child)
}

export function appendChild(node: Node, child: Node) {
  node.appendChild(child)
}

export function parentNode(node: Node): ?Node {
  return node.parentNode
}

export function tagName(node: Element): string {
  return node.tagName
}

export function nextSibling(node: Node): ?Node {
  return node.nextSibling
}

export function insertBefore(parentNode: Node, newNode: Node, referenceNode: Node) {
  parentNode.insertBefore(newNode, referenceNode)
}
