const createRpcProxy = (path = []) => {
	const handler = {
		get(_, method) {
			return createRpcProxy([...path, method])
		},
		apply(_, __, args) {
			const fullMethod = path.join('.')
			if (!window.backendRPC) {
				throw new Error(`Backend RPC not available`)
			}
			return (async () => {
				try {
					const res = await Promise.race([
						window.backendRPC(fullMethod, ...args),
						new Promise((_, reject) => setTimeout(() => reject(new Error(`RPC "${fullMethod}" timeout`)), 30000)),
					])
					try { return JSON.parse(res) } catch (e) { return res }
				} catch (e) {
					console.error(`[RPC] ${fullMethod} failed:`, e.message)
					throw e
				}
			})()
		}
	}
	return new Proxy(() => {}, handler)
}

window.rpc = createRpcProxy()
