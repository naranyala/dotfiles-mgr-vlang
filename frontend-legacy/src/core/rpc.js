window.rpc = new Proxy({}, {
	get(_, method) {
		return async (...args) => {
			const fn = window[method]
			if (!fn) {
				throw new Error(`RPC method "${method}" not available`)
			}
			try {
				const res = await Promise.race([
					fn(...args),
					new Promise((_, reject) => setTimeout(() => reject(new Error(`RPC "${method}" timeout`)), 30000)),
				])
				try { return JSON.parse(res) } catch (e) { return res }
			} catch (e) {
				console.error(`[RPC] ${method} failed:`, e.message)
				throw e
			}
		}
	},
})
