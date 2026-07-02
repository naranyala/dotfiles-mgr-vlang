module core

import src.util
import x.json2
import os

fn C.getpid() int

pub fn register_builtins(mut app App) {
	app.register_rpc('shell.log', fn (req string, mut a App) string {
		msg := util.get_arg(req, 0) or { "" }
		level := util.get_arg(req, 1) or { "info" }
		println("[FRONTEND] [${level.to_upper()}] ${msg}")
		a.log_to_frontend(msg, level)
		return "{}"
	})

	app.register_rpc('shell.dumpBackendState', fn (req string, mut a App) string {
		divider := '═'.repeat(60)
		println('\n' + divider)
		println('  BACKEND STATE DUMP')
		println(divider)

		mut handler_names := []string{}
		for k, _ in a.handlers {
			handler_names << k
		}
		println('[registered_rpcs] ${handler_names}')
		println('[process.cwd] ${os.getwd()}')
		println('[process.pid] ${C.getpid()}')
		println('[platform] ${os.user_os()}')
		println('[home_dir] ${os.home_dir()}')

		if os.is_dir('workspace') {
			entries := os.ls('workspace') or { []string{} }
			println('[workspace] ${entries}')
		} else {
			println('[workspace] (not created)')
		}

		if os.is_dir('workspace_trash') {
			entries := os.ls('workspace_trash') or { []string{} }
			println('[workspace_trash] ${entries}')
		} else {
			println('[workspace_trash] (empty)')
		}

		println(divider)
		println('  END BACKEND STATE DUMP')
		println(divider + '\n')

		mut state := map[string]json2.Any{}
		mut handlers_arr := []json2.Any{}
		for h in handler_names {
			handlers_arr << json2.Any(h)
		}
		state['registered_rpcs'] = handlers_arr
		state['rpc_count'] = a.handlers.len
		state['cwd'] = os.getwd()
		state['platform'] = os.user_os()
		state['home_dir'] = os.home_dir()

		if os.is_dir('workspace') {
			ws_entries := os.ls('workspace') or { []string{} }
			mut ws_arr := []json2.Any{}
			for e in ws_entries {
				ws_arr << json2.Any(e)
			}
			state['workspace'] = ws_arr
		}

		if os.is_dir('workspace_trash') {
			tr_entries := os.ls('workspace_trash') or { []string{} }
			mut tr_arr := []json2.Any{}
			for e in tr_entries {
				tr_arr << json2.Any(e)
			}
			state['workspace_trash'] = tr_arr
		}

		return state.str()
	})
}
