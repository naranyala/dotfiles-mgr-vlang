module ffi

// Callback context for passing data to C callbacks
pub struct CallbackCtx {
pub mut:
	data voidptr
}

// Create a new callback context
pub fn new_callback_ctx(data voidptr) CallbackCtx {
	return CallbackCtx{ data: data }
}

// Cast callback context to a typed pointer
pub fn (ctx &CallbackCtx) as[T]() &T {
	return unsafe { &T(ctx.data) }
}

// Check if callback context is valid
pub fn (ctx &CallbackCtx) is_valid() bool {
	return ffi.is_not_null(ctx.data)
}
