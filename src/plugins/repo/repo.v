module repo

import src.core
import os
import json

fn rpc_repo_list(req string, mut app &core.App) string {
	mut repos := []map[string]string{}
	if os.is_dir('workspace') {
		entries := os.ls('workspace') or { []string{} }
		for entry in entries {
			full := os.join_path('workspace', entry)
			if os.is_dir(full) {
				repos << { 'name': entry, 'path': full }
			}
		}
	}
	return json.encode(repos)
}

pub fn register(mut app core.App) {
	app.register_rpc('repo.list', fn (req string, mut app &core.App) string { return rpc_repo_list(req, mut app) })
}
