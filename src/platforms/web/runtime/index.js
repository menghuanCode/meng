/* @flow */

import Vue from 'core/index'
import { query } from '../util/index'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { inBrowser } from 'core/util/index'

import { patch } from './patch'


// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop


// public mount method
Vue.prototype.$mount = function (
	el?: string | Element,
	hydrating?: boolean
): Component {
	el = el && inBrowser ? query(el) : undefined
	return mountComponent(this, el, hydrating)
}



export default Vue
