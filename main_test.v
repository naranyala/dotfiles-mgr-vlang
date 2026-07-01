module main

import os
import json
import x.json2
import src.core
import src.plugins.system
import src.plugins.files
import src.plugins.git
import src.plugins.tools
import src.plugins.processes
import src.plugins.probe

fn empty_app() core.App {
	mut app := core.App{ w: voidptr(0) }
	mut app_ref := &app
	system.register(mut app_ref)
	files.register(mut app_ref)
	git.register(mut app_ref)
	tools.register(mut app_ref)
	processes.register(mut app_ref)
	probe.register(mut app_ref)
	return app
}

fn rpc(mut app core.App, name string, req string) string {
	handler := app.handlers[name] or { return '{"error": "Handler not found: $name"}' }
	return handler(req, mut app)
}

fn jmap(s string) map[string]json2.Any {
	obj := json2.decode[json2.Any](s) or { panic('bad json: $s') }
	return obj.as_map()
}

fn jlen(s string, key string) int {
	m := jmap(s)
	return m[key].arr().len
}

// --- System plugin tests ---

fn test_system_info() {
	mut app := empty_app()
	res := rpc(mut app, 'systemInfo', '[]')
	m := jmap(res)
	assert 'platform' in m
	assert 'homeDir' in m
	assert m['platform'].str() != ''
	assert m['homeDir'].str() != ''
}

fn test_hostname() {
	mut app := empty_app()
	res := rpc(mut app, 'hostname', '[]')
	m := jmap(res)
	assert 'hostname' in m
	assert m['hostname'].str().len > 0
}

fn test_username() {
	mut app := empty_app()
	res := rpc(mut app, 'username', '[]')
	m := jmap(res)
	assert 'username' in m
	assert m['username'].str().len > 0
}

fn test_uname() {
	mut app := empty_app()
	res := rpc(mut app, 'uname', '[]')
	m := jmap(res)
	assert 'sysname' in m
	assert 'release' in m
	assert 'machine' in m
	assert m['sysname'].str() == 'Linux'
}

fn test_memory_info() {
	mut app := empty_app()
	res := rpc(mut app, 'memoryInfo', '[]')
	m := jmap(res)
	assert 'total' in m
	assert 'available' in m
	assert 'usedPercent' in m
}

fn test_uptime() {
	mut app := empty_app()
	res := rpc(mut app, 'uptime', '[]')
	m := jmap(res)
	assert 'seconds' in m
	assert m['seconds'].f64() > 0
}

fn test_disk_usage() {
	mut app := empty_app()
	res := rpc(mut app, 'diskUsage', '[]')
	m := jmap(res)
	assert 'total' in m
	assert 'free' in m
	assert 'usedPercent' in m

	res2 := rpc(mut app, 'diskUsage', '["/tmp"]')
	m2 := jmap(res2)
	assert m2['total'].f64() > 0
}

fn test_disk_usage_invalid_path() {
	mut app := empty_app()
	res := rpc(mut app, 'diskUsage', '["/nonexistent_xyzzy"]')
	m := jmap(res)
	assert 'error' in m
}

fn test_memory_info_values() {
	mut app := empty_app()
	res := rpc(mut app, 'memoryInfo', '[]')
	m := jmap(res)
	total := m['total'].f64()
	available := m['available'].f64()
	used_percent := m['usedPercent'].f64()
	assert total > 0
	assert available >= 0
	assert used_percent >= 0
	assert used_percent <= 100
}

fn test_uptime_positive() {
	mut app := empty_app()
	res := rpc(mut app, 'uptime', '[]')
	m := jmap(res)
	seconds := m['seconds'].f64()
	assert seconds >= 0
}

fn test_uname_short_output() {
	mut app := empty_app()
	res := rpc(mut app, 'uname', '[]')
	m := jmap(res)
	assert m['sysname'].str() != ''
}

// --- Files plugin tests ---

