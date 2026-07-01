module git

import src.core
import src.util

import os
import json

struct GitCloneResult {
	success bool
	repo_name string @[json: 'repoName']
	output string
}

fn sanitize_git_url(url string) ?string {
	if url.len == 0 || url.len > 2048 {
		return none
	}
	for c in url {
		if !c.is_alnum() && c != `.` && c != `_` && c != `-` && c != `/` && c != `:` && c != `@` && c != `~` {
			return none
		}
	}
	return url
}

fn rpc_git_clone(req string, mut app &core.App) string {
	url := util.get_arg(req, 0) or { return util.err_resp('Missing repo URL') }
	safe_url := sanitize_git_url(url) or { return util.err_resp('Invalid URL: contains disallowed characters') }
	os.mkdir_all('workspace') or { return util.err_resp('Failed to create workspace: $err.msg()') }
	cmd := 'cd workspace && git clone --depth=1 ' + safe_url + ' 2>&1'
	res := util.exec(cmd)
	if res.exit_code != 0 {
		return util.err_resp(res.output)
	}
	repo_name := safe_url.split('/').last().replace('.git', '')
	return json.encode(GitCloneResult{
		success: true
		repo_name: repo_name
		output: res.output
	})
}

fn rpc_git_list(req string, mut app &core.App) string {
	if !os.is_dir('workspace') {
		return json.encode({ 'repos': []string{} })
	}
	entries := os.ls('workspace') or { return json.encode({ 'repos': []string{} }) }
	mut repos := []string{}
	for entry in entries {
		full := os.join_path('workspace', entry)
		if os.is_dir(full) && os.exists(os.join_path(full, '.git')) {
			repos << entry
		}
	}
	return json.encode({ 'repos': repos })
}

fn rpc_git_remove(req string, mut app &core.App) string {
	name := util.get_arg(req, 0) or { return util.err_resp('Missing repo name') }
	if name.len == 0 || name.len > 256 {
		return util.err_resp('Invalid repo name')
	}
	for c in name {
		if !c.is_alnum() && c != `_` && c != `-` && c != `.` {
			return util.err_resp('Invalid repo name: contains disallowed characters')
		}
	}
	target := os.join_path('workspace', name)
	trash_dir := 'workspace_trash'
	trash_target := os.join_path(trash_dir, name)
	if !os.is_dir(target) {
		return util.err_resp('Repository not found: $name')
	}
	os.mkdir_all(trash_dir) or { return util.err_resp('Failed to create trash: $err.msg()') }
	if os.is_dir(trash_target) {
		os.rmdir_all(trash_target) or {}
	}
	os.mv(target, trash_target) or { return util.err_resp('Failed to remove: $err.msg()') }
	return json.encode({ 'success': true })
}

fn rpc_git_restore(req string, mut app &core.App) string {
	name := util.get_arg(req, 0) or { return util.err_resp('Missing repo name') }
	if name.len == 0 || name.len > 256 {
		return util.err_resp('Invalid repo name')
	}
	for c in name {
		if !c.is_alnum() && c != `_` && c != `-` && c != `.` {
			return util.err_resp('Invalid repo name: contains disallowed characters')
		}
	}
	trash_target := os.join_path('workspace_trash', name)
	target := os.join_path('workspace', name)
	if !os.is_dir(trash_target) {
		return util.err_resp('Repository not found in trash: $name')
	}
	os.mkdir_all('workspace') or {}
	if os.is_dir(target) {
		return util.err_resp('Cannot restore, repository already exists: $name')
	}
	os.mv(trash_target, target) or { return util.err_resp('Failed to restore: $err.msg()') }
	return json.encode({ 'success': true })
}

fn rpc_git_trash_list(req string, mut app &core.App) string {
	if !os.is_dir('workspace_trash') {
		return json.encode({ 'repos': []string{} })
	}
	entries := os.ls('workspace_trash') or { return json.encode({ 'repos': []string{} }) }
	mut repos := []string{}
	for entry in entries {
		full := os.join_path('workspace_trash', entry)
		if os.is_dir(full) {
			repos << entry
		}
	}
	return json.encode({ 'repos': repos })
}

pub fn register(mut app core.App) {
	app.register_rpc('gitClone', fn (req string, mut app &core.App) string { return rpc_git_clone(req, mut app) })
	app.register_rpc('gitList', fn (req string, mut app &core.App) string { return rpc_git_list(req, mut app) })
	app.register_rpc('gitRemove', fn (req string, mut app &core.App) string { return rpc_git_remove(req, mut app) })
	app.register_rpc('gitRestore', fn (req string, mut app &core.App) string { return rpc_git_restore(req, mut app) })
	app.register_rpc('gitTrashList', fn (req string, mut app &core.App) string { return rpc_git_trash_list(req, mut app) })
}
