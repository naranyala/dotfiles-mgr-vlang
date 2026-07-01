module ffi

// Allocate memory for n elements of size T
pub fn alloc[T](n int) &T {
	return unsafe { malloc(n * sizeof(T)) }
}

// Free memory allocated by C
pub fn free_ptr(ptr voidptr) {
	unsafe { free(ptr) }
}

// Duplicate a C string (caller must free the result)
pub fn strdup(s &char) &char {
	if ffi.is_null(s) {
		return ffi.null
	}
	return unsafe { C.strdup(s) }
}

// Get length of a C string safely
pub fn strlen(s &char) int {
	if ffi.is_null(s) {
		return 0
	}
	return unsafe { C.strlen(s) }
}

// Read a C string up to max_len bytes
pub fn strn(s &char, max_len int) string {
	if ffi.is_null(s) || max_len <= 0 {
		return ''
	}
	return unsafe { s.vstring_with_len(max_len) }
}

// Zero-fill a memory block
pub fn memzero(ptr voidptr, size int) {
	if ffi.is_null(ptr) || size <= 0 {
		return
	}
	unsafe {
		mut p := &u8(ptr)
		for i in 0 .. size {
			p[i] = 0
		}
	}
}

// Copy memory from src to dst
pub fn memcpy(dst voidptr, src voidptr, size int) {
	if ffi.is_null(dst) || ffi.is_null(src) || size <= 0 {
		return
	}
	unsafe { C.memcpy(dst, src, size) }
}

// Compare memory blocks
pub fn memcmp(a voidptr, b voidptr, size int) int {
	if ffi.is_null(a) || ffi.is_null(b) {
		return if a == b { 0 } else { if ffi.is_null(a) { -1 } else { 1 } }
	}
	return unsafe { C.memcmp(a, b, size) }
}
