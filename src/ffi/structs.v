module ffi

// Read a C struct field at a given byte offset
pub fn struct_read_field[T](base voidptr, offset int) T {
	return unsafe { *(&T(base + offset)) }
}

// Write a value to a C struct field at a given byte offset
pub fn struct_write_field[T](base voidptr, offset int, val T) {
	unsafe { *(&T(base + offset)) = val }
}

// Get the size of a C type in bytes
pub fn sizeof[T]() int {
	return sizeof(T)
}

// Align up to the next multiple of alignment
pub fn align_up(value int, alignment int) int {
	return (value + alignment - 1) & ~(alignment - 1)
}

// Check if a pointer is aligned to N bytes
pub fn is_aligned(ptr voidptr, alignment int) bool {
	return int(ptr) % alignment == 0
}
