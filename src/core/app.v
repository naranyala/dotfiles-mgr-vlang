module core

import x.json2
import os

fn C.getpid() int

pub struct BindingCtx {
pub mut:
	app &App = unsafe { nil }
	name string
}

pub struct App {
pub mut:
	w voidptr
	handlers map[string]fn(req string, mut app App) string
	binding_ctxs []&BindingCtx
}

pub fn new_app() &App {
	w := C.webview_create(1, unsafe { nil })
	
	// Inject console.log interceptor directly into the webview
	C.webview_init(w, "
		window.rpc = window.rpc || {};
		const oldLog = console.log;
		const oldWarn = console.warn;
		const oldError = console.error;
		console.log = (...args) => { oldLog(...args); window.rpc.log && window.rpc.log(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'info'); };
		console.warn = (...args) => { oldWarn(...args); window.rpc.log && window.rpc.log(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'warn'); };
		console.error = (...args) => { oldError(...args); window.rpc.log && window.rpc.log(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'error'); };
	".str)
	
	mut app := &App{ w: w }
	
	app.register_rpc('log', fn (req string, mut a App) string {
		msg := get_arg(req, 0) or { "" }
		level := get_arg(req, 1) or { "info" }
		println("[FRONTEND] [$${level.to_upper()}] $${msg}")
		a.log_to_frontend(msg, level)
		return "{}"
	})
	
	app.register_rpc('dumpBackendState', fn (req string, mut a App) string {
		divider := '═'.repeat(60)
		println('\n' + divider)
		println('  BACKEND STATE DUMP')
		println(divider)
		
		// Registered RPC handlers
		mut handler_names := []string{}
		for k, _ in a.handlers {
			handler_names << k
		}
		println('[registered_rpcs] $${handler_names}')
		
		// Process info
		println('[process.cwd] $${os.getwd()}')
		println('[process.pid] $${C.getpid()}')
		
		// Platform info
		println('[platform] $${os.user_os()}')
		println('[home_dir] $${os.home_dir()}')
		
		// Workspace state
		if os.is_dir('workspace') {
			entries := os.ls('workspace') or { []string{} }
			println('[workspace] $${entries}')
		} else {
			println('[workspace] (not created)')
		}
		
		// Trash state
		if os.is_dir('workspace_trash') {
			entries := os.ls('workspace_trash') or { []string{} }
			println('[workspace_trash] $${entries}')
		} else {
			println('[workspace_trash] (empty)')
		}
		
		println(divider)
		println('  END BACKEND STATE DUMP')
		println(divider + '\n')
		
		// Return JSON for frontend consumption
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
	
	return app
}

pub fn (mut app App) set_title(title string) {
	C.webview_set_title(app.w, title.str)
}

pub fn (mut app App) set_size(width int, height int) {
	C.webview_set_size(app.w, width, height, 0)
}

pub fn (mut app App) set_html(html string) {
	C.webview_set_html(app.w, html.str)
}

pub fn (mut app App) log_to_frontend(msg string, level string) {
	json_msg := json2.encode(msg)
	json_level := json2.encode(level)
	js := 'window.dispatchEvent(new CustomEvent("backend-log", { detail: { msg: ${json_msg}, level: ${json_level} } }))'
	C.webview_eval(app.w, js.str)
}

pub fn (mut app App) print(msg string) {
	println(msg)
	app.log_to_frontend(msg, 'info')
}

pub fn (mut app App) eprintln(msg string) {
	eprintln(msg)
	app.log_to_frontend(msg, 'error')
}

pub fn (mut app App) run() {
	println("[BACKEND] Webview starting...")
	C.webview_run(app.w)
	C.webview_destroy(app.w)
}

fn c_rpc_dispatcher(seq &char, req &char, arg voidptr) {
	ctx := unsafe { &BindingCtx(arg) }
	mut app := ctx.app
	req_str := unsafe { req.vstring() }

	if ctx.name != "log" && ctx.name != "dumpBackendState" {
		println("[RPC CALL] $${ctx.name} <- $${req_str}")
	}

	handler := app.handlers[ctx.name] or {
		println("[RPC ERROR] Handler not found: $${ctx.name}")
		C.webview_return(app.w, seq, 1, '{"error": "Handler not found"}'.str)
		return
	}

	res := handler(req_str, mut app)
	
	if ctx.name != "log" && ctx.name != "dumpBackendState" {
		res_short := if res.len > 100 { res[..100] + "..." } else { res }
		println("[RPC RES]  $${ctx.name} -> $${res_short}")
	}

	C.webview_return(app.w, seq, 0, res.str)
}

pub fn get_arg(req string, index int) ?string {
	raw := json2.decode[json2.Any](req) or { return none }
	arr := raw.as_array()
	if index >= arr.len { return none }
	return arr[index].str()
}

pub fn (mut app App) register_rpc(name string, handler fn (req string, mut a App) string) {
	app.handlers[name] = handler
	ctx := &BindingCtx{ app: app, name: name }
	app.binding_ctxs << ctx
	C.webview_bind(app.w, name.str, voidptr(c_rpc_dispatcher), ctx)
	C.webview_init(app.w, "
		window.rpc = window.rpc || {};
		window.rpc['$name'] = async function(...args) {
			const res = await window['$name'](...args);
			try { return JSON.parse(res); } catch (e) { return res; }
		};
	".str)
}
