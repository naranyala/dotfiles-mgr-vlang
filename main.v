import os
import json
import x.json2

struct BindingCtx {
	app &App = unsafe { nil }
	name string
}

struct App {
mut:
	w voidptr
	handlers map[string]fn(req string, mut app App) string
	binding_ctxs []&BindingCtx
}

// Global dispatcher for all RPC callbacks from C
fn c_rpc_dispatcher(seq &char, req &char, arg voidptr) {
	ctx := unsafe { &BindingCtx(arg) }
	mut app := ctx.app
	
	req_str := unsafe { req.vstring() }
	
	handler := app.handlers[ctx.name] or {
		C.webview_return(app.w, seq, 1, '{"error": "Handler not found"}'.str)
		return
	}
	
	res := handler(req_str, mut app)
	C.webview_return(app.w, seq, 0, res.str)
}

// ===========================================================================
// JSON Helper
// ===========================================================================

fn get_arg(req string, index int) ?string {
	raw := json2.decode[json2.Any](req) or { return none }
	arr := raw.as_array()
	if index >= arr.len { return none }
	return arr[index].str()
}

// ===========================================================================
// Core RPC Utilities
// ===========================================================================

fn (mut app App) rpc_os_info(req string) string {
	mut res := map[string]string{}
	res['os'] = os.user_os()
	res['home_dir'] = os.home_dir()
	res['current_dir'] = os.getwd()
	res['tmp_dir'] = os.temp_dir()
	return json.encode(res)
}

fn (mut app App) rpc_exec(req string) string {
	cmd := get_arg(req, 0) or { return '{"error": "Missing command argument"}' }
	res := os.execute(cmd)
	mut out := map[string]string{}
	out['exit_code'] = res.exit_code.str()
	out['output'] = res.output
	return json.encode(out)
}

fn (mut app App) rpc_open_external(req string) string {
	uri := get_arg(req, 0) or { return '{"error": "Missing URI argument"}' }
	$if windows { os.execute('start "$uri"') }
	$else $if macos { os.execute('open "$uri"') }
	$else $if linux { os.execute('xdg-open "$uri"') }
	return '{"success": true}'
}

// ===========================================================================
// Extended Filesystem RPC Utilities
// ===========================================================================

fn (mut app App) rpc_read_dir(req string) string {
	dir := get_arg(req, 0) or { return '{"error": "Missing directory argument"}' }
	entries := os.ls(dir) or { return '{"error": "Failed to list directory: $err.msg()"}' }
	
	mut results := []map[string]string{}
	for entry in entries {
		full_path := os.join_path(dir, entry)
		is_dir := os.is_dir(full_path)
		mut item := map[string]string{}
		item['name'] = entry
		item['is_dir'] = if is_dir { "true" } else { "false" }
		item['size'] = if !is_dir { os.file_size(full_path).str() } else { "0" }
		results << item
	}
	return json.encode(results)
}

fn (mut app App) rpc_read_file(req string) string {
	filepath := get_arg(req, 0) or { return '{"error": "Missing filepath argument"}' }
	content := os.read_file(filepath) or { return '{"error": "Failed to read file: $err.msg()"}' }
	mut res := map[string]string{}
	res['content'] = content
	return json.encode(res)
}

fn (mut app App) rpc_write_file(req string) string {
	filepath := get_arg(req, 0) or { return '{"error": "Missing filepath argument"}' }
	content := get_arg(req, 1) or { return '{"error": "Missing content argument"}' }
	os.write_file(filepath, content) or { return '{"error": "Failed to write file: $err.msg()"}' }
	return '{"success": true}'
}

fn (mut app App) rpc_exists(req string) string {
	path := get_arg(req, 0) or { return '{"error": "Missing path"}' }
	return if os.exists(path) { 'true' } else { 'false' }
}

fn (mut app App) rpc_is_dir(req string) string {
	path := get_arg(req, 0) or { return '{"error": "Missing path"}' }
	return if os.is_dir(path) { 'true' } else { 'false' }
}

fn (mut app App) rpc_mkdir(req string) string {
	path := get_arg(req, 0) or { return '{"error": "Missing path"}' }
	os.mkdir_all(path) or { return '{"error": "$err.msg()"}' }
	return '{"success": true}'
}

