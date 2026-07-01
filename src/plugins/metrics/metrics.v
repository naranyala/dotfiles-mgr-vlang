module metrics

import src.core
import src.util

import os
import json

fn count_files(dir string) (int, u64) {
	mut count := 0
	mut total_size := u64(0)
	entries := os.ls(dir) or { return 0, 0 }
	for entry in entries {
		full := os.join_path(dir, entry)
		if os.is_dir(full) {
			c, s := count_files(full)
			count += c
			total_size += s
		} else {
			count++
			total_size += os.file_size(full)
		}
	}
	return count, total_size
}

fn rpc_metrics_get_stats(req string, mut app &core.App) string {
	if !os.is_dir('workspace') {
		return util.err_resp("No workspace directory")
	}
	count, total_size := count_files('workspace')
	return json.encode({
		'total_files': count.str()
		'total_size_bytes': total_size.str()
		'cpuCount': '0'
	})
}

pub fn register(mut app core.App) {
	app.register_rpc('metrics_getStats', fn (req string, mut app &core.App) string { return rpc_metrics_get_stats(req, mut app) })
}
