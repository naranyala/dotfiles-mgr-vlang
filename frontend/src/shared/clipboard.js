export async function copyToClipboard(text) {
	if (navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text)
			return true
		} catch (e) {
			console.warn('[clipboard] writeText failed:', e.message)
		}
	}
	
	if (window.rpc?.shell?.clipboardSet) {
		try {
			const res = await window.rpc.shell.clipboardSet(text)
			return res.ok || !res.error
		} catch (e) {
			console.warn('[clipboard] rpc.clipboardSet failed:', e.message)
		}
	}

	console.warn('[clipboard] Clipboard API not available in this context')
	return false
}

export async function readFromClipboard() {
	if (navigator.clipboard?.readText) {
		try {
			return await navigator.clipboard.readText()
		} catch (e) {
			console.warn('[clipboard] readText failed:', e.message)
		}
	}

	if (window.rpc?.shell?.clipboardGet) {
		try {
			const res = await window.rpc.shell.clipboardGet()
			return res.text || ''
		} catch (e) {
			console.warn('[clipboard] rpc.clipboardGet failed:', e.message)
		}
	}

	console.warn('[clipboard] Clipboard API not available in this context')
	return ''
}
