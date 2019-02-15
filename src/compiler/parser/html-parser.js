/**
 * 不对此文件进行类型检查，因为它主要是第三方代码。
 */


/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

import { makeMap, no } from "shared/util";

const doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - 避免在页面内联时被视为HTML注释
const comment = /^<!\--/
const conditionalComment = /^<!\[/

const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `(?:(${ncname}\\:)?${ncname})`
const endTag = new RegExp(`<\\/${qnameCapture}[^>]*>`)




export function parseHTML (html, options) {
  const stack = []
  const expectHTML = options.expectHTML
  const isUnaryTag = options.isUnaryTag || no
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no

  let index = 0
  let last, lastTag

  // while (html) {
  //
  //   last = html
  //   // 确保我们不是像 'textarea，script/style' 那样的的内容元素
  //   if (!lastTag || !isPlainTextElement(lastTag)) {
  //     let textEnd = html.indexOf('<')
  //     if (textEnd === 0) {
  //       // Comment:
  //       if (comment.test(html)) {
  //         const commentEnd = html.indexOf('-->')
  //
  //         if (commentEnd >= 0) {
  //           if (options.shouldKeepComment) {
  //             options.comment(html.substring(4, commentEnd))
  //           }
  //           advance(commentEnd + 3)
  //           continue
  //         }
  //       }
  //
  //       // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
  //       if (conditionalComment.test(html)) {
  //         const conditionalEnd = html.indexOf(']>')
  //
  //         if (conditionalEnd >= 0) {
  //           advance(conditionalEnd + 2)
  //           continue
  //         }
  //       }
  //
  //       // Doctype:
  //       const doctypeMatch = html.match(doctype)
  //       if (doctypeMatch) {
  //         advance(doctypeMatch[0].length)
  //         continue
  //       }
  //
  //       // End tag:
  //       const endTagMatch = html.match(endTag)
  //       if (endTagMatch) {
  //         const curIndex = index
  //         advance(endTagMatch[0].length)
  //         parseEndTag(endTagMatch[1], curIndex, index)
  //       }
  //
  //       // Start tag:
  //     }
  //
  //   }
  // }

  function advance(n) {
    index += n
    html = html.substring(n)
  }

  function parseEndTag(tagName, start, end) {
  }
}
