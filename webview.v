module main

// Manual webview build — header path
#flag -I @VMODROOT/lib/webview/include
#flag -L @VMODROOT/lib/webview
#flag -l webview
#flag -l stdc++

// vcpkg headers/libs (used by other deps)
#flag -I @VMODROOT/vcpkg_installed/x64-linux/include
#flag -L @VMODROOT/vcpkg_installed/x64-linux/lib

$if linux {
	#pkgconfig webkit2gtk-4.1
	#flag linux -l dl
	#flag linux -l pthread
}
$if macos {
	#flag -framework WebKit
}

#include "webview/api.h"

pub const (
	hint_none  = 0
	hint_min   = 1
	hint_max   = 2
	hint_fixed = 3
)

fn C.webview_create(debug int, window voidptr) voidptr
fn C.webview_destroy(w voidptr)
fn C.webview_run(w voidptr)
fn C.webview_terminate(w voidptr)
fn C.webview_set_title(w voidptr, title &char)
fn C.webview_set_size(w voidptr, width int, height int, hints int)
fn C.webview_set_html(w voidptr, html &char)
fn C.webview_init(w voidptr, js &char)
fn C.webview_eval(w voidptr, js &char)
fn C.webview_bind(w voidptr, name &char, cb voidptr, arg voidptr)
fn C.webview_return(w voidptr, id &char, status int, result &char)
fn C.webview_navigate(w voidptr, url &char)

pub struct Webview {
	w voidptr
}

pub fn webview_create(debug bool) !Webview {
	w := C.webview_create(if debug { 1 } else { 0 }, voidptr(0))
	if isnil(w) {
		return error('webview_create failed')
	}
	return Webview{w}
}

pub fn (w Webview) destroy() { C.webview_destroy(w.w) }
pub fn (w Webview) run() { C.webview_run(w.w) }
pub fn (w Webview) terminate() { C.webview_terminate(w.w) }
pub fn (w Webview) set_title(title string) { C.webview_set_title(w.w, title.str) }
pub fn (w Webview) set_size(width int, height int, hints int) { C.webview_set_size(w.w, width, height, hints) }
pub fn (w Webview) set_html(html string) { C.webview_set_html(w.w, html.str) }
pub fn (w Webview) init(js string) { C.webview_init(w.w, js.str) }
pub fn (w Webview) eval(js string) { C.webview_eval(w.w, js.str) }
pub fn (w Webview) navigate(url string) { C.webview_navigate(w.w, url.str) }
pub fn (w Webview) bind(name string, cb voidptr, arg voidptr) { C.webview_bind(w.w, name.str, cb, arg) }
pub fn (w Webview) ret(id string, status int, result string) { C.webview_return(w.w, id.str, status, result.str) }
