import { reactive } from '../../core/signals.js'

export const state = reactive({
	dbPath: 'data.sqlite',
	tables: [],
	selectedTable: '',
	columns: [],
	rows: [],
	schema: [],
	newRow: {},
	editIdx: -1,
	editRow: {},
	sql: '',
	queryResult: null,
	loading: false,
	error: '',
})

export async function init() {
	try { await loadTables() } catch (e) { state.error = e.message }
}

async function loadTables() {
	try {
		const res = await window.rpc.dbTables()
		if (res.error) { state.error = res.error; return }
		state.tables = (res.rows || []).map(r => r.name)
		if (state.tables.length > 0 && !state.selectedTable) {
			state.selectedTable = state.tables[0]
			await loadTable()
		}
	} catch (e) { state.error = e.message }
}

async function loadTable() {
	if (!state.selectedTable) return
	state.loading = true
	state.error = ''
	try {
		const res = await window.rpc.dbQuery(`SELECT * FROM ${state.selectedTable} LIMIT 200`)
		if (res.error) { state.error = res.error; state.columns = []; state.rows = []; return }
		state.columns = res.columns || []
		state.rows = res.rows || []
		const schemaRes = await window.rpc.dbSchema(state.selectedTable)
		state.schema = (schemaRes.rows || []).map(r => ({
			name: r.name,
			type: r.type,
			notnull: r.notnull === '1',
			dflt: r.dflt_value,
			pk: r.pk === '1',
		}))
		state.newRow = {}
		state.columns.forEach(c => { state.newRow[c] = '' })
	} catch (e) { state.error = e.message }
	finally { state.loading = false }
}

async function insertRow() {
	const cols = state.columns.filter(c => state.newRow[c] !== '')
	if (cols.length === 0) return
	const vals = cols.map(c => {
		const v = state.newRow[c]
		return isNaN(v) || v === '' ? `'${v.replace(/'/g, "''")}'` : v
	}).join(', ')
	const sql = `INSERT INTO ${state.selectedTable} (${cols.join(', ')}) VALUES (${vals})`
	state.loading = true
	try {
		const res = await window.rpc.dbExec(sql)
		if (res.error) { state.error = res.error; return }
		state.newRow = {}
		state.columns.forEach(c => { state.newRow[c] = '' })
		await loadTable()
	} catch (e) { state.error = e.message }
	finally { state.loading = false }
}

async function updateRow() {
	if (state.editIdx < 0) return
	const pkCol = state.schema.find(s => s.pk)?.name || state.columns[0]
	const pkVal = state.rows[state.editIdx][pkCol]
	const sets = state.columns.filter(c => c !== pkCol).map(c => {
		const v = state.editRow[c]
		return isNaN(v) || v === '' ? `${c}='${v.replace(/'/g, "''")}'` : `${c}=${v}`
	}).join(', ')
	const sql = `UPDATE ${state.selectedTable} SET ${sets} WHERE ${pkCol}='${pkVal}'`
	state.loading = true
	try {
		const res = await window.rpc.dbExec(sql)
		if (res.error) { state.error = res.error; return }
		state.editIdx = -1
		state.editRow = {}
		await loadTable()
	} catch (e) { state.error = e.message }
	finally { state.loading = false }
}

async function deleteRow(idx) {
	const pkCol = state.schema.find(s => s.pk)?.name || state.columns[0]
	const pkVal = state.rows[idx][pkCol]
	const sql = `DELETE FROM ${state.selectedTable} WHERE ${pkCol}='${pkVal}'`
	state.loading = true
	try {
		const res = await window.rpc.dbExec(sql)
		if (res.error) { state.error = res.error; return }
		await loadTable()
	} catch (e) { state.error = e.message }
	finally { state.loading = false }
}

