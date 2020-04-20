#  ☵☲ pndlm-vue-redux

Vue2 bindings for Redux.  
Opinionated toward code simplicity, predictability, and performance.

**Currently WIP**

---

## Use 

In your Vue app, plug your redux store in as an option to any component and it will be passed to children (adopted from Vuex).
```js
import PNDLMVueRedux from 'pndlm-vue-redux'
// import your reduxStore
import reduxStore from './reduxStore'
import Clock from './clock.vue'

Vue.use(PNDLMVueRedux)
new Vue({
	reduxStore,
	components: { Clock },
	template: '<Clock />'
}).$mount('#root')
```

`clock.vue`  
This example component uses `mapState` to pull from the state tree and keep itself updated, including use of a memoized selector.
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
	}
}
</script>

<template>
	<div>{{ timeString }}</div>
</template>
```

---

## Source Material

The library is being written through careful review of the following excellent resources.

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
