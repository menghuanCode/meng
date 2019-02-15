/* @flow */

import { inBrowser } from 'core/util/index'

//检查当前浏览器是否在属性值内编码char
let div
function getShouldDecode(href: boolean): boolean {
  div = div || document.createComment('div')
  div.innerHTML = href ? `<a href="\n" />` : `<div a="\n" />`
  return div.innerHTML.indexOf('&#10;') > 0
}


//＃3663：IE在属性值中编码换行符，而其他浏览器则不编码换行符
export const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false
// #6828: chrome对[href]中的内容进行编码
export const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false
