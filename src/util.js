/**
 *  ☵☲ pndlm-vue-redux
 *      util.js
 * 
 *      MMXX PNDLM https://pndlm.com
 *      License MIT
 */

/**
 * Get the raw type string of a value, e.g., [object Object].
 * borrowed from vue/src/shared/util.js
 */
const _toString = Object.prototype.toString

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 * borrowed from vue/src/shared/util.js
 */
export function isPlainObject (obj) {
	return _toString.call(obj) === '[object Object]'
}

// inspired by vue/src/core/instance/state.js
export function proxy (target, sourceKey, key) {
	Object.defineProperty(target, key, {
		enumerable: true,
		configurable: true,
		get: function proxyGetter () {
			return this[sourceKey][key]
		},
		set: function proxySetter (val) {
			this[sourceKey][key] = val
		}
	})
}
