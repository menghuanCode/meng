/* @flow */

import Vue from './runtime/index'
import { query } from './util/index'
import { warn, cached } from 'core/util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
	const el = query(id)
	return el && el.innerHTML
})

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
	el?: string | Element,
	hydrating?: boolean
): Component {
	el = el && query(el)

	if (el === document.body || el === document.documentElement) {
		process.env.NODE_ENV !== 'production' && warn(
			`不应该将 Vue 挂载到 <html> or <body> - 我是挂载到普通元素.`
		)
		return this
	}

	const options = this.$options
	// 解析 template/el 并转换为 render 函数

	if (!options.render) {
		let template = options.template
		if (template) {
			if (typeof template === 'string') {
				if (template.charAt(0) === '#') {
					template = idToTemplate(template)
					if (process.env.NODE_ENV !== 'production' && !template) {
						warn(`模板元素没找到或者是空: ${options.template}`,this)
					}
				}
			} else if (template.nodeType) {
				template = template.innerHTML
			} else {
				if (process.env.NODE_ENV !== 'production') {
					warn('无效模板选项:' + template, this)
				}
				return this
			}
		} else if (el) {
			template = getOuterHTML(el)
		}
		if (template) {
		  const { render, staticRenderFns } = compileToFunctions(template, {
		    shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)

      // options.render = render
      // options.staticRenderFns = staticRenderFns
		}
	}


	return mount.call(this, el, hydrating)
}


/**
 * 获取外部元素，注意
 * 也包括 IE中的 SVG 元素
 */
function getOuterHTML(el: Element): string {
	if (el.outerHTML) {
		return el.outerHTML
	} else {
		const container = document.createElement('div')
		container.appendChild(el.cloneNode(true))
		return container.innerHTML
	}
}




export default Vue
