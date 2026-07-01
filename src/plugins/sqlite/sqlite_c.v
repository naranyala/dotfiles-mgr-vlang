module sqlite

#flag -I @VMODROOT/lib/sqlite
#flag -L @VMODROOT/lib/sqlite
#flag -l sqlite3

#include <sqlite3.h>

fn C.sqlite3_open(filename &char, pp_db &&voidptr) int
fn C.sqlite3_close(db voidptr) int
fn C.sqlite3_exec(db voidptr, sql &char, cb voidptr, arg voidptr, errmsg &&char) int
fn C.sqlite3_errmsg(db voidptr) &char
fn C.sqlite3_prepare_v2(db voidptr, sql &char, nbyte int, pp_stmt &&voidptr, pp_tail &&char) int
fn C.sqlite3_step(stmt voidptr) int
fn C.sqlite3_finalize(stmt voidptr) int
fn C.sqlite3_column_count(stmt voidptr) int
fn C.sqlite3_column_name(stmt voidptr, col int) &char
fn C.sqlite3_column_text(stmt voidptr, col int) &char
fn C.sqlite3_changes(db voidptr) int
fn C.sqlite3_free(ptr voidptr)

const sqlite_ok = 0
const sqlite_row = 100
const sqlite_done = 101
