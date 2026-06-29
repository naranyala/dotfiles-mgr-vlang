module tools

import src.core

import os
import json

fn rpc_env(req string, mut app core.App) string {
	key := core.get_arg(req, 0) or { return '{"error": "Missing key"}' }
	val := os.getenv(key)
	if val == "" { return '{"error": "not set"}' }
	return json.encode({ "value": val })
}

fn rpc_clipboard_get(req string, mut app core.App) string {
	res := os.execute("xclip -o -selection clipboard")
	return json.encode({ "text": res.output })
}

fn rpc_clipboard_set(req string, mut app core.App) string {
	text := core.get_arg(req, 0) or { return '{"error": "Missing text"}' }
	mut child := os.new_process("xclip")
	child.set_args(["-selection", "clipboard"])
	child.set_redirect_stdio()
	child.run()
	child.stdin_write(text)
	child.close()
	child.wait()
	return '{"success": true}'
}

fn rpc_exec(req string, mut app core.App) string {
	cmd := core.get_arg(req, 0) or { return '{"error": "Missing command"}' }
	res := os.execute(cmd)
	return json.encode({ "output": res.output })
}

fn rpc_which(req string, mut app core.App) string {
	cmd := core.get_arg(req, 0) or { return '{"error": "Missing command"}' }
	res := os.execute("which $cmd")
	return json.encode({ "found": res.exit_code == 0 })
}

pub fn register(mut app core.App) {
	app.register_rpc('env', fn (req string, mut app core.App) string { return rpc_env(req, mut app) })
	app.register_rpc('clipboardGet', fn (req string, mut app core.App) string { return rpc_clipboard_get(req, mut app) })
	app.register_rpc('clipboardSet', fn (req string, mut app core.App) string { return rpc_clipboard_set(req, mut app) })
	app.register_rpc('exec', fn (req string, mut app core.App) string { return rpc_exec(req, mut app) })
	app.register_rpc('which', fn (req string, mut app core.App) string { return rpc_which(req, mut app) })
}