async function runSql() {
	if (!state.sql.trim()) return
	state.loading = true
	state.error = ''
	state.queryResult = null
	try {
		const lower = state.sql.trim().toLowerCase()
		if (lower.startsWith('select') || lower.startsWith('pragma')) {
			const res = await window.rpc.dbQuery(state.sql)
			if (res.error) { state.error = res.error; return }
			state.queryResult = res
		} else {
			const res = await window.rpc.dbExec(state.sql)
			if (res.error) { state.error = res.error; return }
			state.queryResult = { message: `OK — ${res.changes} row(s) affected` }
			await loadTables()
		}
	} catch (e) { state.error = e.message }
	finally { state.loading = false }
}

export function onMount(component) {
	component.delegate('click', '#btn-refresh-tables', () => loadTables())
	component.delegate('click', '[data-select-table]', (e) => {
		const table = e.target.closest('[data-select-table]').dataset.selectTable
		state.selectedTable = table
		loadTable()
	})
	component.delegate('change', '#select-table', (e) => {
		state.selectedTable = e.target.value
		loadTable()
	})
	component.delegate('click', '#btn-insert', () => insertRow())
	component.delegate('click', '#btn-run-sql', () => runSql())
	component.delegate('input', '#sql-input', (e) => (state.sql = e.target.value))

	component.delegate('click', '.btn-edit', (e) => {
		const idx = parseInt(e.target.dataset.idx)
		state.editIdx = idx
		state.editRow = { ...state.rows[idx] }
	})
	component.delegate('click', '.btn-cancel-edit', () => {
		state.editIdx = -1
		state.editRow = {}
	})
	component.delegate('click', '.btn-save-edit', () => updateRow())
	component.delegate('click', '.btn-delete', (e) => {
		const idx = parseInt(e.target.dataset.idx)
		if (confirm('Delete this row?')) deleteRow(idx)
	})
	component.delegate('input', '.edit-input', (e) => {
		const col = e.target.dataset.col
		state.editRow[col] = e.target.value
	})
	component.delegate('input', '.new-input', (e) => {
		const col = e.target.dataset.col
		state.newRow[col] = e.target.value
	})
}

