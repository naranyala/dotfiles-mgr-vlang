module core

#flag -I @VMODROOT/lib/webview/include
#flag -L @VMODROOT/lib/webview

$if linux {
	#flag linux -Wl,--start-group
	#flag linux -l webview_new
	#flag linux -l glib-2.0
	#flag linux -l gtk-3
	#flag linux -l gdk-3
	#flag linux -l pango-1.0
	#flag linux -l cairo
	#flag linux -l gdk_pixbuf-2.0
	#flag linux -l atk-1.0
	#flag linux -l gio-2.0
	#flag linux -l gobject-2.0
	#flag linux -l javascriptcoregtk-4.1
	#flag linux -l soup-3.0
	#flag linux -l harfbuzz
	#flag linux -l pcre2-8
	#flag linux -l z
	#flag linux -l webkit2gtk-4.1
	#flag linux -Wl,--end-group
	#flag linux -l stdc++
	#flag linux -l dl
	#flag linux -l pthread
}
$if macos {
	#flag -framework WebKit
}

#include <webview/webview.h>

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
