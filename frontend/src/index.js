import './rpc.js'
import { reactive } from './signals.js'
import { ReactiveComponent } from './component.js'

const state = reactive({
	sysInfo: null,
	hostname: '',
	username: '',
	uname: null,
	memory: null,
	uptime: null,
	diskInfo: null,
	fileContent: '',
	filePath: '/tmp/test.txt',
	listDirPath: '/',
	dirEntries: [],
	statInfo: null,
	statPath: '/',
	globPat: '**/*.json',
	globResults: [],
	envKey: 'HOME',
	envVal: '',
	clipText: '',
	execCmd: 'uname -a',
	execResult: '',
	whichCmd: '',
	whichFound: false,
})

async function loadAll() {
	try {
		state.sysInfo = await window.rpc.systemInfo()
	} catch (e) { state.sysInfo = { error: e.message } }
	try {
		state.hostname = (await window.rpc.hostname()).hostname
	} catch (e) { state.hostname = `err: ${e.message}` }
	try {
		state.username = (await window.rpc.username()).username
	} catch (e) { state.username = `err: ${e.message}` }
	try {
		state.uname = await window.rpc.uname()
	} catch (e) { state.uname = { error: e.message } }
	try {
		state.memory = await window.rpc.memoryInfo()
	} catch (e) { state.memory = { error: e.message } }
	try {
		state.uptime = await window.rpc.uptime()
	} catch (e) { state.uptime = { error: e.message } }
	try {
		state.diskInfo = await window.rpc.diskUsage('/')
	} catch (e) { state.diskInfo = { error: e.message } }
}

class SystemDashboard extends ReactiveComponent {
	onMount() {
		loadAll()

		// File browser
		this.delegate('click', '#btn-ls', async () => {
			const res = await window.rpc.listDir(state.listDirPath)
			if (res.error) alert('List Error: ' + res.error)
			else state.dirEntries = res.entries || []
		})
		this.delegate('input', '#ls-path', (e) => (state.listDirPath = e.target.value))

		// File editor
		this.delegate('click', '#btn-read', async () => {
			const res = await window.rpc.readFile(state.filePath)
			if (res.error) alert('Read Error: ' + res.error)
			else state.fileContent = res.content || ''
		})
		this.delegate('click', '#btn-write', async () => {
			const res = await window.rpc.writeFile(state.filePath, state.fileContent)
			if (res.error) alert('Write Error: ' + res.error)
			else alert('Wrote to ' + state.filePath)
		})
		this.delegate('input', '#file-path', (e) => (state.filePath = e.target.value))
		this.delegate('input', '#file-content', (e) => (state.fileContent = e.target.value))

		// Stat
		this.delegate('click', '#btn-stat', async () => {
			const res = await window.rpc.stat(state.statPath)
			if (res.error) alert('Stat Error: ' + res.error)
			else state.statInfo = res
		})
		this.delegate('input', '#stat-path', (e) => (state.statPath = e.target.value))

		// Glob
		this.delegate('click', '#btn-glob', async () => {
			const res = await window.rpc.glob(state.globPat)
			if (res.error) alert('Glob Error: ' + res.error)
			else state.globResults = res.matches || []
		})
		this.delegate('input', '#glob-pat', (e) => (state.globPat = e.target.value))

		// Env
		this.delegate('click', '#btn-env', async () => {
			const res = await window.rpc.env(state.envKey)
			if (res.error) state.envVal = 'not set'
			else state.envVal = res.value
		})
		this.delegate('input', '#env-key', (e) => (state.envKey = e.target.value))

		// Clipboard
		this.delegate('click', '#btn-clip-get', async () => {
			const res = await window.rpc.clipboardGet()
			if (res.error) alert('Clipboard Error: ' + res.error)
			else state.clipText = res.text
		})
		this.delegate('click', '#btn-clip-set', async () => {
			const res = await window.rpc.clipboardSet(state.clipText)
			if (res.error) alert('Clipboard Error: ' + res.error)
			else alert('Copied!')
		})
		this.delegate('input', '#clip-text', (e) => (state.clipText = e.target.value))

		// Exec
		this.delegate('click', '#btn-exec', async () => {
			const res = await window.rpc.exec(state.execCmd)
			if (res.error) state.execResult = 'Error: ' + res.error
			else state.execResult = res.output || '(no output)'
		})
		this.delegate('input', '#exec-cmd', (e) => (state.execCmd = e.target.value))

		// Which
		this.delegate('click', '#btn-which', async () => {
			const r1 = await window.rpc.which(state.whichCmd)
			state.whichFound = r1.found
		})
		this.delegate('input', '#which-cmd', (e) => (state.whichCmd = e.target.value))
	}

