module state

import src.core
import os
import x.json2

fn rpc_state_get(req string, mut app &core.App) string {
	mut rpc_names := []string{}
	for k, _ in app.handlers {
		rpc_names << k
	}
	rpc_names.sort()

	mut arr := []json2.Any{}
	for name in rpc_names {
		arr << json2.Any(name)
	}

	mut m := map[string]json2.Any{}
	m['rpc_count'] = json2.Any(rpc_names.len)
	m['rpc_names'] = arr
	m['cwd'] = json2.Any(os.getwd())
	m['platform'] = json2.Any(os.user_os())
	m['home_dir'] = json2.Any(os.home_dir())
	return m.str()
}

pub fn register(mut app core.App) {
	app.register_rpc('state.get', fn (req string, mut app &core.App) string { return rpc_state_get(req, mut app) })
}
