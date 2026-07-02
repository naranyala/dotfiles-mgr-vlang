module processes

import src.core
import src.util

import json

struct ProcEntry {
	user    string
	pid     string
	cpu     f64
	mem     f64
	vsz     string
	rss     string
	command string
}

fn rpc_ps_list(req string, mut app &core.App) string {
	sort_by := util.get_arg(req, 0) or { "cpu" }
	sort_flag := if sort_by == "mem" { "-%mem" } else { "-%cpu" }
	raw := util.exec_output("ps aux --sort=$sort_flag 2>/dev/null")
	if raw == '' {
		return util.err_resp("failed to list processes")
	}
	lines := raw.split('\n')
	if lines.len < 2 {
		return '[]'
	}
	mut procs := []ProcEntry{}
	for i := 1; i < lines.len; i++ {
		parts := lines[i].trim_space().split(' ').filter(it != '')
		if parts.len < 11 { continue }
		cmd := parts[10..].join(' ')
		cmd_display := if cmd.len > 60 { cmd[..60] } else { cmd }
		procs << ProcEntry{
			user: parts[0]
			pid: parts[1]
			cpu: parts[2].f64()
			mem: parts[3].f64()
			vsz: parts[4]
			rss: parts[5]
			command: cmd_display
		}
	}
	return json.encode(procs)
}

fn rpc_ps_kill(req string, mut app &core.App) string {
	pid := util.get_arg(req, 0) or { return util.err_resp("missing pid") }
	res := util.exec("kill $pid")
	if res.exit_code == 0 {
		return '{"ok": true}'
	}
	return json.encode({ "error": res.output })
}

pub fn register(mut app core.App) {
	app.register_rpc('shell.psList', fn (req string, mut app &core.App) string { return rpc_ps_list(req, mut app) })
	app.register_rpc('shell.psKill', fn (req string, mut app &core.App) string { return rpc_ps_kill(req, mut app) })
}
