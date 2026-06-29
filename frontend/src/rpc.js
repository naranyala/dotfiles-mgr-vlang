const raw = window.__rpc

window.rpc = new Proxy({}, {
	get(_, method) {
		return (...args) => raw(method, ...args)
	},
})
