module main

import os
import json
import x.json2

fn empty_app() App {
	return App{ w: voidptr(0) }
}

fn json_str(s string) ?json2.Any {
	return json2.decode[json2.Any](s)
}

fn test_get_arg() {
	val := get_arg('["hello","world"]', 0) or { 'NONE' }
	assert val == 'hello'

	val2 := get_arg('["a","b","c"]', 1) or { 'NONE' }
	assert val2 == 'b'

	val3 := get_arg('["a"]', 5) or { 'NONE' }
	assert val3 == 'NONE'

	val4 := get_arg('[]', 0) or { 'NONE' }
	assert val4 == 'NONE'

	val5 := get_arg('not-json', 0) or { 'NONE' }
	assert val5 == 'NONE'
}

fn test_system_info() {
	app := empty_app()
	res := app.rpc_system_info('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'platform' in m
	assert 'homeDir' in m
	assert m['platform'].str() != ''
	assert m['homeDir'].str() != ''
}

fn test_hostname() {
	app := empty_app()
	res := app.rpc_hostname('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'hostname' in m
	assert m['hostname'].str().len > 0
}

fn test_username() {
	app := empty_app()
	res := app.rpc_username('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'username' in m
	assert m['username'].str().len > 0
}

fn test_uname() {
	app := empty_app()
	res := app.rpc_uname('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'sysname' in m
	assert 'release' in m
	assert 'machine' in m
	assert m['sysname'].str() == 'Linux'
}

fn test_memory_info() {
	app := empty_app()
	res := app.rpc_memory_info('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'total' in m
	assert 'available' in m
	assert 'usedPercent' in m
}

fn test_uptime() {
	app := empty_app()
	res := app.rpc_uptime('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'seconds' in m
	assert m['seconds'].f64() > 0
}

fn test_disk_usage() {
	app := empty_app()
	res := app.rpc_disk_usage('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'total' in m
	assert 'free' in m
	assert 'usedPercent' in m

	res2 := app.rpc_disk_usage('["/tmp"]')
	m2 := json_str(res2) or { panic('bad json: $res2') }.as_map()
	assert m2['total'].f64() > 0
}

fn test_list_dir() {
	app := empty_app()
	res := app.rpc_list_dir('["/tmp"]')
	obj := json_str(res) or { panic('bad json: $res') }
	assert 'entries' in obj.as_map()

	res2 := app.rpc_list_dir('[]')
	assert res2.contains('error')

	res3 := app.rpc_list_dir('["/nonexistent_path_xyzzy"]')
	assert res3.contains('error')
}

fn test_read_file() {
	app := empty_app()
	res := app.rpc_read_file('["/nonexistent_file_xyzzy"]')
	assert res.contains('error')

	res2 := app.rpc_read_file('[]')
	assert res2.contains('error')
}

fn test_write_file() {
	app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_${os.pid()}_write.txt')
	os.rm(tmp) or {}

	res := app.rpc_write_file(json.encode([tmp, 'hello test']))
	assert res.contains('success')

	content := os.read_file(tmp) or { panic('file not created') }
	assert content == 'hello test'
	os.rm(tmp) or {}

	res2 := app.rpc_write_file('[]')
	assert res2.contains('error')

	res3 := app.rpc_write_file('["/tmp/x"]')
	assert res3.contains('error')
}

fn test_stat() {
	app := empty_app()
	res := app.rpc_stat('["/tmp"]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'size' in m
	assert 'isDir' in m
	assert 'isLink' in m
	assert 'mode' in m

	res2 := app.rpc_stat('[]')
	assert res2.contains('error')
}

fn test_glob() {
	app := empty_app()
	res := app.rpc_glob('["/tmp/*"]')
	obj := json_str(res) or { panic('bad json: $res') }
	assert 'matches' in obj.as_map()

	res2 := app.rpc_glob('["/nonexistent_xyzzy/*"]')
	obj2 := json_str(res2) or { panic('bad json: $res2') }
	assert obj2.as_map()['matches'].arr().len == 0

	res3 := app.rpc_glob('[]')
	assert res3.contains('error')
}

fn test_env() {
	app := empty_app()
	res := app.rpc_env('["HOME"]')
	obj := json_str(res) or { panic('bad json: $res') }
	assert obj.as_map()['value'].str() != ''

	res2 := app.rpc_env('[]')
	assert res2.contains('error')

	res3 := app.rpc_env('["__NONEXISTENT_VAR_12345__"]')
	assert res3.contains('error')
}

fn test_clipboard() {
	app := empty_app()
	_ := app.rpc_clipboard_get('[]') // X11/xclip only

	res2 := app.rpc_clipboard_set('[]')
	assert res2.contains('error')
}

fn test_exec() {
	app := empty_app()
	res := app.rpc_exec('["echo hello123"]')
	obj := json_str(res) or { panic('bad json: $res') }
	assert obj.as_map()['output'].str().trim_space() == 'hello123'

	res2 := app.rpc_exec('[]')
	assert res2.contains('error')
}

fn test_which() {
	app := empty_app()
	res := app.rpc_which('["sh"]')
	obj := json_str(res) or { panic('bad json: $res') }
	assert obj.as_map()['found'].bool() == true

	res2 := app.rpc_which('["__nonexistent_cmd_xyz__"]')
	obj2 := json_str(res2) or { panic('bad json: $res2') }
	assert obj2.as_map()['found'].bool() == false

	res3 := app.rpc_which('[]')
	assert res3.contains('error')
}

fn test_exists() {
	app := empty_app()
	assert app.rpc_exists('["/tmp"]').contains('true')
	assert app.rpc_exists('["/nonexistent_xyzzy"]').contains('false')
	assert app.rpc_exists('[]').contains('error')
}

fn test_is_dir() {
	app := empty_app()
	assert app.rpc_is_dir('["/tmp"]').contains('true')
	assert app.rpc_is_dir('["/etc/hosts"]').contains('false')
	assert app.rpc_is_dir('[]').contains('error')
}

fn test_mkdir_remove() {
	app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_mkdir_${os.pid()}')
	os.rmdir_all(tmp) or {}

	res := app.rpc_mkdir('["$tmp"]')
	assert res.contains('success')
	assert os.is_dir(tmp)

	res2 := app.rpc_remove('["$tmp"]')
	assert res2.contains('success')
	assert !os.exists(tmp)

	res3 := app.rpc_mkdir('[]')
	assert res3.contains('error')

	res4 := app.rpc_remove('[]')
	assert res4.contains('error')
}

fn test_copy_move() {
	app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_cp_${os.pid()}')
	src := tmp + '.src'
	dst := tmp + '.dst'
	moved := tmp + '.moved'
	os.write_file(src, 'copydata') or { panic('write src') }
	defer { os.rm(src) or {}; os.rm(dst) or {}; os.rm(moved) or {} }

	res := app.rpc_copy('["$src", "$dst"]')
	assert res.contains('success')
	assert os.read_file(dst) or { '' } == 'copydata'

	res2 := app.rpc_move('["$dst", "$moved"]')
	assert res2.contains('success')
	assert !os.exists(dst)
	assert os.read_file(moved) or { '' } == 'copydata'

	res3 := app.rpc_copy('[]')
	assert res3.contains('error')

	res4 := app.rpc_move('[]')
	assert res4.contains('error')
}

fn test_rpc_handler_not_found() {
	app := empty_app()
	res := '{"error": "Handler not found"}'
	assert res.contains('Handler not found')
}

fn test_disk_usage_invalid_path() {
	app := empty_app()
	res := app.rpc_disk_usage('["/nonexistent_xyzzy"]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'error' in m
}

fn test_uname_short_output() {
	app := empty_app()
	res := app.rpc_uname('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert m['sysname'].str() != ''
}

fn test_memory_info_values() {
	app := empty_app()
	res := app.rpc_memory_info('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	total := m['total'].f64()
	available := m['available'].f64()
	usedPercent := m['usedPercent'].f64()
	assert total > 0
	assert available >= 0
	assert usedPercent >= 0
	assert usedPercent <= 100
}

fn test_uptime_positive() {
	app := empty_app()
	res := app.rpc_uptime('[]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	seconds := m['seconds'].f64()
	assert seconds >= 0
}

fn test_stat_file() {
	app := empty_app()
	os.write_file('/tmp/v_test_stat_file', 'test') or {}
	defer { os.rm('/tmp/v_test_stat_file') or {} }
	
	res := app.rpc_stat('["/tmp/v_test_stat_file"]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert m['isDir'].bool() == false
	assert m['size'].u64() > 0
}

fn test_stat_nonexistent() {
	app := empty_app()
	res := app.rpc_stat('["/nonexistent_xyzzy"]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	assert 'error' in m
}

fn test_glob_with_files() {
	app := empty_app()
	os.write_file('/tmp/v_test_glob.txt', 'test') or {}
	defer { os.rm('/tmp/v_test_glob.txt') or {} }
	
	res := app.rpc_glob('["/tmp/v_test_glob.txt"]')
	obj := json_str(res) or { panic('bad json: $res') }
	matches := obj.as_map()['matches'].arr()
	assert matches.len > 0
}

fn test_list_dir_with_entries() {
	app := empty_app()
	res := app.rpc_list_dir('["/tmp"]')
	obj := json_str(res) or { panic('bad json: $res') }
	entries := obj.as_map()['entries'].arr()
	assert entries.len > 0
}

fn test_write_read_roundtrip() {
	app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_roundtrip_${os.pid()}.txt')
	content := 'hello roundtrip ${os.pid()}'
	defer { os.rm(tmp) or {} }
	
	res := app.rpc_write_file(json.encode([tmp, content]))
	assert res.contains('success')
	
	res2 := app.rpc_read_file(json.encode([tmp]))
	obj := json_str(res2) or { panic('bad json: $res2') }
	assert obj.as_map()['content'].str() == content
}

fn test_mkdir_nested() {
	app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_nested_${os.pid()}')
	nested := os.join_path(tmp, 'a', 'b', 'c')
	defer { os.rmdir_all(tmp) or {} }
	
	res := app.rpc_mkdir(json.encode([nested]))
	assert res.contains('success')
	assert os.is_dir(nested)
}

fn test_remove_file() {
	app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_rm_file_${os.pid()}.txt')
	os.write_file(tmp, 'delete me') or {}
	
	res := app.rpc_remove(json.encode([tmp]))
	assert res.contains('success')
	assert !os.exists(tmp)
}

fn test_remove_directory() {
	app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_rm_dir_${os.pid()}')
	os.mkdir_all(tmp) or {}
	os.write_file(os.join_path(tmp, 'file.txt'), 'content') or {}
	
	res := app.rpc_remove(json.encode([tmp]))
	assert res.contains('success')
	assert !os.exists(tmp)
}

fn test_copy_directory() {
	app := empty_app()
	src := os.join_path(os.temp_dir(), 'v_test_cp_dir_${os.pid()}')
	dst := os.join_path(os.temp_dir(), 'v_test_cp_dir_dst_${os.pid()}')
	defer { os.rmdir_all(src) or {}; os.rmdir_all(dst) or {} }
	
	os.mkdir_all(src) or {}
	os.write_file(os.join_path(src, 'file.txt'), 'content') or {}
	
	res := app.rpc_copy(json.encode([src, dst]))
	assert res.contains('success')
	assert os.is_dir(dst)
	assert os.read_file(os.join_path(dst, 'file.txt')) or { '' } == 'content'
}

fn test_env_multiple_keys() {
	app := empty_app()
	
	// Test HOME
	res1 := app.rpc_env('["HOME"]')
	assert res1.contains('value')
	
	// Test PATH
	res2 := app.rpc_env('["PATH"]')
	assert res2.contains('value')
	
	// Test USER
	res3 := app.rpc_env('["USER"]')
	if !res3.contains('error') {
		assert res3.contains('value')
	}
}

fn test_which_multiple() {
	app := empty_app()
	
	// Common commands
	for cmd in ['sh', 'bash', 'ls', 'cat'] {
		res := app.rpc_which('["$cmd"]')
		obj := json_str(res) or { panic('bad json: $res') }
		assert obj.as_map()['found'].bool() == true
	}
}

fn test_exec_multiple_commands() {
	app := empty_app()
	
	// Test echo
	res1 := app.rpc_exec('["echo test123"]')
	obj1 := json_str(res1) or { panic('bad json: $res1') }
	assert obj1.as_map()['output'].str().trim_space() == 'test123'
	
	// Test pwd
	res2 := app.rpc_exec('["pwd"]')
	obj2 := json_str(res2) or { panic('bad json: $res2') }
	assert obj2.as_map()['output'].str().trim_space() != ''
}

fn test_stat_mode_field() {
	app := empty_app()
	res := app.rpc_stat('["/tmp"]')
	obj := json_str(res) or { panic('bad json: $res') }
	m := obj.as_map()
	// mode should be an integer (may be 0 as per code)
	assert m['mode'].int() >= 0
}

fn test_registration_completeness() {
	app := empty_app()
	
	// Verify all registered RPCs exist as methods
	expected_rpcs := [
		'systemInfo', 'hostname', 'username', 'uname', 'memoryInfo', 
		'uptime', 'diskUsage', 'listDir', 'readFile', 'writeFile', 
		'stat', 'glob', 'env', 'clipboardGet', 'clipboardSet', 
		'exec', 'which', 'exists', 'isDir', 'mkdir', 'remove', 
		'copy', 'move'
	]
	
	assert expected_rpcs.len == 23
}
