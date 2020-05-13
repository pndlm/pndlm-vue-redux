#  ☵☲ pndlm-vue-redux

Vue2 bindings for Redux.

What we are working toward is an implementation of Redux bindings for Vue which are roughly equivalent to what the `useSelector` hook offers up in the latest versions of [react-redux](https://github.com/reactjs/react-redux).

**Currently WIP** — We are road-testing this on a large scale product and will continue to make improvements over the coming weeks.  Next features on the list are:

* Documentation examples including props and computed properties
* Ability to specify alternative equality function on a selector
* Cover the bases outlined in https://react-redux.js.org/next/api/hooks
* Update and testing with Vue 3

If you have any feedback, please open an issue or pull request on GitHub.

---

## Use 

In your Vue app, plug your redux store in as an option to any component and it will be passed to children (adopted from Vuex).
```js
import PNDLMVueRedux from 'pndlm-vue-redux'
// import your reduxStore
import reduxStore from './reduxStore'
import Clock from './clock.vue'

// if you want extra debugging:
PNDLMVueRedux.setExtraDebug()

Vue.use(PNDLMVueRedux)
new Vue({
	reduxStore,
	components: { Clock },
	template: '<Clock />'
}).$mount('#root')
```

`clock.vue`  
This example component uses `mapState` to pull from the state tree and keep itself updated, including use of a memoized selector.  It also dispatches an action upon button click.
```html
<script>
import { createSelector } from 'reselect'

const getClientTick = state => state.timer.movement.clientTick
const getTimeString = createSelector(
	getClientTick,
	(clientTick) => new Date(clientTick).toString()
)

export default {
	mapState: {
		timeString: getTimeString
	},
	methods: {
		handleClick: function(e) {
			this.$reduxStore.dispatch({
				type: 'BUTTON_CLICKED'
			})
		}
	}
}
</script>

<template>
	<div>
		<p>The time is: {{ timeString }}</p>
		<button v-on:click="handleClick">Click me</button>
	</div>
</template>
```

---

## TODO



## Source Material

The library is being crafted from ongoing review of the following excellent resources:

* [The History and Implementation of React-Redux](https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/) by Mark Erikson
* [Vue Mastery Advanced Components](https://www.vuemastery.com/courses/advanced-components) video series by Gregg Pollack and Evan You
* The source code of these libraries—
	* [react-redux](https://github.com/reactjs/react-redux)
	* [vue](https://github.com/vuejs/vue)
	* [vuex](https://github.com/vuejs/vuex)

Our thanks go out to the open-source community, most especially Dan Abrimov and those listed above.

---

Brought to you by [PNDLM](https://pndlm.com).  
License MIT
