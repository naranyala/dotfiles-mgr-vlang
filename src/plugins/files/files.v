module files

import src.core

import os
import json

struct StatResult {
	size u64
	is_dir bool @[json: 'isDir']
	is_link bool @[json: 'isLink']
	mode int
}

fn rpc_list_dir(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { return '{"error": "Missing path"}' }
	entries := os.ls(path) or { return '{"error": "$err.msg()"}' }
	return json.encode({ "entries": entries })
}

fn rpc_read_file(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { return '{"error": "Missing path"}' }
	content := os.read_file(path) or { return '{"error": "$err.msg()"}' }
	return json.encode({ "content": content })
}

fn rpc_write_file(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { return '{"error": "Missing path"}' }
	content := core.get_arg(req, 1) or { return '{"error": "Missing content"}' }
	os.write_file(path, content) or { return '{"error": "$err.msg()"}' }
	return '{"success": true}'
}

fn rpc_stat(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { return '{"error": "Missing path"}' }
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

fn rpc_glob(req string, mut app core.App) string {
	pat := core.get_arg(req, 0) or { return '{"error": "Missing pattern"}' }
	matches := os.glob(pat) or { []string{} }
	return json.encode({ "matches": matches })
}

fn rpc_exists(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { return '{"error": "Missing path"}' }
	return if os.exists(path) { '{"exists": true}' } else { '{"exists": false}' }
}

fn rpc_is_dir(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { return '{"error": "Missing path"}' }
	return if os.is_dir(path) { '{"is_dir": true}' } else { '{"is_dir": false}' }
}

fn rpc_mkdir(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { return '{"error": "Missing path"}' }
	os.mkdir_all(path) or { return '{"error": "$err.msg()"}' }
	return '{"success": true}'
}

fn rpc_remove(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { return '{"error": "Missing path"}' }
	if os.is_dir(path) {
		os.rmdir_all(path) or { return '{"error": "$err.msg()"}' }
	} else {
		os.rm(path) or { return '{"error": "$err.msg()"}' }
	}
	return '{"success": true}'
}

fn rpc_copy(req string, mut app core.App) string {
	src := core.get_arg(req, 0) or { return '{"error": "Missing src"}' }
	dst := core.get_arg(req, 1) or { return '{"error": "Missing dst"}' }
	os.cp_all(src, dst, true) or { return '{"error": "$err.msg()"}' }
	return '{"success": true}'
}

fn rpc_move(req string, mut app core.App) string {
	src := core.get_arg(req, 0) or { return '{"error": "Missing src"}' }
	dst := core.get_arg(req, 1) or { return '{"error": "Missing dst"}' }
	os.mv(src, dst) or { return '{"error": "$err.msg()"}' }
	return '{"success": true}'
}

pub fn register(mut app core.App) {
	app.register_rpc('listDir', fn (req string, mut app core.App) string { return rpc_list_dir(req, mut app) })
	app.register_rpc('readFile', fn (req string, mut app core.App) string { return rpc_read_file(req, mut app) })
	app.register_rpc('writeFile', fn (req string, mut app core.App) string { return rpc_write_file(req, mut app) })
	app.register_rpc('stat', fn (req string, mut app core.App) string { return rpc_stat(req, mut app) })
	app.register_rpc('glob', fn (req string, mut app core.App) string { return rpc_glob(req, mut app) })
	app.register_rpc('exists', fn (req string, mut app core.App) string { return rpc_exists(req, mut app) })
	app.register_rpc('isDir', fn (req string, mut app core.App) string { return rpc_is_dir(req, mut app) })
	app.register_rpc('mkdir', fn (req string, mut app core.App) string { return rpc_mkdir(req, mut app) })
	app.register_rpc('remove', fn (req string, mut app core.App) string { return rpc_remove(req, mut app) })
	app.register_rpc('copy', fn (req string, mut app core.App) string { return rpc_copy(req, mut app) })
	app.register_rpc('move', fn (req string, mut app core.App) string { return rpc_move(req, mut app) })
}
