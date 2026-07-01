module files

import src.core
import src.util

import os
import json

struct StatResult {
	size u64
	is_dir bool @[json: 'isDir']
	is_link bool @[json: 'isLink']
	mode int
}

fn rpc_list_dir(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp('Missing path') }
	if path.len > 4096 {
		return util.err_resp('Path too long')
	}
	entries := os.ls(path) or { return util.err_resp(err.msg()) }
	return json.encode({ 'entries': entries })
}

fn rpc_read_file(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp('Missing path') }
	if path.len > 4096 {
		return util.err_resp('Path too long')
	}
	content := os.read_file(path) or { return util.err_resp(err.msg()) }
	return json.encode({ 'content': content })
}

fn rpc_write_file(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp('Missing path') }
	content := util.get_arg(req, 1) or { return util.err_resp('Missing content') }
	if path.len > 4096 {
		return util.err_resp('Path too long')
	}
	os.write_file(path, content) or { return util.err_resp(err.msg()) }
	return util.ok_resp()
}

fn rpc_stat(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp("Missing path") }
	is_d := os.is_dir(path)
	is_l := os.is_link(path)
	sz := if !is_d { os.file_size(path) } else { u64(0) }
	return json.encode(StatResult{
		size: sz
		is_dir: is_d
		is_link: is_l
		mode: 0
	})
}

fn rpc_glob(req string, mut app &core.App) string {
	pat := util.get_arg(req, 0) or { return util.err_resp("Missing pattern") }
	matches := os.glob(pat) or { []string{} }
	return json.encode({ "matches": matches })
}

fn rpc_exists(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp("Missing path") }
	return if os.exists(path) { '{"exists": true}' } else { '{"exists": false}' }
}

fn rpc_is_dir(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp("Missing path") }
	return if os.is_dir(path) { '{"is_dir": true}' } else { '{"is_dir": false}' }
}

fn rpc_mkdir(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp("Missing path") }
	os.mkdir_all(path) or { return util.err_resp(err.msg()) }
	return util.ok_resp()
}

fn rpc_remove(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { return util.err_resp("Missing path") }
	if os.is_dir(path) {
		os.rmdir_all(path) or { return util.err_resp(err.msg()) }
	} else {
		os.rm(path) or { return util.err_resp(err.msg()) }
	}
	return util.ok_resp()
}

fn rpc_copy(req string, mut app &core.App) string {
	src := util.get_arg(req, 0) or { return util.err_resp("Missing src") }
	dst := util.get_arg(req, 1) or { return util.err_resp("Missing dst") }
	os.cp_all(src, dst, true) or { return util.err_resp(err.msg()) }
	return util.ok_resp()
}

fn rpc_move(req string, mut app &core.App) string {
	src := util.get_arg(req, 0) or { return util.err_resp("Missing src") }
	dst := util.get_arg(req, 1) or { return util.err_resp("Missing dst") }
	os.mv(src, dst) or { return util.err_resp(err.msg()) }
	return util.ok_resp()
}

pub fn register(mut app core.App) {
	app.register_rpc('listDir', fn (req string, mut app &core.App) string { return rpc_list_dir(req, mut app) })
	app.register_rpc('readFile', fn (req string, mut app &core.App) string { return rpc_read_file(req, mut app) })
	app.register_rpc('writeFile', fn (req string, mut app &core.App) string { return rpc_write_file(req, mut app) })
	app.register_rpc('stat', fn (req string, mut app &core.App) string { return rpc_stat(req, mut app) })
	app.register_rpc('glob', fn (req string, mut app &core.App) string { return rpc_glob(req, mut app) })
	app.register_rpc('exists', fn (req string, mut app &core.App) string { return rpc_exists(req, mut app) })
	app.register_rpc('isDir', fn (req string, mut app &core.App) string { return rpc_is_dir(req, mut app) })
	app.register_rpc('mkdir', fn (req string, mut app &core.App) string { return rpc_mkdir(req, mut app) })
	app.register_rpc('remove', fn (req string, mut app &core.App) string { return rpc_remove(req, mut app) })
	app.register_rpc('copy', fn (req string, mut app &core.App) string { return rpc_copy(req, mut app) })
	app.register_rpc('move', fn (req string, mut app &core.App) string { return rpc_move(req, mut app) })
}
