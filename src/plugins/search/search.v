module search

import src.core
import src.util

import os
import json

fn rpc_search_query(req string, mut app &core.App) string {
	query := util.get_arg(req, 0) or { return util.err_resp("Missing query") }
	if !os.is_dir('workspace') {
		return json.encode({ 'results': '' })
	}
	res := util.exec('cd workspace && git grep -n --no-color ' + query + ' 2>/dev/null')
	if res.exit_code != 0 {
		return json.encode({ 'results': '' })
	}
	return json.encode({ 'results': res.output })
}

pub fn register(mut app core.App) {
	app.register_rpc('shell.search_query', fn (req string, mut app &core.App) string { return rpc_search_query(req, mut app) })
}
