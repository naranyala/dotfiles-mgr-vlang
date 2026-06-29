const ctxMap = new WeakMap()

export function createContext(defaultValue) {
	const key = {}
	return {
		provide(val) { ctxMap.set(key, val) },
		consume() { return ctxMap.has(key) ? ctxMap.get(key) : defaultValue },
	}
}