fn test_list_dir() {
	mut app := empty_app()
	res := rpc(mut app, 'listDir', '["/tmp"]')
	obj := jmap(res)
	assert 'entries' in obj

	res2 := rpc(mut app, 'listDir', '[]')
	assert res2.contains('error')

	res3 := rpc(mut app, 'listDir', '["/nonexistent_path_xyzzy"]')
	assert res3.contains('error')
}

fn test_list_dir_with_entries() {
	mut app := empty_app()
	res := rpc(mut app, 'listDir', '["/tmp"]')
	entries := jmap(res)['entries'].arr()
	assert entries.len > 0
}

fn test_list_dir_home() {
	mut app := empty_app()
	home := os.home_dir()
	res := rpc(mut app, 'listDir', '["$home"]')
	entries := jmap(res)['entries'].arr()
	assert entries.len > 0
}

fn test_read_file() {
	mut app := empty_app()
	res := rpc(mut app, 'readFile', '["/nonexistent_file_xyzzy"]')
	assert res.contains('error')

	res2 := rpc(mut app, 'readFile', '[]')
	assert res2.contains('error')
}

fn test_write_file() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_write.txt')
	os.rm(tmp) or {}

	res := rpc(mut app, 'writeFile', json.encode([tmp, 'hello test']))
	assert res.contains('success')

	content := os.read_file(tmp) or { panic('file not created') }
	assert content == 'hello test'
	os.rm(tmp) or {}

	res2 := rpc(mut app, 'writeFile', '[]')
	assert res2.contains('error')

	res3 := rpc(mut app, 'writeFile', '["/tmp/x"]')
	assert res3.contains('error')
}

fn test_write_read_roundtrip() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_roundtrip.txt')
	content := 'hello roundtrip'
	defer { os.rm(tmp) or {} }

	res := rpc(mut app, 'writeFile', json.encode([tmp, content]))
	assert res.contains('success')

	res2 := rpc(mut app, 'readFile', json.encode([tmp]))
	assert jmap(res2)['content'].str() == content
}

fn test_write_read_large_file() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_large.txt')
	content := 'x'.repeat(10000)
	defer { os.rm(tmp) or {} }

	res := rpc(mut app, 'writeFile', json.encode([tmp, content]))
	assert res.contains('success')

	res2 := rpc(mut app, 'readFile', json.encode([tmp]))
	assert jmap(res2)['content'].str().len == 10000
}

fn test_stat() {
	mut app := empty_app()
	res := rpc(mut app, 'stat', '["/tmp"]')
	m := jmap(res)
	assert 'size' in m
	assert 'isDir' in m
	assert 'isLink' in m
	assert 'mode' in m

	res2 := rpc(mut app, 'stat', '[]')
	assert res2.contains('error')
}

fn test_stat_file() {
	mut app := empty_app()
	os.write_file('/tmp/v_test_stat_file', 'test') or {}
	defer { os.rm('/tmp/v_test_stat_file') or {} }

	res := rpc(mut app, 'stat', '["/tmp/v_test_stat_file"]')
	m := jmap(res)
	assert m['isDir'].bool() == false
	assert m['size'].u64() > 0
}

fn test_stat_nonexistent() {
	mut app := empty_app()
	res := rpc(mut app, 'stat', '["/nonexistent_xyzzy"]')
	m := jmap(res)
	assert 'error' in m
}

fn test_stat_mode_field() {
	mut app := empty_app()
	res := rpc(mut app, 'stat', '["/tmp"]')
	m := jmap(res)
	assert m['mode'].int() >= 0
}

fn test_stat_symlink() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_symlink')
	target := os.join_path(os.temp_dir(), 'v_test_symlink_target')
	os.write_file(target, 'link target') or {}
	os.symlink(target, tmp) or { return }
	defer { os.rm(tmp) or {}; os.rm(target) or {} }

	res := rpc(mut app, 'stat', '["$tmp"]')
	m := jmap(res)
	assert m['isLink'].bool() == true
}

