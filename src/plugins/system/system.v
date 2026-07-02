module system

import src.core
import src.util

import os
import json

fn rpc_system_info(req string, mut app &core.App) string {
	return json.encode({
		"platform": os.user_os()
		"homeDir": os.home_dir()
	})
}

fn rpc_hostname(req string, mut app &core.App) string {
	return json.encode({ "hostname": util.exec_output("hostname") })
}

fn rpc_username(req string, mut app &core.App) string {
	return json.encode({ "username": util.exec_output("whoami") })
}

fn rpc_uname(req string, mut app &core.App) string {
	raw := util.exec_output("uname -a")
	parts := raw.split(" ")
	if parts.len < 3 { return util.err_resp("failed to parse uname") }
	return json.encode({
		"sysname": parts[0]
		"release": parts[2]
		"machine": parts[parts.len-2]
		"version": parts[3]
	})
}

fn rpc_memory_info(req string, mut app &core.App) string {
	raw := util.exec_output('free -b')
	lines := raw.split('\n')
	if lines.len > 1 {
		cols := lines[1].split(' ').filter(it != '')
		if cols.len >= 7 {
			total := cols[1].f64()
			available := cols[6].f64()
			if total <= 0 {
				return util.err_resp('Invalid memory total')
			}
			used := total - available
			return json.encode({
				'total': total
				'available': available
				'usedPercent': (used / total) * 100.0
			})
		}
	}
	return util.err_resp('failed to read memory')
}

fn rpc_uptime(req string, mut app &core.App) string {
	raw := util.exec_output("cat /proc/uptime")
	parts := raw.split(" ")
	if parts.len > 0 {
		return json.encode({ "seconds": parts[0].f64() })
	}
	return util.err_resp("failed to read uptime")
}

fn rpc_disk_usage(req string, mut app &core.App) string {
	path := util.get_arg(req, 0) or { '/' }
	raw := util.exec_output('df -B1 $path')
	lines := raw.split('\n')
	if lines.len > 1 {
		cols := lines[1].split(' ').filter(it != '')
		if cols.len >= 5 {
			total := cols[1].f64()
			used := cols[2].f64()
			free := cols[3].f64()
			if total <= 0 {
				return util.err_resp('Invalid disk total')
			}
			return json.encode({
				'total': total
				'free': free
				'usedPercent': (used / total) * 100.0
			})
		}
	}
	return util.err_resp('failed to read disk usage')
}

pub fn register(mut app core.App) {
	app.register_rpc('system.getSystemInfo', fn (req string, mut app &core.App) string { return rpc_system_info(req, mut app) })
	app.register_rpc('shell.hostname', fn (req string, mut app &core.App) string { return rpc_hostname(req, mut app) })
	app.register_rpc('shell.username', fn (req string, mut app &core.App) string { return rpc_username(req, mut app) })
	app.register_rpc('shell.uname', fn (req string, mut app &core.App) string { return rpc_uname(req, mut app) })
	app.register_rpc('shell.memoryInfo', fn (req string, mut app &core.App) string { return rpc_memory_info(req, mut app) })
	app.register_rpc('shell.uptime', fn (req string, mut app &core.App) string { return rpc_uptime(req, mut app) })
	app.register_rpc('shell.diskUsage', fn (req string, mut app &core.App) string { return rpc_disk_usage(req, mut app) })
}
