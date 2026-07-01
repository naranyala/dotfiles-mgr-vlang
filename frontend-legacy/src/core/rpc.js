window.rpc = new Proxy({}, {
	get(_, method) {
		return async (...args) => {
			if (typeof window[method] !== 'function') {
				throw new Error(`RPC method ${method} is not defined`)
			}
			const res = await window[method](...args)
			try { return JSON.parse(res) } catch (e) { return res }
		}
	},
})
