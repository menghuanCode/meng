/* @flow */

/**
 * 将属性混合到目标对象中
 */
export function extend (to: Object, _from: ?Object): Object {
	for(const key in _from) {
		to[key] = _from[key]
	}

	return to
}