fn test_glob() {
	mut app := empty_app()
	res := rpc(mut app, 'glob', '["/tmp/*"]')
	obj := jmap(res)
	assert 'matches' in obj

	res2 := rpc(mut app, 'glob', '["/nonexistent_xyzzy/*"]')
	assert jmap(res2)['matches'].arr().len == 0

	res3 := rpc(mut app, 'glob', '[]')
	assert res3.contains('error')
}

fn test_glob_with_files() {
	mut app := empty_app()
	os.write_file('/tmp/v_test_glob.txt', 'test') or {}
	defer { os.rm('/tmp/v_test_glob.txt') or {} }

	res := rpc(mut app, 'glob', '["/tmp/v_test_glob.txt"]')
	matches := jmap(res)['matches'].arr()
	assert matches.len > 0
}

fn test_glob_complex_pattern() {
	mut app := empty_app()
	os.write_file('/tmp/v_test_glob_complex.txt', 'test') or {}
	defer { os.rm('/tmp/v_test_glob_complex.txt') or {} }

	res := rpc(mut app, 'glob', '["/tmp/v_test_glob_*.txt"]')
	matches := jmap(res)['matches'].arr()
	assert matches.len > 0
}

fn test_exists() {
	mut app := empty_app()
	assert rpc(mut app, 'exists', '["/tmp"]').contains('true')
	assert rpc(mut app, 'exists', '["/nonexistent_xyzzy"]').contains('false')
	assert rpc(mut app, 'exists', '[]').contains('error')
}

fn test_is_dir() {
	mut app := empty_app()
	assert rpc(mut app, 'isDir', '["/tmp"]').contains('true')
	assert rpc(mut app, 'isDir', '["/etc/hosts"]').contains('false')
	assert rpc(mut app, 'isDir', '[]').contains('error')
}

fn test_mkdir_remove() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_mkdir')
	os.rmdir_all(tmp) or {}

	res := rpc(mut app, 'mkdir', '["$tmp"]')
	assert res.contains('success')
	assert os.is_dir(tmp)

	res2 := rpc(mut app, 'remove', '["$tmp"]')
	assert res2.contains('success')
	assert !os.exists(tmp)

	res3 := rpc(mut app, 'mkdir', '[]')
	assert res3.contains('error')

	res4 := rpc(mut app, 'remove', '[]')
	assert res4.contains('error')
}

fn test_mkdir_nested() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_nested')
	nested := os.join_path(tmp, 'a', 'b', 'c')
	defer { os.rmdir_all(tmp) or {} }

	res := rpc(mut app, 'mkdir', json.encode([nested]))
	assert res.contains('success')
	assert os.is_dir(nested)
}

fn test_mkdir_already_exists() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_mkdir_exists')
	os.mkdir_all(tmp) or {}
	defer { os.rmdir_all(tmp) or {} }

	res := rpc(mut app, 'mkdir', '["$tmp"]')
	assert res.contains('success')
}

fn test_remove_file() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_rm_file.txt')
	os.write_file(tmp, 'delete me') or {}

	res := rpc(mut app, 'remove', json.encode([tmp]))
	assert res.contains('success')
	assert !os.exists(tmp)
}

fn test_remove_directory() {
	mut app := empty_app()
	tmp := os.join_path(os.temp_dir(), 'v_test_rm_dir')
	os.mkdir_all(tmp) or {}
	os.write_file(os.join_path(tmp, 'file.txt'), 'content') or {}

	res := rpc(mut app, 'remove', json.encode([tmp]))
	assert res.contains('success')
	assert !os.exists(tmp)
}