fn (mut app App) rpc_remove(req string) string {
	path := get_arg(req, 0) or { return '{"error": "Missing path"}' }
	if os.is_dir(path) {
		os.rmdir_all(path) or { return '{"error": "$err.msg()"}' }
	} else {
		os.rm(path) or { return '{"error": "$err.msg()"}' }
	}
	return '{"success": true}'
}

fn (mut app App) rpc_copy(req string) string {
	src := get_arg(req, 0) or { return '{"error": "Missing src"}' }
	dst := get_arg(req, 1) or { return '{"error": "Missing dst"}' }
	os.cp_all(src, dst, true) or { return '{"error": "$err.msg()"}' }
	return '{"success": true}'
}

fn (mut app App) rpc_move(req string) string {
	src := get_arg(req, 0) or { return '{"error": "Missing src"}' }
	dst := get_arg(req, 1) or { return '{"error": "Missing dst"}' }
	os.mv(src, dst) or { return '{"error": "$err.msg()"}' }
	return '{"success": true}'
}

// ===========================================================================
// Environment Variables
// ===========================================================================

fn (mut app App) rpc_get_env(req string) string {
	key := get_arg(req, 0) or { return '{"error": "Missing key"}' }
	val := os.getenv(key)
	mut res := map[string]string{}
	res['value'] = val
	return json.encode(res)
}

fn (mut app App) rpc_set_env(req string) string {
	key := get_arg(req, 0) or { return '{"error": "Missing key"}' }
	val := get_arg(req, 1) or { return '{"error": "Missing value"}' }
	os.setenv(key, val, true)
	return '{"success": true}'
}

// ===========================================================================
// Automatic Namespace Registration
// ===========================================================================

fn (mut app App) register_rpc(name string, handler fn (req string, mut a App) string) {
	internal_name := '__rpc_' + name
	
	app.handlers[internal_name] = handler
	
	// Create context and store it to prevent GC
	ctx := &BindingCtx{
		app: app
		name: internal_name
	}
	app.binding_ctxs << ctx
	
	// Bind to C webview
	C.webview_bind(app.w, internal_name.str, voidptr(c_rpc_dispatcher), ctx)
	
	// Expose to JS
	C.webview_init(app.w, "
		window.rpc = window.rpc || {};
		window.rpc['$name'] = async function(...args) {
			const res = await window['$internal_name'](...args);
			try { return JSON.parse(res); } catch (e) { return res; }
		};
	".str)
}

fn main() {
	html_content := os.read_file('frontend/dist/app.html') or {
		eprintln("Failed to read frontend/dist/app.html.")
		exit(1)
	}

	w := C.webview_create(1, unsafe { nil })
	mut app := App{ w: w }

	C.webview_set_title(app.w, "Vlang General Purpose App".str)
	C.webview_set_size(app.w, 1024, 800, 0) // 0 = WEBVIEW_HINT_NONE
	
	C.webview_init(app.w, "window.rpc = window.rpc || {};".str)
	
	// Core System
	app.register_rpc('osInfo', fn (req string, mut app App) string { return app.rpc_os_info(req) })
	app.register_rpc('exec', fn (req string, mut app App) string { return app.rpc_exec(req) })
	app.register_rpc('openExternal', fn (req string, mut app App) string { return app.rpc_open_external(req) })
	
	// Environment
	app.register_rpc('getEnv', fn (req string, mut app App) string { return app.rpc_get_env(req) })
	app.register_rpc('setEnv', fn (req string, mut app App) string { return app.rpc_set_env(req) })

	// Filesystem Operations
	app.register_rpc('readDir', fn (req string, mut app App) string { return app.rpc_read_dir(req) })
	app.register_rpc('readFile', fn (req string, mut app App) string { return app.rpc_read_file(req) })
	app.register_rpc('writeFile', fn (req string, mut app App) string { return app.rpc_write_file(req) })
	app.register_rpc('exists', fn (req string, mut app App) string { return app.rpc_exists(req) })
	app.register_rpc('isDir', fn (req string, mut app App) string { return app.rpc_is_dir(req) })
	app.register_rpc('mkdir', fn (req string, mut app App) string { return app.rpc_mkdir(req) })
	app.register_rpc('remove', fn (req string, mut app App) string { return app.rpc_remove(req) })
	app.register_rpc('copy', fn (req string, mut app App) string { return app.rpc_copy(req) })
	app.register_rpc('move', fn (req string, mut app App) string { return app.rpc_move(req) })

	C.webview_set_html(app.w, html_content.str)
	
	C.webview_run(app.w)
	C.webview_destroy(app.w)
}
