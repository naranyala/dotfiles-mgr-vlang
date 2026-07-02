import { reactive } from '../../core/signals.js'
import { html } from '../../core/template.js'

export const state = reactive({
	backendState: null,
	logs: [],
	loading: false,
})

export async function init() {}

async function refresh() {
	state.loading = true
	try {
		state.backendState = await window.rpc.state.get()
	} catch (e) {
		state.backendState = { error: e.message }
	}
	state.loading = false
}

export function onMount(component) {
	component.delegate('click', '#btn-backend-refresh', () => refresh())
}

export function render() {
	const { backendState, loading } = state

	if (!backendState) return `<div class="card"><div class="bd">Loading…</div></div>`

	return html`
		<div class="card">
			<div class="hdr">
				<span>Backend State</span>
				<button id="btn-backend-refresh" class="btn-icon" title="Refresh">↻</button>
			</div>
			<div class="bd">
				${backendState.error ? `<span class="err">${backendState.error}</span>` : `
					<div class="mono" style="font-size:0.8rem">
						<span style="color:#818cf8">RPC Methods:</span> ${backendState.rpc_count || 0}<br>
						<span style="color:#818cf8">Platform:</span> ${backendState.platform || '—'}<br>
						<span style="color:#818cf8">CWD:</span> ${backendState.cwd || '—'}
					</div>
					${backendState.rpc_names?.length ? `
						<div style="margin-top:8px">
							<label style="font-size:0.8rem">Registered RPCs</label>
							<div class="mono" style="font-size:0.72rem;max-height:200px;overflow:auto">
								${backendState.rpc_names.join(' · ')}
							</div>
						</div>
					` : ''}
				`}
			</div>
		</div>`
}