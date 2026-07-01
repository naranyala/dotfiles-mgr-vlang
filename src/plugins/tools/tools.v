module tools

import src.core
import src.util

import os
import json

fn rpc_env_get(req string, mut app &core.App) string {
	key := util.get_arg(req, 0) or { return util.err_resp('Missing key') }
	if key.len == 0 || key.len > 4096 {
		return util.err_resp('Invalid key')
	}
	val := os.getenv(key)
	if val == '' { return util.err_resp('not set') }
	return json.encode({ 'value': val })
}

fn rpc_env_set(req string, mut app &core.App) string {
	name := util.get_arg(req, 0) or { return util.err_resp('Missing name') }
	value := util.get_arg(req, 1) or { return util.err_resp('Missing value') }
	if name.len == 0 || name.len > 4096 {
		return util.err_resp('Invalid environment variable name')
	}
	os.setenv(name, value, true)
	return util.ok_resp()
}

fn rpc_env_list(req string, mut app &core.App) string {
	return json.encode(os.environ())
}

fn rpc_cwd(req string, mut app &core.App) string {
	wd := os.getwd()
	return json.encode({ 'path': wd })
}

fn rpc_set_cwd(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp('Missing path') }
	os.chdir(path) or { return util.err_resp(err.msg()) }
	return util.ok_resp()
}

fn rpc_clipboard_get(req string, mut app &core.App) string {
	res := util.exec('xclip -o -selection clipboard 2>/dev/null')
	if res.exit_code != 0 && res.exit_code != 1 {
		return util.err_resp('Clipboard read failed (exit ${res.exit_code})')
	}
	return json.encode({ 'text': res.output })
}

fn rpc_clipboard_set(req string, mut app &core.App) string {
	text := util.get_arg(req, 0) or { return util.err_resp('Missing text') }
	mut child := os.new_process('xclip')
	child.set_args(['-selection', 'clipboard'])
	child.set_redirect_stdio()
	child.run()
	child.stdin_write(text)
	child.close()
	child.wait()
	if child.status != .exited {
		return util.err_resp('Clipboard write failed')
	}
	return util.ok_resp()
}

fn rpc_exec(req string, mut app &core.App) string {
	cmd := util.get_arg(req, 0) or { return util.err_resp('Missing command') }
	if cmd.len == 0 {
		return util.err_resp('Command cannot be empty')
	}
	if cmd.len > 65536 {
		return util.err_resp('Command too long')
	}
	output := util.exec_output(cmd)
	return json.encode({ 'output': output })
}

fn rpc_exec_bg(req string, mut app &core.App) string {
	cmd := util.get_arg(req, 0) or { return util.err_resp('Missing command') }
	if cmd.len == 0 {
		return util.err_resp('Command cannot be empty')
	}
	mut child := os.new_process('/bin/sh')
	child.set_args(['-c', cmd])
	child.set_redirect_stdio()
	child.run()
	pid := child.pid.str()
	return json.encode({ 'jobId': pid, 'pid': pid })
}

fn rpc_exec_read(req string, mut app &core.App) string {
	_ = util.get_arg(req, 0) or { return util.err_resp('Missing jobId') }
	return util.err_resp('execRead not implemented')
}

fn rpc_exec_kill(req string, mut app &core.App) string {
	pid_str := util.get_arg(req, 0) or { return util.err_resp('Missing pid') }
	pid := pid_str.int()
	if pid <= 0 {
		return util.err_resp('Invalid pid')
	}
	C.kill(pid, 9)
	return util.ok_resp()
}

fn rpc_process_signal(req string, mut app &core.App) string {
	pid_str := util.get_arg(req, 0) or { return util.err_resp('Missing pid') }
	sig_str := util.get_arg(req, 1) or { '9' }
	pid := pid_str.int()
	sig := sig_str.int()
	if pid <= 0 {
		return util.err_resp('Invalid pid')
	}
	if sig < 1 || sig > 31 {
		return util.err_resp('Invalid signal number')
	}
	C.kill(pid, sig)
	return util.ok_resp()
}

fn rpc_path_join(req string, mut app &core.App) string {
	raw := util.get_arg(req, 0) or { return util.err_resp('Missing parts') }
	parts := raw.split(',')
	return json.encode({ 'path': os.join_path(...parts) })
}

fn rpc_path_dirname(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp('Missing path') }
	return json.encode({ 'path': os.dir(path) })
}

fn rpc_path_basename(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp('Missing path') }
	return json.encode({ 'name': os.base(path) })
}

fn rpc_expand_env(req string, mut app &core.App) string {
	tpl := util.get_arg(req, 0) or { return util.err_resp('Missing template') }
	return json.encode({ 'value': os.expand_tilde_to_home(tpl) })
}

fn rpc_which(req string, mut app &core.App) string {
	cmd := util.get_arg(req, 0) or { return util.err_resp('Missing command') }
	return json.encode({ 'found': util.which(cmd) })
}

pub fn register(mut app core.App) {
	app.register_rpc('envGet', fn (req string, mut app &core.App) string { return rpc_env_get(req, mut app) })
	app.register_rpc('envSet', fn (req string, mut app &core.App) string { return rpc_env_set(req, mut app) })
	app.register_rpc('envList', fn (req string, mut app &core.App) string { return rpc_env_list(req, mut app) })
	app.register_rpc('cwd', fn (req string, mut app &core.App) string { return rpc_cwd(req, mut app) })
	app.register_rpc('setCwd', fn (req string, mut app &core.App) string { return rpc_set_cwd(req, mut app) })
	app.register_rpc('clipboardGet', fn (req string, mut app &core.App) string { return rpc_clipboard_get(req, mut app) })
	app.register_rpc('clipboardSet', fn (req string, mut app &core.App) string { return rpc_clipboard_set(req, mut app) })
	app.register_rpc('exec', fn (req string, mut app &core.App) string { return rpc_exec(req, mut app) })
	app.register_rpc('execBg', fn (req string, mut app &core.App) string { return rpc_exec_bg(req, mut app) })
	app.register_rpc('execRead', fn (req string, mut app &core.App) string { return rpc_exec_read(req, mut app) })
	app.register_rpc('execKill', fn (req string, mut app &core.App) string { return rpc_exec_kill(req, mut app) })
	app.register_rpc('processSignal', fn (req string, mut app &core.App) string { return rpc_process_signal(req, mut app) })
	app.register_rpc('pathJoin', fn (req string, mut app &core.App) string { return rpc_path_join(req, mut app) })
	app.register_rpc('pathDirname', fn (req string, mut app &core.App) string { return rpc_path_dirname(req, mut app) })
	app.register_rpc('pathBasename', fn (req string, mut app &core.App) string { return rpc_path_basename(req, mut app) })
	app.register_rpc('expandEnv', fn (req string, mut app &core.App) string { return rpc_expand_env(req, mut app) })
	app.register_rpc('which', fn (req string, mut app &core.App) string { return rpc_which(req, mut app) })
}
