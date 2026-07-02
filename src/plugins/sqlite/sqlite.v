module sqlite

import src.core
import src.util
import src.ffi

import json

struct DbConn {
mut:
	path string
	conn voidptr
}

__global db_conn DbConn

fn get_db_conn() voidptr {
	if ffi.is_not_null(db_conn.conn) {
		return db_conn.conn
	}
	if db_conn.path.len == 0 {
		db_conn.path = 'data.sqlite'
	}
	C.sqlite3_open(db_conn.path.str, &db_conn.conn)
	return db_conn.conn
}

fn rpc_db_open(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { 'data.sqlite' }
	if path.len == 0 {
		return util.err_resp('Database path cannot be empty')
	}
	if ffi.is_not_null(db_conn.conn) {
		C.sqlite3_close(db_conn.conn)
		db_conn.conn = ffi.null
	}
	db_conn.path = path
	conn := get_db_conn()
	if ffi.is_null(conn) {
		return util.err_resp('Failed to open database: ' + path)
	}
	return json.encode({ 'path': db_conn.path })
}

fn rpc_db_close(req string, mut app &core.App) string {
	if ffi.is_not_null(db_conn.conn) {
		C.sqlite3_close(db_conn.conn)
		db_conn.conn = ffi.null
	}
	return util.ok_resp()
}

fn rpc_db_exec(req string, mut app &core.App) string {
	query := util.get_arg(req, 0) or { return util.err_resp('Missing SQL') }
	if query.len == 0 {
		return util.err_resp('SQL cannot be empty')
	}
	conn := get_db_conn()
	if ffi.is_null(conn) {
		return util.err_resp('No database open')
	}
	errmsg := ffi.null_cstr()
	ret := C.sqlite3_exec(conn, query.str, ffi.null, ffi.null, &errmsg)
	if ret != sqlite_ok {
		msg := ffi.cstr_to_str_or(errmsg, 'unknown error')
		if ffi.is_not_null(errmsg) {
			C.sqlite3_free(errmsg)
		}
		return util.err_resp(msg)
	}
	changes := C.sqlite3_changes(conn)
	return json.encode({ 'changes': changes })
}

struct QueryResult {
	columns []string
	rows    []map[string]string
}

fn rpc_db_query(req string, mut app &core.App) string {
	query := util.get_arg(req, 0) or { return util.err_resp('Missing SQL') }
	if query.len == 0 {
		return util.err_resp('SQL cannot be empty')
	}
	conn := get_db_conn()
	if ffi.is_null(conn) {
		return util.err_resp('No database open')
	}

	stmt := ffi.null_cstr()
	ret := C.sqlite3_prepare_v2(conn, query.str, -1, &stmt, ffi.null)
	if ret != sqlite_ok {
		err := ffi.cstr_to_str(C.sqlite3_errmsg(conn))
		return util.err_resp(err)
	}

	col_count := C.sqlite3_column_count(stmt)
	mut cols := []string{}
	for i in 0 .. col_count {
		cols << ffi.cstr_to_str(C.sqlite3_column_name(stmt, i))
	}

	mut rows := []map[string]string{}
	for {
		step_ret := C.sqlite3_step(stmt)
		if step_ret == sqlite_done {
			break
		}
		if step_ret != sqlite_row {
			err := ffi.cstr_to_str(C.sqlite3_errmsg(conn))
			C.sqlite3_finalize(stmt)
			return util.err_resp('Step failed: ' + err)
		}
		mut row := map[string]string{}
		for i in 0 .. col_count {
			col_name := ffi.cstr_to_str(C.sqlite3_column_name(stmt, i))
			val := C.sqlite3_column_text(stmt, i)
			row[col_name] = ffi.cstr_to_str(val)
		}
		rows << row
	}

	C.sqlite3_finalize(stmt)
	result := QueryResult{
		columns: cols
		rows: rows
	}
	return json.encode(result)
}

fn sanitize_table_name(name string) ?string {
	for c in name {
		if !c.is_alnum() && c != `_` {
			return none
		}
	}
	if name.len == 0 || name.len > 128 {
		return none
	}
	return name
}

fn rpc_db_tables(req string, mut app &core.App) string {
	return rpc_db_query('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"', mut app)
}

fn rpc_db_schema(req string, mut app &core.App) string {
	table := util.get_arg(req, 0) or { return util.err_resp('Missing table name') }
	safe := sanitize_table_name(table) or { return util.err_resp('Invalid table name') }
	return rpc_db_query('PRAGMA table_info(' + safe + ')', mut app)
}

pub fn register(mut app core.App) {
	app.register_rpc('sqlite.open', fn (req string, mut app &core.App) string { return rpc_db_open(req, mut app) })
	app.register_rpc('sqlite.close', fn (req string, mut app &core.App) string { return rpc_db_close(req, mut app) })
	app.register_rpc('sqlite.exec', fn (req string, mut app &core.App) string { return rpc_db_exec(req, mut app) })
	app.register_rpc('sqlite.query', fn (req string, mut app &core.App) string { return rpc_db_query(req, mut app) })
	app.register_rpc('sqlite.tables', fn (req string, mut app &core.App) string { return rpc_db_tables(req, mut app) })
	app.register_rpc('sqlite.schema', fn (req string, mut app &core.App) string { return rpc_db_schema(req, mut app) })
}