	render() {
		const { sysInfo, hostname, username, uname, memory, uptime, diskInfo,
			statInfo, statPath, globResults, globPat,
			envKey, envVal, clipText, execCmd, execResult, whichCmd, whichFound,
			listDirPath, dirEntries, filePath, fileContent } = state

		return `
      <style>
        :host { display:block; max-width:800px; margin:20px auto; font-family:system-ui,sans-serif; color:#222; }
        .card { background:#fff; border-radius:10px; box-shadow:0 1px 4px rgba(0,0,0,0.1); margin-bottom:12px; overflow:hidden; }
        .hdr { background:#1e293b; color:#fff; padding:10px 18px; font-size:1rem; font-weight:600; display:flex; justify-content:space-between; }
        .bd  { padding:12px 18px; font-size:0.9rem; }
        .mono { background:#f1f5f9; padding:6px 10px; border-radius:4px; font-family:monospace; font-size:0.85rem; white-space:pre-wrap; word-break:break-all; }
        label { font-weight:600; font-size:0.8rem; display:block; margin-top:8px; }
        input,textarea { width:100%; padding:6px; margin-top:2px; border:1px solid #cbd5e1; border-radius:4px; box-sizing:border-box; font-family:inherit; font-size:0.85rem; }
        textarea { height:70px; resize:vertical; }
        button { background:#3b82f6; color:#fff; border:none; padding:6px 14px; margin:6px 4px 0 0; border-radius:4px; cursor:pointer; font-weight:500; font-size:0.85rem; }
        button:hover { background:#2563eb; }
        .badge { display:inline-block; background:#e2e8f0; padding:1px 6px; border-radius:3px; font-size:0.75rem; margin:1px; }
        .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .ok { color:#16a34a; font-weight:600; }
        .err { color:#dc2626; }
      </style>

      <div class="grid2">

        <!-- System Info -->
        <div class="card">
          <div class="hdr">System</div>
          <div class="bd">
            ${!sysInfo ? '<em>loading…</em>' :
              sysInfo.error ? `<span class="err">${sysInfo.error}</span>` :
              `<div class="mono">Platform: ${sysInfo.platform}<br>Home: ${sysInfo.homeDir}</div>`}
            <div class="mono" style="margin-top:6px">Host: ${hostname}<br>User: ${username}</div>
          </div>
        </div>

        <!-- Uname -->
        <div class="card">
          <div class="hdr">Kernel</div>
          <div class="bd">
            ${!uname ? '<em>loading…</em>' : uname.error ? `<span class="err">${uname.error}</span>` :
              `<div class="mono">${uname.sysname} ${uname.release}<br>${uname.machine}<br>${uname.version}</div>`}
          </div>
        </div>

        <!-- Memory -->
        <div class="card">
          <div class="hdr">Memory</div>
          <div class="bd">
            ${!memory ? '<em>loading…</em>' : memory.error ? `<span class="err">${memory.error}</span>` :
              `<div class="mono">Total: ${(memory.total/1024/1024).toFixed(1)} MB<br>Available: ${(memory.available/1024/1024).toFixed(1)} MB<br>Used: ${memory.usedPercent} %</div>`}
          </div>
        </div>

        <!-- Uptime -->
        <div class="card">
          <div class="hdr">Uptime</div>
          <div class="bd">
            ${!uptime ? '<em>loading…</em>' : uptime.error ? `<span class="err">${uptime.error}</span>` :
              `<div class="mono">${Math.floor(uptime.seconds / 3600)}h ${Math.floor((uptime.seconds % 3600) / 60)}m</div>`}
          </div>
        </div>

        <!-- Disk -->
        <div class="card">
          <div class="hdr">Disk Usage (/)</div>
          <div class="bd">
            ${!diskInfo ? '<em>loading…</em>' : diskInfo.error ? `<span class="err">${diskInfo.error}</span>` :
              `<div class="mono">Total: ${(diskInfo.total/1024/1024/1024).toFixed(1)} GB<br>Used: ${diskInfo.usedPercent} %<br>Free: ${(diskInfo.free/1024/1024/1024).toFixed(1)} GB</div>`}
          </div>
        </div>

        <!-- Glob -->
        <div class="card">
          <div class="hdr">Glob</div>
          <div class="bd">
            <label>Pattern</label>
            <input id="glob-pat" value="${globPat}" />
            <button id="btn-glob">Search</button>
            <div style="margin-top:6px">${globResults.length ? globResults.map(e => `<span class="badge">${e}</span>`).join(' ') : '<span style="color:#94a3b8">(no matches)</span>'}</div>
          </div>
        </div>

        <!-- Stat -->
        <div class="card">
          <div class="hdr">Stat</div>
          <div class="bd">
            <label>Path</label>
            <input id="stat-path" value="${statPath}" />
            <button id="btn-stat">Stat</button>
            ${statInfo ? `<div class="mono" style="margin-top:6px">size: ${statInfo.size}<br>dir: ${statInfo.isDir}<br>link: ${statInfo.isLink}<br>mode: ${statInfo.mode}</div>` : ''}
          </div>
        </div>

        <!-- Env -->
        <div class="card">
          <div class="hdr">Environment</div>
          <div class="bd">
            <label>Key</label>
            <input id="env-key" value="${envKey}" />
            <button id="btn-env">Get</button>
            ${envVal ? `<div class="mono" style="margin-top:6px">${envVal}</div>` : ''}
          </div>
        </div>

        <!-- Clipboard -->
        <div class="card">
          <div class="hdr">Clipboard</div>
          <div class="bd">
            <textarea id="clip-text">${clipText}</textarea>
            <div><button id="btn-clip-get">Paste</button><button id="btn-clip-set">Copy</button></div>
          </div>
        </div>

        <!-- Exec -->
        <div class="card">
          <div class="hdr">Execute</div>
          <div class="bd">
            <label>Command</label>
            <input id="exec-cmd" value="${execCmd}" />
            <button id="btn-exec">Run</button>
            ${execResult ? `<div class="mono" style="margin-top:6px">${execResult}</div>` : ''}
          </div>
        </div>

        <!-- Which -->
        <div class="card">
          <div class="hdr">which</div>
          <div class="bd">
            <label>Program</label>
            <input id="which-cmd" value="${whichCmd}" />
            <button id="btn-which">Check</button>
            ${whichCmd ? `<div style="margin-top:6px">${whichFound ? '<span class="ok">found</span>' : '<span class="err">not found</span>'}</div>` : ''}
          </div>
        </div>

      </div>

      <!-- File Browser (full width) -->
      <div class="card">
        <div class="hdr">File Browser</div>
        <div class="bd">
          <label>Path</label>
          <input id="ls-path" value="${listDirPath}" />
          <button id="btn-ls">List</button>
          <div style="margin-top:6px">${dirEntries.length ? dirEntries.map(e => `<span class="badge">${e}</span>`).join(' ') : '<span style="color:#94a3b8">(empty)</span>'}</div>
        </div>
      </div>

      <!-- File Editor (full width) -->
      <div class="card">
        <div class="hdr">File Editor</div>
        <div class="bd">
          <label>File Path</label>
          <input id="file-path" value="${filePath}" />
          <label>Content</label>
          <textarea id="file-content">${fileContent}</textarea>
          <div><button id="btn-read">Read</button><button id="btn-write">Write</button></div>
        </div>
      </div>`
	}
}

customElements.define('system-dashboard', SystemDashboard)
