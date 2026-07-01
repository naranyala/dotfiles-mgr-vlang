module ffi

// Dynamic library handle
pub struct DlHandle {
mut:
	handle voidptr
}

fn C.dlopen(filename &char, flags int) voidptr
fn C.dlclose(handle voidptr) int
fn C.dlsym(handle voidptr, symbol &char) voidptr
fn C.dlerror() &char

const rtld_lazy = 1

// Open a dynamic library
pub fn dlopen(path string) !DlHandle {
	if path.len == 0 {
		return error('Empty library path')
	}
	handle := C.dlopen(path.str, rtld_lazy)
	if handle == ffi.null {
		err := ffi.cstr_to_str(C.dlerror())
		return error('Failed to load ${path}: ${err}')
	}
	return DlHandle{ handle: handle }
}

// Close a dynamic library
pub fn (h &DlHandle) close() {
	if ffi.is_not_null(h.handle) {
		C.dlclose(h.handle)
	}
}

// Get a function pointer from a loaded library
pub fn (h &DlHandle) sym(name string) !voidptr {
	if ffi.is_null(h.handle) {
		return error('Library not loaded')
	}
	if name.len == 0 {
		return error('Empty symbol name')
	}
	s := C.dlsym(h.handle, name.str)
	if ffi.is_null(s) {
		err := ffi.cstr_to_str(C.dlerror())
		return error('Symbol "${name}" not found: ${err}')
	}
	return s
}

// Get the last dynamic loading error
pub fn dlerror() string {
	err := C.dlerror()
	return ffi.cstr_to_str(err)
}
