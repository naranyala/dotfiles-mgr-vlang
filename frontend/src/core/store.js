import { reactive } from './signals.js'

export function createStore(initial, actions) {
	const state = reactive(initial)
	const bound = {}
	for (const key of Object.keys(actions)) {
		bound[key] = (...args) => actions[key](state, ...args)
	}
	return { state, actions: bound }
}
