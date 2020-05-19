/**
 *  ☵☲ pndlm-vue-redux
 *      index.js
 * 
 *      MMXX PNDLM https://pndlm.com
 *      License MIT
 */

import { proxy, isPlainObject } from './util'

let _debug = false
const setExtraDebug = (value = true) => {
	_debug = value
}

// inspired by vuex/src/store.js
// eslint-disable-next-line
let Vue // bind on install
export function install (_Vue) {
	if (Vue && _Vue === Vue) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('[PNDLMVueRedux] is already installed. Vue.use(PNDLMVueRedux) should be called only once.')
		}
		return
	}
	Vue = _Vue
	applyMixin(Vue)
}

// inspired by vuex/src/mixin.js
function applyMixin (Vue) {
	Vue.mixin({
		beforeCreate: pndlmVueReduxInit,
		beforeDestroy: pndlmVueReduxDestroy,
	})

	function pndlmVueReduxInit () {
		const options = this.$options
		if (options.reduxStore) {
			this.$reduxStore = options.reduxStore
		} else if (options.parent && options.parent.$reduxStore) {
			this.$reduxStore = options.parent.$reduxStore
		} else {
			// no store available
			return
		}

		if(this.$options.mapState) {
			_debug && console.log('[PNDLMVueRedux] init component', this)
			
			if (!isPlainObject(this.$options.mapState)) {
				console.error(`[PNDLMVueRedux] mapState must be a plain object, will not map`, this)
				return
			}

			const initialData = {}
			const state = this.$reduxStore.getState()
			const mapState = this.$options.mapState

			for(const k in mapState) {
				if(typeof mapState[k] !== 'function') {
					console.error(`[PNDLMVueRedux] mapState[${k}] is not a function, will not map`, this)
					continue
				}
				initialData[k] = mapState[k].call(this, state)
				proxy(this, '_pvr_observable', k)
			}

			this._pvr_observable = Vue.observable(initialData)
			this._pvr_store_unsubscribe = this.$reduxStore.subscribe(handleStateChange.bind(this))
		}
	}

	function pndlmVueReduxDestroy () {
		if(this._pvr_store_unsubscribe) {
			_debug && console.log('[PNDLMVueRedux] destroy component', this)
			this._pvr_store_unsubscribe()
		}
	}
}

function handleStateChange () {
	let willUpdate = false
	const state = this.$reduxStore.getState()

	for(const k in this._pvr_observable) {
		const value = this.$options.mapState[k].call(this, state)
		willUpdate = willUpdate || (value !== this._pvr_observable[k])
		this._pvr_observable[k] = value
	}

	if(willUpdate) {
		_debug && console.log('[PNDLMVueRedux] will update component', this)
		this.$forceUpdate()
	}
}

export default {
	install,
	setExtraDebug,
}
