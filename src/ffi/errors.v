module ffi

// Common C error codes
pub const ok = 0
pub const err_generic = -1
pub const err_nomem = -2
pub const err_inval = -3
pub const err_io = -4
pub const err_nxio = -5
pub const err_acces = -6
pub const err_exist = -7
pub const err_noent = -8

// Check if a C return code indicates success
pub fn is_ok(code int) bool {
	return code == ok
}

// Check if a C return code indicates error
pub fn is_err(code int) bool {
	return code != ok
}

// Convert a C error code to a human-readable message
pub fn err_name(code int) string {
	return match code {
		ok { 'OK' }
		err_generic { 'GENERIC' }
		err_nomem { 'OUT_OF_MEMORY' }
		err_inval { 'INVALID_ARGUMENT' }
		err_io { 'IO_ERROR' }
		err_nxio { 'NO_SUCH_DEVICE' }
		err_acces { 'PERMISSION_DENIED' }
		err_exist { 'FILE_EXISTS' }
		err_noent { 'NO_SUCH_FILE' }
		else { 'UNKNOWN(${code})' }
	}
}

// Assert that a C call succeeded, return error string if failed
pub fn check(code int, context string) ?string {
	if is_ok(code) {
		return none
	}
	return '${context}: ${err_name(code)} (${code})'
}
