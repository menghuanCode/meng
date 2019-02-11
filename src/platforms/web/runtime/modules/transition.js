/* @flow */

import {inBrowser} from "core/util/index";

export default inBrowser ? {
  create: null,
  activate: null,
  remove (vnode: VNode, rm: Function) {

  }
} : {

}