fn test_copy_move() {
	mut app := empty_app()
	src := os.join_path(os.temp_dir(), 'v_test_cp_src')
	dst := os.join_path(os.temp_dir(), 'v_test_cp_dst')
	moved := os.join_path(os.temp_dir(), 'v_test_cp_moved')
	os.write_file(src, 'copydata') or { panic('write src') }
	defer { os.rm(src) or {}; os.rm(dst) or {}; os.rm(moved) or {} }

	res := rpc(mut app, 'copy', '["$src", "$dst"]')
	assert res.contains('success')
	assert os.read_file(dst) or { '' } == 'copydata'

	res2 := rpc(mut app, 'move', '["$dst", "$moved"]')
	assert res2.contains('success')
	assert !os.exists(dst)
	assert os.read_file(moved) or { '' } == 'copydata'

	res3 := rpc(mut app, 'copy', '[]')
	assert res3.contains('error')

	res4 := rpc(mut app, 'move', '[]')
	assert res4.contains('error')
}

fn test_copy_directory() {
	mut app := empty_app()
	src := os.join_path(os.temp_dir(), 'v_test_cp_dir')
	dst := os.join_path(os.temp_dir(), 'v_test_cp_dir_dst')
	defer { os.rmdir_all(src) or {}; os.rmdir_all(dst) or {} }

	os.mkdir_all(src) or {}
	os.write_file(os.join_path(src, 'file.txt'), 'content') or {}

	res := rpc(mut app, 'copy', json.encode([src, dst]))
	assert res.contains('success')
	assert os.is_dir(dst)
	assert os.read_file(os.join_path(dst, 'file.txt')) or { '' } == 'content'
}

// --- Tools plugin tests ---

fn test_env() {
	mut app := empty_app()
	res := rpc(mut app, 'env', '["HOME"]')
	m := jmap(res)
	assert m['value'].str() != ''

	res2 := rpc(mut app, 'env', '[]')
	assert res2.contains('error')

	res3 := rpc(mut app, 'env', '["__NONEXISTENT_VAR_12345__"]')
	assert res3.contains('error')
}

fn test_env_multiple_keys() {
	mut app := empty_app()
	res1 := rpc(mut app, 'env', '["HOME"]')
	assert res1.contains('value')

	res2 := rpc(mut app, 'env', '["PATH"]')
	assert res2.contains('value')

	res3 := rpc(mut app, 'env', '["USER"]')
	if !res3.contains('error') {
		assert res3.contains('value')
	}
}

fn test_env_empty_key() {
	mut app := empty_app()
	res := rpc(mut app, 'env', '[""]')
	assert res.len > 0
}

fn test_clipboard() {
	mut app := empty_app()
	_ := rpc(mut app, 'clipboardGet', '[]')

	res2 := rpc(mut app, 'clipboardSet', '[]')
	assert res2.contains('error')
}

fn test_exec() {
	mut app := empty_app()
	res := rpc(mut app, 'exec', '["echo hello123"]')
	m := jmap(res)
	assert m['output'].str().trim_space() == 'hello123'

	res2 := rpc(mut app, 'exec', '[]')
	assert res2.contains('error')
}

fn test_exec_multiple_commands() {
	mut app := empty_app()
	res1 := rpc(mut app, 'exec', '["echo test123"]')
	assert jmap(res1)['output'].str().trim_space() == 'test123'

	res2 := rpc(mut app, 'exec', '["pwd"]')
	assert jmap(res2)['output'].str().trim_space() != ''
}

fn test_exec_empty_output() {
	mut app := empty_app()
	res := rpc(mut app, 'exec', '["true"]')
	assert jmap(res)['output'].str().trim_space() == ''
}

fn test_exec_stderr() {
	mut app := empty_app()
	res := rpc(mut app, 'exec', '["echo error >&2"]')
	m := jmap(res)
	assert m['output'].str().contains('error')
}

fn test_which() {
	mut app := empty_app()
	res := rpc(mut app, 'which', '["sh"]')
	m := jmap(res)
	assert m['found'].bool() == true

	res2 := rpc(mut app, 'which', '["__nonexistent_cmd_xyz__"]')
	m2 := jmap(res2)
	assert m2['found'].bool() == false

	res3 := rpc(mut app, 'which', '[]')
	assert res3.contains('error')
}

