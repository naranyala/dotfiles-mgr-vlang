module fstree

import src.core
import src.util

import os
import json

struct TreeNode {
	name     string
	id       string
	node_type string @[json: 'type']
	children []TreeNode
}

fn build_tree(dir string, base string) []TreeNode {
	mut nodes := []TreeNode{}
	entries := os.ls(dir) or { return nodes }
	for entry in entries {
		full := os.join_path(dir, entry)
		rel := if base.len > 0 { base + '/' + entry } else { entry }
		if os.is_dir(full) {
			children := build_tree(full, rel)
			nodes << TreeNode{
				name: entry
				id: rel
				node_type: 'folder'
				children: children
			}
		} else {
			nodes << TreeNode{
				name: entry
				id: rel
				node_type: 'file'
			}
		}
	}
	return nodes
}

fn rpc_get_tree(req string, mut app &core.App) string {
	repo_id := util.get_arg(req, 0) or { return util.err_resp("Missing repo id") }
	repo_dir := os.join_path('workspace', repo_id)
	if !os.is_dir(repo_dir) {
		return util.err_resp("Repository not found: " + repo_id)
	}
	tree := build_tree(repo_dir, '')
	return json.encode(tree)
}

fn rpc_get_file_content(req string, mut app &core.App) string {
	entry_id := util.get_arg(req, 0) or { return util.err_resp("Missing entry id") }
	parts := entry_id.split('/')
	if parts.len < 2 {
		return util.err_resp("Invalid entry id")
	}
	repo_id := parts[0]
	file_path := parts[1..].join('/')
	full := os.join_path('workspace', repo_id, file_path)
	content := os.read_file(full) or { return util.err_resp(err.msg()) }
	return json.encode(content)
}

pub fn register(mut app core.App) {
	app.register_rpc('get_tree', fn (req string, mut app &core.App) string { return rpc_get_tree(req, mut app) })
	app.register_rpc('get_file_content', fn (req string, mut app &core.App) string { return rpc_get_file_content(req, mut app) })
}
