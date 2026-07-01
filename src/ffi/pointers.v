module ffi

// Safe null pointer constant
pub const null = unsafe { nil }

// Check if a C pointer is null
pub fn is_null(ptr voidptr) bool {
	return ptr == unsafe { nil }
}

// Check if a C pointer is not null
pub fn is_not_null(ptr voidptr) bool {
	return ptr != unsafe { nil }
}

// Cast voidptr to a typed pointer (unsafe but centralized)
pub fn cast[T](ptr voidptr) &T {
	return unsafe { &T(ptr) }
}

// Cast voidptr to a mutable typed pointer
pub fn cast_mut[T](ptr voidptr) &T {
	return unsafe { &T(ptr) }
}

// Dereference a C char* to V string (handles null)
pub fn cstr_to_str(ptr &char) string {
	if ptr == unsafe { nil } {
		return ''
	}
	return unsafe { ptr.vstring() }
}

// Dereference a C char* to V string or a default value
pub fn cstr_to_str_or(ptr &char, default string) string {
	if ptr == unsafe { nil } {
		return default
	}
	return unsafe { ptr.vstring() }
}

// Create a null C char* pointer
pub fn null_cstr() &char {
	return unsafe { nil }
}

// Convert V string to C string (caller must free if needed)
pub fn str_to_cstr(s string) &char {
	return s.str
}

// Safe comparison of C pointers
pub fn ptr_eq(a voidptr, b voidptr) bool {
	return a == b
}

// Check if two C pointers are different
pub fn ptr_ne(a voidptr, b voidptr) bool {
	return a != b
}
