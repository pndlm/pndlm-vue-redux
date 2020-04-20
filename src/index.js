/**
 *  ☵☲ pndlm-vue-redux
 *      index.js
 * 
 *      © 2020 PNDLM https://pndlm.com
 *      License MIT
 * 
 *      This library is currently in development.
 *      For more information please reach out 
 */

// inspired by vuex/src/store.js
let Vue // bind on install
export function install (_Vue) {
	if (Vue && _Vue === Vue) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(
				'[PNDLMVueRedux] is already installed. Vue.use(PNDLMVueRedux) should be called only once.'
			)
		}
		return
	}
	Vue = _Vue
	applyMixin(Vue)
}

// inspired by vuex/src/mixin.js
function applyMixin (Vue) {
	// lifecycle:
	// ownProps -> mapStateToProps -> render -> componentDidUpdate/setState -> render

	Vue.mixin({
		created: vueReduxInit,
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

		this._reduxUnsubscribe = this.$reduxStore.subscribe(handleStateChange.bind(this))
	}

	function vueReduxDestroy () {
		if(this._reduxUnsubscribe) {
			this._reduxUnsubscribe()
		}
	}
}

function handleStateChange () {
	if(this.$options.mapState) {
		const mapState = this.$options.mapState
		const state = this.$reduxStore.getState()

		for(const k in mapState) {
			this[k] = mapState[k].call(this, state)
		}

		console.debug('[PNDLMVueRedux] will update component', this)
		this.$forceUpdate()
	}
}

export default {
	install,
}
