module core

import src.util
import src.ffi
import x.json2

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
	w := C.webview_create(1, ffi.null)
	if ffi.is_null(w) {
		eprintln('[FATAL] Failed to create webview')
		exit(1)
	}

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
	register_builtins(mut app)
	return app
}

pub fn (mut app App) set_title(title string) {
	if ffi.is_not_null(app.w) {
		C.webview_set_title(app.w, title.str)
	}
}

pub fn (mut app App) set_size(width int, height int) {
	if ffi.is_not_null(app.w) {
		C.webview_set_size(app.w, width, height, 0)
	}
}

pub fn (mut app App) set_html(html string) {
	if ffi.is_not_null(app.w) {
		C.webview_set_html(app.w, html.str)
	}
}

pub fn (mut app App) log_to_frontend(msg string, level string) {
	if ffi.is_null(app.w) { return }
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
	if ffi.is_null(app.w) {
		eprintln('[FATAL] Cannot run: webview not initialized')
		return
	}
	println('[BACKEND] Webview starting...')
	C.webview_run(app.w)
	C.webview_destroy(app.w)
}

fn c_rpc_dispatcher(seq &char, req &char, arg voidptr) {
	ctx := unsafe { &BindingCtx(arg) }
	if ffi.is_null(ctx) || ffi.is_null(ctx.app) {
		return
	}

	mut app := ctx.app
	req_str := unsafe { req.vstring() }

	if ctx.name != 'log' && ctx.name != 'dumpBackendState' {
		println('[RPC CALL] ${ctx.name} <- ${req_str}')
	}

	handler := app.handlers[ctx.name] or {
		eprintln('[RPC ERROR] Handler not found: ${ctx.name}')
		C.webview_return(app.w, seq, 1, util.err_resp('Handler not found: ${ctx.name}').str)
		return
	}

	res := handler(req_str, mut app)

	if res.len == 0 {
		eprintln('[RPC WARN] ${ctx.name} returned empty response')
		C.webview_return(app.w, seq, 1, util.err_resp('Empty response from handler').str)
		return
	}

	if ctx.name != 'log' && ctx.name != 'dumpBackendState' {
		res_short := if res.len > 100 { res[..100] + '...' } else { res }
		println('[RPC RES]  ${ctx.name} -> ${res_short}')
	}

	C.webview_return(app.w, seq, 0, res.str)
}

pub fn get_arg(req string, index int) ?string {
	return util.get_arg(req, index)
}

pub fn (mut app App) register_rpc(name string, handler fn (req string, mut a App) string) {
	app.handlers[name] = handler
	ctx := &BindingCtx{ app: app, name: name }
	app.binding_ctxs << ctx
	C.webview_bind(app.w, name.str, voidptr(c_rpc_dispatcher), ctx)
}
