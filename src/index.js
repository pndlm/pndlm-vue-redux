/**
 *  ☵☲ pndlm-vue-redux
 *      index.js
 * 
 *      © 2020 PNDLM https://pndlm.com
 *      License MIT
 */

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
		beforeCreate: vueReduxInit,
		beforeDestroy: vueReduxDestroy,
	})

	function vueReduxInit () {
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
			//_debug && console.log('[PNDLMVueRedux] init component', this)

			// sanity check that all mapState properties are functions
			if (process.env.NODE_ENV !== 'production') {
				const errors = 0
				const mapState = this.$options.mapState
				for(const k in mapState) {
					if(typeof mapState[k] !== 'function') {
						console.error(`[PNDLMVueRedux] mapState[${k}] is not a function, will not bind component`, this)
						errors++
					}
				}
				if(errors) {
					// errors, do not bind
					return
				}
			}

			this._reduxMapStateCurrent = {}
			this._reduxUnsubscribe = this.$reduxStore.subscribe(handleStateChange.bind(this))
			handleStateChange.call(this)
		}
	}

	function vueReduxDestroy () {
		if(this._reduxUnsubscribe) {
			_debug && console.log('[PNDLMVueRedux] destroy component', this)
			this._reduxUnsubscribe()
		}
	}
}

function handleStateChange () {
	let willUpdate = false

	const mapState = this.$options.mapState
	const state = this.$reduxStore.getState()

	for(const k in mapState) {
		const value = mapState[k].call(this, state)
		willUpdate = willUpdate || (value !== this._reduxMapStateCurrent[k])
		this._reduxMapStateCurrent[k] = this[k] = value
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