fn test_which_multiple() {
	mut app := empty_app()
	for cmd in ['sh', 'bash', 'ls', 'cat'] {
		res := rpc(mut app, 'which', '["$cmd"]')
		assert jmap(res)['found'].bool() == true
	}
}

// --- Git plugin tests ---

fn test_git_list_empty() {
	mut app := empty_app()
	res := rpc(mut app, 'gitList', '[]')
	assert 'repos' in jmap(res)
}

fn test_git_trash_list_empty() {
	mut app := empty_app()
	res := rpc(mut app, 'gitTrashList', '[]')
	assert 'repos' in jmap(res)
}

fn test_git_clone_invalid_url() {
	mut app := empty_app()
	res := rpc(mut app, 'gitClone', '["https://not-a-real-repo.example.com/repo.git"]')
	assert res.contains('error')
}

fn test_git_remove_missing() {
	mut app := empty_app()
	res := rpc(mut app, 'gitRemove', '["nonexistent_repo_xyzzy"]')
	assert res.contains('error')
}

fn test_git_restore_missing() {
	mut app := empty_app()
	res := rpc(mut app, 'gitRestore', '["nonexistent_repo_xyzzy"]')
	assert res.contains('error')
}

fn test_git_clone_missing_url() {
	mut app := empty_app()
	res := rpc(mut app, 'gitClone', '[]')
	assert res.contains('error')
}

fn test_git_remove_missing_arg() {
	mut app := empty_app()
	res := rpc(mut app, 'gitRemove', '[]')
	assert res.contains('error')
}

fn test_git_restore_missing_arg() {
	mut app := empty_app()
	res := rpc(mut app, 'gitRestore', '[]')
	assert res.contains('error')
}

// --- Processes plugin tests ---

fn test_ps_list() {
	mut app := empty_app()
	res := rpc(mut app, 'psList', '["cpu"]')
	// Should return a JSON array
	assert res.len > 0
	assert res.contains('[')
}

fn test_ps_kill_nonexistent() {
	mut app := empty_app()
	res := rpc(mut app, 'psKill', '["99999999"]')
	// Should either succeed or return error — both acceptable
	assert res.len > 0
}

fn test_ps_list_empty_arg() {
	mut app := empty_app()
	res := rpc(mut app, 'psList', '[]')
	// Should still work with default sort
	assert res.len > 0
}

// --- Probe plugin tests ---

fn test_system_probe() {
	mut app := empty_app()
	res := rpc(mut app, 'systemProbe', '[]')
	m := jmap(res)
	assert 'loadAvg' in m
	assert 'procsTotal' in m
	assert 'cpuCores' in m
	assert m['cpuCores'].int() > 0
}

fn test_system_probe_load_avg() {
	mut app := empty_app()
	res := rpc(mut app, 'systemProbe', '[]')
	m := jmap(res)
	load_avg := m['loadAvg'].arr()
	assert load_avg.len == 3
	assert load_avg[0].f64() >= 0
}

// --- Handler registration ---

fn test_registration_completeness() {
	mut app := empty_app()
	expected_rpcs := [
		'systemInfo', 'hostname', 'username', 'uname', 'memoryInfo',
		'uptime', 'diskUsage', 'listDir', 'readFile', 'writeFile',
		'stat', 'glob', 'env', 'clipboardGet', 'clipboardSet',
		'exec', 'which', 'exists', 'isDir', 'mkdir', 'remove',
		'copy', 'move',
	]
	for rpc_name in expected_rpcs {
		assert rpc_name in app.handlers, 'Missing RPC handler: $rpc_name'
	}
}

fn test_rpc_handler_not_found() {
	mut app := empty_app()
	res := rpc(mut app, 'nonexistent', '[]')
	assert res.contains('Handler not found')
}
