module ffi

// C string builder for efficient string construction
pub struct CStringBuilder {
mut:
	buf &u8 = unsafe { nil }
	len int
	cap int
}

// Create a new C string builder with initial capacity
pub fn new_cstr_builder(initial_cap int) CStringBuilder {
	mut cap := initial_cap
	if cap <= 0 {
		cap = 256
	}
	buf := unsafe { malloc(cap) }
	return CStringBuilder{
		buf: buf
		cap: cap
	}
}

// Append a V string to the builder
pub fn (mut b CStringBuilder) write(s string) {
	if s.len == 0 {
		return
	}
	new_len := b.len + s.len
	if new_len >= b.cap {
		b.grow(new_len + 1)
	}
	unsafe {
		memcpy(b.buf + b.len, s.str, s.len)
	}
	b.len = new_len
}

// Append a single byte
pub fn (mut b CStringBuilder) write_byte(c u8) {
	if b.len + 1 >= b.cap {
		b.grow(b.len + 2)
	}
	unsafe {
		b.buf[b.len] = c
	}
	b.len++
}

// Append a C char* string
pub fn (mut b CStringBuilder) write_cstr(s &char) {
	if ffi.is_null(s) {
		return
	}
	str := cstr_to_str(s)
	b.write(str)
}

// Get the current length
pub fn (b &CStringBuilder) len() int {
	return b.len
}

// Convert to V string (creates a copy)
pub fn (b &CStringBuilder) str() string {
	if ffi.is_null(b.buf) || b.len == 0 {
		return ''
	}
	return unsafe { b.buf.vstring_with_len(b.len) }
}

// Convert to C char* (caller must NOT free this — it's owned by the builder)
pub fn (b &CStringBuilder) cstr() &char {
	if ffi.is_null(b.buf) {
		return ffi.null
	}
	// Null-terminate
	if b.len < b.cap {
		unsafe {
			b.buf[b.len] = 0
		}
	}
	return unsafe { &char(b.buf) }
}

// Reset the builder (keeps allocated memory)
pub fn (mut b CStringBuilder) reset() {
	b.len = 0
}

// Free the builder's memory
pub fn (mut b CStringBuilder) free() {
	if ffi.is_not_null(b.buf) {
		free_ptr(b.buf)
		b.buf = ffi.null
		b.len = 0
		b.cap = 0
	}
}

// Internal: grow the buffer
fn (mut b CStringBuilder) grow(min_cap int) {
	new_cap := if b.cap > 0 { b.cap * 2 } else { 256 }
	mut cap := new_cap
	for cap < min_cap {
		cap *= 2
	}
	new_buf := unsafe { malloc(cap) }
	if ffi.is_not_null(b.buf) && b.len > 0 {
		unsafe { memcpy(new_buf, b.buf, b.len) }
		free_ptr(b.buf)
	}
	b.buf = new_buf
	b.cap = cap
}