export function render() {
	const { tables, selectedTable, columns, rows, newRow, editIdx, editRow,
		sql, queryResult, loading, error, schema } = state

	return `
	<div class="card full-width">
		<div class="hdr">
			<span>SQLite Database</span>
			<button id="btn-refresh-tables" class="btn-icon" title="Refresh">↻</button>
		</div>
		<div class="bd">
			${error ? `<div class="err" style="margin-bottom:12px">${error}</div>` : ''}

			<!-- Table Selection Grid -->
			<label>Tables</label>
			<div class="grid2" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:12px;margin-bottom:20px">
				${tables.map(t => `
					<div class="card ${t === selectedTable ? 'feature-card' : ''}" data-select-table="${t}" style="cursor:pointer;padding:12px;text-align:center;font-size:0.85rem;font-weight:500">
						${t}
					</div>
				`).join('')}
				${tables.length === 0 ? '<div class="empty-state">No tables found.</div>' : ''}
			</div>

			<!-- SQL Console -->
			<div style="margin-bottom:16px">
				<label>SQL Console</label>
				<div style="display:flex;gap:8px">
					<textarea id="sql-input" rows="2" style="flex:1;font-family:monospace;font-size:0.82rem;padding:8px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;resize:vertical" placeholder="SELECT * FROM ${selectedTable}">${sql}</textarea>
					<button id="btn-run-sql" ${loading ? 'disabled' : ''} style="align-self:flex-end">Run</button>
				</div>
			</div>

			${queryResult ? queryResult.message
				? `<div style="color:#4ade80;margin-bottom:12px;font-size:0.85rem">${queryResult.message}</div>`
				: queryResult.columns ? `
				<div style="max-height:200px;overflow:auto;border:1px solid #1e293b;border-radius:6px;margin-bottom:16px">
					<table style="width:100%;border-collapse:collapse;font-size:0.8rem">
						<thead><tr>${queryResult.columns.map(c => `<th style="padding:6px 10px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8;position:sticky;top:0;background:#0f172a">${c}</th>`).join('')}</tr></thead>
						<tbody>${(queryResult.rows || []).map(r => `<tr>${queryResult.columns.map(c => `<td style="padding:4px 10px;border-bottom:1px solid #1e293b;color:#e2e8f0">${r[c] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
					</table>
				</div>` : '' : ''}

			<!-- Schema -->
			${schema.length ? `
			<details style="margin-bottom:16px">
				<summary style="cursor:pointer;color:#94a3b8;font-size:0.82rem;margin-bottom:6px">Schema (${selectedTable})</summary>
				<div style="max-height:120px;overflow:auto;border:1px solid #1e293b;border-radius:6px">
					<table style="width:100%;border-collapse:collapse;font-size:0.78rem">
						<thead><tr><th style="padding:4px 8px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8">Column</th><th style="padding:4px 8px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8">Type</th><th style="padding:4px 8px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8">PK</th></tr></thead>
						<tbody>${schema.map(s => `<tr><td style="padding:3px 8px;color:#e2e8f0">${s.name}</td><td style="padding:3px 8px;color:#94a3b8">${s.type}</td><td style="padding:3px 8px;color:${s.pk ? '#fbbf24' : '#475569'}">${s.pk ? '✓' : ''}</td></tr>`).join('')}</tbody>
					</table>
				</div>
			</details>` : ''}

			<!-- Data Table -->
			${columns.length ? `
			<div style="max-height:400px;overflow:auto;border:1px solid #1e293b;border-radius:6px;margin-bottom:12px">
				<table style="width:100%;border-collapse:collapse;font-size:0.8rem">
					<thead><tr>
						${columns.map(c => `<th style="padding:6px 10px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8;position:sticky;top:0;background:#0f172a">${c}</th>`).join('')}
						<th style="padding:6px 10px;border-bottom:1px solid #334155;color:#94a3b8;position:sticky;top:0;background:#0f172a"></th>
					</tr></thead>
					<tbody>
						${rows.map((r, i) => editIdx === i ? `
						<tr style="background:#1e293b">
							${columns.map(c => `<td style="padding:2px 4px"><input class="edit-input" data-col="${c}" value="${editRow[c] ?? ''}" style="width:100%;padding:2px 6px;border-radius:4px;border:1px solid #475569;background:#0f172a;color:#e2e8f0;font-size:0.8rem" /></td>`).join('')}
							<td style="padding:2px 4px;white-space:nowrap">
								<button class="btn-save-edit" style="font-size:0.75rem;padding:2px 6px">✓</button>
								<button class="btn-cancel-edit" style="font-size:0.75rem;padding:2px 6px">✕</button>
							</td>
						</tr>` : `
						<tr>
							${columns.map(c => `<td style="padding:4px 10px;border-bottom:1px solid #1e293b;color:#e2e8f0">${r[c] ?? ''}</td>`).join('')}
							<td style="padding:4px 10px;border-bottom:1px solid #1e293b;white-space:nowrap">
								<button class="btn-edit" data-idx="${i}" style="font-size:0.75rem;padding:1px 5px">✎</button>
								<button class="btn-delete" data-idx="${i}" style="font-size:0.75rem;padding:1px 5px;color:#f87171">✕</button>
							</td>
						</tr>`).join('')}
						<!-- Insert row -->
						<tr style="background:#0f172a;border-top:1px solid #334155">
							${columns.map(c => `<td style="padding:2px 4px"><input class="new-input" data-col="${c}" value="${newRow[c] ?? ''}" placeholder="${c}" style="width:100%;padding:2px 6px;border-radius:4px;border:1px solid #334155;background:#020617;color:#e2e8f0;font-size:0.8rem" /></td>`).join('')}
							<td style="padding:2px 4px"><button id="btn-insert" style="font-size:0.75rem;padding:2px 6px">+ Add</button></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div style="color:#64748b;font-size:0.78rem">${rows.length} row(s)${rows.length >= 200 ? ' (limited to 200)' : ''}</div>
			` : `<div style="color:#64748b;text-align:center;padding:24px">${tables.length ? 'Select a table above' : 'No tables found. Use SQL Console to create one.'}</div>`}
		</div>
	</div>`
}
